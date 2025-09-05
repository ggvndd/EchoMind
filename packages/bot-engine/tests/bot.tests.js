// packages/bot-engine/tests/bot.test.js

const { getBotResponse } = require('../lib/bot');
const fs = require('fs');
const path = require('path');

// Mock `fs` untuk pengujian unit yang terisolasi
jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    writeFileSync: jest.fn(),
    readFileSync: jest.fn(),
    existsSync: jest.fn()
}));

describe('Dynamic Bot Engine', () => {
    beforeEach(() => {
        // Reset mock data
        fs.writeFileSync.mockClear();
        fs.readFileSync.mockClear();
        fs.existsSync.mockClear();
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue('{}');
    });

    test('Should add a new schedule with !tambah command', () => {
        const response = getBotResponse('test-user', '!tambah basis_data kamis 11:00 Ruang_C1');
        expect(response).toBe('Jadwal basis_data berhasil ditambahkan!');
        expect(fs.writeFileSync).toHaveBeenCalled();
    });

    // ... (kasus uji lainnya)
});