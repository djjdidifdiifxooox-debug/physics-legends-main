/**
 * Save Manager - handles LocalStorage persistence
 */

const SAVE_KEY = 'physicsLegends_save';
const SETTINGS_KEY = 'physicsLegends_settings';
const LEADERBOARD_KEY = 'physicsLegends_leaderboard';

export class SaveManager {
    /**
     * Save player data to LocalStorage
     */
    static savePlayer(player) {
        try {
            const data = {
                timestamp: new Date().toISOString(),
                player: player.toJSON(),
            };
            localStorage.setItem(SAVE_KEY, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Failed to save player:', error);
            return false;
        }
    }

    /**
     * Load player data from LocalStorage
     */
    static loadPlayer() {
        try {
            const data = localStorage.getItem(SAVE_KEY);
            if (!data) return null;
            
            const parsed = JSON.parse(data);
            return parsed.player;
        } catch (error) {
            console.error('Failed to load player:', error);
            return null;
        }
    }

    /**
     * Check if save exists
     */
    static hasSave() {
        return localStorage.getItem(SAVE_KEY) !== null;
    }

    /**
     * Delete save data
     */
    static deleteSave() {
        try {
            localStorage.removeItem(SAVE_KEY);
            return true;
        } catch (error) {
            console.error('Failed to delete save:', error);
            return false;
        }
    }

    /**
     * Save settings
     */
    static saveSettings(settings) {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Failed to save settings:', error);
            return false;
        }
    }

    /**
     * Load settings
     */
    static loadSettings() {
        try {
            const data = localStorage.getItem(SETTINGS_KEY);
            if (!data) return this.getDefaultSettings();
            return JSON.parse(data);
        } catch (error) {
            console.error('Failed to load settings:', error);
            return this.getDefaultSettings();
        }
    }

    /**
     * Get default settings
     */
    static getDefaultSettings() {
        return {
            soundEnabled: true,
            musicVolume: 0.7,
            sfxVolume: 0.8,
            difficulty: 'NORMAL',
            animations: true,
            darkMode: true,
            language: 'en',
        };
    }

    /**
     * Save leaderboard entry
     */
    static saveLeaderboardEntry(entry) {
        try {
            let leaderboard = this.getLeaderboard();
            leaderboard.push({
                ...entry,
                timestamp: new Date().toISOString(),
            });
            
            // Sort by score descending
            leaderboard.sort((a, b) => b.score - a.score);
            
            // Keep only top 100
            leaderboard = leaderboard.slice(0, 100);
            
            localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
            return true;
        } catch (error) {
            console.error('Failed to save leaderboard entry:', error);
            return false;
        }
    }

    /**
     * Get leaderboard
     */
    static getLeaderboard() {
        try {
            const data = localStorage.getItem(LEADERBOARD_KEY);
            if (!data) return [];
            return JSON.parse(data);
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
            return [];
        }
    }

    /**
     * Export save as JSON file
     */
    static exportSave() {
        try {
            const player = this.loadPlayer();
            const settings = this.loadSettings();
            const leaderboard = this.getLeaderboard();
            
            const data = {
                version: '1.0.0',
                exportDate: new Date().toISOString(),
                player,
                settings,
                leaderboard,
            };
            
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            // Trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = `physics-legends-save-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            return true;
        } catch (error) {
            console.error('Failed to export save:', error);
            return false;
        }
    }

    /**
     * Import save from JSON file
     */
    static async importSave(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            if (data.player) {
                localStorage.setItem(SAVE_KEY, JSON.stringify({
                    timestamp: new Date().toISOString(),
                    player: data.player,
                }));
            }
            
            if (data.settings) {
                this.saveSettings(data.settings);
            }
            
            if (data.leaderboard) {
                localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(data.leaderboard));
            }
            
            return true;
        } catch (error) {
            console.error('Failed to import save:', error);
            return false;
        }
    }

    /**
     * Clear all data
     */
    static clearAll() {
        try {
            localStorage.removeItem(SAVE_KEY);
            localStorage.removeItem(SETTINGS_KEY);
            localStorage.removeItem(LEADERBOARD_KEY);
            return true;
        } catch (error) {
            console.error('Failed to clear all data:', error);
            return false;
        }
    }

    /**
     * Get storage info
     */
    static getStorageInfo() {
        try {
            if (navigator.storage && navigator.storage.estimate) {
                return navigator.storage.estimate();
            }
            return null;
        } catch (error) {
            console.error('Failed to get storage info:', error);
            return null;
        }
    }
}

export default SaveManager;
