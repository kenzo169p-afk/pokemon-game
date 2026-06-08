const GameState = {
    MENU: 0,
    MAP: 1,
    BATTLE: 2,
    DIALOG: 3,
    PAUSED: 4
};

const Game = {
    state: GameState.MENU,
    canvas: null,
    ctx: null,
    lastTime: 0,
    camera: { x: 0, y: 0 },
    keys: {},
    dialogQueue: [],
    
    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        window.addEventListener('keydown', e => {
            this.keys[e.key] = true;
            this.handleInput(e.key);
        });
        window.addEventListener('keyup', e => {
            this.keys[e.key] = false;
        });

        // Setup Start Menu
        document.getElementById('btn-start-game').addEventListener('click', () => {
            AudioManager.init();
            this.startGame();
        });

        // Initialize World
        World.loadMap('verdantVale');
        
        requestAnimationFrame(t => this.loop(t));
    },

    startGame() {
        Player.name = document.getElementById('char-name').value || 'Leo';
        Player.color = document.getElementById('char-color').value;
        document.getElementById('start-menu').classList.add('hidden');
        document.getElementById('character-creation').classList.add('hidden');
        
        // Check load game
        if (Player.load()) {
            World.loadMap(Player.mapId);
        }
        
        this.state = GameState.MAP;
    },

    handleInput(key) {
        if (this.state === GameState.MENU) {
            if (key === 'Enter') {
                document.getElementById('character-creation').classList.remove('hidden');
            }
        } 
        else if (this.state === GameState.MAP) {
            if (key === 'Escape') {
                this.state = GameState.PAUSED;
                document.getElementById('pause-menu').classList.remove('hidden');
            } else if (key === 'z' || key === 'Enter') {
                this.interact();
            } else {
                this.movePlayer(key);
            }
        }
        else if (this.state === GameState.DIALOG) {
            if (key === 'z' || key === 'Enter') {
                this.advanceDialog();
            }
        }
        else if (this.state === GameState.PAUSED) {
            if (key === 'Escape') {
                GameUI.closePauseMenu();
            }
        }
    },

    movePlayer(key) {
        let dx = 0, dy = 0;
        if (key === 'ArrowUp' || key === 'w') dy = -1;
        else if (key === 'ArrowDown' || key === 's') dy = 1;
        else if (key === 'ArrowLeft' || key === 'a') dx = -1;
        else if (key === 'ArrowRight' || key === 'd') dx = 1;

        if (dx !== 0 || dy !== 0) {
            let newX = Player.x + dx;
            let newY = Player.y + dy;

            // Map transitions
            if (newY < 0 && World.currentMap.connections.north) {
                World.loadMap(World.currentMap.connections.north);
                Player.y = World.currentMap.height - 1;
                return;
            } else if (newY >= World.currentMap.height && World.currentMap.connections.south) {
                World.loadMap(World.currentMap.connections.south);
                Player.y = 0;
                return;
            }

            if (!World.isSolid(newX, newY)) {
                Player.x = newX;
                Player.y = newY;
                
                if (World.checkEncounter()) {
                    this.state = GameState.BATTLE;
                    Battle.start(World.getRandomEncounter());
                }
            }
        }
    },

    interact() {
        // Check adjacent tiles for NPCs
        const directions = [[0,-1], [0,1], [-1,0], [1,0]];
        for (let dir of directions) {
            let npc = World.getNPC(Player.x + dir[0], Player.y + dir[1]);
            if (npc) {
                this.triggerEvent(npc);
                return;
            }
        }
    },

    triggerEvent(npc) {
        if (npc.trigger === 'starter_event') {
            if (!Player.flags.hasStarter) {
                this.showDialog(npc.name, "Olá! Pegue este Leaflora para começar sua jornada!");
                Player.addAnimon(new AnimonInstance(1, 5));
                Player.flags.hasStarter = true;
            } else {
                this.showDialog(npc.name, "Cuide bem do seu Animon!");
                Player.healParty();
                this.showDialog(npc.name, "Seus Animons foram curados!");
            }
        } else if (npc.trigger === 'rival_battle') {
            if (!Player.flags.defeatedRival) {
                this.showDialog(npc.name, "Prepare-se para perder!");
                this.dialogQueue.push({ type: 'battle', enemy: new AnimonInstance(4, 5), isTrainer: true, onWin: () => {
                    Player.flags.defeatedRival = true;
                    this.showDialog(npc.name, "O quê?! Como eu perdi?");
                }});
            } else {
                this.showDialog(npc.name, "Eu vou ficar mais forte, você vai ver!");
            }
        } else if (npc.trigger === 'boss_battle_flora') {
            if (!Player.flags.defeatedFlora) {
                this.showDialog(npc.name, "Você acha que sua ressonância é forte?");
                this.dialogQueue.push({ type: 'battle', enemy: new AnimonInstance(2, 12), isTrainer: true, onWin: () => {
                    Player.flags.defeatedFlora = true;
                    this.showDialog(npc.name, "Você provou seu valor. Pegue a Insígnia da Folha!");
                }});
            } else {
                this.showDialog(npc.name, "A natureza está com você.");
            }
        } else {
            this.showDialog(npc.name, npc.text);
        }
    },

    showDialog(name, text) {
        this.dialogQueue.push({ type: 'text', name, text });
        if (this.state !== GameState.DIALOG) {
            this.state = GameState.DIALOG;
            this.advanceDialog();
        }
    },

    advanceDialog() {
        if (this.dialogQueue.length > 0) {
            const next = this.dialogQueue.shift();
            if (next.type === 'text') {
                document.getElementById('dialog-box').classList.remove('hidden');
                document.getElementById('dialog-name').innerText = next.name;
                document.getElementById('dialog-text').innerText = next.text;
                AudioManager.playSelect();
            } else if (next.type === 'battle') {
                document.getElementById('dialog-box').classList.add('hidden');
                this.state = GameState.BATTLE;
                Battle.start(next.enemy, next.isTrainer, next.onWin);
            }
        } else {
            document.getElementById('dialog-box').classList.add('hidden');
            this.state = GameState.MAP;
        }
    },

    saveGame() {
        Player.save();
        alert('Jogo Salvo!');
        GameUI.closePauseMenu();
    },

    updateCamera() {
        // Center camera on player
        this.camera.x = Player.x * TILE_SIZE - this.canvas.width / 2 + TILE_SIZE / 2;
        this.camera.y = Player.y * TILE_SIZE - this.canvas.height / 2 + TILE_SIZE / 2;
    },

    drawPlayer() {
        let px = Player.x * TILE_SIZE - this.camera.x;
        let py = Player.y * TILE_SIZE - this.camera.y;
        
        const colors = { red: '#E53935', blue: '#1E88E5', green: '#43A047' };
        ctx.fillStyle = colors[Player.color] || '#E53935';
        
        // Simple sprite
        ctx.fillRect(px + 4, py + 4, 24, 24); // Body
        ctx.fillStyle = '#FFE0BD'; // Skin
        ctx.fillRect(px + 8, py, 16, 16); // Head
        ctx.fillStyle = '#000';
        ctx.fillRect(px + 10, py + 4, 4, 4); // Eyes
        ctx.fillRect(px + 18, py + 4, 4, 4);
    },

    loop(timestamp) {
        const dt = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.state === GameState.MAP || this.state === GameState.DIALOG || this.state === GameState.PAUSED) {
            this.updateCamera();
            World.draw(this.ctx, this.camera.x, this.camera.y);
            this.drawPlayer();
        } else if (this.state === GameState.BATTLE) {
            Battle.draw(this.ctx);
        }

        requestAnimationFrame(t => this.loop(t));
    }
};

