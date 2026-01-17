import VoteService from '../../public/src/services/VoteService.js';

describe('Auth Service Test', () => {
    let service;
    let mockRepo;

    beforeEach(() => {
        mockRepo = {
            saveAccount: jest.fn(),
            login: jest.fn() // Pastikan nama fungsi ini ada
        };
        service = new VoteService(mockRepo);
    });

    test('login harus mengembalikan data jika NIM dan Password benar', async () => {
        const mockUser = { nim: '1234567890', nama: 'Budi' };
        mockRepo.login.mockResolvedValue(mockUser);
        
        const res = await service.login('1234567890', 'password');
        expect(res.success).toBe(true);
        expect(res.user.nama).toBe('Budi');
    });
});