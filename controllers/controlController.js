const { delivery, user, sequelize } = require('../models');
const deliveryService = require('../services/deliveryService');
const request = require('request');
require('dotenv').config();

let url = process.env.APPURL;
let url2 = 'http://77fa-106-101-3-142.ngrok.io';
let url3 = 'https://eric-a-eric-a.loca.lt';

module.exports = {
    test: async function (req, res) {
        console.log(url);
    },
    userOpen: async function (req, res) {
        try {
            request(url + '/useropen', function (error, response, body) {
                console.log(body);
                res.status(200).send(body);
            });
        } catch (err) {
            console.log(err);
            res.status(400).send(body);
        }
    },
    adminOpen: async function (req, res) {
        try {
            request(url + '/adminopen', function (error, response, body) {
                console.log(body);
                res.status(200).send(body);
            });
        } catch (err) {
            console.log(err);
            res.status(400).send(body);
        }
    },
    adminClose: async function (req, res) {
        try {
            request(url + '/adminclose', function (error, response, body) {
                console.log(body);
                res.status(200).send(body);
            });
        } catch (err) {
            console.log(err);
            res.status(400).send(body);
        }
    },
    adminStart: async function (req, res) {
        let id = req.params.id;
        try {
            request(
                url + '/adminstart/' + id,
                function (error, response, body) {
                    console.log(body);
                    res.status(200).send(body);
                }
            );
        } catch (err) {
            console.log(err);
            res.status(400).send(body);
        }
    },
    acceptDelivery: async function (req, res) {
        let id = req.params.id;
        try {
            await deliveryService.acceptDelivery(id);
            request(url + '/start/' + id, function (error, response, body) {
                console.log(body);
                res.status(200).send(body);
            });
        } catch (err) {
            res.status(400).send(false);
        }
    },
    refuseDelivery: async function (req, res) {
        let id = req.params.id;
        try {
            await deliveryService.refuseDelivery(id);
            res.status(200).send(true);
        } catch (err) {
            res.status(400).send(false);
        }
    },
};
