const TILE_SIZE = 32;

// Map Enums
const T = {
    GRASS: 0,
    TREE: 1,
    WATER: 2,
    PATH: 3,
    TALL_GRASS: 4,
    WALL: 5,
    FLOOR: 6,
    DOOR: 7
};

const Maps = {
    verdantVale: {
        width: 15, height: 10,
        data: [
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,0,0,0,1,6,6,6,1,0,0,4,4,4,1,
            1,0,0,0,1,6,6,6,1,0,4,4,4,4,1,
            1,0,3,3,3,3,7,3,3,3,3,3,4,4,1,
            1,0,3,0,0,0,3,0,0,0,0,3,0,0,1,
            1,0,3,0,1,1,3,1,1,0,0,3,0,0,1,
            1,0,3,3,3,3,3,3,3,3,3,3,0,0,1,
            1,2,2,2,2,2,3,2,2,2,2,2,2,2,1,
            1,2,2,2,2,2,3,2,2,2,2,2,2,2,1,
            1,1,1,1,1,1,3,1,1,1,1,1,1,1,1
        ],
        encounters: [1, 10, 12, 13], // Leaflora, Rubblemouse, Galebird, Sparkbug
        npcs: [
            { x: 3, y: 2, name: 'Prof. Hawthorne', text: 'Olá! Bem-vindo a Aethelgard. Pegue um Animon!', trigger: 'starter_event' },
            { x: 8, y: 6, name: 'Kaelen', text: 'Eu serei o melhor mestre Animon!', trigger: 'rival_battle' }
        ],
        connections: {
            south: 'resonanceForest'
        }
    },
    resonanceForest: {
        width: 15, height: 10,
        data: [
            1,1,1,1,1,1,3,1,1,1,1,1,1,1,1,
            1,4,4,4,4,1,3,1,4,4,4,4,4,4,1,
            1,4,1,1,4,1,3,1,4,1,1,1,1,4,1,
            1,4,1,1,4,3,3,3,4,1,1,1,1,4,1,
            1,4,4,4,4,3,1,3,4,4,4,4,4,4,1,
            1,1,1,1,1,3,1,3,1,1,1,1,1,1,1,
            1,4,4,4,3,3,1,3,3,3,4,4,4,4,1,
            1,4,1,1,3,1,1,1,1,3,1,1,1,4,1,
            1,4,4,4,3,3,3,3,3,3,4,4,4,4,1,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
        ],
        encounters: [1, 4, 7, 10], 
        npcs: [
            { x: 7, y: 4, name: 'Flora', text: 'A natureza é forte. Mostre-me sua ressonância!', trigger: 'boss_battle_flora' }
        ],
        connections: {
            north: 'verdantVale'
        }
    }
};

const World = {
    currentMap: null,
    
    loadMap(mapId) {
        this.currentMap = Maps[mapId];
        Player.mapId = mapId;
    },

    getTile(x, y) {
        if (x < 0 || x >= this.currentMap.width || y < 0 || y >= this.currentMap.height) {
            return T.WALL; // Out of bounds
        }
        return this.currentMap.data[y * this.currentMap.width + x];
    },

    isSolid(x, y) {
        const t = this.getTile(x, y);
        // Add NPC collision check
        if (this.currentMap.npcs) {
            for (let npc of this.currentMap.npcs) {
                if (npc.x === x && npc.y === y) return true;
            }
        }
        return [T.TREE, T.WATER, T.WALL, T.DOOR].includes(t);
    },

    getNPC(x, y) {
        if (!this.currentMap.npcs) return null;
        return this.currentMap.npcs.find(npc => npc.x === x && npc.y === y);
    },

    draw(ctx, cameraX, cameraY) {
        if (!this.currentMap) return;

        const startCol = Math.floor(cameraX / TILE_SIZE);
        const endCol = startCol + (ctx.canvas.width / TILE_SIZE) + 1;
        const startRow = Math.floor(cameraY / TILE_SIZE);
        const endRow = startRow + (ctx.canvas.height / TILE_SIZE) + 1;

        for (let y = startRow; y < endRow; y++) {
            for (let x = startCol; x < endCol; x++) {
                let tile = this.getTile(x, y);
                let px = x * TILE_SIZE - cameraX;
                let py = y * TILE_SIZE - cameraY;

                // Basic tile drawing
                switch(tile) {
                    case T.GRASS: ctx.fillStyle = '#8BC34A'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE); break;
                    case T.TREE: 
                        ctx.fillStyle = '#8BC34A'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                        ctx.fillStyle = '#2E7D32'; ctx.beginPath(); ctx.arc(px+16, py+16, 14, 0, Math.PI*2); ctx.fill();
                        break;
                    case T.WATER: ctx.fillStyle = '#2196F3'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE); break;
                    case T.PATH: ctx.fillStyle = '#D7CCC8'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE); break;
                    case T.TALL_GRASS: 
                        ctx.fillStyle = '#689F38'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                        // Details
                        ctx.fillStyle = '#33691E';
                        ctx.fillRect(px+4, py+4, 4, 8); ctx.fillRect(px+20, py+16, 4, 8);
                        break;
                    case T.WALL: ctx.fillStyle = '#607D8B'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE); break;
                    case T.FLOOR: ctx.fillStyle = '#BCAAA4'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE); break;
                    case T.DOOR: ctx.fillStyle = '#5D4037'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE); break;
                    default: ctx.fillStyle = '#000'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE); break;
                }
            }
        }

        // Draw NPCs
        if (this.currentMap.npcs) {
            this.currentMap.npcs.forEach(npc => {
                let px = npc.x * TILE_SIZE - cameraX;
                let py = npc.y * TILE_SIZE - cameraY;
                ctx.fillStyle = '#FF9800'; // NPC color
                ctx.fillRect(px + 4, py + 4, 24, 24);
                // Eyes
                ctx.fillStyle = '#000';
                ctx.fillRect(px + 8, py + 8, 4, 4);
                ctx.fillRect(px + 16, py + 8, 4, 4);
            });
        }
    },

    checkEncounter() {
        if (this.getTile(Player.x, Player.y) === T.TALL_GRASS) {
            if (Math.random() < 0.1) {
                return true;
            }
        }
        return false;
    },
    
    getRandomEncounter() {
        const pool = this.currentMap.encounters;
        const id = pool[Math.floor(Math.random() * pool.length)];
        const level = Math.floor(Math.random() * 5) + 2; // Lv 2-6 roughly
        return new AnimonInstance(id, level);
    }
};
