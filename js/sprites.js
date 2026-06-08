// Animon Resonance - Sprite Engine
// Uses string matrices to generate pixel art procedurally to avoid external assets.
// Colors are mapped to characters.

const Palette = {
    ' ': 'transparent', // transparent
    '0': '#000000', // Black
    '1': '#FFFFFF', // White
    '2': '#4CAF50', // Grass Green
    '3': '#388E3C', // Dark Grass
    '4': '#1B5E20', // Very Dark Grass
    '5': '#8BC34A', // Light Grass
    '6': '#795548', // Brown
    '7': '#5D4037', // Dark Brown
    '8': '#3E2723', // Very Dark Brown
    '9': '#2196F3', // Water Blue
    'A': '#1976D2', // Dark Water
    'B': '#BCAAA4', // Path/Floor light
    'C': '#8D6E63', // Path shadow
    'D': '#F44336', // Red
    'E': '#B71C1C', // Dark Red
    'F': '#FFEB3B', // Yellow
    'G': '#FFE0BD', // Skin tone
    'H': '#607D8B', // Gray Wall
    'I': '#455A64', // Dark Gray Wall
    'J': '#FF9800', // Orange
    'K': '#E65100', // Dark Orange
    'L': '#9C27B0'  // Purple
};

// 16x16 matrices
const TileData = {
    // Basic Grass
    grass: [
        "5555555555555555",
        "5555555555555555",
        "5555555555555555",
        "5525555555555555",
        "5525555552255555",
        "5555555555555555",
        "5555555555555555",
        "5555555555555555",
        "5555555555555555",
        "5555555555552555",
        "5555225555552555",
        "5555555555555555",
        "5555555555555555",
        "5555555555555555",
        "5555555555555555",
        "5555555555555555"
    ],
    tallGrass: [
        "2222222222222222",
        "2323232232232322",
        "3232323323323232",
        "2222222222222222",
        "2323223232232232",
        "3232332323323323",
        "2222222222222222",
        "2322323223232232",
        "3233232332323323",
        "2222222222222222",
        "2232322323223232",
        "3323233232332323",
        "2222222222222222",
        "2323223232232232",
        "3232332323323323",
        "2222222222222222"
    ],
    tree: [
        "   4444444444   ",
        " 44333333333344 ",
        " 43332222223334 ",
        "4332222222222334",
        "4332222222222334",
        "4332222222222334",
        "4333222222223334",
        " 43333333333334 ",
        " 44333333333344 ",
        "   4444444444   ",
        "      7777      ",
        "      8668      ",
        "      8668      ",
        "      8668      ",
        "      7777      ",
        "     333333     "
    ],
    water: [
        "999A999A999A999A",
        "9999999999999999",
        "9A999A999A999A99",
        "9999999999999999",
        "999A999A999A999A",
        "9999999999999999",
        "9A999A999A999A99",
        "9999999999999999",
        "999A999A999A999A",
        "9999999999999999",
        "9A999A999A999A99",
        "9999999999999999",
        "999A999A999A999A",
        "9999999999999999",
        "9A999A999A999A99",
        "9999999999999999"
    ],
    path: [
        "BBBBBBBBBBBBBBBB",
        "BBBBBBBBBBBBBBBB",
        "BBBBBCBBBBBBBBBB",
        "BBBBBBBBBBBCBBBB",
        "BBBBBBBBBBBBBBBB",
        "BBCBBBBBBBBBBBBB",
        "BBBBBBBBBBBBBBBB",
        "BBBBBBBCBBBBBBBB",
        "BBBBBBBBBBBBBBBB",
        "BBBCBBBBBBBBBBBB",
        "BBBBBBBBBBBBBBBB",
        "BBBBBBBBBBCBBBBB",
        "BBBBBBBBBBBBBBBB",
        "BBBBBCBBBBBBBBBB",
        "BBBBBBBBBBBBBBBB",
        "BBBBBBBBBBBBBBBB"
    ],
    floor: [
        "6C6C6C6C6C6C6C6C",
        "C6C6C6C6C6C6C6C6",
        "6C6C6C6C6C6C6C6C",
        "C6C6C6C6C6C6C6C6",
        "6C6C6C6C6C6C6C6C",
        "C6C6C6C6C6C6C6C6",
        "6C6C6C6C6C6C6C6C",
        "C6C6C6C6C6C6C6C6",
        "6C6C6C6C6C6C6C6C",
        "C6C6C6C6C6C6C6C6",
        "6C6C6C6C6C6C6C6C",
        "C6C6C6C6C6C6C6C6",
        "6C6C6C6C6C6C6C6C",
        "C6C6C6C6C6C6C6C6",
        "6C6C6C6C6C6C6C6C",
        "C6C6C6C6C6C6C6C6"
    ],
    wall: [
        "IIIIIIIIIIIIIIII",
        "IHHHHHHHHHHHHHHI",
        "IHHHHHHHHHHHHHHI",
        "IHHHHHHHHHHHHHHI",
        "IHHHHHHHHHHHHHHI",
        "IHHHHHHHHHHHHHHI",
        "IHHHHHHHHHHHHHHI",
        "IIIIIIIIIIIIIIII",
        "IHHHHHHHHHHHHHHI",
        "IHHHHHHHHHHHHHHI",
        "IHHHHHHHHHHHHHHI",
        "IHHHHHHHHHHHHHHI",
        "IHHHHHHHHHHHHHHI",
        "IHHHHHHHHHHHHHHI",
        "IIIIIIIIIIIIIIII",
        "IIIIIIIIIIIIIIII"
    ],
    door: [
        "8888888888888888",
        "8777777777777778",
        "8777777777777778",
        "8777777777777778",
        "8777777777777778",
        "8777777777777778",
        "8777777777707778",
        "8777777777707778",
        "8777777777777778",
        "8777777777777778",
        "8777777777777778",
        "8777777777777778",
        "8777777777777778",
        "8777777777777778",
        "8777777777777778",
        "8888888888888888"
    ],
    table: [
        "6666666666666666",
        "6BBBBBBBBBBBBBB6",
        "6BBBBBBBBBBBBBB6",
        "6BBBBBBBBBBBBBB6",
        "6BBBBBBBBBBBBBB6",
        "6666666666666666",
        " 88          88 ",
        " 88          88 ",
        " 88          88 ",
        " 88          88 ",
        " 88          88 ",
        " 88          88 ",
        " 88          88 ",
        "                ",
        "                ",
        "                "
    ],
    bed: [
        "DDDDDDDDDDDDDDDD",
        "DDDDDDDDDDDDDDDD",
        "D11111111111111D",
        "D11111111111111D",
        "D11111111111111D",
        "DDDDDDDDDDDDDDDD",
        "DDDDDDDDDDDDDDDD",
        "DDDDDDDDDDDDDDDD",
        "DDDDDDDDDDDDDDDD",
        "DDDDDDDDDDDDDDDD",
        "DDDDDDDDDDDDDDDD",
        "DDDDDDDDDDDDDDDD",
        "DDDDDDDDDDDDDDDD",
        "DDDDDDDDDDDDDDDD",
        "88            88",
        "88            88"
    ],
    healingMachine: [
        "IIIIIIIIIIIIIIII",
        "I11111111111111I",
        "I1D1D1D11111111I",
        "I1D1D1D11111111I",
        "I11111111111111I",
        "I1111D1111D1111I",
        "I111DDD11DDD111I",
        "I11DDDDD1DDDDD1I",
        "I111DDD11DDD111I",
        "I1111D1111D1111I",
        "I11111111111111I",
        "IIIIIIIIIIIIIIII",
        "HIIIIIIIIIIIIIIH",
        "HIIIIIIIIIIIIIIH",
        "HIIIIIIIIIIIIIIH",
        "HHHHHHHHHHHHHHHH"
    ],
    shopCounter: [
        "HHHHHHHHHHHHHHHH",
        "HIIIIIIIIIIIIIIH",
        "H11111111111111H",
        "H11111111111111H",
        "H11111111111111H",
        "H11111111111111H",
        "H11111111111111H",
        "H11111111111111H",
        "HIIIIIIIIIIIIIIH",
        "HHHHHHHHHHHHHHHH",
        "HHHHHHHHHHHHHHHH",
        "HHHHHHHHHHHHHHHH",
        "HHHHHHHHHHHHHHHH",
        "HHHHHHHHHHHHHHHH",
        "HHHHHHHHHHHHHHHH",
        "HHHHHHHHHHHHHHHH"
    ],
    houseRoof: [
        "EEEEEEEEEEEEEEEE",
        "EEEEEEEEEEEEEEEE",
        "EEEDDDDDDDDDDEEE",
        "EEDDDDDDDDDDDDEE",
        "EEDDDDDDDDDDDDEE",
        "EDDDDDDDDDDDDDDE",
        "EDDDDDDDDDDDDDDE",
        "DDDDDDDDDDDDDDDD",
        "DDDDDDDDDDDDDDDD",
        "DDDDDDDDDDDDDDDD",
        "DDDDDDDDDDDDDDDD",
        "DDDDDDDDDDDDDDDD",
        "DDDDDDDDDDDDDDDD",
        "DDDDDDDDDDDDDDDD",
        "DDDDDDDDDDDDDDDD",
        "DDDDDDDDDDDDDDDD"
    ],
    houseWall: [
        "1111111111111111",
        "1111111111111111",
        "1111111111111111",
        "1111199991111111",
        "1111199991111111",
        "1111199991111111",
        "1111111111111111",
        "1111111111111111",
        "1111111111111111",
        "1111111111111111",
        "1111111111111111",
        "1111111111111111",
        "1111111111111111",
        "1111111111111111",
        "1111111111111111",
        "1111111111111111"
    ],
    ledge: [
        "5555555555555555",
        "5555555555555555",
        "5555555555555555",
        "5555555555555555",
        "5555555555555555",
        "5555555555555555",
        "5555555555555555",
        "5555555555555555",
        "3333333333333333",
        "2222222222222222",
        "4444444444444444",
        "4444444444444444",
        "4444444444444444",
        "5555555555555555",
        "5555555555555555",
        "5555555555555555"
    ]
};

