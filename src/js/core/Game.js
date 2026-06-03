/**
 * Main Game Engine
 * Orchestrates all game systems and state
 */

import { Player } from './core/Player.js';
import { Enemy, createEnemy } from './core/Enemy.js';
import { QuestionGenerator } from './generation/QuestionGenerator.js';
import { SaveManager } from './storage/SaveManager.js';
import { GAME_CONFIG, KINGDOMS, PHYSICS_TOPICS } from './config/GameConfig.js';

export class Game {
    constructor() {
        this.player = new Player('Scholar');
        this.enemy = null;
        this.currentQuestion = null;
        this.questionGenerator = new QuestionGenerator();
        this.gameState = 'menu'; // menu, worldMap, combat, resultsScreen
        this.currentTopic = 'kinematics';
        this.difficulty = 'NORMAL';
        this.isInCombat = false;
        this.combatLog = [];
        this.eventListeners = {};
    }

    /**
     * Initialize game
     */
    initialize() {
        // Load saved data
        const savedPlayer = SaveManager.loadPlayer();
        if (savedPlayer) {
            this.player = Object.assign(new Player(), savedPlayer);
        }

        this.emit('initialized');
        return true;
    }

    /**
     * Start new game
     */
    startNewGame(playerName = 'Scholar') {
        this.player = new Player(playerName);
        this.gameState = 'worldMap';
        this.emit('gameStarted');
        return true;
    }

    /**
     * Start combat encounter
     */
    startCombat(topic = 'kinematics') {
        this.currentTopic = topic;
        this.enemy = createEnemy(topic, this.difficulty);
        this.isInCombat = true;
        this.gameState = 'combat';
        this.combatLog = [];
        
        // Generate first question
        this.nextQuestion();
        
        this.emit('combatStarted', {
            player: this.player.getSummary(),
            enemy: this.enemy.getDisplayInfo(),
            question: this.currentQuestion,
        });

        return true;
    }

    /**
     * Get next question
     */
    nextQuestion() {
        this.currentQuestion = this.questionGenerator.generateQuestion(
            this.currentTopic,
            this.difficulty
        );
        return this.currentQuestion;
    }

    /**
     * Submit answer
     */
    submitAnswer(selectedAnswer) {
        const isCorrect = selectedAnswer === this.currentQuestion.correctAnswer;
        
        if (isCorrect) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer();
        }

        return {
            isCorrect,
            correctAnswer: this.currentQuestion.correctAnswer,
            explanation: this.currentQuestion.explanation,
        };
    }

    /**
     * Handle correct answer
     */
    handleCorrectAnswer() {
        // Player deals damage
        const damage = this.player.calculateDamage();
        const actualDamage = this.enemy.takeDamage(damage);

        // Add experience and coins
        const xpGain = GAME_CONFIG.BASE_XP * (1 + this.player.currentCombo * 0.1);
        const coinsGain = Math.ceil(5 * (1 + this.player.currentCombo * 0.05));

        this.player.addExperience(xpGain);
        this.player.addCoins(coinsGain);
        this.player.addCorrectAnswer(this.currentTopic);

        // Log action
        this.combatLog.push({
            action: 'playerAttack',
            damage: actualDamage,
            xpGain,
            coinsGain,
            comboCount: this.player.currentCombo,
        });

        this.emit('correctAnswer', {
            damage: actualDamage,
            xp: xpGain,
            coins: coinsGain,
            combo: this.player.currentCombo,
            enemyHp: this.enemy.currentHp,
        });

        // Check if enemy defeated
        if (!this.enemy.isAlive()) {
            this.endCombat(true);
        }
    }

    /**
     * Handle incorrect answer
     */
    handleIncorrectAnswer() {
        // Enemy deals damage
        const enemyDamage = this.enemy.calculateDamage();
        this.player.takeDamage(enemyDamage);
        this.player.addIncorrectAnswer(this.currentTopic);

        // Reset combo
        const previousCombo = this.player.currentCombo;
        this.player.currentCombo = 0;

        // Log action
        this.combatLog.push({
            action: 'enemyAttack',
            damage: enemyDamage,
            comboLost: previousCombo,
        });

        this.emit('incorrectAnswer', {
            damage: enemyDamage,
            playerHp: this.player.currentHp,
            comboLost: previousCombo,
        });

        // Check if player defeated
        if (!this.player.isAlive()) {
            this.endCombat(false);
        }
    }

    /**
     * End combat
     */
    endCombat(playerWon) {
        this.isInCombat = false;
        this.gameState = 'resultsScreen';

        const loot = this.enemy.getLoot();
        
        if (playerWon) {
            this.player.questsCompleted += 1;
            this.player.addExperience(loot.experience);
            this.player.addCoins(loot.coins);
        } else {
            // Penalty for losing
            this.player.currentHp = this.player.maxHp;
        }

        // Save progress
        SaveManager.savePlayer(this.player);

        this.emit('combatEnded', {
            playerWon,
            loot,
            playerSummary: this.player.getSummary(),
        });

        return playerWon;
    }

    /**
     * Progress kingdom
     */
    progressKingdom(kingdomNumber) {
        this.player.progressKingdom(kingdomNumber);
        SaveManager.savePlayer(this.player);
        return true;
    }

    /**
     * Get kingdom info
     */
    getKingdomInfo(kingdomNumber) {
        const kingdom = KINGDOMS.find(k => k.level <= kingdomNumber && kingdomNumber < (KINGDOMS[KINGDOMS.indexOf(k) + 1]?.level ?? 101));
        return kingdom || KINGDOMS[0];
    }

    /**
     * Get player summary
     */
    getPlayerSummary() {
        return this.player.getSummary();
    }

    /**
     * Save game
     */
    save() {
        return SaveManager.savePlayer(this.player);
    }

    /**
     * Load game
     */
    load() {
        const savedData = SaveManager.loadPlayer();
        if (savedData) {
            this.player = Object.assign(new Player(), savedData);
            return true;
        }
        return false;
    }

    /**
     * Event system
     */
    on(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }

    off(event, callback) {
        if (this.eventListeners[event]) {
            this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
        }
    }

    emit(event, data = null) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => callback(data));
        }
    }

    /**
     * Debug info
     */
    getDebugInfo() {
        return {
            gameState: this.gameState,
            playerLevel: this.player.level,
            playerHp: `${this.player.currentHp}/${this.player.maxHp}`,
            enemyHp: this.enemy ? `${this.enemy.currentHp}/${this.enemy.maxHp}` : 'N/A',
            currentQuestion: this.currentQuestion?.question || 'None',
        };
    }
}

export default Game;
