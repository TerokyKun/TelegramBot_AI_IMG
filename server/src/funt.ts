export function sendHelpMessage(bot, chatId) {
    const helpMessage = `
    Привет! 🎨 Добро пожаловать в бота для создания уникальных изображений на основе ваших текстовых запросов! Вот как им пользоваться:

    1. Написание запроса:
        Это может быть объект, который вы хотите увидеть на изображении. Например: "kitten" ("котенок"), "spaceship" ("космический корабль"), "castle" ("замок").
       
        Напишите о его внешности, стиле и других интересных особенностях. Например: "pink kitten with big eyes" ("розовый котенок с большими глазами"), "futuristic spaceship with bright lights" ("футуристический космический корабль с яркими огнями"), "fairytale castle with towers" ("сказочный замок с башнями").
       
        Получите уникальное изображение! Бот создаст для вас уникальное изображение на основе вашего запроса и описания.
    
    2. Дополнительные настройки:

        Формат изображения: Вы можете изменить формат изображения, указав ширину и высоту в пикселях через пункт меню "Формат".

        Выбор модели: Модель генерации может изменить стиль вашего изображения. Выберите подходящую модель в пункте "Модели".
    
    3. Продвинутые настройки:

        .negativ: ; 👈 Используйте этот флаг, чтобы исключить нежелательные атрибуты изображения. Например: ".negativ: bad quality;" (".negativ: плохое качество;").

        .seed: ; 👈 Укажите этот флаг, чтобы контролировать начальную точку генерации или редактировать понравившийся результат. Например: ".seed: 111;" (Использовать для работы только цифры).

        Важно! Ипосльзовать обызательно точку с запятой после начальных атрибутов, чтобы использовать .negativ и .seed. Между флагами тоже нужно использовать точку с запятой и объявлять их обязательно с использованием .negativ: и .seed: 
    
    Пример использования:

         girl, long hair;
        .negativ: bad quality;
        .seed: 111;
    
    Также не забывайте, что для генерации изображений используйте только латинские буквы (английский язык). 
    Удачного творчества! 🖌️✨`;
    ;

    bot.sendMessage(chatId, helpMessage, {
      reply_markup: {
        keyboard: [
          [{ text: 'Модели', callback_data: '/model' }, { text: 'Форматы', callback_data: '/format' }],
          [{ text: 'Краткое обучение', callback_data: '/help' }]
        ]
      },
    });
}





export function sendFormatMessage(bot, chatId) {
    const formatMessage = `
    Выберите формат изображения:
    1. 512x512
    2. 1024x768
    3. 768x1024
    4. 512x768
    5. Случайный
    `;
    bot.sendMessage(chatId, formatMessage, {
      reply_markup: {
        keyboard: [
          [{ text: "512x512" }, { text: "1024x768" }],
          [{ text: "768x1024" }, { text: "512x768" }],
          [{ text: "Случайный" }],
        ],
        resize_keyboard: true,
      },
    });
}

// Переменная для хранения выбранной модели
let selectedModel = "primemix_v21";

// Функция для отправки сообщения с выбором модели и сохранения выбранной модели
export async function sendModelMenu(bot, chatId) {
    const modelOptions = `
    Выберите модель:
    1. primemix_v21
    2. tPonynai3_v41OptimizedFromV4
    3. dreamshaperXL_v21TurboDPMSDE
    4. meinamix_meinaV11`;

    bot.sendMessage(chatId, modelOptions, {
        reply_markup: {
            keyboard: [
                [{ text: 'primemix_v21' }],
                [{ text: 'tPonynai3_v41OptimizedFromV4' }],
                [{ text: 'dreamshaperXL_v21TurboDPMSDE' }], 
                [{ text: 'meinamix_meinaV11.safetensors' }]
            ],
            resize_keyboard: true,
        },
    });
}


