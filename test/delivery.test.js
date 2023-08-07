const expect = require('chai').expect;
const sinon = require('sinon');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config')[env];
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

const Delivery = require('../models/delivery')(sequelize, DataTypes);
const deliveryController = require('../controllers/deliveryController');

const baseResponse = require('../config/baseResponseStatus');
const { response, errResponse } = require('../config/response');

describe('deliveryController-orderDelivery', function () {
    it('should send a response with SERVER_ERROR if accessing the database fails', async function () {
        const createStub = sinon.stub(Delivery.__proto__, 'create');
        createStub.throws();

        const req = {
            body: {
                name: '테스트',
                phoneNumber: '01012345678',
                departure: '101',
                destination: '12',
                item: '마카롱',
                isInPerson: '1',
                name: '테스트',
                status: '접수 중',
                userId: '01012345678',
                isAccpeted: '접수 요청',
            },
        };

        const res = {
            send: sinon.stub(),
        };

        await deliveryController.orderDelivery(req, res);

        expect(res.send.calledWith(errResponse(baseResponse.DB_ERROR))).to.be
            .true;

        createStub.restore();
    });

    it('should send a response with SUCCESS if successes', async function () {
        const req = {
            body: {
                name: '테스트',
                phoneNumber: '01012345678',
                departure: '101',
                destination: '12',
                item: '마카롱',
                isInPerson: '1',
                name: '테스트',
                status: '접수 중',
                userId: '01012345678',
                isAccepted: '접수 요청',
            },
        };

        const res = {
            send: sinon.stub(),
        };

        await deliveryController.orderDelivery(req, res);

        expect(res.send.calledWith(response(baseResponse.SUCCESS))).to.be.true;
    });
});

describe('deliveryController-getDeliveryList', function () {
    it('should send a response with SERVER_ERROR if accessing the database fails', async function () {
        const findAllStub = sinon.stub(Delivery.__proto__, 'findAll');
        findAllStub.throws();

        const req = {
            session: {
                isAdmin: false,
                phoneNumber: '01012121212',
            },
            params: {
                phoneNumber: '01012121212',
            },
        };

        const res = {
            send: sinon.stub(),
        };

        await deliveryController.getDeliveryList(req, res);

        expect(res.send.calledWith(errResponse(baseResponse.DB_ERROR))).to.be
            .true;

        findAllStub.restore();
    });

    it('should send a response with SUCCESS if successes', async function () {
        const req = {
            session: {
                isAdmin: false,
                phoneNumber: '01012121212',
            },
            params: {
                phoneNumber: '01012121212',
            },
        };

        const res = {
            send: sinon.stub(),
        };

        await deliveryController.getDeliveryList(req, res);

        sinon.assert.calledWith(
            res.send,
            response(baseResponse.SUCCESS, [
                {
                    id: 8,
                    name: '테스트',
                    phoneNumber: '01012121212',
                    destination: '101',
                    isInPerson: '두고 가기',
                    item: '마카롱',
                    isAccepted: '접수 요청',
                    status: '접수 중',
                    date: '2023. 8. 7.',
                    time: '오후 12:02:07',
                },
            ])
        );
    });

    it('should send a response with BAD_REQUEST if request phoneNumber is not same', async function () {
        const req = {
            session: {
                isAdmin: false,
                phoneNumber: '01012345678',
            },
            params: {
                phoneNumber: '01012121212',
            },
        };

        const res = {
            send: sinon.stub(),
        };

        await deliveryController.getDeliveryList(req, res);

        sinon.assert.calledWith(
            res.send,
            errResponse(baseResponse.BAD_REQUEST)
        );
    });
});
