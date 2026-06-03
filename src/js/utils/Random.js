/**
 * Random Number Generation Utilities
 * Provides consistent RNG for procedural question generation
 */

export class Random {
    constructor(seed = null) {
        this.seed = seed || Date.now();
    }

    /**
     * Seeded random number generator (0 to 1)
     */
    next() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }

    /**
     * Generate random integer between min and max (inclusive)
     */
    integer(min = 0, max = 100) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }

    /**
     * Generate random float between min and max
     */
    float(min = 0, max = 1, decimals = 2) {
        return parseFloat((this.next() * (max - min) + min).toFixed(decimals));
    }

    /**
     * Generate random decimal with specific precision
     */
    decimal(min = 0, max = 1, decimals = 1) {
        const multiplier = Math.pow(10, decimals);
        return Math.round(this.next() * (max - min) * multiplier + min * multiplier) / multiplier;
    }

    /**
     * Pick random element from array
     */
    pick(array) {
        return array[this.integer(0, array.length - 1)];
    }

    /**
     * Shuffle array
     */
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = this.integer(0, i);
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Generate weighted random selection
     */
    weighted(options) {
        // options: [{ value: something, weight: 1 }]
        const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
        let random = this.float(0, totalWeight);

        for (const option of options) {
            random -= option.weight;
            if (random <= 0) {
                return option.value;
            }
        }

        return options[options.length - 1].value;
    }

    /**
     * Generate UUID-like identifier
     */
    uuid() {
        return `${this.integer(0, 0xffff).toString(16)}-${this.integer(0, 0xffff).toString(16)}-${this.integer(0, 0xffff).toString(16)}-${this.integer(0, 0xffff).toString(16)}`;
    }

    /**
     * Generate seeded random color
     */
    color() {
        const hue = this.integer(0, 360);
        const saturation = this.integer(70, 100);
        const lightness = this.integer(40, 60);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    /**
     * Reset seed for reproducible generation
     */
    setSeed(seed) {
        this.seed = seed;
    }
}

/**
 * Global random instance
 */
export const globalRandom = new Random();

/**
 * Create new random generator with seed
 */
export function createSeededRandom(seed) {
    return new Random(seed);
}
