const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Coba gunakan CORS jika tersedia (untuk Localhost), jika tidak (Netlify) abaikan
try {
    const cors = require('cors');
    app.use(cors());
} catch (e) {
    console.log("CORS tidak terinstal, melewati...");
}

app.use(express.json());
app.use(express.static('public'));

// server.js
const DB_PATH = path.join(__dirname, 'public', 'db.json');

// Helper baca/tulis tetap sama
const readDB = () => {
    try {
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    } catch (err) {
        return { accounts: [], votes: [] };
    }
};
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Endpoint tetap menggunakan logika yang sudah kita perbaiki sebelumnya
app.post('/api/register', (req, res) => {
    const db = readDB();
    if (db.accounts.some(u => u.nim === req.body.nim)) {
        return res.status(400).json({ success: false, msg: "NIM sudah terdaftar!" });
    }
    db.accounts.push(req.body);
    writeDB(db);
    res.status(201).json({ success: true });
});

app.post('/api/login', (req, res) => {
    const db = readDB();
    const user = db.accounts.find(u => u.nim === req.body.nim && u.password === req.body.password);
    if (!user) return res.status(401).json({ success: false, msg: "NIM atau Password salah" });
    res.json(user);
});



// server.js

app.put('/api/accounts/:nim', (req, res) => {
    const db = readDB();
    const userIndex = db.accounts.findIndex(u => u.nim === req.params.nim);
    if (userIndex !== -1) {
        const { nama, passwordLama, passwordBaru } = req.body;
        if (db.accounts[userIndex].password !== passwordLama) {
            return res.status(401).json({ success: false, msg: "Password lama salah!" });
        }
        db.accounts[userIndex].nama = nama;
        if (passwordBaru) db.accounts[userIndex].password = passwordBaru;
        writeDB(db);
        res.json({ success: true, user: db.accounts[userIndex] });
    } else {
        res.status(404).json({ success: false, msg: "User tidak ditemukan" });
    }
});

// Tambahkan ini di server.js
app.get('/api/votes', (req, res) => {
    const db = readDB();
    res.json(db.votes);
});

app.post('/api/votes', (req, res) => {
    const db = readDB();
    db.votes.push(req.body); // Menambah data baru ke array votes
    writeDB(db);
    res.status(201).json({ success: true });
});

// Endpoint DELETE suara
app.delete('/api/votes/:index', (req, res) => {
    const db = readDB();
    const index = parseInt(req.params.index);
    if (db.votes[index] !== undefined) {
        db.votes.splice(index, 1);
        writeDB(db);
        res.json({ success: true });
    } else {
        res.status(404).send("Data tidak ditemukan");
    }
});

// server.js
app.put('/api/votes/:index', (req, res) => {
    const db = readDB();
    const index = parseInt(req.params.index); // Pastikan jadi angka
    
    if (!isNaN(index) && db.votes[index]) {
        // Ganti data pada index tersebut dengan data baru dari form
        db.votes[index] = req.body; 
        writeDB(db);
        return res.json({ success: true });
    } else {
        return res.status(404).json({ success: false, msg: "Data tidak ditemukan di database" });
    }
});

app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));