// Character base sprites (16x16)
const CharSprites = {
    player: [
        "    00000000    ",
        "   0D00D00D00   ",
        "   0DDD0DDD00   ",
        "   0DDDDDD000   ",
        "   0G00G00G00   ",
        "   0GG0GG0G00   ",
        "   00G00G0G00   ",
        "    00000000    ",
        "    09999990    ",
        "   0090000900   ",
        "   0G999999G0   ",
        "   0000990000   ",
        "     090090     ",
        "     090090     ",
        "    01100110    ",
        "    00000000    "
    ],
    prof: [
        "    00000000    ",
        "   0C00C00C00   ",
        "   0CCC0CCC00   ",
        "   0CCCCCC000   ",
        "   0G00G00G00   ",
        "   0GG0GG0G00   ",
        "   00G00G0G00   ",
        "    00000000    ",
        "    01111110    ",
        "   0010000100   ",
        "   0G111111G0   ",
        "   0000110000   ",
        "     060060     ",
        "     060060     ",
        "    08800880    ",
        "    00000000    "
    ],
    rival: [
        "    00000000    ",
        "   0J00J00J00   ",
        "   0JJJ0JJJ00   ",
        "   0JJJJJJ000   ",
        "   0G00G00G00   ",
        "   0GG0GG0G00   ",
        "   00G00G0G00   ",
        "    00000000    ",
        "    0L0L0L00    ",
        "   00L0000L00   ",
        "   0GLLLLLLG0   ",
        "   0000LL0000   ",
        "     0I00I0     ",
        "     0I00I0     ",
        "    01100110    ",
        "    00000000    "
    ],
    bugcatcher: [
        "    00000000    ",
        "   0555555500   ",
        "   0555555500   ",
        "   0555555500   ",
        "   0G00G00G00   ",
        "   0GG0GG0G00   ",
        "   00G00G0G00   ",
        "    00000000    ",
        "    02222220    ",
        "   0020000200   ",
        "   0G222222G0   ",
        "   0000220000   ",
        "     060060     ",
        "     060060     ",
        "    01100110    ",
        "    00000000    "
    ],
    leader: [
        "    00000000    ",
        "   0444444400   ",
        "   0444444400   ",
        "   0444444400   ",
        "   0G00G00G00   ",
        "   0GG0GG0G00   ",
        "   00G00G0G00   ",
        "    00000000    ",
        "    02222220    ",
        "   0020000200   ",
        "   0G222222G0   ",
        "   0000220000   ",
        "     020020     ",
        "     020020     ",
        "    03300330    ",
        "    00000000    "
    ]
};

const Sprites = {
    cache: {},
    ready: false,

    init() {
        // Pre-render tiles
        for (let key in TileData) {
            this.cache[key] = this.renderToCanvas(TileData[key], 16);
        }
        for (let key in CharSprites) {
            this.cache['char_' + key] = this.renderToCanvas(CharSprites[key], 16);
        }
        this.ready = true;
    },

    renderToCanvas(matrix, size) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let char = matrix[y][x];
                if (char !== ' ') {
                    ctx.fillStyle = Palette[char];
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        }
        return canvas;
    },

    drawTile(ctx, name, dx, dy, width, height) {
        if (!this.ready) this.init();
        if (this.cache[name]) {
            ctx.drawImage(this.cache[name], dx, dy, width, height);
        } else {
            ctx.fillStyle = '#FF00FF'; // Missing texture magenta
            ctx.fillRect(dx, dy, width, height);
        }
    },
    
    drawChar(ctx, name, dx, dy, width, height) {
        if (!this.ready) this.init();
        if (this.cache['char_' + name]) {
            ctx.drawImage(this.cache['char_' + name], dx, dy, width, height);
        } else {
            this.drawTile(ctx, 'grass', dx, dy, width, height); // fallback
        }
    }
};
