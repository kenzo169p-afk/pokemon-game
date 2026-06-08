const ItemsDB = {
    potion: { id: 'potion', name: 'Poção de Ressonância', type: 'heal', value: 20, desc: 'Cura 20 HP.' },
    capsule: { id: 'capsule', name: 'Cápsula Animon', type: 'capture', rate: 1.5, desc: 'Captura um Animon selvagem.' }
};

class PlayerData {
    constructor() {
        this.name = 'Leo';
        this.color = 'red';
        this.x = 5;
        this.y = 5;
        this.mapId = 'verdantVale';
        this.party = []; // Array of AnimonInstance
        this.bag = {
            potion: 5,
            capsule: 5
        };
        this.flags = {}; // For story progression
    }

    addAnimon(animonInstance) {
        if (this.party.length < 6) {
            this.party.push(animonInstance);
            return true;
        }
        return false; // PC box not implemented in MVP
    }

    healParty() {
        this.party.forEach(a => a.hp = a.maxHp);
    }

    save() {
        const data = {
            name: this.name,
            color: this.color,
            x: this.x,
            y: this.y,
            mapId: this.mapId,
            bag: this.bag,
            flags: this.flags,
            party: this.party.map(a => ({
                speciesId: a.species.id,
                level: a.level,
                xp: a.xp,
                hp: a.hp,
                moves: a.moves
            }))
        };
        localStorage.setItem('animon_save', JSON.stringify(data));
    }

    load() {
        const saved = localStorage.getItem('animon_save');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.name = data.name;
                this.color = data.color;
                this.x = data.x;
                this.y = data.y;
                this.mapId = data.mapId;
                this.bag = data.bag || { potion: 5, capsule: 5 };
                this.flags = data.flags || {};
                
                this.party = data.party.map(pData => {
                    let a = new AnimonInstance(pData.speciesId, pData.level);
                    a.xp = pData.xp;
                    a.hp = pData.hp;
                    a.moves = pData.moves;
                    return a;
                });
                return true;
            } catch (e) {
                console.error("Save load error", e);
                return false;
            }
        }
        return false;
    }
}

const Player = new PlayerData();
