const baseResponse = require('../config/baseResponseStatus');
const { response, errResponse } = require('../config/response');
const { delivery, user, sequelize } = require('../models');
const deliveryService = require('../services/deliveryService');
const request = require('request');
require('dotenv').config();

module.exports = {
    orderDelivery: async function (req, res) {
        let transaction = await sequelize.transaction();
        try {
            let createResult = await deliveryService.createDelivery(req);
            res.send(createResult);
        } catch (err) {
            console.log(err);
            res.send(errResponse(baseResponse.SERVER_ERROR));
        }
    },
    getDeliveryList: async function (req, res) {
        if (
            !req.session.isAdmin &&
            req.session.phoneNumber != req.params.phoneNumber
        ) {
            res.send(errResponse(baseResponse.BAD_REQUEST));
        } else {
            let phoneNumber = req.params.phoneNumber;
            try {
                const result = await deliveryService.findDeliveryByPN(
                    phoneNumber
                );
                res.send(result);
            } catch (err) {
                console.log(err);
                res.send(errResponse(baseResponse.SERVER_ERROR));
            }
        }
    },
};
