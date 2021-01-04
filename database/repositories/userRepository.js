const db = require('../models');
const user = require('../models/user');


/**
 * 
 * @param {string} fullName- 
 * @param {string} password- 
 */
const createUser = async ({ fullName, password }) => {
    const existedUser = await db.users.findOne({ where: { fullName } });
    if (existedUser) return "User is exists";
    const user = await db.users.create({
        fullName,
        password
    });
    return user.dataValues;
}
/**
 * 
 * @param {string} fullName 
 */
const getUserByName = async (fullName) => {
    const user = await db.users.findOne({ where: { fullName } });
    return user.dataValues;
}


const signInUser = async ({ fullName, password }) => {
    const user = await db.users.findOne({ where: { fullName } });
    if (!user) return "User not found";
    if (password !== user.password) return "Password incorrect";
    return user.dataValues;
}
const updateUser = async (user) => {
    const result = await db.users.update(user, { where: { id: user.id } });
    return result[1][0].dataValues;
}

const GetAllUsers = async () => {
    let users = await db.users.findAll({});
    users = users.map(users.dataValues);
    return users;
}
/**
 * 
 * @param {number} id 
 */
const deleteUser = async id => {
    return await db.users.destroy({ where: { id } });
}

module.exports = {
    createUser,
    getUserByName,
    updateUser,
    GetAllUsers,
    signInUser,
    deleteUser
}