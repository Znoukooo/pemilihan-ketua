import VoteRepository from '../../public/src/repositories/VoteRepository.js';

describe('VoteRepository Test', () => {
    let repo;

    beforeEach(() => {
        repo = new VoteRepository();
        localStorage.clear();
        jest.clearAllMocks();
    });

    test('saveVote() harus menyimpan data ke localStorage', async () => {
        const mockUser = { nama: 'Budi', nim: '1234567890' };
        
        // Mocking fetch karena repository sekarang menggunakan API
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true }),
            })
        );

        const success = await repo.saveVote(mockUser);
        expect(success).toBe(true);
        expect(global.fetch).toHaveBeenCalledWith('/api/votes', expect.any(Object));
    });
});