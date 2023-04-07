const cookieAttributes = {
    httpOnly: true,
    secure: true,
    domain: process.env.DOMAIN,
}

const refreshTokenAttributes = {...cookieAttributes};
refreshTokenAttributes.path = '/refresh-token';

module.exports = {
    cookieAttributes,
    refreshTokenAttributes,
}