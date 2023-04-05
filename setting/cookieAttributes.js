const cookieAttributes = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    domain: process.env.DOMAIN,
}

const refreshTokenAttributes = {...cookieAttributes};
refreshTokenAttributes.path = '/refresh-token';

module.exports = {
    cookieAttributes,
    refreshTokenAttributes,
}