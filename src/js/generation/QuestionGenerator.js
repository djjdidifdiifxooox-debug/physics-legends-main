/**
 * Procedural Question Generator
 * Generates unique physics questions based on topic and difficulty
 */

import { Random } from '../utils/Random.js';
import { PhysicsMath } from '../utils/PhysicsMath.js';

export class QuestionGenerator {
    constructor(seed = null) {
        this.random = new Random(seed);
        this.generators = {
            kinematics: this.generateKinematicsQuestion.bind(this),
            dynamics: this.generateDynamicsQuestion.bind(this),
            energy: this.generateEnergyQuestion.bind(this),
            momentum: this.generateMomentumQuestion.bind(this),
            electricity: this.generateElectricityQuestion.bind(this),
            magnetism: this.generateMagnetismQuestion.bind(this),
            waves: this.generateWavesQuestion.bind(this),
            thermodynamics: this.generateThermodynamicsQuestion.bind(this),
            modern: this.generateModernPhysicsQuestion.bind(this),
        };
    }

    /**
     * Generate a random question for a topic
     */
    generateQuestion(topic, difficulty = 'NORMAL') {
        const generator = this.generators[topic];
        if (!generator) {
            return this.generateGenericQuestion(topic);
        }
        return generator(difficulty);
    }

    /**
     * Kinematics Questions
     */
    generateKinematicsQuestion(difficulty) {
        const types = [
            'velocity',
            'acceleration',
            'displacement',
            'time',
        ];
        const type = types[this.random.integer(0, types.length - 1)];

        const distance = this.random.integer(10, 100);
        const time = this.random.float(1, 10, 1);
        const velocity = PhysicsMath.calculateVelocity(distance, time);

        if (type === 'velocity') {
            return {
                topic: 'kinematics',
                difficulty,
                question: `An object travels ${distance} meters in ${time} seconds. What is its velocity?`,
                formula: 'v = d / t',
                answers: this.generateMultipleChoice(velocity, 'number'),
                correctAnswer: velocity,
                explanation: `Velocity is calculated as distance divided by time. ${distance} / ${time} = ${velocity} m/s`,
            };
        }

        return this.generateGenericQuestion('kinematics');
    }

    /**
     * Dynamics Questions (Newton's Laws)
     */
    generateDynamicsQuestion(difficulty) {
        const mass = this.random.integer(1, 20);
        const acceleration = this.random.float(1, 10, 1);
        const force = PhysicsMath.calculateForce(mass, acceleration);

        return {
            topic: 'dynamics',
            difficulty,
            question: `A force is applied to an object with mass ${mass} kg, causing it to accelerate at ${acceleration} m/s². What is the force?`,
            formula: 'F = m × a',
            answers: this.generateMultipleChoice(force, 'number'),
            correctAnswer: force,
            explanation: `Newton's second law: F = m × a = ${mass} × ${acceleration} = ${force} N`,
        };
    }

    /**
     * Energy Questions
     */
    generateEnergyQuestion(difficulty) {
        const types = this.random.pick(['kinetic', 'potential']);
        
        if (types === 'kinetic') {
            const mass = this.random.integer(1, 50);
            const velocity = this.random.integer(1, 20);
            const ke = PhysicsMath.calculateKineticEnergy(mass, velocity);

            return {
                topic: 'energy',
                difficulty,
                question: `Calculate the kinetic energy of an object with mass ${mass} kg moving at ${velocity} m/s.`,
                formula: 'KE = 0.5 × m × v²',
                answers: this.generateMultipleChoice(ke, 'number'),
                correctAnswer: ke,
                explanation: `KE = 0.5 × ${mass} × ${velocity}² = 0.5 × ${mass} × ${velocity * velocity} = ${ke} J`,
            };
        } else {
            const mass = this.random.integer(1, 50);
            const height = this.random.integer(1, 100);
            const g = 9.8;
            const pe = PhysicsMath.calculatePotentialEnergy(mass, g, height);

            return {
                topic: 'energy',
                difficulty,
                question: `An object with mass ${mass} kg is at a height of ${height} m. What is its potential energy?`,
                formula: 'PE = m × g × h',
                answers: this.generateMultipleChoice(pe, 'number'),
                correctAnswer: pe,
                explanation: `PE = ${mass} × 9.8 × ${height} = ${pe} J`,
            };
        }
    }

