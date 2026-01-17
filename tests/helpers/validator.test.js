import { validateNIM, validateEmpty } from '../../public/src/utils/validator.js';

describe('Validator Helper Test', () => {
    test('validateNIM harus mengembalikan true untuk NIM 10-12 digit', () => {
        expect(validateNIM('202201010001')).toBe(true);
    });

    test('validateNIM harus mengembalikan false untuk NIM berisi huruf', () => {
        expect(validateNIM('202201abc001')).toBe(false);
    });

    test('validateEmpty harus mengembalikan false jika ada field kosong', () => {
        const data = { nama: 'Budi', nim: '' };
        expect(validateEmpty(data)).toBe(false);
    });
});