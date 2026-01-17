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
            // Di Localhost: Tetap ambil dari server Node.js Anda
            const res = await fetch('/api/votes');
            return await res.json();
        } else {
            // DI NETLIFY: Ambil file db.json terbaru yang Anda 'Push' ke GitHub
            try {
                // Kita fetch file db.json yang berada di folder root project Anda
                const response = await fetch('../../db.json');
                const dataFromFile = await response.json();
                
                // Ambil juga data baru yang disimpan user di browser ini (LocalStorage)
                const localData = this.getLB();
                
                // GABUNGKAN: Data dari VS Code (File) + Data dari Browser (Local)
                // Ini memastikan data yang Anda tulis di VS Code otomatis muncul di aplikasi
                const allVotes = [...dataFromFile.votes, ...localData.votes];
                
                // Hilangkan duplikasi jika ada (berdasarkan NIM) agar data tidak double
                const uniqueVotes = Array.from(new Map(allVotes.map(item => [item.nim, item])).values());
                
                return uniqueVotes;
            } catch (error) {
                console.error("Gagal sinkronisasi dengan db.json:", error);
                return this.getLB().votes; // Fallback jika file tidak terbaca
            }
        }
    }
}