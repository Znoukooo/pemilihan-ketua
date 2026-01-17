import { validateNIM, validateEmpty } from '../utils/validator.js';
import User from '../models/User.js';

export default class VoteService {
    constructor(repository) {
        this.repository = repository;
    }

    async register(data) { return await this.repository.saveAccount(data); }
    async login(nim, password) {
        const user = await this.repository.login(nim, password); // Pastikan nama ini 'login'
        return user ? { success: true, user } : { success: false, msg: "NIM atau Password salah!" };
    }
    async getResults() { return await this.repository.getAllVotes(); }
    async submitVote(data) { return await this.repository.saveVote(data); }
    async updateVote(index, data) {
        try {
            const response = await fetch(`/api/votes/${index}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            return result.success;
        } catch (err) {
            return false;
        }
    }
    async deleteVote(index) { return await this.repository.deleteVote(index); }

    
}