import User from '../../public/src/models/User.js';

describe('User Model Test', () => {
    test('Harus dapat membuat instance User dengan data yang benar', () => {
        const user = new User(
            'Budi Santoso', 
            '202201010001', 
            '03TPLP001', 
            'Teknik Informatika', 
            '2000-01-01', 
            'Kandidat 1'
        );

        expect(user.nama).toBe('Budi Santoso');
        expect(user.nim).toBe('202201010001');
        expect(user.pilihan).toBe('Kandidat 1');
    });
});