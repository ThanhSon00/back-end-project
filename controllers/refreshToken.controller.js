const { StatusCodes } = require('http-status-codes');
const { Token } = require('../models/models');
const { Op } = require('sequelize');
const validateToken = async (req, res) => {
    await Token.destroy({ 
        where: {
            expiration: {
                [Op.lte]: new Date().toISOString()
            }
        }
    });
    res.status(StatusCodes.OK).send();
}

const getTokens = async (req, res) => {
    const { customer_id } = req.params;
    const tokens = await Token.findAll({
        where: {
            customer_id: customer_id,
        }
    });
    return res.status(StatusCodes.OK).json(tokens);
}

const createToken = async (req, res) => {
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
    validateToken,
    getTokens,
    createToken,
}