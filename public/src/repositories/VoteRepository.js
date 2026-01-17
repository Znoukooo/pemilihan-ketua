export default class VoteRepository {
    async saveAccount(userData) {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return res.ok;
    }

    async login(nim, password) {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nim, password })
        });
        return res.ok ? await res.json() : null;
    }

    async updateAccount(nim, newData) {
        const res = await fetch(`/api/users/${nim}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newData)
        });
        return await res.json();
    }

    // --- Logika Suara (Lama) ---
    async saveVote(voteData) {
        const res = await fetch('/api/votes', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(voteData)
        });
        return res.ok;
    }

    async updateVote(index, updatedData) {
        const res = await fetch(`/api/votes/${index}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });
        return res.ok;
    }

    async deleteVote(index) {
        const res = await fetch(`/api/votes/${index}`, {
            method: 'DELETE'
        });
        return res.ok;
    }

    async getAllVotes() {
        const res = await fetch('/api/votes');
        return await res.json();
    }
}