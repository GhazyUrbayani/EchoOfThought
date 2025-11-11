# 👁️ Echo of Thought

<p align="center">
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=24&color=00BFFF&center=true&vCenter=true&width=600&lines=Selamat+datang+di+Echo+of+Thought;Cerita+yang+beradaptasi+dengan+tatapan+Anda.;Bukan+apa+yang+Anda+klik.;Tetapi+ke+mana+Anda+melihat." alt="Animated Typing Header" />
  </a>
</p>

> **Peringatan:** Proyek ini membutuhkan akses ke **webcam** Anda untuk fungsionalitas penuh.

**Echo of Thought** adalah eksperimen naratif web yang imersif di mana cerita beradaptasi bukan dengan apa yang Anda klik, tetapi dengan ke mana Anda melihat.

Ini adalah submisi kami untuk Lomba Software Development **SEVENT 9.0** dengan tema "Game, Code, and Play: Sharpening Creativity and Skills" dan sub-tema "AI for New Opportunities".

---

### 💡 Konsep Inti: *Empathy Engine*

Echo of Thought menantang interaksi web standar. Lupakan tombol. Lupakan kursor. Pemain memengaruhi cerita hanya dengan tatapan mata mereka.

Ini bukan game; ini adalah **empathy engine**.

Aplikasi ini dirancang untuk menciptakan koneksi yang lebih dalam antara pemain dan narasi. Kami mengeksplorasi bagaimana perhatian (*attention*) yang tidak disadari—tatapan singkat, fiksasi emosional—dapat secara langsung membentuk dan mengubah realitas digital di depan Anda.

---

### ✨ Fitur Inovatif (The 'Wow Factor')

#### 1. Interaksi Berbasis Tatapan (Gaze-Based Interaction)
Interaksi 100% bebas-tangan. Pilihan dialog dipilih hanya dengan menatap pusaran visual. Objek di dunia game "merasa" dilihat dan akan bereaksi dengan animasi halus saat mata Anda tertuju padanya.

<p align="center">
  <img src="https://placehold.co/600x300/2d2d2d/ffffff?text=Demo+Gaze+Interaction+(Ganti+dengan+GIF)" alt="Demo Interaksi Tatapan">
</p>

#### 2. Deteksi Emosi AI (AI for New Opportunities)
Ini adalah inti dari solusi kami untuk sub-tema "AI for New Opportunities". Kami tidak hanya melacak *ke mana* pemain melihat. Kami menggunakan **WebGazer.js** untuk mendeteksi *micro-fixation* (tatapan intens singkat) pada wajah karakter atau objek. Fiksasi ini kami tafsirkan sebagai ketertarikan emosional, yang berfungsi sebagai pemicu untuk membuka alur cerita tersembunyi.

<p align="center">
  <img src="https://placehold.co/600x300/2d2d2d/ffffff?text=Demo+Deteksi+Fiksasi+AI+(Ganti+dengan+GIF)" alt="Demo Deteksi AI">
</p>

#### 3. Visual Generatif (Generative Visuals)
Tidak ada UI statis. Latar belakang dan elemen cerita adalah seni generatif yang di-render secara *real-time* menggunakan **P5.js**. Visual ini berubah dan beradaptasi berdasarkan *mood* adegan dan input tatapan pemain, menciptakan pengalaman yang unik setiap saat.

---

### 💻 Tech Stack (Strategi Inti)

Kami sengaja memilih *stack* yang ringan, tanpa *framework*, untuk mendapatkan performa mentah dan kontrol penuh atas *render loop* dan *gaze tracking*.

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5 Canvas">
  <img src="https://img.shields.io/badge/AI_/_ML-WebGazer.js-orange?style=for-the-badge" alt="WebGazer.js">
  <img src="https://img.shields.io/badge/Generative_Art-P5.js-ED225D?style=for-the-badge" alt="P5.js">
</p>

-   **AI / Machine Learning**: `WebGazer.js` (Untuk *real-time gaze tracking* & deteksi fiksasi langsung di browser).
-   **Visuals & Interaction**: `P5.js` (Untuk *generative art* dan *interactive canvas*).
-   **Core**: Vanilla `JavaScript (ES6+)` & `HTML5 Canvas`.

---

### 🚀 Cara Menjalankan

#### Opsi 1: Akses Versi Live (Direkomendasikan)
Proyek ini telah di-deploy dan dapat diakses langsung melalui browser Anda:

➡️ **[MASUKKAN_LINK_DEPLOY_ANDA_DI_SINI]** ⬅️

*(Contoh: `https://username.github.io/EchoOfThought/`)*

#### Opsi 2: Menjalankan Secara Lokal
Jika Anda ingin menjalankan proyek ini di komputer Anda:

**PENTING:** Proyek ini **harus** dijalankan melalui *local server*. Membuka file `index.html` secara langsung (via `file://`) tidak akan berfungsi karena browser membatasi akses webcam untuk alasan keamanan.

1.  **Clone Repositori:**
    ```bash
    git clone [https://github.com/](https://github.com/)[USERNAME]/EchoOfThought.git
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
