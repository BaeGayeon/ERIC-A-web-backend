const { delivery, user } = require('../models');
const baseResponse = require('../config/baseResponseStatus');
const { response, errResponse } = require('../config/response');

module.exports = {
    createDelivery: async function (req) {
        try {
            let today = new Date();

            let dateResult = today.toLocaleDateString();
            let timeResult = today.toLocaleTimeString();

            await delivery.create({
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                departure: req.body.departure,
                destination: req.body.destination,
                item: req.body.item,
                inPerson: req.body.isInPerson,
                status: req.body.status,
                userId: req.body.userId,
                date: dateResult,
                time: timeResult,
                isAccepted: req.body.isAccepted,
            });
            return response(baseResponse.SUCCESS);
        } catch (err) {
            // console.log(err);
            return errResponse(baseResponse.DB_ERROR);
        }
    },
    findDeliveryByPN: async function (phoneNumber) {
        try {
            const deliveryResult = await delivery.findAll({
                where: { phoneNumber: phoneNumber },
            });
            const result = [];
            for (let i = 0; i < deliveryResult.length; i++) {
                d = deliveryResult[i];

                result.push({
                    id: d.dataValues.id,
                    name: d.dataValues.name,
                    phoneNumber: d.dataValues.phoneNumber,
                    destination: d.dataValues.destination,
                    isInPerson: d.dataValues.inPerson
                        ? '직접 수령하기'
                        : '두고 가기',
                    item: d.dataValues.item,
                    isAccepted: d.dataValues.isAccepted,
                    status: d.dataValues.status,
                    date: d.dataValues.date,
                    time: d.dataValues.time,
                });
            }
            return response(baseResponse.SUCCESS, result);
        } catch (err) {
            // console.log(err);
            return errResponse(baseResponse.DB_ERROR);
        }
    },
    acceptDelivery: async function (id) {
        delivery.update(
            {
                isAccepted: '접수 완료',
                status: '접수지로 출발',
            },
            { where: { id: id } }
        );
    },
    refuseDelivery: async function (id) {
        delivery.update(
            {
                isAccepted: '접수 거부',
                status: '접수 거부',
            },
            { where: { id: id } }
        );
    },
};
