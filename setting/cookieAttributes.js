const cookieAttributes = {
    httpOnly: true,
    secure: true,
}

const refreshTokenAttributes = {...cookieAttributes};
refreshTokenAttributes.path = '/refresh-token';

module.exports = {
    cookieAttributes,
    refreshTokenAttributes,
}