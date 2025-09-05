// packages/bot-engine/lib/bot.js - VERSI REVISI TERAKHIR

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../../data/schedule.json');
const userState = new Map();

function loadSchedule() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
        return {};
    } catch (error) {
        console.error('Gagal memuat jadwal:', error);
        return {};
    }
}

function saveSchedule(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Gagal menyimpan jadwal:', error);
    }
}

let SCHEDULE_DATA = loadSchedule();

function getBotResponse(userId, message) {
    const currentState = userState.get(userId) || {};
    const lowerMessage = message.toLowerCase();

    // 1. Prioritas: Periksa perintah (commands)
    if (lowerMessage.startsWith('!')) {
        return handleCommand(lowerMessage.substring(1));
    }

    // 2. Prioritas kedua: Aturan spesifik (pertanyaan jadwal)
    // Regex lebih fleksibel untuk mencocokkan berbagai variasi
    const fullScheduleMatch = lowerMessage.match(/(jadwal|kelas|kuliah) (saya|aku)? (mata kuliah)?\s*([\w\s]+)\??/i);
    if (fullScheduleMatch) {
        const course = fullScheduleMatch[4].trim().replace(/_/g, ' '); // Mengubah underscore menjadi spasi
        const schedule = SCHEDULE_DATA[course.replace(/\s/g, '_')]; // Mencocokkan dengan nama file
        if (schedule) {
            const response = `Ya, Anda ada kelas ${course} pada hari ${schedule.day}, jam ${schedule.time} di ${schedule.location}.`;
            userState.set(userId, { lastCourse: course.replace(/\s/g, '_') });
            return response;
        } else {
            userState.set(userId, {});
            return `Maaf, saya tidak menemukan jadwal untuk mata kuliah "${course}".`;
        }
    }
    
    // 3. Prioritas ketiga: Aturan kontekstual (pertanyaan lanjutan)
    if (currentState.lastCourse) {
        const lastCourse = currentState.lastCourse;
        const schedule = SCHEDULE_DATA[lastCourse];
        if (schedule) {
            if (lowerMessage.match(/^(jam berapa|pukul berapa)\??/i)) {
                return `Kelas ${lastCourse.replace(/_/g, ' ')} adalah pada jam ${schedule.time}.`;
            }
            if (lowerMessage.match(/^(hari apa)\??/i)) {
                return `Kelas ${lastCourse.replace(/_/g, ' ')} diadakan pada hari ${schedule.day}.`;
            }
            if (lowerMessage.match(/^(dimana|di mana)\??/i)) {
                return `Kelas ${lastCourse.replace(/_/g, ' ')} berada di ${schedule.location}.`;
            }
            if (lowerMessage.match(/^(terima kasih|makasih)\??/i)) {
                userState.set(userId, {});
                return "Sama-sama! Ada lagi yang bisa saya bantu?";
            }
        }
    }

    // 4. Prioritas keempat: Aturan umum
    // Regex sapaan diperbaiki untuk mengizinkan tanda baca
    if (lowerMessage.match(/^(halo|hai|p|assalamualaikum)[\s\W]*$/i)) {
        return "Halo! 👋 Ada yang bisa saya bantu terkait jadwal kuliah?";
    }
    
    // Regex untuk pertanyaan identitas
    if (lowerMessage.match(/^(siapa namamu|siapa kamu)\??/i)) {
        return "Saya adalah Chatbot Jadwal Kuliah.";
    }

    // 5. Prioritas terakhir: Aturan default (catch-all)
    userState.set(userId, {});
    return "Maaf, saya tidak mengerti. Coba gunakan perintah `!help` untuk bantuan.";
}

function handleCommand(command) {
    const args = command.split(' ');
    const commandName = args.shift().toLowerCase();

    // ... (Logika command tetap sama seperti sebelumnya)
    switch (commandName) {
        case 'tambah':
            if (args.length < 4) {
                return "Format salah. Gunakan `!tambah [mata kuliah] [hari] [jam] [lokasi]`";
            }
            const course = args[0].toLowerCase();
            const day = args[1];
            const time = args[2];
            const location = args.slice(3).join(' ');

            SCHEDULE_DATA[course] = { day, time, location };
            saveSchedule(SCHEDULE_DATA);
            return `Jadwal ${course} berhasil ditambahkan!`;
        
        case 'jadwal':
            if (Object.keys(SCHEDULE_DATA).length === 0) {
                return "Belum ada jadwal yang tersimpan.";
            }
            let allSchedules = "Berikut daftar jadwal yang ada:\n";
            for (const key in SCHEDULE_DATA) {
                const schedule = SCHEDULE_DATA[key];
                allSchedules += `- **${key.replace(/_/g, ' ')}**: Hari ${schedule.day}, Jam ${schedule.time} di ${schedule.location}\n`;
            }
            return allSchedules;

        case 'help':
            return "Perintah yang tersedia:\n" +
                   "`!tambah [mata kuliah] [hari] [jam] [lokasi]` - Menambahkan jadwal baru.\n" +
                   "`!jadwal` - Menampilkan semua jadwal yang tersimpan.\n" +
                   "Anda juga bisa bertanya langsung, misal: `Apakah saya ada jadwal algoritma?`";

        default:
            return `Perintah \`${commandName}\` tidak dikenal. Gunakan \`!help\` untuk daftar perintah.`;
    }
}

SCHEDULE_DATA = loadSchedule();

module.exports = { getBotResponse };