const GameUI = {
    openParty() {
        const list = document.getElementById('party-list');
        list.innerHTML = '';
        Player.party.forEach((a, i) => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `<span>${a.species.name} (Lv ${a.level})</span> <span>HP: ${a.hp}/${a.maxHp}</span>`;
            list.appendChild(div);
        });
        document.getElementById('pause-menu').classList.add('hidden');
        document.getElementById('party-screen').classList.remove('hidden');
    },
    
    openBag() {
        const list = document.getElementById('bag-list');
        list.innerHTML = '';
        Object.keys(Player.bag).forEach(k => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `<span>${ItemsDB[k].name}</span> <span>x${Player.bag[k]}</span>`;
            list.appendChild(div);
        });
        document.getElementById('pause-menu').classList.add('hidden');
        document.getElementById('bag-screen').classList.remove('hidden');
    },

    openMap() {
        alert(`Você está em: ${World.currentMap === Maps.verdantVale ? 'Verdant Vale' : 'Resonance Forest'}`);
    },

    closeSubMenu() {
        document.getElementById('party-screen').classList.add('hidden');
        document.getElementById('bag-screen').classList.add('hidden');
        document.getElementById('pause-menu').classList.remove('hidden');
    },

    closePauseMenu() {
        document.getElementById('pause-menu').classList.add('hidden');
        Game.state = GameState.MAP;
    }
};

window.onload = () => {
    window.ctx = document.getElementById('game-canvas').getContext('2d');
    Game.init();
};
