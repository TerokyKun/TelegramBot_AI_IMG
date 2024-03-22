import axios from "axios";
import TelegramBot from "node-telegram-bot-api";
import sharp from "sharp";
import { validateData } from './validator.js';

// Функция для обработки сообщений
export async function handleMessage(
  bot: TelegramBot,
  msg: TelegramBot.Message
) {
  // Проверяем, является ли сообщение командой или соответствует ли сообщение формату
  
  if (
    msg.text.match(/^\s*\/start/i) // Добавляем проверку на команду /start
  ) {

    return;
  }

  if (
    !msg.text ||
    !msg.text.match(/^\s*\.prompt:/i)
  ) {
    // Если сообщение не соответствует формату, отправляем сообщение о некорректном формате
    bot.sendMessage(msg.chat.id, "Сообщение имеет некорректный формат!");
    return;
  }


  const chatId = msg.chat.id;
  const text = msg.text;

  const validatedText = validateData(text);

  // Регулярное выражение для сопоставления формата сообщения
  const match = validatedText.match(
    /\.prompt:\s*([^.]*)\s*(?:\.negativ:\s*([^.]*)\s*)?(?:\.w:\s*([0-9]+)\s*)?(?:\.h:\s*([0-9]+)\s*)?/i
  );
  if (match) {
    let promptmsg = match[1].trim(); // Получаем значение prompt
    let negativ = match[2] ? match[2].trim() : "(deformed, distorted, disfigured:1.2),bad face, low quality, blurry face, poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, (mutated hands and fingers:1.4), disconnected limbs, mutation, mutated, ugly, disgusting, blurry, amputation, worst quality, large head, low quality, extra digits, bad eye, EasyNegativeV2, text"; // Получаем значение negativ
    let width = match[3] ? parseInt(match[3]) : 512; // Получаем значение ширины
    let height = match[4] ? parseInt(match[4]) : 512; // Получаем значение высоты

    // Отправляем запрос на генерацию изображения
    try {
      const response = await axios.post(
        "http://127.0.0.1:7860/sdapi/v1/txt2img",
        {
          prompt: promptmsg,
          negative_prompt: negativ,
          steps: 20,
          cfg_scale: 8,
          width: width,
          height: height,
          seed: -1,
          sampler_index: "DPM++ 2M Karras",
        }
      );

      // Выводим информацию о изображении в консоль
      console.log(
        "Информация о генерируемом изображении:",
        response.data.info
      );

      // Получаем изображение в формате base64
      const imageBase64 = response.data.images[0];

      // Конвертируем изображение в формат PNG
      const imageBuffer = Buffer.from(imageBase64, "base64");
      const pngBuffer = await sharp(imageBuffer).png().toBuffer();

      // Отправляем изображение в чат
      bot.sendPhoto(chatId, pngBuffer, { filename: "generated_image.png" });
    } catch (error) {
      console.error("Ошибка при запросе на генерацию изображения:", error);
      bot.sendMessage(
        chatId,
        "Произошла ошибка при генерации изображения. Пожалуйста, попробуйте еще раз."
      );
    }
  } 
}
