# 👁️ Echo of Thought

<p align="center">
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=24&color=00BFFF&center=true&vCenter=true&width=600&lines=Selamat+datang+di+Echo+of+Thought;Cerita+yang+beradaptasi+dengan+tatapan.;Bukan+apa+yang+Anda+klik.;Tetapi+ke+mana+Anda+melihat." alt="Animated Typing Header" />
  </a>
</p>

> **Peringatan:** Proyek ini membutuhkan akses ke **webcam** Anda untuk fungsionalitas penuh.

**Echo of Thought** adalah interactive visual novel berbasis eye-gaze tracking di mana cerita beradaptasi bukan dengan apa yang Anda klik, tetapi dengan ke mana Anda melihat.

Ini adalah submisi kami untuk Lomba Software Development **SEVENT 9.0** dengan tema "Game, Code, and Play: Sharpening Creativity and Skills" dan sub-tema "AI for New Opportunities".

---

### 💡 Konsep Inti: *Pilih dengan Tatapan*

Echo of Thought menantang interaksi web standar. Lupakan tombol. Lupakan kursor. Pemain membuat pilihan cerita hanya dengan menatap opsi yang diinginkan.

Aplikasi ini dirancang untuk menciptakan pengalaman storytelling yang unik dan imersif. Sistem eye-gaze tracking memungkinkan pemain untuk memilih dialog dan keputusan dalam cerita cyberpunk interaktif tanpa menyentuh keyboard atau mouse sama sekali.

---

### ✨ Fitur Utama

#### 1. Eye-Gaze Selection System

Interaksi 100% bebas-tangan menggunakan **WebGazer.js**. Pilihan dialog dipilih dengan menatap orb visual yang merepresentasikan setiap opsi. Sistem dwell-time (120 frame / ~2 detik) memastikan pemilihan yang disengaja dan akurat.

#### 2. Dynamic Story Engine
Cerita bercabang dengan 5 episode dan 4 ending berbeda berdasarkan pilihan pemain. Setiap keputusan memengaruhi relationship scores dengan karakter (Nara, Dimas, Salsa) dan Echo score yang menentukan akhir cerita.

#### 3. Telltale-Style Notifications
Notifikasi karakter muncul di pojok kanan atas layar, memberikan feedback instant tentang dampak pilihan pemain terhadap hubungan dengan karakter - mirip dengan game Telltale.

#### 4. Adaptive Layout System
Layout orb pilihan menyesuaikan secara dinamis:
- 2 pilihan: Kiri-Kanan
- 3 pilihan: 2 Atas, 1 Bawah
- 4 pilihan: Grid 2×2

#### 5. Reading Timer
Sistem reading state dengan timer 3 detik memastikan pemain punya waktu membaca narasi sebelum pilihan muncul, menciptakan pacing yang lebih nyaman.

#### 6. Pixel-Perfect Aesthetics
Font **Press Start 2P** dengan rendering pixel-perfect (noSmooth) menciptakan atmosfer cyberpunk retro-futuristic yang konsisten di seluruh UI.

---

### 💻 Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5 Canvas">
  <img src="https://img.shields.io/badge/AI_/_ML-WebGazer.js-orange?style=for-the-badge" alt="WebGazer.js">
  <img src="https://img.shields.io/badge/Graphics-P5.js-ED225D?style=for-the-badge" alt="P5.js">
</p>

-   **Eye-Gaze Tracking**: `WebGazer.js v2.0` - Real-time gaze prediction menggunakan machine learning di browser
-   **Graphics Engine**: `P5.js v1.9.0` - Canvas rendering dan visual effects
-   **Architecture**: Object-Oriented JavaScript (ES6+) dengan class-based design
-   **Story Engine**: Custom JSON-based story tree dengan state management
-   **Styling**: Press Start 2P font, vanilla CSS dengan cyberpunk aesthetic

---

### 🚀 Cara Menjalankan

#### Opsi 1: Akses Versi Live (Direkomendasikan)
Proyek ini telah di-deploy dan dapat diakses langsung melalui browser Anda:

➡️ **[https://ghazyurbayani.github.io/EchoOfThought/](https://ghazyurbayani.github.io/EchoOfThought/)** ⬅️

**Persyaratan:**
- Browser modern (Chrome/Edge/Firefox recommended)
- Webcam aktif
- Pencahayaan yang cukup terang

**Cara Bermain:**
1. Klik tombol **START GAME** di main menu
2. Izinkan akses webcam saat browser meminta
3. Ikuti proses kalibrasi dengan menatap 9 titik
4. Pilih dialog dengan menatap orb selama ~2 detik
5. Nikmati cerita yang dibentuk oleh pilihan tatapan Anda!

#### Opsi 2: Menjalankan Secara Lokal

**PENTING:** Proyek ini **harus** dijalankan melalui *local server*. Membuka file `index.html` secara langsung (via `file://`) tidak akan berfungsi karena browser membatasi akses webcam untuk alasan keamanan.

1.  **Clone Repositori:**
    ```bash
    git clone https://github.com/GhazyUrbayani/EchoOfThought.git
    cd EchoOfThought
    ```
2.  **Jalankan Server Lokal:**
    Cara termudah adalah menggunakan Python (jika sudah terinstal):
    ```bash
    # Untuk Python 3.x
    python -m http.server 8000
    ```
    *(Atau gunakan ekstensi "Live Server" di VS Code)*
    
3.  **Buka Browser:**
    Navigasi ke `http://localhost:8000` dan **izinkan akses webcam** saat diminta.
