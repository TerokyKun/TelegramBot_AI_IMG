export function validateData(data) {
    // Удаляем кириллические символы из строки
    const result = data.replace(/[а-яё]/gi, '');
    return result;
}
//# sourceMappingURL=validator.js.map