    /**
     * Momentum Questions
     */
    generateMomentumQuestion(difficulty) {
        const mass = this.random.integer(1, 100);
        const velocity = this.random.integer(1, 30);
        const momentum = PhysicsMath.calculateMomentum(mass, velocity);

        return {
            topic: 'momentum',
            difficulty,
            question: `An object with mass ${mass} kg is moving at ${velocity} m/s. What is its momentum?`,
            formula: 'p = m × v',
            answers: this.generateMultipleChoice(momentum, 'number'),
            correctAnswer: momentum,
            explanation: `Momentum = mass × velocity = ${mass} × ${velocity} = ${momentum} kg·m/s`,
        };
    }

    /**
     * Electricity Questions
     */
    generateElectricityQuestion(difficulty) {
        const types = this.random.pick(['ohm', 'power', 'current']);
        
        if (types === 'ohm') {
            const voltage = this.random.integer(1, 100);
            const current = this.random.float(0.1, 10, 1);
            const resistance = PhysicsMath.calculateResistance(voltage, current);

            return {
                topic: 'electricity',
                difficulty,
                question: `A circuit has a voltage of ${voltage} V and a current of ${current} A. What is the resistance?`,
                formula: 'R = V / I (Ohm\'s Law)',
                answers: this.generateMultipleChoice(resistance, 'number'),
                correctAnswer: resistance,
                explanation: `Resistance = Voltage / Current = ${voltage} / ${current} = ${resistance} Ω`,
            };
        }

        return this.generateGenericQuestion('electricity');
    }

    /**
     * Magnetism Questions
     */
    generateMagnetismQuestion(difficulty) {
        return {
            topic: 'magnetism',
            difficulty,
            question: 'What is the SI unit of magnetic field strength?',
            answers: ['Tesla', 'Gauss', 'Weber', 'Henry'],
            correctAnswer: 'Tesla',
            formula: 'B (measured in Tesla)',
            explanation: 'The Tesla (T) is the SI unit for magnetic field strength. 1 T = 1 kg/(A·s²)',
        };
    }

    /**
     * Waves Questions
     */
    generateWavesQuestion(difficulty) {
        const frequency = this.random.integer(1, 1000);
        const wavelength = this.random.float(0.1, 100, 1);
        const speed = PhysicsMath.calculateWaveSpeed(frequency, wavelength);

        return {
            topic: 'waves',
            difficulty,
            question: `A wave has a frequency of ${frequency} Hz and a wavelength of ${wavelength} m. What is its speed?`,
            formula: 'v = f × λ',
            answers: this.generateMultipleChoice(speed, 'number'),
            correctAnswer: speed,
            explanation: `Wave speed = frequency × wavelength = ${frequency} × ${wavelength} = ${speed} m/s`,
        };
    }

    /**
     * Thermodynamics Questions
     */
    generateThermodynamicsQuestion(difficulty) {
        const celsius = this.random.integer(-50, 50);
        const kelvin = PhysicsMath.celsiusToKelvin(celsius);

        return {
            topic: 'thermodynamics',
            difficulty,
            question: `Convert ${celsius}°C to Kelvin.`,
            formula: 'K = °C + 273.15',
            answers: this.generateMultipleChoice(kelvin, 'number'),
            correctAnswer: kelvin,
            explanation: `Absolute temperature = ${celsius} + 273.15 = ${kelvin} K`,
        };
    }

    /**
     * Modern Physics Questions
     */
    generateModernPhysicsQuestion(difficulty) {
        return {
            topic: 'modern',
            difficulty,
            question: 'What is the speed of light in vacuum?',
            answers: ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10¹⁰ m/s', '3 × 10⁵ m/s'],
            correctAnswer: '3 × 10⁸ m/s',
            formula: 'c = 3 × 10⁸ m/s',
            explanation: 'The speed of light in vacuum is approximately 3 × 10⁸ meters per second (299,792,458 m/s exactly).',
        };
    }

    /**
     * Generic Question Fallback
     */
    generateGenericQuestion(topic) {
        return {
            topic,
            difficulty: 'NORMAL',
            question: `What is an important concept in ${topic}?`,
            answers: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 'Option A',
            explanation: 'Study the fundamentals of this topic.',
        };
    }

    /**
     * Generate multiple choice options
     */
    generateMultipleChoice(correctAnswer, type = 'number', count = 4) {
        const options = [correctAnswer];

        for (let i = 1; i < count; i++) {
            if (type === 'number') {
                const variation = correctAnswer * (0.7 + this.random.float(0, 0.6));
                options.push(parseFloat(variation.toFixed(2)));
            }
        }

        // Shuffle options
        return this.random.shuffle(options);
    }
}

export default QuestionGenerator;
