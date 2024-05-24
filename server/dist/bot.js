import axios from "axios";
import sharp from "sharp";
import { sendHelpMessage, sendFormatMessage, sendModelMenu } from './funt.js';
let defaultWidth = 512; // Ширина по умолчанию
let defaultHeight = 512; // Высота по умолчанию
let defaulModel = "primemix_v21";
// Функция для обработки сообщений
export async function handleMessage(bot, msg) {
    // Проверяем, является ли сообщение известной командой
    if (isKnownCommand(msg.text)) {
        // Если да, завершаем обработку
        return;
    }
    // Обрабатываем текстовые сообщения
    handleTextMessage(bot, msg);
}
// Проверяем, является ли сообщение одной из известных команд
function isKnownCommand(text) {
    // Регулярное выражение для проверки команд
    const commandRegex = /^(\/start|\/format|\/model|\/help)$/;
    // Проверяем, соответствует ли текст команде
    return commandRegex.test(text);
}
// Обработка текстовых запросов
async function handleTextMessage(bot, msg) {
    // Регулярное выражение для сопоставления формата сообщения
    const match = msg.text.match(/([^;]*)(?:\s*;\s*|\s*\.?\s*)?(?:\.negativ:\s*([^;]*)(?:\s*;\s*|\s*\.?\s*)?)?(?:\.seed:\s*([0-9]+)(?:\s*;|\s*\.?\s*)?)?/i);
    if (!match) {
        // Если сообщение не соответствует формату, отправляем сообщение о некорректном формате
        bot.sendMessage(msg.chat.id, "Сообщение имеет некорректный формат!");
        return;
    }
    const chatId = msg.chat.id;
    const promptmsg = match[1] ? match[1].trim() : ''; // Получаем значение prompt
    const negativMsg = match[2]
        ? match[2].trim()
        : "(deformed, distorted, disfigured:1.2),bad face, low quality, blurry face, poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, (mutated hands and fingers:1.4), disconnected limbs, mutation, mutated, ugly, disgusting, blurry, amputation, worst quality, large head, low quality, extra digits, bad eye, EasyNegativeV2"; // Получаем значение negativ
    const seedMsg = match[3] ? parseInt(match[3]) : -1; // Получаем значение seed
    // Если команда "/help", отправляем сообщение и не обрабатываем дальше
    if (msg.text === "/help" || msg.text === "Краткое обучение") {
        sendHelpMessage(bot, chatId);
        return;
    }
    // Если команда "/format", отправляем сообщение с выбором формата изображения
    if (msg.text === "/format" || msg.text === "Форматы") {
        sendFormatMessage(bot, chatId);
        return;
    }
    // Если команда "/model", отправляем сообщение с вариантами моделей
    if (msg.text === "/model" || msg.text === "Модели") {
        sendModelMenu(bot, chatId);
        return;
    }
    // Обработка выбора пользователем формата изображения
    if (msg.text === "512x512") {
        await setDefaultSize(chatId, 512, 512, bot);
        return;
    }
    else if (msg.text === "1024x768") {
        await setDefaultSize(chatId, 1024, 768, bot);
        return;
    }
    else if (msg.text === "768x1024") {
        await setDefaultSize(chatId, 768, 1024, bot);
        return;
    }
    else if (msg.text === "512x768") {
        await setDefaultSize(chatId, 512, 768, bot);
        return;
    }
    else if (msg.text === "Случайный") {
        const randomWidth = Math.floor(Math.random() * 1000) + 100;
        const randomHeight = Math.floor(Math.random() * 1000) + 100;
        await setDefaultSize(chatId, randomWidth, randomHeight, bot);
        return;
    }
    // Обработка выбора пользователем формата изображения
    if (msg.text === "primemix_v21") {
        await setModel(chatId, `primemix_v21.safetensors [b79a4f7283]`, bot);
        return;
    }
    else if (msg.text === "tPonynai3_v41OptimizedFromV4") {
        await setModel(chatId, `tPonynai3_v41OptimizedFromV4.safetensors [0b3046dd73]`, bot);
        return;
    }
    else if (msg.text === "dreamshaperXL_v21TurboDPMSDE") {
        await setModel(chatId, `dreamshaperXL_v21TurboDPMSDE.safetensors [4496b36d48]`, bot);
        return;
    }
    else if (msg.text === "meinamix_meinaV11.safetensors") {
        await setModel(chatId, `meinamix_meinaV11.safetensors [54ef3e3610]`, bot);
        return;
    }
    const isModelName = /^(primemix_v21|tPonynai3_v41OptimizedFromV4|dreamshaperXL_v21TurboDPMSDE)$/.test(msg.text);
    if (isModelName) {
        // Если сообщение является наименованием модели, отправляем сообщение о сохранении формата и завершаем выполнение функции
        bot.sendMessage(chatId, `Модель ${msg.text} выбрана.`);
        return;
    }
    // Отправляем запрос на генерацию изображения
    try {
        console.log(`Received message from user: ${JSON.stringify(msg.from)}`);
        // Отправляем выбранную модель на сервер
        const optionResponse = await axios.post("http://127.0.0.1:7860/sdapi/v1/options", {
            sd_model_checkpoint: defaulModel,
        });
        // Отправляем запрос на генерацию изображения
        const response = await axios.post("http://127.0.0.1:7860/sdapi/v1/txt2img", {
            prompt: promptmsg,
            negative_prompt: negativMsg,
            steps: 20,
            cfg_scale: 8,
            width: defaultWidth,
            height: defaultHeight,
            seed: seedMsg,
            sampler_index: "Euler a",
        });
        const ingInfo = response.data.info;
        const useBackIngoImage = JSON.parse(ingInfo);
        // Получаем изображение в формате base64
        const imageBase64 = response.data.images[0];
        // Конвертируем изображение в формат PNG
        const imageBuffer = Buffer.from(imageBase64, "base64");
        const pngBuffer = await sharp(imageBuffer).png().toBuffer();
        console.log(`Prompt: ${useBackIngoImage.prompt}`);
        console.log(`NegativePrompt: ${useBackIngoImage.negative_prompt}`);
        console.log(`Seed: ${useBackIngoImage.seed}`);
        console.log(`W: ${useBackIngoImage.width}`);
        console.log(`H: ${useBackIngoImage.height}`);
        const caption = `Сгенерированное изображение:
    ${useBackIngoImage.prompt};
    .negativ: ${useBackIngoImage.negative_prompt};
    .seed: ${useBackIngoImage.seed};
    Формат ${useBackIngoImage.width}x${useBackIngoImage.height}`;
        // Отправляем изображение в чат с использованием URL с данными изображения в формате base64
        await bot.sendPhoto(chatId, pngBuffer, {
            caption,
            reply_markup: {
                keyboard: [
                    [{ text: "Модели", callback_data: "/model" }, { text: "Форматы", callback_data: "/format" }],
                    [{ text: "Краткое обучение", callback_data: "/help" }]
                ]
            },
        });
    }
    catch (error) {
        console.error("Ошибка при запросе на генерацию изображения:", error);
        bot.sendMessage(chatId, "Произошла ошибка при генерации изображения. Пожалуйста, попробуйте позже.");
    }
}
// Функция для установки размера изображения по умолчанию
async function setDefaultSize(chatId, width, height, bot) {
    defaultWidth = width;
    defaultHeight = height;
    bot.sendMessage(chatId, `Формат ${width}x${height} сохранен.`, {
        reply_markup: {
            keyboard: [
                [
                    { text: "Модели", callback_data: "/model" },
                    { text: "Форматы", callback_data: "/format" },
                ],
                [{ text: "Краткое обучение", callback_data: "/help" }],
            ],
        },
    });
}
async function setModel(chatId, modelCode, bot) {
    defaulModel = modelCode;
    bot.sendMessage(chatId, `Выбрана модель: ${modelCode}`, {
        reply_markup: {
            keyboard: [
                [
                    { text: "Модели", callback_data: "/model" },
                    { text: "Форматы", callback_data: "/format" },
                ],
                [{ text: "Краткое обучение", callback_data: "/help" }],
            ],
        },
    });
}
//# sourceMappingURL=bot.js.map