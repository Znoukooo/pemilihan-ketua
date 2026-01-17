import VoteController from '../../public/src/controller/VoteController.js';

describe('VoteController Test', () => {
    let controller;
    let mockService;
    let mockView;

    beforeEach(() => {
        // MOCK ALERT agar tidak error
        window.alert = jest.fn();
        
        mockService = {
            submitVote: jest.fn().mockResolvedValue(true),
            updateVote: jest.fn().mockResolvedValue(true),
            getResults: jest.fn().mockResolvedValue([])
        };
        mockView = {
            getFormData: jest.fn().mockReturnValue({
                nama: 'Budi', nim: '1234567890', pilihan: 'Kandidat 1'
            }),
            getEditIndex: jest.fn().mockReturnValue(""),
            renderResults: jest.fn(),
            resetForm: jest.fn(),
            showMainApp: jest.fn()
        };
        controller = new VoteController(mockService, mockView);
    });

    test('handleVote harus memanggil service submitVote saat editIndex kosong', async () => {
        await controller.handleVote();
        expect(mockService.submitVote).toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith("Data Berhasil Disimpan!");
    });
});