/**
 * Game Constants and Configuration
 */

export const GAME_CONFIG = {
    // Game Metadata
    TITLE: 'Physics Legends - Olympiad Adventure',
    VERSION: '1.0.0',
    MAX_LEVEL: 100,
    
    // UI Settings
    AUTO_SAVE_INTERVAL: 30000, // 30 seconds
    
    // Combat System
    BASE_DAMAGE: 10,
    BASE_HP: 100,
    HP_PER_LEVEL: 15,
    CRITICAL_CHANCE_BASE: 0.1,
    CRITICAL_MULTIPLIER: 1.5,
    
    // XP System
    BASE_XP: 50,
    XP_MULTIPLIER: 1.5,
    
    // Questions
    QUESTION_TIME_LIMIT: 30, // seconds
    COMBO_MULTIPLIER: 1.1,
    
    // Skills
    SKILL_COOLDOWN: 3, // turns
};

// Physics Topics
export const PHYSICS_TOPICS = [
    { id: 'kinematics', name: 'Kinematics', kingdom: 'Mechanics Kingdom' },
    { id: 'dynamics', name: 'Dynamics', kingdom: 'Newton Fortress' },
    { id: 'energy', name: 'Energy', kingdom: 'Energy Temple' },
    { id: 'momentum', name: 'Momentum', kingdom: 'Momentum Valley' },
    { id: 'electricity', name: 'Electricity', kingdom: 'Electricity City' },
    { id: 'magnetism', name: 'Magnetism', kingdom: 'Magnetism Realm' },
    { id: 'waves', name: 'Waves', kingdom: 'Wave Ocean' },
    { id: 'thermodynamics', name: 'Thermodynamics', kingdom: 'Thermodynamics Volcano' },
    { id: 'modern', name: 'Modern Physics', kingdom: 'Modern Physics Lab' },
    { id: 'olympiad', name: 'Olympiad', kingdom: 'Olympiad Tower' },
];

// Kingdoms and Bosses
export const KINGDOMS = [
    { level: 1, name: 'Mechanics Kingdom', boss: 'Aristotle', topic: 'kinematics' },
    { level: 11, name: 'Newton Fortress', boss: 'Isaac Newton', topic: 'dynamics' },
    { level: 21, name: 'Energy Temple', boss: 'James Joule', topic: 'energy' },
    { level: 31, name: 'Momentum Valley', boss: 'René Descartes', topic: 'momentum' },
    { level: 41, name: 'Electricity City', boss: 'Benjamin Franklin', topic: 'electricity' },
    { level: 51, name: 'Magnetism Realm', boss: 'Michael Faraday', topic: 'magnetism' },
    { level: 61, name: 'Wave Ocean', boss: 'Christiaan Huygens', topic: 'waves' },
    { level: 71, name: 'Thermodynamics Volcano', boss: 'Ludwig Boltzmann', topic: 'thermodynamics' },
    { level: 81, name: 'Modern Physics Lab', boss: 'Albert Einstein', topic: 'modern' },
    { level: 91, name: 'Olympiad Tower', boss: 'Richard Feynman', topic: 'olympiad' },
];

// Skills
export const SKILLS = [
    {
        id: 'quick-solve',
        name: 'Quick Solve',
        description: 'Increase time limit by 10 seconds',
        cost: 3,
        effect: 'addTime',
        value: 10,
    },
    {
        id: 'second-chance',
        name: 'Second Chance',
        description: 'Retry failed question without penalty',
        cost: 4,
        effect: 'retry',
    },
    {
        id: 'calculator-mind',
        name: 'Calculator Mind',
        description: 'Reduce question difficulty by one level',
        cost: 3,
        effect: 'reduceDifficulty',
    },
    {
        id: 'critical-thinking',
        name: 'Critical Thinking',
        description: 'Next hit deals 2x damage',
        cost: 4,
        effect: 'doubleDamage',
    },
    {
        id: 'time-warp',
        name: 'Time Warp',
        description: 'Pause timer for 5 seconds',
        cost: 5,
        effect: 'pauseTime',
        value: 5,
    },
];

// Achievements
export const ACHIEVEMENTS = [
    { id: 'first-steps', name: 'First Steps', description: 'Defeat your first enemy', points: 10 },
    { id: 'hundred-correct', name: 'Hundred Correct', description: 'Answer 100 questions correctly', points: 50 },
    { id: 'combo-20', name: 'Combo Master', description: 'Achieve a 20-question combo', points: 100 },
    { id: 'first-boss', name: 'Boss Slayer', description: 'Defeat your first boss', points: 100 },
    { id: 'level-50', name: 'Halfway Hero', description: 'Reach level 50', points: 100 },
    { id: 'level-100', name: 'Legend Status', description: 'Reach level 100', points: 500 },
    { id: 'olympiad-tower', name: 'Olympiad Champion', description: 'Complete the Olympiad Tower', points: 500 },
    { id: 'speedrunner', name: 'Speedrunner', description: 'Complete a question in under 5 seconds', points: 50 },
    { id: 'accuracy', name: 'Accuracy Expert', description: 'Achieve 95% accuracy rate', points: 100 },
    { id: 'scholar', name: 'Master Scholar', description: 'Master all physics topics', points: 200 },
];

// Difficulty Multipliers
export const DIFFICULTY_MULTIPLIERS = {
    EASY: 0.7,
    NORMAL: 1.0,
    HARD: 1.3,
    INSANE: 1.6,
};

// Enemy Templates
export const ENEMY_TEMPLATES = {
    basic: { hp: 30, damage: 5, xp: 20, coins: 10 },
    intermediate: { hp: 60, damage: 10, xp: 50, coins: 25 },
    advanced: { hp: 100, damage: 15, xp: 100, coins: 50 },
    elite: { hp: 150, damage: 20, xp: 200, coins: 100 },
    boss: { hp: 500, damage: 30, xp: 500, coins: 250 },
};
