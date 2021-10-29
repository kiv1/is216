const { Api, TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');

const session = new StringSession(process.env.TELEGRAM_SESSION);
const client = new TelegramClient(session, parseInt(process.env.TELEGRAM_APP_ID), process.env.TELEGRAM_API_HASH, {});
connect();

async function checkHandle(handle) {
    return await client.invoke(
        new Api.account.CheckUsername({
            username: handle,
        })
    );
}

async function sendOTP(handle, otp) {
    try {
        return await client.invoke(
            new Api.messages.SendMessage({
                peer: handle,
                message: 'Your OTP is: ' + otp + '\nThis OTP is valid for 2 minutes only',
                randomId: BigInt(makeid(13)),
            })
        );
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function sendRequest(handle) {
    try {
        return await client.invoke(
            new Api.messages.SendMessage({
                peer: handle,
                message:
                    'Hi there! Someone has invited you to be their Study Buddy! Go to Study Buddy Site to accept their request!',
                randomId: BigInt(makeid(13)),
            })
        );
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function sendConfirmation(handle, name, otherHandle) {
    try {
        return await client.invoke(
            new Api.messages.SendMessage({
                peer: handle,
                message:
                    'Hi there! Let me introduce to your new study buddy ' +
                    name +
                    '\nTheir telegram handle is @' +
                    otherHandle,
                randomId: BigInt(makeid(13)),
            })
        );
    } catch (err) {
        console.log(err);
        return false;
    }
}

function makeid(length) {
    var result = '';
    var characters = '123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function connect() {
    try {
        client.connect();
    } catch (err) {
        console.log(err);
    }
}
module.exports = {
    checkHandle,
    sendOTP,
    sendRequest,
    sendConfirmation,
};
