export default class VoteService {
    constructor(repository) {
        this.repository = repository;
    }

    async register(data) { return await this.repository.saveAccount(data); }
    async login(nim, password) {
        const user = await this.repository.login(nim, password);
        return user ? { success: true, user } : { success: false, msg: "NIM atau Password salah!" };
    }
    async getResults() { return await this.repository.getAllVotes(); }
    async submitVote(data) { return await this.repository.saveVote(data); }
    
    // SEKARANG MEMANGGIL REPO, BUKAN FETCH
    async updateVote(index, data) {
        return await this.repository.updateVote(index, data);
    }
    
    async deleteVote(index) { return await this.repository.deleteVote(index); }
}