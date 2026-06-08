const Types = {
    GRASS: 'Grama',
    FIRE: 'Fogo',
    WATER: 'Água',
    EARTH: 'Terra',
    WIND: 'Vento',
    ELEC: 'Elétrico',
    GHOST: 'Fantasma',
    ASTRAL: 'Astral',
    NORMAL: 'Normal'
};

const TypeEffectiveness = {
    [Types.FIRE]: { strong: [Types.GRASS], weak: [Types.WATER, Types.EARTH] },
    [Types.WATER]: { strong: [Types.FIRE, Types.EARTH], weak: [Types.GRASS, Types.ELEC] },
    [Types.GRASS]: { strong: [Types.WATER, Types.EARTH], weak: [Types.FIRE, Types.WIND] },
    [Types.EARTH]: { strong: [Types.ELEC, Types.FIRE], weak: [Types.WATER, Types.GRASS] },
    [Types.ELEC]: { strong: [Types.WATER, Types.WIND], weak: [Types.EARTH] },
    [Types.WIND]: { strong: [Types.GRASS], weak: [Types.ELEC] },
    [Types.GHOST]: { strong: [Types.ASTRAL], weak: [Types.ASTRAL] },
    [Types.ASTRAL]: { strong: [Types.GHOST], weak: [Types.GHOST] },
    [Types.NORMAL]: { strong: [], weak: [] }
};

const MovesDB = {
    tackle: { name: 'Investida', type: Types.NORMAL, power: 40, accuracy: 100 },
    leafBlade: { name: 'Folha Navalha', type: Types.GRASS, power: 55, accuracy: 95 },
    ember: { name: 'Brasa', type: Types.FIRE, power: 40, accuracy: 100 },
    flamethrower: { name: 'Lança-Chamas', type: Types.FIRE, power: 90, accuracy: 100 },
    waterGun: { name: 'Jato d\'Água', type: Types.WATER, power: 40, accuracy: 100 },
    hydroPump: { name: 'Hidro Bomba', type: Types.WATER, power: 110, accuracy: 80 },
    gust: { name: 'Lufada', type: Types.WIND, power: 40, accuracy: 100 },
    mudSlap: { name: 'Tapa de Lama', type: Types.EARTH, power: 20, accuracy: 100 },
    spark: { name: 'Faísca', type: Types.ELEC, power: 40, accuracy: 100 },
    shadowBall: { name: 'Bola Sombria', type: Types.GHOST, power: 80, accuracy: 100 },
    astralBeam: { name: 'Raio Astral', type: Types.ASTRAL, power: 100, accuracy: 95 }
};

const AnimonDB = {
    1: {
        id: 1, name: 'Leaflora', type: Types.GRASS, 
        baseStats: { hp: 45, atk: 49, def: 49, spd: 45 },
        evolvesAt: 14, evolvesTo: 2,
        color: '#4CAF50',
        moves: [{level: 1, move: 'tackle'}, {level: 5, move: 'leafBlade'}]
    },
    2: {
        id: 2, name: 'Florisaur', type: Types.GRASS, 
        baseStats: { hp: 60, atk: 62, def: 63, spd: 60 },
        evolvesAt: 30, evolvesTo: 3,
        color: '#388E3C',
        moves: [{level: 1, move: 'tackle'}, {level: 1, move: 'leafBlade'}]
    },
    3: {
        id: 3, name: 'Sylvanor', type: Types.GRASS, 
        baseStats: { hp: 80, atk: 82, def: 83, spd: 80 },
        color: '#1B5E20',
        moves: [{level: 1, move: 'tackle'}, {level: 1, move: 'leafBlade'}]
    },
    4: {
        id: 4, name: 'Pyroduck', type: Types.FIRE, 
        baseStats: { hp: 39, atk: 52, def: 43, spd: 65 },
        evolvesAt: 14, evolvesTo: 5,
        color: '#FF5722',
        moves: [{level: 1, move: 'tackle'}, {level: 5, move: 'ember'}]
    },
    5: {
        id: 5, name: 'Ignisaur', type: Types.FIRE, 
        baseStats: { hp: 58, atk: 64, def: 58, spd: 80 },
        evolvesAt: 30, evolvesTo: 6,
        color: '#E64A19',
        moves: [{level: 1, move: 'tackle'}, {level: 1, move: 'ember'}]
    },
    6: {
        id: 6, name: 'Volcanwing', type: Types.FIRE, 
        baseStats: { hp: 78, atk: 84, def: 78, spd: 100 },
        color: '#BF360C',
        moves: [{level: 1, move: 'tackle'}, {level: 1, move: 'ember'}, {level: 30, move: 'flamethrower'}]
    },
    7: {
        id: 7, name: 'Aquapup', type: Types.WATER, 
        baseStats: { hp: 44, atk: 48, def: 65, spd: 43 },
        evolvesAt: 14, evolvesTo: 8,
        color: '#03A9F4',
        moves: [{level: 1, move: 'tackle'}, {level: 5, move: 'waterGun'}]
    },
    8: {
        id: 8, name: 'Hydrosaur', type: Types.WATER, 
        baseStats: { hp: 59, atk: 63, def: 80, spd: 58 },
        evolvesAt: 30, evolvesTo: 9,
        color: '#0288D1',
        moves: [{level: 1, move: 'tackle'}, {level: 1, move: 'waterGun'}]
    },
    9: {
        id: 9, name: 'Tidalwave', type: Types.WATER, 
        baseStats: { hp: 79, atk: 83, def: 100, spd: 78 },
        color: '#01579B',
        moves: [{level: 1, move: 'tackle'}, {level: 1, move: 'waterGun'}, {level: 35, move: 'hydroPump'}]
    },
    10: {
        id: 10, name: 'Rubblemouse', type: Types.EARTH, 
        baseStats: { hp: 40, atk: 50, def: 40, spd: 50 },
        evolvesAt: 20, evolvesTo: 11,
        color: '#795548',
        moves: [{level: 1, move: 'tackle'}, {level: 6, move: 'mudSlap'}]
    },
    11: {
        id: 11, name: 'Terramole', type: Types.EARTH, 
        baseStats: { hp: 70, atk: 80, def: 70, spd: 70 },
        color: '#4E342E',
        moves: [{level: 1, move: 'tackle'}, {level: 1, move: 'mudSlap'}]
    },
    12: {
        id: 12, name: 'Galebird', type: Types.WIND, 
        baseStats: { hp: 40, atk: 45, def: 40, spd: 65 },
        color: '#B3E5FC',
        moves: [{level: 1, move: 'tackle'}, {level: 4, move: 'gust'}]
    },
    13: {
        id: 13, name: 'Sparkbug', type: Types.ELEC, 
        baseStats: { hp: 35, atk: 40, def: 40, spd: 60 },
        color: '#FFEB3B',
        moves: [{level: 1, move: 'tackle'}, {level: 5, move: 'spark'}]
    },
    14: {
        id: 14, name: 'Aetherios', type: Types.ASTRAL, 
        baseStats: { hp: 100, atk: 100, def: 100, spd: 100 },
        color: '#9C27B0',
        moves: [{level: 1, move: 'tackle'}, {level: 50, move: 'astralBeam'}]
    }
};

