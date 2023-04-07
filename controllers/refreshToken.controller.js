const { StatusCodes } = require('http-status-codes');
const { Token } = require('../models/models');
const { Op } = require('sequelize');
const validateRefreshToken = async (req, res) => {
    await Token.destroy({ 
        where: {
            expiration: {
                [Op.lte]: new Date().toISOString()
            }
        }
    });
    res.status(StatusCodes.OK).send();
}

const getRefreshTokens = async (req, res) => {
    const { customer_id } = req.params;
    const tokens = await Token.findAll({
        where: {
            customer_id: customer_id,
        }
    });
    return res.status(StatusCodes.OK).json(tokens);
}

const createRefreshToken = async (req, res) => {
    const { customer_id } = req.params;
    const { expiration, jti } = req.body;
    const token = await Token.create({
        customer_id,
        jti,
        expiration,   
    });
    res.status(StatusCodes.CREATED).json(token);
}
module.exports = {
    validateRefreshToken,
    getRefreshTokens,
    createRefreshToken,
}