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

const User = require('../models/user')(sequelize, DataTypes);
const userController = require('../controllers/userController');

const baseResponse = require('../config/baseResponseStatus');
const { response, errResponse } = require('../config/response');

describe('userController-signIn', function () {
    it('should send a response with SERVER_ERROR if accessing the database fails', async function () {
        const findOneStub = sinon.stub(User.__proto__, 'findOne');
        findOneStub.throws();

        const req = {
            body: {
                phoneNumber: '1234',
                password: '1234',
            },
        };

        const res = {
            send: sinon.stub(),
        };

        await userController.signIn(req, res);

        sinon.assert.calledWith(res.send, errResponse(baseResponse.DB_ERROR));

        findOneStub.restore();
    });
});

describe('userController-checkPhoneNumber', function () {
    it('should send a response with SIGNUP_REDUNDANT_ID if the phonenumber already exists', async function () {
        const req = {
            params: {
                phoneNumber: '01012345678',
            },
        };

        const res = {
            send: sinon.stub(),
        };

        await userController.checkPhoneNumber(req, res);

        sinon.assert.calledWith(
            res.send,
            errResponse(baseResponse.SIGNUP_REDUNDANT_ID)
        );
    });
});
