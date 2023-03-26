const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { api } = require('../bin/URL');

const scrapeWebData = async (url, shelves) => {
    const product_id = url.replace('https://www.amazon.com/dp/', '');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);

    await page.emulateMediaType('screen');            // use screen media
    await page.pdf({ path: `pdf/${product_id}.pdf`, displayHeaderFooter: true, printBackground: true });  // generate pdf

    try {
        await page.waitForSelector('.imageThumbnail img');
    } catch (e) {
        if (e instanceof puppeteer.TimeoutError) {
            console.log("Image not found");
        }
        else console.error(e)
    }

    const productInformation = await page.evaluate(() => {
        const product_id = document.baseURI.replace('https://www.amazon.com/dp/', '');
        const array = [];
        document.querySelectorAll('.imageThumbnail img').forEach((ele) => {
            array.push(ele.getAttribute('src'));
        })
        const imageLinks = array.join('|');
        let productDescription = document.querySelector('div#productDescription span') || '';
        productDescription = productDescription.textContent || '';
        productDescription = productDescription.replace(/['"]+/g, ' Inch ');
        if (!productDescription) {
            console.log("Description not found");
        }
        // let productDescription = document.querySelector('div#productDescription span').textContent.replace(/['"]+/g, ' Inch ') || '';
        return {
            product_id,
            imageLinks,
            productDescription,
        }
    })
    await browser.close();
    shelves.push(productInformation);
}

const getProductsDescription = async () => {
    const baseURL = 'https://www.amazon.com/dp';
    const products = await Product.findAll({
        attributes: ['product_id'],
        limit: 50,
        offset: 739,
    });
    for (var i = 0; i < products.length; i++) {
        await sleep(3000);
        const shelves = [];
        const product_id = products[i].dataValues.product_id;
        const url = `${baseURL}/${product_id}`;
        await scrapeWebData(url, shelves);
        console.log(`Finish ${i + 1} product(s)`);
        let csvContent = shelves.map(element => {
            return Object.values(element).map(item => `"${item}"`).join(',')
        }).join("\n")
        fs.appendFile('product-information.csv', '\n' + csvContent, 'utf8', function (err) {
            if (err) {
                console.log('Some error occurred - file either not saved or corrupted.')
            } else {
                console.log('File has been saved!')
            }
        })
    }
}

const scrapeData = async (link, shelves) => {
    const categoryName = link.split('&category=')[1];
    const response = await api.get(`/categories?name=${categoryName}`);
    const { category_id } = response.data[0];
    let pageAmount = 10;
    for (let i = 1; i <= pageAmount; i++) {
        const response = await axios.get(link + '&page=' + i);
        const html = response.data;
        const $ = cheerio.load(html);
        $('div.sg-col-4-of-24.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.sg-col.s-widget-spacing-small.sg-col-4-of-20').each((_idx, el) => {
            const shelf = $(el)
            const product_id = shelf.attr('data-asin');
            const title = shelf.find('h2.a-size-mini.a-spacing-none.a-color-base.s-line-clamp-4').text().replace(/['"]+/g, ' Inch ');
            const price = shelf.find('div.a-section.a-spacing-none.a-spacing-top-small.s-price-instructions-style span.a-price-whole').text().replace(',', '');
            const fraction = shelf.find('div.a-section.a-spacing-none.a-spacing-top-small.s-price-instructions-style span.a-price-fraction').text();
            const image = shelf.find('img.s-image').attr('src');

            let element = {
                product_id,
                title,
                price: price + fraction,
                image,
                category_id,
            }
            if (element.price != '') {
                shelves.push(element);
            }
        });
        await sleep(5000);
        console.log(`Finish page ${i} of ${categoryName}`);
    }
    return shelves;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const main = async () => {
    const monitorsLink = 'https://www.amazon.com/s?rh=n%3A1292115011&fs=true&category=Monitors';
    const laptopsLink = 'https://www.amazon.com/s?rh=n%3A565108&fs=true&category=Laptops';
    const computerAccessoriesLink = 'https://www.amazon.com/s?rh=n%3A172456&fs=true&category=Computer+Accessories';
    const tabletsLink = 'https://www.amazon.com/s?rh=n%3A1232597011&fs=true&category=Tablets';
    const desktopsLink = 'https://www.amazon.com/s?rh=n%3A565098&fs=true&category=Desktops';

    const linkArray = [
        monitorsLink,
        laptopsLink,
        computerAccessoriesLink,
        tabletsLink,
        desktopsLink
    ]

    const shelves = [];

    for (const link of linkArray) {
        await scrapeData(link, shelves);
    }
    let csvContent = shelves.map(element => {
        return Object.values(element).map(item => `"${item}"`).join(',')
    }).join("\n")

    fs.writeFile('saved-shelves.csv', "product_id, title, price, image, category_id" + '\n' + csvContent, 'utf8', function (err) {
        if (err) {
            console.log('Some error occurred - file either not saved or corrupted.')
        } else {
            console.log('File has been saved!')
        }
    })
}
main()
