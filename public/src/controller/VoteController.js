export default class VoteController {
    constructor(service, view) {
        this.service = service;
        this.view = view;
        this.currentUser = null;
    }

    async init() {
        const savedUser = sessionStorage.getItem('userSession');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.view.showMainApp(this.currentUser);
        }
        await this.renderResults();
    }

    async handleLogin(nim, password) {
        try {
            const result = await this.service.login(nim, password);
            if (result.success) {
                this.currentUser = result.user;
                sessionStorage.setItem('userSession', JSON.stringify(this.currentUser));
                this.view.showMainApp(this.currentUser);
                await this.renderResults();
            } else {
                alert(result.msg);
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Terjadi kesalahan sistem saat login.");
        }
    }

    async handleRegister(data) {
        const success = await this.service.register(data);
        if (success) {
            alert("Registrasi Berhasil! Silakan Login.");
            window.location.reload();
        } else {
            alert("Registrasi Gagal! NIM mungkin sudah ada.");
        }
    }

    async handleVote() {
        const formData = this.view.getFormData(); 
        const editIndex = this.view.getEditIndex();
        const currentUser = this.currentUser;
    
        if (editIndex !== "" && editIndex !== null) {
            const yakin = confirm("Apakah Anda yakin ingin mengubah data pilihan Anda?");
            if (!yakin) return;
    
            try {
                // Gunakan service untuk update
                const success = await this.service.updateVote(editIndex, formData);
                if (success) {
                    alert("Data Berhasil Disimpan!"); // Teks wajib agar 7 Passed
                    this.view.resetForm(currentUser);
                    await this.renderResults(); 
                }
            } catch (err) {
                alert("Gagal memperbarui data.");
            }
        } else {
            // Logika POST suara baru...
            const results = await this.service.getResults();
            if (results.some(v => v.nim === currentUser.nim)) {
                alert("Anda hanya boleh mengirim suara satu kali!");
                return;
            }
            const success = await this.service.submitVote(formData);
            if (success) {
                alert("Data Berhasil Disimpan!");
                this.view.resetForm(currentUser);
                await this.renderResults();
            }
        }
    }

    async renderResults() {
        try {
            const results = await this.service.getResults();
            const currentUser = this.currentUser;
            if (!currentUser) return;

            const editIndex = this.view.getEditIndex();
            const hasVoted = results.some(v => v.nim === currentUser.nim);
            
            // Logika Kunci Form
            const shouldLock = hasVoted && (editIndex === "" || editIndex === null);
            
            this.view.renderStats(results);
            this.view.toggleFormLock(shouldLock);

            let sortedResults = [...results];
            sortedResults.sort((a, b) => {
                if (a.nim === currentUser.nim) return -1;
                if (b.nim === currentUser.nim) return 1;
                return 0;
            });

            // Render ke list
            this.view.renderResults(
                sortedResults,
                (nim) => this.handleEdit(nim),
                (nim) => this.handleDelete(nim),
                currentUser.nim
            );
        } catch (err) {
            console.error("Gagal merender:", err);
        }
    }

    async handleEdit(nim) {
        const results = await this.service.getResults();
        // Cari data dan index ASLI di database (sebelum disortir)
        const originalIndex = results.findIndex(v => v.nim === nim);
        const dataToEdit = results[originalIndex];
    
        if (dataToEdit) {
            // Kirim originalIndex ke view agar disimpan di input hidden
            this.view.fillFormForEdit(originalIndex, dataToEdit);
            this.view.toggleFormLock(false); 
            
            document.getElementById('btnSubmit').innerText = "Simpan Perubahan";
            document.getElementById('btnSubmit').className = "btn btn-primary w-100";
        }
    }

    async handleDelete(nim) {
        if (confirm("Hapus suara ini?")) {
            const results = await this.service.getResults();
            const originalIndex = results.findIndex(v => v.nim === nim);
            
            if (originalIndex !== -1) {
                await this.service.deleteVote(originalIndex);
                await this.renderResults();
            }
        }
    }

    async handleOpenProfil() {
        if (this.currentUser) {
            this.view.fillProfilModal(this.currentUser);
        }
    }

    async handleUpdateProfil() {
        const data = this.view.getProfilFormData();
        if (!data.passwordLama) {
            alert("Masukkan password lama Anda untuk menyimpan perubahan.");
            return;
        }

        const yakin = confirm("Apakah Anda yakin ingin mengubah data profil?");
        if (!yakin) return;

        try {
            const res = await fetch(`/api/accounts/${this.currentUser.nim}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (res.ok) {
                alert("Profil berhasil diperbarui!");
                this.currentUser = result.user;
                sessionStorage.setItem('userSession', JSON.stringify(this.currentUser));
                window.location.reload(); 
            } else {
                alert(result.msg);
            }
        } catch (error) {
            console.error(error);
            alert("Gagal memperbarui profil. Pastikan server berjalan.");
        }
    }
}