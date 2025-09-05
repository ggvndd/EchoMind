# Chatbot Jadwal Kuliah (Modular)

Sebuah chatbot interaktif yang dirancang untuk membantu mahasiswa mengelola dan memeriksa jadwal perkuliahan mereka langsung dari Discord. Chatbot ini dibangun dengan arsitektur modular yang memisahkan logika inti (engine) dari integrasi platform (Discord), menjadikannya mudah untuk dikelola, diuji, dan diperluas.

## Fitur Utama

* **Manajemen Jadwal Dinamis**: Tambah jadwal baru secara langsung melalui perintah di Discord (`!tambah`).
* **Penyimpanan Data Berkelanjutan**: Menggunakan file JSON sebagai database sederhana untuk menyimpan jadwal. Data tidak hilang saat bot di-restart.
* **Pemrosesan Bahasa Alami (NLP)**: Mampu memahami pertanyaan percakapan, termasuk fitur refleksi kata ganti (`saya` -> `Anda`), dan pertanyaan yang sadar konteks.
* **Arsitektur Modular**: Logika inti bot (`bot-engine`) terisolasi dari kode integrasi Discord, memungkinkan pengembangan dan pengujian yang lebih bersih.

---

## Setup dan Instalasi

### Prasyarat

Pastikan Anda sudah menginstal **Node.js** dan **npm** di sistem Anda.

### Langkah-langkah

1.  **clone Repositori**:
    ```bash
    git clone [https://github.com/your-username/chatbot-modular.git](https://github.com/your-username/chatbot-modular.git)
    cd chatbot-modular
    ```

2.  **Instal Dependencies**:
    * Instal dependensi untuk aplikasi Discord:
        ```bash
        cd apps/discord-bot
        npm install
        ```
    * Kembali ke direktori utama dan instal dependensi untuk bot engine:
        ```bash
        cd ../..
        cd packages/bot-engine
        npm install
        ```
    * Kembali ke direktori utama:
        ```bash
        cd ../..
        ```

3.  **Konfigurasi Kredensial**:
    * Buat file `.env` di direktori utama (`chatbot/`).
    * Salin isi dari `.env.example` ke file `.env` yang baru Anda buat.
    * Ganti `MASUKKAN_TOKEN_DISCORD_ANDA_DI_SINI` dengan token bot Discord Anda.

---

## Cara Menjalankan Bot

Untuk menjalankan bot dan menghubungkannya dengan Discord, eksekusi perintah berikut dari direktori utama proyek:

```bash
node apps/discord-bot/index.js
```

Kemudian, akses link ini untuk menambahkan bot anda ke server Discord yang anda inginkan
https://discord.com/oauth2/authorize?client_id=1413427196151988285&permissions=67584&integration_type=0&scope=bot

Lalu, gunakan !help untuk mengetahui command list yang ada.
