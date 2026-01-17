// public/src/repositories/VoteRepository.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://cnfpzuarlcqoatgpkoqh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZnB6dWFybGNxb2F0Z3Brb3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1ODkzNjQsImV4cCI6MjA4NDE2NTM2NH0.vYAeU7GqwhO7uWmYTicqiXRI9TCp_aaCrgKtDBDXrgg'; 
const supabase = createClient(supabaseUrl, supabaseKey);

export default class VoteRepository {
    constructor() {
        this.isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    }

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
            const { error } = await supabase.from('accounts').insert([userData]);
            return !error;
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
            const { data } = await supabase.from('accounts').select('*').eq('nim', nim).eq('password', password).single();
            return data || null;
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
            const { error } = await supabase.from('votes').insert([voteData]);
            return !error;
        }
    }

    // --- LOGIKA AMBIL DATA ---
    async getAllVotes() {
        if (this.isLocal) {
            const res = await fetch('/api/votes');
            return await res.json();
        } else {
            const { data } = await supabase.from('votes').select('*');
            return data || [];
        }
    }

    // --- LOGIKA UPDATE (PENTING) ---
    async updateVote(indexOrNim, updatedData) {
        if (this.isLocal) {
            // Localhost menggunakan index array di server.js
            const res = await fetch(`/api/votes/${indexOrNim}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            return res.ok;
        } else {
            // DI NETLIFY: Gunakan NIM untuk update di Supabase
            const { error } = await supabase
                .from('votes')
                .update(updatedData)
                .eq('nim', updatedData.nim); // Cari berdasarkan NIM dari form
            return !error;
        }
    }

    // --- LOGIKA DELETE ---
    async deleteVote(indexOrNim) {
        if (this.isLocal) {
            // Localhost menggunakan index array di server.js
            const res = await fetch(`/api/votes/${indexOrNim}`, { method: 'DELETE' });
            return res.ok;
        } else {
            // DI NETLIFY: Gunakan NIM untuk hapus di Supabase
            const { error } = await supabase
                .from('votes')
                .delete()
                .eq('nim', indexOrNim); // indexOrNim di sini berisi NIM saat dipanggil dari Controller
            return !error;
        }
    }
}