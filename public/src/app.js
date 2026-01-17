import VoteController from './controller/VoteController.js';
import VoteView from './views/VoteView.js';
import VoteService from './services/VoteService.js';
import VoteRepository from './repositories/VoteRepository.js';

const app = new VoteController(new VoteService(new VoteRepository()), new VoteView());

document.addEventListener('DOMContentLoaded', async () => {
    // PANGGIL INIT HANYA DI SINI (Sekali saja)
    await app.init();

    // REGISTER
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.onsubmit = async (e) => {
            e.preventDefault();
            const data = {
                nama: document.getElementById('regNama').value,
                nim: document.getElementById('regNim').value,
                password: document.getElementById('regPassword').value,
                tglLahir: document.getElementById('regTglLahir').value
            };
            await app.handleRegister(data);
        };
    }

    // LOGIN
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const nim = document.getElementById('loginNim').value;
            const password = document.getElementById('loginPassword').value;
            // Gunakan variabel app yang sudah dibuat di atas
            await app.handleLogin(nim, password); 
        };
    }

    // VOTE (Cukup satu Event Listener saja di sini)
    const voteForm = document.getElementById('voteForm');
    if (voteForm) {
        voteForm.onsubmit = async (e) => {
            e.preventDefault(); 
            console.log("Tombol simpan/update ditekan!");
            await app.handleVote();
        };
    }

    // LOGOUT
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.onclick = (e) => {
            e.preventDefault();
            sessionStorage.removeItem('userSession');
            window.location.reload();
        };
    }

    // BATAL EDIT
    const btnCancelEdit = document.getElementById('btnCancelEdit');
    if (btnCancelEdit) {
        btnCancelEdit.onclick = () => {
            const savedUser = JSON.parse(sessionStorage.getItem('userSession'));
            app.view.resetForm(savedUser);
        };
    }
});

document.getElementById('btnSettings').onclick = () => {
    app.handleOpenProfil();
    const modal = new bootstrap.Modal(document.getElementById('modalProfil'));
    modal.show();
};

document.getElementById('btnSaveProfil').onclick = async () => {
    await app.handleUpdateProfil();
};

const darkModeToggle = document.getElementById('darkModeToggle');
const darkIcon = document.getElementById('darkIcon');

darkModeToggle.addEventListener('click', async () => { // Tambahkan async di sini
    const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Ganti Ikon
    darkIcon.setAttribute('name', newTheme === 'dark' ? 'sunny-outline' : 'moon-outline');

    // TAMBAHKAN INI: Agar daftar suara (vote list) langsung berubah warna bg-nya
    if (app.currentUser) {
        await app.renderResults();
    }
});

// Jalankan saat load pertama kali
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-bs-theme', savedTheme);
if (darkIcon) {
    darkIcon.setAttribute('name', savedTheme === 'dark' ? 'sunny-outline' : 'moon-outline');
}