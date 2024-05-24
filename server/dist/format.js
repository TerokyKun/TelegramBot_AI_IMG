export function handleFormat(bot) {
    // Обработчик нажатия на кнопку "Форматы"
    bot.onText(/\/format/, (msg) => {
        const replyMessage = `
        Выберите формат изображения:
        `;
        const keyboard = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Формат 1: 512x512', callback_data: '512x512' }],
                    [{ text: 'Формат 2: 1024x1024', callback_data: '1024x1024' }],
                    [{ text: 'Формат 3: 800x600', callback_data: '800x600' }],
                    [{ text: 'Формат 4: 1920x1080', callback_data: '1920x1080' }]
                ]
            }
        };
        bot.sendMessage(msg.chat.id, replyMessage, keyboard);
    });
    // Обработчик нажатия на кнопки с выбором размеров изображения
    bot.on('callback_query', (callbackQuery) => {
        const msg = callbackQuery.message;
        const data = callbackQuery.data;
        // Разбираем данные о размерах изображения
        const [width, height] = data.split('x');
        // Отправляем сообщение о выбранном формате и сохраняем размеры в объекте
        const replyMessage = `Выбран формат ${width}x${height}`;
        bot.sendMessage(msg.chat.id, replyMessage);
        // Используйте эти размеры для дальнейшей обработки
    });
}
//# sourceMappingURL=format.js.map