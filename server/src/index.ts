import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import { handleMessage } from './bot.js';
import { validateData } from './validator.js';

const app = express();
const token = 'Telegram_Bot_Code';
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
    \.seed: <сид>

    Например:
    \.prompt: house, tree
    \.negativ: cat, dog
    \.w: 800
    \.h: 600
    \.seed: -1 по умолчанию (случайная генерация)


Пожалуйста, используйте только латинские символы.
Рекомендую использовать такие размеры изображений:
    512 × 512  <по умолчанию>
    768 × 768
    512 × 1024
    768 × 1024
    1024 × 768
`;
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
