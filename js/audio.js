const AudioManager = {
    ctx: null,
    enabled: false,
    
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.enabled = true;
        }
    },
    
    playTone(freq, type, duration, vol=0.1) {
        if (!this.enabled || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    playSelect() {
        this.playTone(440, 'square', 0.1, 0.05);
        setTimeout(() => this.playTone(660, 'square', 0.15, 0.05), 50);
    },

    playHit() {
        this.playTone(150, 'sawtooth', 0.2, 0.1);
        setTimeout(() => this.playTone(100, 'square', 0.2, 0.1), 50);
    },
    
    playLevelUp() {
        const notes = [440, 554, 659, 880];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 'square', 0.2, 0.05), i * 150);
        });
    },

    playEncounter() {
        for(let i=0; i<3; i++) {
            setTimeout(() => this.playTone(880, 'sawtooth', 0.1, 0.1), i * 200);
            setTimeout(() => this.playTone(440, 'sawtooth', 0.1, 0.1), i * 200 + 100);
        }
    },

    playCapture() {
        setTimeout(() => this.playTone(300, 'sine', 0.2, 0.1), 0);
        setTimeout(() => this.playTone(400, 'sine', 0.2, 0.1), 400);
        setTimeout(() => this.playTone(500, 'sine', 0.2, 0.1), 800);
        setTimeout(() => this.playLevelUp(), 1200);
    }
};
