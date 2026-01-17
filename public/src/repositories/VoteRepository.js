export default class VoteRepository {
    constructor() {
        // Cek apakah aplikasi berjalan di localhost
        this.isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        
        if (!this.isLocal && !localStorage.getItem('db_pemilihan')) {
            localStorage.setItem('db_pemilihan', JSON.stringify({ accounts: [], votes: [] }));
        }
    }

    // --- HELPER UNTUK LOCALSTORAGE (NETLIFY) ---
    getLB() { return JSON.parse(localStorage.getItem('db_pemilihan')); }
    saveLB(data) { localStorage.setItem('db_pemilihan', JSON.stringify(data)); }

    // --- LOGIKA REGISTER ---
    async saveAccount(userData) {
        if (this.isLocal) {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            return res.ok;
        } else {
            const db = this.getLB();
            if (db.accounts.find(u => u.nim === userData.nim)) return false;
            db.accounts.push(userData);
            this.saveLB(db);
            return true;
        }
    }

    // --- LOGIKA LOGIN ---
    async login(nim, password) {
        if (this.isLocal) {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nim, password })
            });
            return res.ok ? await res.json() : null;
        } else {
            const db = this.getLB();
            return db.accounts.find(u => u.nim === nim && u.password === password) || null;
        }
    }

    // --- LOGIKA VOTE (SAVE) ---
    async saveVote(voteData) {
        if (this.isLocal) {
            const res = await fetch('/api/votes', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(voteData)
            });
            return res.ok;
        } else {
            const db = this.getLB();
            db.votes.push(voteData);
            this.saveLB(db);
            return true;
        }
    }

    // --- LOGIKA UPDATE ---
    async updateVote(index, updatedData) {
        if (this.isLocal) {
            const res = await fetch(`/api/votes/${index}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            return res.ok;
        } else {
            const db = this.getLB();
            db.votes[index] = updatedData;
            this.saveLB(db);
            return true;
        }
    }

    // --- LOGIKA DELETE ---
    async deleteVote(index) {
        if (this.isLocal) {
            const res = await fetch(`/api/votes/${index}`, { method: 'DELETE' });
            return res.ok;
        } else {
            const db = this.getLB();
            db.votes.splice(index, 1);
            this.saveLB(db);
            return true;
        }
    }

    // --- LOGIKA AMBIL DATA ---
    async getAllVotes() {
        if (this.isLocal) {
            // Di Localhost: Ambil dari API Node.js
            const res = await fetch('/api/votes');
            return await res.json();
        } else {
            // DI NETLIFY: Ambil file fisik db.json yang ada di folder yang sama
            try {
                const response = await fetch('./db.json'); // Path relatif ke index.html
                const dataFromFile = await response.json();
                
                // Gabungkan dengan data baru di browser user (LocalStorage)
                const localData = this.getLB();
                const allVotes = [...dataFromFile.votes, ...localData.votes];
                
                // Filter agar NIM unik (tidak double)
                return Array.from(new Map(allVotes.map(item => [item.nim, item])).values());
            } catch (error) {
                return this.getLB().votes;
            }
        }
    }
}