

(function($) {
	"use strict"

	// Mobile Nav toggle
	$('.menu-toggle > a').on('click', function (e) {
		e.preventDefault();
		$('#responsive-nav').toggleClass('active');
	})

	// Fix cart dropdown from closing
	$('.cart-dropdown').on('click', function (e) {
		e.stopPropagation();
	});

	/////////////////////////////////////////

	// Products Slick
	$('.products-slick').each(function() {
		var $this = $(this),
				$nav = $this.attr('data-nav');

		$this.slick({
			slidesToShow: 4,
			slidesToScroll: 1,
			autoplay: true,
			infinite: true,
			speed: 300,
			dots: false,
			arrows: true,
			appendArrows: $nav ? $nav : false,
			responsive: [{
	        breakpoint: 991,
	        settings: {
	          slidesToShow: 2,
	          slidesToScroll: 1,
	        }
	      },
	      {
	        breakpoint: 480,
	        settings: {
	          slidesToShow: 1,
	          slidesToScroll: 1,
	        }
	      },
	    ]
		});
	});

	// Products Widget Slick
	$('.products-widget-slick').each(function() {
		var $this = $(this),
				$nav = $this.attr('data-nav');

		$this.slick({
			infinite: true,
			autoplay: true,
			speed: 300,
			dots: false,
			arrows: true,
			appendArrows: $nav ? $nav : false,
		});
	});

	/////////////////////////////////////////

	// Product Main img Slick
	$('#product-main-img').slick({
    infinite: true,
    speed: 300,
    dots: false,
    arrows: true,
    fade: true,
    asNavFor: '#product-imgs',
  });

	// Product imgs Slick
  $('#product-imgs').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    focusOnSelect: true,
		centerPadding: 0,
		vertical: true,
    asNavFor: '#product-main-img',
		responsive: [{
        breakpoint: 991,
        settings: {
					vertical: false,
					arrows: false,
					dots: true,
        }
      },
    ]
  });

	// Product img zoom
	var zoomMainProduct = document.getElementById('product-main-img');
	if (zoomMainProduct) {
		$('#product-main-img .product-preview').zoom();
	}

	/////////////////////////////////////////

	// Input number
	$('.input-number').each(function() {
		var $this = $(this),
		$input = $this.find('input[type="number"]'),
		up = $this.find('.qty-up'),
		down = $this.find('.qty-down');

		down.on('click', function () {
			var value = parseInt($input.val()) - 1;
			value = value < 1 ? 1 : value;
			$input.val(value);
			$input.change();
			updatePriceSlider($this , value)
		})

		up.on('click', function () {
			var value = parseInt($input.val()) + 1;
			$input.val(value);
			$input.change();
			updatePriceSlider($this , value)
		})
	});

	var priceInputMax = document.getElementById('price-max'),
			priceInputMin = document.getElementById('price-min');

	priceInputMax.addEventListener('change', function(){
		updatePriceSlider($(this).parent() , this.value)
	});

	priceInputMin.addEventListener('change', function(){
		updatePriceSlider($(this).parent() , this.value)
	});

	function updatePriceSlider(elem , value) {
		if ( elem.hasClass('price-min') ) {
			console.log('min')
			priceSlider.noUiSlider.set([value, null]);
		} else if ( elem.hasClass('price-max')) {
			console.log('max')
			priceSlider.noUiSlider.set([null, value]);
		}
	}

	// Price Slider
	var priceSlider = document.getElementById('price-slider');
	if (priceSlider) {
		noUiSlider.create(priceSlider, {
			start: [1, 2000],
			connect: true,
			step: 1,
			range: {
				'min': 1,
				'max': 2000
			}
		});

		priceSlider.noUiSlider.on('update', function( values, handle ) {
			var value = values[handle];
			handle ? priceInputMax.value = value : priceInputMin.value = value
		});
	}

})(jQuery);

addButtonEventListener();

// Prevent loading page when submit form
function addButtonEventListener() {
	$(document).ready(function(){
		$("button.delete").click(function() { 
		  const cart_id = $(this).data("cart-id");
		  const product_id = $(this).data("product-id");
		  $.ajax({
			  url: `/api/v1/carts/${cart_id}/products/${product_id}`,
			  type: 'delete',
			  data: '',
			  success: function(response){
				// Handle success response
				var div = document.querySelector(`.product-widget#${product_id}`);
				div.remove();
				decreaseTotalAmount();
			  },
			  error: function(xhr, status, error){
				// Handle error response
				console.log(xhr.responseText);
			  }
			});
		});
		$("button.add-to-cart-btn").click(function() { 
		  const cart_id = $(this).data("cart-id");
		  const product_id = $(this).data("product-id");
		  $.ajax({
			  url: `/api/v1/carts/${cart_id}/products`,
			  type: 'post',
			  data: `product_id=${product_id}`,
			  success: function(response){
				addProductToCart(cart_id, product_id);
				showSuccessMessage();
			  },
			  error: function(xhr, status, error){
				// Handle error response
				console.log(xhr.responseText);
			  }
			});
		});
	});
}

  function showSuccessMessage() {
	  var alert_items = document.querySelectorAll(".alert_item");
	  var alert_wrapper = document.querySelector(".alert_wrapper");
	  var close_btn = document.querySelectorAll(".close");
	  alert_wrapper.classList.add("active");
	  alert_items.forEach(function (alert_item, alert_index) {
		  alert_item.style.top = "-100%";
	  })

	  close_btn.forEach(function (close, close_index) {
		  close.addEventListener("click", function () {
			  alert_wrapper.classList.remove("active");

			  alert_items.forEach(function (alert_item, alert_index) {
				  alert_item.style.top = "-100%";
			  })
		  })
	  })

	  document.querySelector(".alert_item.alert_success").style.top = "10%";
	  document.querySelector(".alert_item.alert_success div.data p.sub").innerHTML = "Add product to cart successfully";
  }

  function addProductToCart(cart_id, product_id) {
	const cartProduct = {
		product_id: product_id,
		image: document.querySelector(`div#${product_id} div.product-img div.cover img`).src,
		name: document.querySelector(`div#${product_id} h3.product-name`).innerText,
		price: document.querySelector(`div#${product_id} h4.product-price`).innerText.replace('$', ''),
	};
	const ejsView = `
	<div class="product-widget" id="<%= cartProduct.product_id %>">
	<div class="product-img">
		<img src="<%= cartProduct.image %>" alt="">
	</div>
	<div class="product-body">
		<h3 class="product-name"><a href="#"><%= cartProduct.name %></a></h3>
		<h4 class="product-price"><span class="qty">1x</span>$<%= cartProduct.price %></h4>
	</div>
	<button class="delete" data-product-id="<%= cartProduct.product_id %>" data-cart-id="<%= cart_id %>"><i class="fa fa-close"></i></button>                              
	</div>`;
	let html = ejs.render(ejsView, { cartProduct: cartProduct, cart_id: cart_id });
	  // Vanilla JS:
	const fragment = create(html);
	// document.querySelector('.cart-items').appendChild(fragment);
	document.querySelector('.cart-items').appendChild(fragment);
	addButtonEventListener();
	const totalAmount = document.querySelector('div.dropdown div.qty').innerText;
	document.querySelector('div.dropdown div.qty').innerText = parseInt(totalAmount) + 1;

  }
  
  function create(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}

function decreaseTotalAmount () {
	const totalAmount = document.querySelector('div.dropdown div.qty').innerText;
	document.querySelector('div.dropdown div.qty').innerText = parseInt(totalAmount) - 1;
}

