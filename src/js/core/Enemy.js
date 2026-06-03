/**
 * Enemy class - manages enemy data and behavior
 */

export class Enemy {
    constructor(name = 'Physics Guardian', level = 1, type = 'basic') {
        this.name = name;
        this.level = level;
        this.type = type; // basic, intermediate, advanced, elite, boss
        
        // Stats based on type
        const templates = {
            basic: { hp: 30, damage: 5, xp: 20, coins: 10 },
            intermediate: { hp: 60, damage: 10, xp: 50, coins: 25 },
            advanced: { hp: 100, damage: 15, xp: 100, coins: 50 },
            elite: { hp: 150, damage: 20, xp: 200, coins: 100 },
            boss: { hp: 500, damage: 30, xp: 500, coins: 250 },
        };
        
        const template = templates[type] || templates.basic;
        
        // Scale stats by level
        const levelMultiplier = 1 + (level * 0.1);
        this.maxHp = Math.ceil(template.hp * levelMultiplier);
        this.currentHp = this.maxHp;
        this.damage = Math.ceil(template.damage * levelMultiplier);
        this.defense = Math.ceil(2 * levelMultiplier);
        this.experience = Math.ceil(template.xp * levelMultiplier);
        this.coins = Math.ceil(template.coins * levelMultiplier);
        
        // Combat stats
        this.criticalChance = 0.15;
        this.accuracy = 0.8;
        
        // Tracking
        this.turnsSurvived = 0;
    }

    /**
     * Take damage
     */
    takeDamage(amount) {
        const actualDamage = Math.max(1, amount - this.defense);
        this.currentHp = Math.max(0, this.currentHp - actualDamage);
        return actualDamage;
    }

    /**
     * Calculate damage to deal
     */
    calculateDamage() {
        let baseDamage = this.damage;
        
        // Accuracy check
        if (Math.random() > this.accuracy) {
            return 0; // Miss
        }
        
        // Critical hit check
        if (Math.random() < this.criticalChance) {
            return Math.ceil(baseDamage * 1.5);
        }
        
        return baseDamage;
    }

    /**
     * Check if enemy is alive
     */
    isAlive() {
        return this.currentHp > 0;
    }

    /**
     * Get loot
     */
    getLoot() {
        return {
            experience: this.experience,
            coins: this.coins,
        };
    }

    /**
     * Get enemy display info
     */
    getDisplayInfo() {
        return {
            name: this.name,
            level: this.level,
            type: this.type,
            currentHp: this.currentHp,
            maxHp: this.maxHp,
            hpPercentage: (this.currentHp / this.maxHp) * 100,
        };
    }

    /**
     * Serialize to JSON
     */
    toJSON() {
        return {
            name: this.name,
            level: this.level,
            type: this.type,
            maxHp: this.maxHp,
            currentHp: this.currentHp,
            damage: this.damage,
            defense: this.defense,
            experience: this.experience,
            coins: this.coins,
            criticalChance: this.criticalChance,
            accuracy: this.accuracy,
            turnsSurvived: this.turnsSurvived,
        };
    }

    /**
     * Deserialize from JSON
     */
    static fromJSON(data) {
        const enemy = new Enemy(data.name, data.level, data.type);
        Object.assign(enemy, data);
        return enemy;
    }
}

/**
 * Create enemy based on kingdom and difficulty
 */
export function createEnemy(kingdom, difficulty = 'NORMAL') {
    const names = {
        kinematics: ['Motion Guard', 'Velocity Warden', 'Path Enforcer'],
        dynamics: ['Force Guardian', 'Newton\'s Sentinel', 'Power Bearer'],
        energy: ['Energy Keeper', 'Force of Nature', 'Power Protector'],
        momentum: ['Collision Warden', 'Inertia Guard', 'Momentum Keeper'],
        electricity: ['Charge Guardian', 'Volt Protector', 'Current Bearer'],
        magnetism: ['Magnetic Keeper', 'Field Guardian', 'Pole Warden'],
        waves: ['Wave Rider', 'Frequency Guard', 'Resonance Keeper'],
        thermodynamics: ['Heat Guardian', 'Entropy Keeper', 'Thermal Warden'],
        modern: ['Quantum Keeper', 'Relativity Guard', 'Space-Time Warden'],
    };

    const types = {
        EASY: 'basic',
        NORMAL: 'intermediate',
        HARD: 'advanced',
        INSANE: 'elite',
    };

    const topicNames = names[kingdom] || names.kinematics;
    const name = topicNames[Math.floor(Math.random() * topicNames.length)];
    const type = types[difficulty] || types.NORMAL;
    const level = Math.floor(Math.random() * 5) + 1;

    return new Enemy(name, level, type);
}
