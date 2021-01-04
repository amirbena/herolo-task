const db = require('../models');
const { Op } = db.Sequelize;



const makeDateAsLocaleString = message => {
    if (!message) return message;
    if (message.dataValues) message = message.dataValues;
    let { creationDate } = message;
    creationDate = new Date(creationDate).toLocaleString();
    return { ...message, creationDate };
}
/**
 * 
 * @param {string} senderName 
 * @param {string} recieverName 
 * @param {string} subject 
 * @param {string} message 
 * @param {Date} creationDate 
 */

/// PUT RECEIVER NAME- IT'S SUPPOST TO BE ID, BUT IT'S EASY FOR YOUR TEST
const createMessage = async (senderId, receiverName, subject, message, creationDate = new Date) => {
    const receiver = await db.users.findOne({ where: { fullName: receiverName } });
    if (!receiver) return "Receiver not found";
    const { id: receiverId } = receiver;

    console.log("receiverId", receiverId);
    const createdMessage = await db.messages.create({
        senderId,
        receiverId,
        subject,
        message,
        creationDate
    })
    return makeDateAsLocaleString(createdMessage)
}
/**
 * 
 * @param {number} userId 
 */

// Assume the sent message& recieved messages
const getAllMessagesSpecificUser = async userId => {
    let messages = await db.messages.findAll({ where: { [Op.or]: [{ senderId: userId }, { receiverId: userId }] } });
    messages = messages.map(message => makeDateAsLocaleString(message));
    return messages;
}
/**
 * 
 * @param {number} userId 
 */

// Assume the  recieved messages
const getAllUnreadMessagesSpecificUser = async userId => {
    let messages = await db.messages.findAll({ where: { receiverId: userId, isRead: false } });
    messages = messages.map(message => makeDateAsLocaleString(message));
    return messages;
}

const readMessage = async (id, receiverId) => {
    let message = await db.messages.findOne({ where: { id } });
    if (!message) return "Message not found";
    message = message.dataValues;
    if (message.receiverId !== receiverId) return "You're not allowed to read message, only reciever user";
    await db.messages.update({ isRead: true }, { where: { id } });
    message.isRead = true;
    return makeDateAsLocaleString(message);
}

const deleteMessage = async (id, userId) => {

    return await db.messages.destroy({ where: { id, [Op.or]: [{ receiverId: userId }, { senderId: userId }] } });
}


module.exports = {
    createMessage,
    getAllMessagesSpecificUser,
    getAllUnreadMessagesSpecificUser,
    readMessage,
    deleteMessage
}