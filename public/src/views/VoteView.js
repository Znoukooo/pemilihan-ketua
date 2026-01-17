export default class VoteView {
    showMainApp(user) {
        document.getElementById('login-section').classList.add('d-none');
        document.getElementById('main-app').classList.remove('d-none');
        document.getElementById('user-info').classList.remove('d-none');
        document.getElementById('welcome-text').innerText = `Selamat Datang, ${user.nama} (${user.nim})`;
        
        document.getElementById('nama').value = user.nama;
        document.getElementById('nim').value = user.nim;
        document.getElementById('tglLahir').value = user.tglLahir || "";
    }

    resetForm(user) {
        document.getElementById('voteForm').reset();
        document.getElementById('editIndex').value = "";
        document.getElementById('formTitle').innerText = "Form Pendaftaran Pemilih";
        document.getElementById('btnSubmit').innerText = "Kirim Suara";
        document.getElementById('btnCancelEdit').classList.add('d-none');
        
        if (user) {
            document.getElementById('nama').value = user.nama;
            document.getElementById('nim').value = user.nim;
            document.getElementById('tglLahir').value = user.tglLahir || "";
        }
    }

    fillFormForEdit(index, data) {
        document.getElementById('editIndex').value = index;
        document.getElementById('nama').value = data.nama;
        document.getElementById('nim').value = data.nim; 
        document.getElementById('tglLahir').value = data.tglLahir;
        document.getElementById('kandidat').value = data.pilihan;
        
        document.getElementById('formTitle').innerText = "Edit Suara Anda";
        document.getElementById('btnSubmit').innerText = "Simpan Perubahan";
        document.getElementById('btnCancelEdit').classList.remove('d-none');
    }

    getFormData() {
        return {
            nama: document.getElementById('nama').value,
            nim: document.getElementById('nim').value,
            kelas: document.getElementById('kelas').value,
            prodi: document.getElementById('prodi').value,
            tglLahir: document.getElementById('tglLahir').value,
            pilihan: document.getElementById('kandidat').value
        };
    }

    getEditIndex() {
        const el = document.getElementById('editIndex');
        return el ? el.value : "";
    }

    renderResults(votes, onEdit, onDelete, loggedInNim) {
        const list = document.getElementById('voteList');
        list.innerHTML = votes.length ? '' : '<p class="text-muted text-center py-5">Belum ada data suara masuk.</p>';
    
        // Ambil status tema saat ini
        const isDarkMode = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    
        votes.forEach((v) => {
            const isOwner = loggedInNim && v.nim === loggedInNim;
            const item = document.createElement('div');
            
            // MODIFIKASI: Gunakan bg-body-tertiary agar otomatis berubah saat dark mode
            // Tambahkan text-light jika dark mode agar tulisan terlihat jelas
            item.className = `list-group-item border-0 mb-3 shadow-sm rounded-3 border-start border-4 ${
                isOwner ? 'border-success' : 'border-primary'
            } ${isDarkMode ? 'bg-dark text-light' : 'bg-white text-dark'}`;
            
            item.innerHTML = `
                <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center py-1">
                    <div class="mb-2 mb-md-0 overflow-hidden w-100">
                        <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
                            <h6 class="mb-0 fw-bold text-reset text-truncate" style="max-width: 200px;">${v.nama}</h6>
                            <div class="d-flex gap-1">
                                ${isOwner ? '<span class="badge bg-success" style="font-size: 0.65rem;">Anda</span>' : ''}
                                <span class="badge bg-primary" style="font-size: 0.65rem;">${v.pilihan}</span>
                            </div>
                        </div>
                        <div class="d-flex align-items-center ${isDarkMode ? 'text-light-emphasis' : 'text-muted'} small">
                            <span class="text-truncate">${v.nim}</span>
                            <span class="mx-2">|</span>
                            <span class="text-truncate">${v.prodi}</span>
                        </div>
                    </div>
                    
                    <div class="mt-2 mt-md-0 ms-md-3 d-flex w-100 w-md-auto">
                        ${isOwner ? `
                            <div class="d-flex justify-content-between gap-3 w-100">
                                <button class="btn btn-sm btn-outline-primary px-3 flex-fill btn-edit" data-nim="${v.nim}">
                                    Edit
                                </button>
                                <button class="btn btn-sm btn-danger px-3 flex-fill btn-delete" data-nim="${v.nim}">
                                    Hapus
                                </button>
                            </div>
                        ` : `<span class="badge ${isDarkMode ? 'bg-secondary' : 'bg-light text-muted'} border py-2 px-3 small w-100 text-center w-md-auto">Read-only</span>`}
                    </div>
                </div>
            `;
            list.appendChild(item);
        });
    
        // Listener tetap sama...
        document.querySelectorAll('.btn-edit').forEach(b => {
            b.onclick = () => {
                onEdit(b.dataset.nim);
                this.toggleFormLock(false);
            };
        });
        
        document.querySelectorAll('.btn-delete').forEach(b => {
            b.onclick = () => onDelete(b.dataset.nim);
        });
    }

    toggleFormLock(isLocked) {
        const btnSubmit = document.getElementById('btnSubmit');
        const kandidatSelect = document.getElementById('kandidat');
        const formTitle = document.getElementById('formTitle');
        const editIndex = this.getEditIndex(); // Cek apakah sedang mode edit
    
        if (btnSubmit && kandidatSelect) {
            // JANGAN kunci jika sedang dalam mode EDIT
            const finalLockState = (editIndex !== "" && editIndex !== null) ? false : isLocked;
    
            btnSubmit.disabled = finalLockState;
            kandidatSelect.disabled = finalLockState;
    
            if (finalLockState) {
                btnSubmit.innerText = "Anda Sudah Mengirim Suara";
                btnSubmit.className = "btn btn-secondary w-100";
                formTitle.innerHTML = 'Form Pendaftaran <span class="badge bg-success">Sudah Memilih</span>';
            } else {
                btnSubmit.innerText = (editIndex !== "" && editIndex !== null) ? "Simpan Perubahan" : "Kirim Suara";
                btnSubmit.className = "btn btn-primary w-100";
                formTitle.innerText = "Form Pendaftaran Pemilih";
            }
        }
    }

    renderStats(votes) {
        const total = votes.length;
        const k1 = votes.filter(v => v.pilihan === "Kandidat 1").length;
        const k2 = votes.filter(v => v.pilihan === "Kandidat 2").length;
    
        if(document.getElementById('totalSuara')) {
            document.getElementById('totalSuara').innerText = total;
            document.getElementById('totalK1').innerText = k1;
            document.getElementById('totalK2').innerText = k2;
        }
    }
    
    fillProfilModal(user) {
        document.getElementById('updNama').value = user.nama;
        document.getElementById('updOldPassword').value = "";
        document.getElementById('updNewPassword').value = "";
    }
    
    getProfilFormData() {
        return {
            nama: document.getElementById('updNama').value,
            passwordLama: document.getElementById('updOldPassword').value,
            passwordBaru: document.getElementById('updNewPassword').value
        };
    }

    // Tambahkan baris ini di dalam fillFormForEdit pada VoteView.js
    fillFormForEdit(index, data) {
        // Simpan index asli ke input hidden
        document.getElementById('editIndex').value = index; 
        
        document.getElementById('nama').value = data.nama;
        document.getElementById('nim').value = data.nim; 
        document.getElementById('tglLahir').value = data.tglLahir;
        document.getElementById('kandidat').value = data.pilihan;
        
        document.getElementById('formTitle').innerText = "Edit Suara Anda";
        document.getElementById('btnSubmit').innerText = "Simpan Perubahan";
        document.getElementById('btnSubmit').disabled = false;
        document.getElementById('btnCancelEdit').classList.remove('d-none');
    }

    constructor() {
        this.chart = null;
    }
    
    renderStats(votes) {
        const total = votes.length;
        const k1 = votes.filter(v => v.pilihan === "Kandidat 1").length;
        const k2 = votes.filter(v => v.pilihan === "Kandidat 2").length;
    
        // Update Angka di Card
        document.getElementById('totalSuara').innerText = total;
        document.getElementById('totalK1').innerText = k1;
        document.getElementById('totalK2').innerText = k2;
    
        // PANGGIL FUNGSI DIAGRAM
        this.updateChart(k1, k2);
    }
    
    updateChart(k1, k2) {
        const ctx = document.getElementById('voteChart').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }
    
        this.chart = new Chart(ctx, {
            type: 'bar', // DIUBAH DARI PIE KE BAR
            data: {
                labels: ['Kandidat 1', 'Kandidat 2'],
                datasets: [{
                    label: 'Perolehan Suara',
                    data: [k1, k2],
                    backgroundColor: [
                        '#0056b3', // Biru (Kandidat 1)
                        '#ffc107'  // Kuning (Kandidat 2)
                    ],
                    borderRadius: 8, // Membuat ujung batang membulat (Modern)
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false } // Sembunyikan legend karena sudah ada label di bawah
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1, // Agar skala hanya angka bulat (1, 2, 3...)
                            color: document.documentElement.getAttribute('data-bs-theme') === 'dark' ? '#aaa' : '#666'
                        },
                        grid: {
                            display: false // Sembunyikan garis grid agar lebih clean
                        }
                    },
                    x: {
                        ticks: {
                            color: document.documentElement.getAttribute('data-bs-theme') === 'dark' ? '#aaa' : '#666'
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}

