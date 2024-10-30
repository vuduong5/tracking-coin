const axios = require('axios');

// Replace these with your bot token and chat ID
const botToken = '7683968363:AAHjwXL8Wl8O4dLtc4Zlvf_UxMhiQ-RglRw';
const chatId = '1031093695';
//const message = `Hello, this is a message from my bot!`;

async function sendMessage(message) {
    try {
        const response = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        });
        console.log('Message sent:', response.data);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

module.exports = {
    sendMessage
}