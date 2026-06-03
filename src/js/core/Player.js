/**
 * Player class - manages player data and statistics
 */

export class Player {
    constructor(name = 'Scholar') {
        this.name = name;
        this.level = 1;
        this.experience = 0;
        this.experienceToLevel = 100;
        
        // Stats
        this.maxHp = 100;
        this.currentHp = 100;
        this.mana = 100;
        this.maxMana = 100;
        
        // Combat Stats
        this.damage = 10;
        this.defense = 5;
        this.criticalChance = 0.1;
        this.accuracy = 0.85;
        
        // Progression
        this.coins = 0;
        this.skillPoints = 0;
        this.questsCompleted = 0;
        
        // Tracking
        this.questionsAnswered = 0;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.currentCombo = 0;
        this.bestCombo = 0;
        
        // Kingdom Progress
        this.currentKingdom = 1;
        this.currentStage = 1;
        this.kingdomsVisited = [1];
        
        // Skills Learned
        this.skills = [];
        this.skillsCooldown = {};
        
        // Topic Mastery (0-100%)
        this.topicMastery = {
            kinematics: 0,
            dynamics: 0,
            energy: 0,
            momentum: 0,
            electricity: 0,
            magnetism: 0,
            waves: 0,
            thermodynamics: 0,
            modern: 0,
            olympiad: 0,
        };
        
        // Achievements
        this.achievements = [];
    }

    /**
     * Add experience and level up if needed
     */
    addExperience(amount) {
        this.experience += amount;
        
        while (this.experience >= this.experienceToLevel) {
            this.levelUp();
        }
        
        return this.level;
    }

    /**
     * Level up the player
     */
    levelUp() {
        this.experience -= this.experienceToLevel;
        this.level += 1;
        
        // Increase stats on level up
        this.maxHp += 15;
        this.currentHp = this.maxHp;
        this.maxMana += 10;
        this.currentMana = this.maxMana;
        this.damage += 2;
        this.defense += 1;
        
        // Increase XP requirement
        this.experienceToLevel = Math.floor(100 * Math.pow(1.05, this.level));
        
        // Gain skill point
        this.skillPoints += 1;
        
        return true;
    }

    /**
     * Take damage
     */
    takeDamage(amount) {
        this.currentHp = Math.max(0, this.currentHp - amount);
        return this.currentHp;
    }

    /**
     * Heal HP
     */
    heal(amount) {
        this.currentHp = Math.min(this.maxHp, this.currentHp + amount);
        return this.currentHp;
    }

    /**
     * Restore mana
     */
    restoreMana(amount) {
        this.currentMana = Math.min(this.maxMana, this.currentMana + amount);
        return this.currentMana;
    }

    /**
     * Check if player is alive
     */
    isAlive() {
        return this.currentHp > 0;
    }

    /**
     * Add coins
     */
    addCoins(amount) {
        this.coins += amount;
        return this.coins;
    }

    /**
     * Deduct coins
     */
    spendCoins(amount) {
        if (this.coins >= amount) {
            this.coins -= amount;
            return true;
        }
        return false;
    }

    /**
     * Add correct answer
     */
    addCorrectAnswer(topic) {
        this.correctAnswers += 1;
        this.questionsAnswered += 1;
        this.currentCombo += 1;
        this.bestCombo = Math.max(this.bestCombo, this.currentCombo);
        
        // Update topic mastery
        if (this.topicMastery[topic] !== undefined) {
            this.topicMastery[topic] = Math.min(100, this.topicMastery[topic] + 2);
        }
    }

    /**
     * Add incorrect answer
     */
    addIncorrectAnswer(topic) {
        this.incorrectAnswers += 1;
        this.questionsAnswered += 1;
        this.currentCombo = 0;
        
        // Update topic mastery (slight decrease)
        if (this.topicMastery[topic] !== undefined) {
            this.topicMastery[topic] = Math.max(0, this.topicMastery[topic] - 0.5);
        }
    }

    /**
     * Get accuracy percentage
     */
    getAccuracyPercentage() {
        if (this.questionsAnswered === 0) return 0;
        return ((this.correctAnswers / this.questionsAnswered) * 100).toFixed(1);
    }

    /**
     * Learn a skill
     */
    learnSkill(skillId) {
        if (!this.skills.includes(skillId) && this.skillPoints > 0) {
            this.skills.push(skillId);
            this.skillPoints -= 1;
            return true;
        }
        return false;
    }

    /**
     * Use skill (manage cooldown)
     */
    useSkill(skillId) {
        if (this.skills.includes(skillId)) {
            this.skillsCooldown[skillId] = 3; // 3 turn cooldown
            return true;
        }
        return false;
    }

    /**
     * Unlock achievement
     */
    unlockAchievement(achievementId) {
        if (!this.achievements.includes(achievementId)) {
            this.achievements.push(achievementId);
            return true;
        }
        return false;
    }

    /**
     * Progress kingdom
     */
    progressKingdom(kingdomNumber) {
        if (kingdomNumber > this.currentKingdom) {
            this.currentKingdom = kingdomNumber;
        }
        if (!this.kingdomsVisited.includes(kingdomNumber)) {
            this.kingdomsVisited.push(kingdomNumber);
        }
    }

    /**
     * Calculate total damage
     */
    calculateDamage() {
        let baseDamage = this.damage;
        
        // Critical hit check
        if (Math.random() < this.criticalChance) {
            return Math.ceil(baseDamage * 1.5);
        }
        
        return baseDamage;
    }

    /**
     * Get player summary
     */
    getSummary() {
        return {
            name: this.name,
            level: this.level,
            experience: this.experience,
            currentHp: this.currentHp,
            maxHp: this.maxHp,
            coins: this.coins,
            questsCompleted: this.questsCompleted,
            correctAnswers: this.correctAnswers,
            accuracy: this.getAccuracyPercentage(),
            bestCombo: this.bestCombo,
            kingdomsVisited: this.kingdomsVisited.length,
            achievements: this.achievements.length,
        };
    }

    /**
     * Serialize player to JSON
     */
    toJSON() {
        return {
            name: this.name,
            level: this.level,
            experience: this.experience,
            experienceToLevel: this.experienceToLevel,
            maxHp: this.maxHp,
            currentHp: this.currentHp,
            mana: this.mana,
            maxMana: this.maxMana,
            damage: this.damage,
            defense: this.defense,
            criticalChance: this.criticalChance,
            accuracy: this.accuracy,
            coins: this.coins,
            skillPoints: this.skillPoints,
            questsCompleted: this.questsCompleted,
            questionsAnswered: this.questionsAnswered,
            correctAnswers: this.correctAnswers,
            incorrectAnswers: this.incorrectAnswers,
            currentCombo: this.currentCombo,
            bestCombo: this.bestCombo,
            currentKingdom: this.currentKingdom,
            currentStage: this.currentStage,
            kingdomsVisited: this.kingdomsVisited,
            skills: this.skills,
            topicMastery: this.topicMastery,
            achievements: this.achievements,
        };
    }

    /**
     * Deserialize player from JSON
     */
    static fromJSON(data) {
        const player = new Player(data.name);
        Object.assign(player, data);
        return player;
    }
}
