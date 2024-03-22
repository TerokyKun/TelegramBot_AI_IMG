export function validateData(data: string): string {
    // Удаляем кириллические символы из строки
    const result = data.replace(/[а-яё]/gi, '');
    return result;
}