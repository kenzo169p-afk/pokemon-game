const Battle = {
    active: false,
    enemy: null,
    playerAnimon: null,
    turn: 'player', // 'player', 'enemy', 'end'
    isTrainer: false,
    onWin: null,

    start(enemyAnimon, isTrainer = false, onWin = null) {
        this.active = true;
        this.enemy = enemyAnimon;
        this.isTrainer = isTrainer;
        this.onWin = onWin;
        this.playerAnimon = Player.party[0]; // First conscious
        for (let i=0; i<Player.party.length; i++) {
            if (Player.party[i].hp > 0) {
                this.playerAnimon = Player.party[i];
                break;
            }
        }

        document.getElementById('battle-hud').classList.remove('hidden');
        this.updateHUD();
        this.showMessage(`Um selvagem ${this.enemy.species.name} apareceu!`);
        AudioManager.playEncounter();
        
        setTimeout(() => {
            this.showActions();
        }, 1500);
    },

    updateHUD() {
        document.getElementById('enemy-name').innerText = this.enemy.species.name;
        document.getElementById('enemy-level').innerText = `Lv ${this.enemy.level}`;
        const enemyHpPct = Math.max(0, (this.enemy.hp / this.enemy.maxHp) * 100);
        document.getElementById('enemy-hp-bar').style.width = `${enemyHpPct}%`;

        if (this.playerAnimon) {
            document.getElementById('player-animon-name').innerText = this.playerAnimon.species.name;
            document.getElementById('player-animon-level').innerText = `Lv ${this.playerAnimon.level}`;
            const playerHpPct = Math.max(0, (this.playerAnimon.hp / this.playerAnimon.maxHp) * 100);
            document.getElementById('player-hp-bar').style.width = `${playerHpPct}%`;
            document.getElementById('player-hp-text').innerText = `${this.playerAnimon.hp}/${this.playerAnimon.maxHp}`;
        }
    },

    showMessage(msg) {
        document.getElementById('battle-message').innerText = msg;
        document.getElementById('battle-actions').classList.add('hidden');
        document.getElementById('battle-moves').classList.add('hidden');
    },

    showActions() {
        if (this.playerAnimon.hp <= 0) {
            this.handlePlayerFaint();
            return;
        }
        document.getElementById('battle-message').innerText = 'O que você vai fazer?';
        document.getElementById('battle-actions').classList.remove('hidden');
        document.getElementById('battle-moves').classList.add('hidden');
    },

    showMoves() {
        document.getElementById('battle-actions').classList.add('hidden');
        const movesDiv = document.getElementById('battle-moves');
        movesDiv.innerHTML = '';
        this.playerAnimon.moves.forEach((moveId) => {
            const move = MovesDB[moveId];
            const btn = document.createElement('button');
            btn.innerText = `${move.name}\n[${move.type}]`;
            btn.onclick = () => this.executeTurn(moveId);
            movesDiv.appendChild(btn);
        });
        const backBtn = document.createElement('button');
        backBtn.innerText = 'Voltar';
        backBtn.onclick = () => this.showActions();
        movesDiv.appendChild(backBtn);
        movesDiv.classList.remove('hidden');
    },

    showBag() {
        if (Player.bag.capsule > 0 && !this.isTrainer) {
            this.useItem('capsule');
        } else {
            this.showMessage('Você não pode usar itens agora!');
            setTimeout(() => this.showActions(), 1500);
        }
    },

    switchAnimon() {
        // Find next conscious Animon
        const idx = Player.party.indexOf(this.playerAnimon);
        let next = null;
        for (let i=1; i<Player.party.length; i++) {
            let n = Player.party[(idx + i) % Player.party.length];
            if (n.hp > 0) {
                next = n;
                break;
            }
        }
        if (next) {
            this.playerAnimon = next;
            this.showMessage(`Vai, ${this.playerAnimon.species.name}!`);
            this.updateHUD();
            setTimeout(() => this.enemyTurn(), 1500);
        } else {
            this.showMessage('Nenhum outro Animon apto para lutar!');
            setTimeout(() => this.showActions(), 1500);
        }
    },

    runAway() {
        if (this.isTrainer) {
            this.showMessage('Você não pode fugir de uma batalha de treinador!');
            setTimeout(() => this.showActions(), 1500);
            return;
        }
        this.showMessage('Escapou com sucesso!');
        setTimeout(() => this.endBattle(), 1500);
    },

    useItem(itemId) {
        if (itemId === 'capsule') {
            Player.bag.capsule--;
            this.showMessage('Você jogou uma Cápsula Animon!');
            AudioManager.playHit();
            setTimeout(() => {
                const catchRate = ((this.enemy.maxHp - this.enemy.hp) / this.enemy.maxHp) + 0.2;
                if (Math.random() < catchRate) {
                    AudioManager.playCapture();
                    this.showMessage(`Sucesso! ${this.enemy.species.name} foi capturado!`);
                    Player.addAnimon(this.enemy);
                    setTimeout(() => this.endBattle(), 2000);
                } else {
                    this.showMessage(`Oh não! ${this.enemy.species.name} escapou da cápsula!`);
                    setTimeout(() => this.enemyTurn(), 1500);
                }
            }, 1000);
        }
    },

    calculateDamage(attacker, defender, move) {
        // Simplified damage formula
        let damage = (((2 * attacker.level / 5 + 2) * move.power * (attacker.atk / defender.def)) / 50) + 2;
        
        // Type effectiveness
        let modifier = 1;
        const effect = TypeEffectiveness[move.type];
        if (effect.strong.includes(defender.species.type)) modifier = 2;
        if (effect.weak.includes(defender.species.type)) modifier = 0.5;

        // STAB (Same Type Attack Bonus)
        if (attacker.species.type === move.type) modifier *= 1.5;

        // Random roll 85-100%
        modifier *= (Math.floor(Math.random() * 16) + 85) / 100;

        return { damage: Math.floor(damage * modifier), modifier };
    },

    executeTurn(playerMoveId) {
        const move = MovesDB[playerMoveId];
        this.showMessage(`${this.playerAnimon.species.name} usou ${move.name}!`);
        AudioManager.playHit();

        setTimeout(() => {
            const { damage, modifier } = this.calculateDamage(this.playerAnimon, this.enemy, move);
            this.enemy.hp -= damage;
            if (this.enemy.hp < 0) this.enemy.hp = 0;
            this.updateHUD();

            let msg = '';
            if (modifier > 1) msg = 'Foi super efetivo!';
            else if (modifier < 1) msg = 'Não foi muito efetivo...';

            if (msg) {
                this.showMessage(msg);
                setTimeout(() => this.checkEnemyStatus(), 1500);
            } else {
                this.checkEnemyStatus();
            }
        }, 1500);
    },

    checkEnemyStatus() {
        if (this.enemy.hp <= 0) {
            AudioManager.playHit();
            this.showMessage(`${this.enemy.species.name} desmaiou!`);
            setTimeout(() => {
                const xpGain = this.enemy.level * 10;
                this.showMessage(`${this.playerAnimon.species.name} ganhou ${xpGain} XP!`);
                AudioManager.playLevelUp();
                const leveledUp = this.playerAnimon.gainXp(xpGain);
                this.updateHUD();
                
                setTimeout(() => {
                    if (leveledUp) {
                        this.showMessage(`${this.playerAnimon.species.name} subiu para o nível ${this.playerAnimon.level}!`);
                        if (this.playerAnimon.checkEvolution()) {
                            setTimeout(() => {
                                this.showMessage(`Que incrível! Seu Animon evoluiu para ${this.playerAnimon.species.name}!`);
                                setTimeout(() => this.endBattle(true), 2000);
                            }, 1500);
                            return;
                        }
                        setTimeout(() => this.endBattle(true), 1500);
                    } else {
                        this.endBattle(true);
                    }
                }, 1500);

            }, 1500);
        } else {
            this.enemyTurn();
        }
    },

    enemyTurn() {
        const moveId = this.enemy.moves[Math.floor(Math.random() * this.enemy.moves.length)];
        const move = MovesDB[moveId];
        this.showMessage(`${this.enemy.species.name} inimigo usou ${move.name}!`);
        AudioManager.playHit();

        setTimeout(() => {
            const { damage, modifier } = this.calculateDamage(this.enemy, this.playerAnimon, move);
            this.playerAnimon.hp -= damage;
            if (this.playerAnimon.hp < 0) this.playerAnimon.hp = 0;
            this.updateHUD();

            let msg = '';
            if (modifier > 1) msg = 'Foi super efetivo!';
            else if (modifier < 1) msg = 'Não foi muito efetivo...';

            if (msg) {
                this.showMessage(msg);
                setTimeout(() => this.showActions(), 1500);
            } else {
                this.showActions();
            }
        }, 1500);
    },

    handlePlayerFaint() {
        this.showMessage(`${this.playerAnimon.species.name} desmaiou!`);
        AudioManager.playHit();
        setTimeout(() => {
            let hasConscious = false;
            for (let a of Player.party) {
                if (a.hp > 0) hasConscious = true;
            }
            if (hasConscious) {
                this.switchAnimon(); // Force switch
            } else {
                this.showMessage('Você não tem mais Animons aptos! Você perdeu a batalha...');
                setTimeout(() => {
                    Player.healParty();
                    Player.x = 5; // Return to start
                    Player.y = 5;
                    World.loadMap('verdantVale');
                    this.endBattle(false);
                }, 2000);
            }
        }, 1500);
    },

    endBattle(won=false) {
        this.active = false;
        document.getElementById('battle-hud').classList.add('hidden');
        if (won && this.onWin) {
            this.onWin();
        }
    },

    draw(ctx) {
        if (!this.active) return;
        ctx.fillStyle = '#E0F7FA'; // Battle background
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Draw Platforms
        ctx.fillStyle = '#4CAF50';
        ctx.beginPath(); ctx.ellipse(450, 150, 100, 30, 0, 0, Math.PI*2); ctx.fill(); // Enemy base
        ctx.beginPath(); ctx.ellipse(150, 350, 120, 40, 0, 0, Math.PI*2); ctx.fill(); // Player base

        // Draw Animons
        if (this.enemy && this.enemy.hp > 0) {
            SpriteRenderer.drawAnimon(ctx, this.enemy, 450, 130, 80, false);
        }
        if (this.playerAnimon && this.playerAnimon.hp > 0) {
            SpriteRenderer.drawAnimon(ctx, this.playerAnimon, 150, 310, 100, true);
        }
    }
};
