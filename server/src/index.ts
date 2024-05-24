import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import { handleMessage } from './bot.js';
import { sendHelpMessage, sendFormatMessage, sendModelMenu } from './funt.js'
process.env.NTBA_FIX_350 = 'true';

const app = express();
const token = 'token'; // Замените на ваш токен
const bot = new TelegramBot(token, { polling: true });

app.use(express.json());

const menuKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: 'Модели', callback_data: '/model' }, { text: 'Форматы', callback_data: '/format' }],
            [{ text: 'Краткое обучение', callback_data: '/help' }]
        ],
        resize_keyboard: true
    }
};

bot.onText(/\/start/, (msg) => {
    const syntaxMessage = `
    Привет! Добро пожаловать. Teroky_Ai бот, который создает из текстового запроса уникальное изображение!

    Хотите начать?

    Просто напишите объект, который вы хотели бы увидеть, а затем опишите его внешность, стиль и любые дополнительные детали, которые приходят вам в голову.
    `;
    bot.sendMessage(msg.chat.id, syntaxMessage, {
        reply_markup: {
        keyboard: [
                [{ text: 'Модели', callback_data: '/model' }, { text: 'Форматы', callback_data: '/format' }],
                [{ text: 'Краткое обучение', callback_data: '/help' }]
            ]
        }
    });
});

bot.onText(/\/model/, (msg) => {
    sendModelMenu(bot, msg.chat.id);
});

bot.onText(/\/format/, (msg) => {
    sendFormatMessage(bot, msg.chat.id);
});

bot.onText(/\/help/, (msg) => {
    sendHelpMessage(bot, msg.chat.id);
});

bot.on('message', (msg) => {
    handleMessage(bot, msg);
});

app.listen(2831, (err) => {
    if (err) {
        return console.log('Server error 👀', '\n', err);
    }
    console.log('Server OK❤️');
});
