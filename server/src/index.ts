import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import { handleMessage } from './bot.js';
import { validateData } from './validator.js';

const app = express();
const token = '6851417339:AAF227OwFeDmT2VD9DqoropdL_oMGaOSP_Q';
const bot = new TelegramBot(token, { polling: true });

app.use(express.json());

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
    const syntaxMessage = `
    Для генерации изображения используйте следующий синтаксис:
    \.prompt: <промпт>
    \.negativ: <нежелательные слова>
    \.w: <ширина>
    \.h: <высота>

    Например:
    \.prompt: house, tree
    \.negativ: cat, dog
    \.w: 800
    \.h: 600

Пожалуйста, используйте только латинские символы.`;

    bot.sendMessage(msg.chat.id, syntaxMessage);
});


// Обработчик сообщений
bot.on('message', (msg) => {
    handleMessage(bot, msg);
});






app.listen(4000, (err) => {
    if (err) {
        return console.log('Server error 👀', '\n', err);
    }
    console.log('Server OK❤️');
});