class AnimonInstance {
    constructor(speciesId, level) {
        this.species = AnimonDB[speciesId];
        this.level = level;
        this.xp = Math.pow(level, 3);
        this.maxHp = Math.floor((this.species.baseStats.hp * 2 * level) / 100) + level + 10;
        this.hp = this.maxHp;
        this.atk = Math.floor((this.species.baseStats.atk * 2 * level) / 100) + 5;
        this.def = Math.floor((this.species.baseStats.def * 2 * level) / 100) + 5;
        this.spd = Math.floor((this.species.baseStats.spd * 2 * level) / 100) + 5;
        
        this.moves = [];
        this.species.moves.forEach(m => {
            if (this.level >= m.level) {
                if (this.moves.length < 4) this.moves.push(m.move);
                else this.moves[Math.floor(Math.random()*4)] = m.move; // Random overwrite for wild
            }
        });
        if (this.moves.length === 0) this.moves.push('tackle');
    }

    gainXp(amount) {
        this.xp += amount;
        let leveledUp = false;
        while (this.xp >= Math.pow(this.level + 1, 3)) {
            this.levelUp();
            leveledUp = true;
        }
        return leveledUp;
    }

    levelUp() {
        this.level++;
        const oldMax = this.maxHp;
        this.maxHp = Math.floor((this.species.baseStats.hp * 2 * this.level) / 100) + this.level + 10;
        this.hp += (this.maxHp - oldMax); // Heal amount gained
        this.atk = Math.floor((this.species.baseStats.atk * 2 * this.level) / 100) + 5;
        this.def = Math.floor((this.species.baseStats.def * 2 * this.level) / 100) + 5;
        this.spd = Math.floor((this.species.baseStats.spd * 2 * this.level) / 100) + 5;
        
        // Learn new moves
        this.species.moves.forEach(m => {
            if (m.level === this.level && !this.moves.includes(m.move)) {
                if (this.moves.length < 4) this.moves.push(m.move);
            }
        });
    }

    checkEvolution() {
        if (this.species.evolvesAt && this.level >= this.species.evolvesAt) {
            const nextSpecies = AnimonDB[this.species.evolvesTo];
            this.species = nextSpecies;
            // Recalculate stats immediately
            this.maxHp = Math.floor((this.species.baseStats.hp * 2 * this.level) / 100) + this.level + 10;
            this.atk = Math.floor((this.species.baseStats.atk * 2 * this.level) / 100) + 5;
            this.def = Math.floor((this.species.baseStats.def * 2 * this.level) / 100) + 5;
            this.spd = Math.floor((this.species.baseStats.spd * 2 * this.level) / 100) + 5;
            return true;
        }
        return false;
    }
}

// Procedural Sprite Renderer
const SpriteRenderer = {
    drawAnimon(ctx, animon, x, y, size, isBack = false) {
        ctx.fillStyle = animon.species.color;
        
        // Very basic procedural geometric sprites
        // Body
        ctx.fillRect(x - size/2, y - size/2, size, size);
        
        // Eyes
        ctx.fillStyle = '#FFFFFF';
        if (!isBack) {
            ctx.fillRect(x - size/4, y - size/4, size/4, size/4);
            ctx.fillRect(x + size/8, y - size/4, size/4, size/4);
            ctx.fillStyle = '#000000';
            ctx.fillRect(x - size/5, y - size/5, size/8, size/8);
            ctx.fillRect(x + size/5, y - size/5, size/8, size/8);
        }
        
        // Element indicator
        ctx.fillStyle = this.getElementColor(animon.species.type);
        ctx.fillRect(x - size/6, y + size/6, size/3, size/3);
    },

    getElementColor(type) {
        const colors = {
            [Types.GRASS]: '#4CAF50',
            [Types.FIRE]: '#FF5722',
            [Types.WATER]: '#2196F3',
            [Types.EARTH]: '#795548',
            [Types.WIND]: '#B3E5FC',
            [Types.ELEC]: '#FFEB3B',
            [Types.GHOST]: '#9E9E9E',
            [Types.ASTRAL]: '#9C27B0',
            [Types.NORMAL]: '#FFFFFF'
        };
        return colors[type] || '#FFF';
    }
};
