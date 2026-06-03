/**
 * Main Application Entry Point
 * Initializes game and manages screen rendering
 */

import Game from './core/Game.js';
import { KINGDOMS, PHYSICS_TOPICS } from './config/GameConfig.js';
import { SaveManager } from './storage/SaveManager.js';

class PhysicsLegends {
    constructor() {
        this.game = new Game();
        this.currentScreen = 'mainMenu';
        this.settings = SaveManager.loadSettings();
    }

    /**
     * Initialize application
     */
    async init() {
        // Initialize game
        this.game.initialize();

        // Setup event listeners
        this.setupEventListeners();

        // Check for saved game
        const hasSave = SaveManager.hasSave();

        // Render main menu
        this.renderMainMenu(hasSave);

        // Remove loading screen
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('fade-out');
            setTimeout(() => loading.remove(), 300);
        }

        console.log('Physics Legends initialized successfully');
    }

    /**
     * Setup game event listeners
     */
    setupEventListeners() {
        this.game.on('combatStarted', (data) => {
            this.renderCombatScreen(data);
        });

        this.game.on('correctAnswer', (data) => {
            this.showCombatFeedback(true, data);
        });

        this.game.on('incorrectAnswer', (data) => {
            this.showCombatFeedback(false, data);
        });

        this.game.on('combatEnded', (data) => {
            this.renderResultsScreen(data);
        });
    }

    /**
     * Render Main Menu
     */
    renderMainMenu(hasSave) {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="main-menu slide-in-up">
                <div class="menu-container">
                    <h1 class="menu-title">⚛️ Physics Legends</h1>
                    <p class="menu-subtitle">Olympiad Adventure</p>
                    
                    <div class="menu-buttons">
                        ${hasSave ? `
                            <button class="btn btn-primary btn-large" data-action="continue">
                                📖 Continue Game
                            </button>
                        ` : ''}
                        <button class="btn btn-primary btn-large" data-action="newGame">
                            🎮 New Game
                        </button>
                        <button class="btn btn-secondary btn-large" data-action="settings">
                            ⚙️ Settings
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Attach event listeners
        app.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleMenuAction(action);
            });
        });

        this.currentScreen = 'mainMenu';
    }

    /**
     * Handle menu actions
     */
    handleMenuAction(action) {
        switch (action) {
            case 'newGame':
                this.renderNameInput();
                break;
            case 'continue':
                if (this.game.load()) {
                    this.renderWorldMap();
                }
                break;
            case 'settings':
                this.renderSettingsScreen();
                break;
        }
    }

    /**
     * Render name input screen
     */
    renderNameInput() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="name-input-screen slide-in-up">
                <div class="input-container">
                    <h2>Enter your Scholar Name</h2>
                    <input 
                        type="text" 
                        id="playerName" 
                        placeholder="Enter name..." 
                        maxlength="20"
                        autocomplete="off"
                    />
                    <div class="button-group">
                        <button class="btn btn-primary" id="startBtn">Start Adventure</button>
                        <button class="btn btn-secondary" id="backBtn">Back</button>
                    </div>
                </div>
            </div>
        `;

        const nameInput = document.getElementById('playerName');
        const startBtn = document.getElementById('startBtn');
        const backBtn = document.getElementById('backBtn');

        startBtn.addEventListener('click', () => {
            const name = nameInput.value || 'Scholar';
            this.game.startNewGame(name);
            this.renderWorldMap();
        });

        backBtn.addEventListener('click', () => {
            this.renderMainMenu(SaveManager.hasSave());
        });

        nameInput.focus();
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') startBtn.click();
        });
    }

    /**
     * Render world map
     */
    renderWorldMap() {
        const app = document.getElementById('app');
        const summary = this.game.getPlayerSummary();

        app.innerHTML = `
            <div class="world-map-screen">
                <div class="map-header">
                    <h2>⚛️ ${summary.name}</h2>
                    <div class="player-stats">
                        <span class="stat">Lv ${summary.level}</span>
                        <span class="stat">🪙 ${summary.coins}</span>
                        <span class="stat">❤️ ${summary.currentHp}/${summary.maxHp}</span>
                    </div>
                </div>

                <div class="kingdoms-grid">
                    ${KINGDOMS.map(kingdom => `
                        <div class="kingdom-card" data-kingdom="${kingdom.level}">
                            <h3>${kingdom.name}</h3>
                            <p class="kingdom-level">Level ${kingdom.level}</p>
                            <p class="kingdom-boss">Boss: ${kingdom.boss}</p>
                            <button class="btn btn-primary btn-small" data-action="enterKingdom" data-kingdom="${kingdom.level}">
                                Enter
                            </button>
                        </div>
                    `).join('')}
                </div>

                <div class="menu-footer">
                    <button class="btn btn-secondary" data-action="save">💾 Save</button>
                    <button class="btn btn-secondary" data-action="menu">🏠 Menu</button>
                </div>
            </div>
        `;

        // Attach event listeners
        app.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (action === 'enterKingdom') {
                    const kingdom = parseInt(e.target.dataset.kingdom);
                    this.startKingdomCombat(kingdom);
                } else if (action === 'save') {
                    this.game.save();
                    alert('Game saved!');
                } else if (action === 'menu') {
                    this.renderMainMenu(true);
                }
            });
        });

        this.currentScreen = 'worldMap';
    }

    /**
     * Start combat for a kingdom
     */
    startKingdomCombat(kingdomLevel) {
        const kingdom = KINGDOMS.find(k => k.level === kingdomLevel);
        if (kingdom) {
            this.game.difficulty = this.settings.difficulty;
            this.game.startCombat(kingdom.topic);
        }
    }

    /**
     * Render combat screen
     */
    renderCombatScreen(data) {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="combat-screen slide-in-up">
                <div class="combat-header">
                    <div class="player-info">
                        <h3>${data.player.name}</h3>
                        <div class="hp-bar">
                            <div class="hp-fill" style="width: ${(data.player.currentHp / data.player.maxHp) * 100}%"></div>
                        </div>
                        <p>${data.player.currentHp}/${data.player.maxHp} HP</p>
                    </div>
                    <div class="enemy-info">
                        <h3>${data.enemy.name}</h3>
                        <div class="hp-bar">
                            <div class="hp-fill" style="width: ${data.enemy.hpPercentage}%"></div>
                        </div>
                        <p>${data.enemy.currentHp}/${data.enemy.maxHp} HP</p>
                    </div>
                </div>

                <div class="question-area">
                    <h2>${data.question.question}</h2>
                    <p class="formula">Formula: ${data.question.formula}</p>
                </div>

                <div class="answers-area" id="answersArea">
                    ${data.question.answers.map((answer, idx) => `
                        <button class="answer-btn" data-index="${idx}">
                            ${answer}
                        </button>
                    `).join('')}
                </div>

                <div class="timer" id="timer">30s</div>
            </div>
        `;

        // Setup answer buttons
        const answersArea = document.getElementById('answersArea');
        answersArea.querySelectorAll('.answer-btn').forEach((btn, idx) => {
            btn.addEventListener('click', () => {
                this.submitAnswer(data.question.answers[idx]);
            });
        });

        // Setup timer
        this.startTimer(30);

        this.currentScreen = 'combat';
    }

    /**
     * Submit answer
     */
    submitAnswer(answer) {
        const result = this.game.submitAnswer(answer);
        
        // Disable all buttons
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.disabled = true;
        });

        // Show correct answer
        const correctBtn = Array.from(document.querySelectorAll('.answer-btn')).find(
            btn => btn.textContent.includes(result.correctAnswer)
        );

        if (result.isCorrect) {
            correctBtn?.classList.add('correct');
        } else {
            const selectedBtn = Array.from(document.querySelectorAll('.answer-btn')).find(
                btn => btn.textContent.includes(answer)
            );
            selectedBtn?.classList.add('incorrect');
            correctBtn?.classList.add('correct');
        }

        // Continue after delay
        setTimeout(() => {
            if (this.game.isInCombat) {
                this.game.nextQuestion();
                this.renderCombatScreen({
                    player: this.game.player.getSummary(),
                    enemy: this.game.enemy.getDisplayInfo(),
                    question: this.game.currentQuestion,
                });
            }
        }, 2000);
    }

    /**
     * Start timer
     */
    startTimer(seconds) {
        const timerEl = document.getElementById('timer');
        let remaining = seconds;

        const interval = setInterval(() => {
            remaining--;
            timerEl.textContent = `${remaining}s`;

            if (remaining <= 0) {
                clearInterval(interval);
                // Auto-submit wrong answer on timeout
                this.submitAnswer(null);
            }
        }, 1000);
    }

    /**
     * Show combat feedback
     */
    showCombatFeedback(isCorrect, data) {
        // Implement visual feedback
        console.log(isCorrect ? '✓ Correct!' : '✗ Wrong!', data);
    }

    /**
     * Render results screen
     */
    renderResultsScreen(data) {
        const app = document.getElementById('app');
        const result = data.playerWon ? '✓ Victory!' : '✗ Defeat!';
        const resultClass = data.playerWon ? 'victory' : 'defeat';

        app.innerHTML = `
            <div class="results-screen slide-in-up ${resultClass}">
                <div class="results-container">
                    <h1>${result}</h1>
                    <div class="loot-display">
                        <p>Experience: +${data.loot.experience}</p>
                        <p>Coins: +${data.loot.coins}</p>
                    </div>
                    <button class="btn btn-primary" id="continueBtn">Continue</button>
                </div>
            </div>
        `;

        document.getElementById('continueBtn').addEventListener('click', () => {
            this.renderWorldMap();
        });

        this.currentScreen = 'results';
    }

    /**
     * Render settings screen
     */
    renderSettingsScreen() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="settings-screen slide-in-up">
                <h2>⚙️ Settings</h2>
                <div class="settings-container">
                    <label>
                        <input type="checkbox" id="soundToggle" ${this.settings.soundEnabled ? 'checked' : ''}>
                        Sound Effects
                    </label>
                    <label>
                        <select id="difficultySelect">
                            <option value="EASY" ${this.settings.difficulty === 'EASY' ? 'selected' : ''}>Easy</option>
                            <option value="NORMAL" ${this.settings.difficulty === 'NORMAL' ? 'selected' : ''}>Normal</option>
                            <option value="HARD" ${this.settings.difficulty === 'HARD' ? 'selected' : ''}>Hard</option>
                            <option value="INSANE" ${this.settings.difficulty === 'INSANE' ? 'selected' : ''}>Insane</option>
                        </select>
                    </label>
                </div>
                <button class="btn btn-secondary" id="backSettingsBtn">Back</button>
            </div>
        `;

        document.getElementById('backSettingsBtn').addEventListener('click', () => {
            this.settings.soundEnabled = document.getElementById('soundToggle').checked;
            this.settings.difficulty = document.getElementById('difficultySelect').value;
            SaveManager.saveSettings(this.settings);
            this.renderMainMenu(SaveManager.hasSave());
        });
    }
}

// Initialize application on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new PhysicsLegends();
        app.init();
    });
} else {
    const app = new PhysicsLegends();
    app.init();
}
