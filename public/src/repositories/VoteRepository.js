// public/src/repositories/VoteRepository.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Masukkan kredensial dari dashboard Supabase Anda
const supabaseUrl = 'https://cnfpzuarlcqoatgpkoqh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZnB6dWFybGNxb2F0Z3Brb3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1ODkzNjQsImV4cCI6MjA4NDE2NTM2NH0.vYAeU7GqwhO7uWmYTicqiXRI9TCp_aaCrgKtDBDXrgg'; 
const supabase = createClient(supabaseUrl, supabaseKey);

export default class VoteRepository {
    constructor() {
        // Cek apakah aplikasi berjalan di localhost
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
            // DI NETLIFY: Simpan ke tabel 'accounts' di Supabase
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
            // DI NETLIFY: Cek ke tabel 'accounts' di Supabase
            const { data } = await supabase
                .from('accounts')
                .select('*')
                .eq('nim', nim)
                .eq('password', password)
                .single();
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
            // DI NETLIFY: Simpan ke tabel 'votes' di Supabase
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
            // DI NETLIFY: Ambil semua data dari tabel 'votes' Supabase
            const { data } = await supabase.from('votes').select('*');
            return data || [];
        }
    }

    // --- LOGIKA DELETE ---
    async deleteVote(indexOrNim) {
        if (this.isLocal) {
            const res = await fetch(`/api/votes/${indexOrNim}`, { method: 'DELETE' });
            return res.ok;
        } else {
            // DI NETLIFY: Hapus berdasarkan NIM (lebih aman daripada index)
            const { error } = await supabase.from('votes').delete().eq('nim', indexOrNim);
            return !error;
        }
    }
}