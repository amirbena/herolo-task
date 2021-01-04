const jwt = require('jsonwebtoken');
const { UserRepository } = require('../../database');
const { StatusCodes } = require('http-status-codes');
const hasInternalError = require('../others/hasInternalError');

const genTokenByUser = user => {
    const { id, fullName } = user;
    const tokenPayload = { id, fullName };
    const token = jwt.sign(tokenPayload, process.env.TOKEN_KEY);
    return token;
}
const signup = async (req, res) => {
    try {
        const user = await UserRepository.createUser(req.body);
        if (user === "User is Exists") return res.status(StatusCodes.CONFLICT).send(user);
        const token = genTokenByUser(user);
        res.setHeader("authorization", token);
        res.send(`Succeed to signup a ${user.fullName} user`);
    } catch (ex) {
        return hasInternalError(res, ex)
    }
}

const signin = async (req, res) => {
    try {
        const user = await UserRepository.signInUser(req.body);
        if (user === "User not found") return res.status(StatusCodes.NOT_FOUND).send(user);
        if(user === "Password incorrect") return res.status(StatusCodes.CONFLICT).send(user);
        const token = genTokenByUser(user);
        res.setHeader("authorization", token);
        res.status(StatusCodes.OK).send("Succeed to signin");
    } catch (ex) {
        return hasInternalError(res, ex)
    }
}

module.exports = {
    signin,
    signup
}