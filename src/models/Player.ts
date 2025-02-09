// Description: This file contains the player model.

import { Role, ExpTotalMapping, ExpLevelMapping } from './Static';

/**
 * Class representing a Player.
 */
class Player {
    dcId: string;
    guildId: string;
    dcTag: string;
    role: number;
    level: number;
    exp: number;
    expCurrentLevel: number;
    currentTaskId: string | null;
    currencies: { [key: string]: number };

    /**
     * Create a Player.
     * @param {string} dcId - The Discord ID.
     * @param {string} dcTag - The Discord Tag.
     * @param {string} guildId - The Guild ID.
     * @param {number} [role=Role.MEMBER] - The role of the player.
     */
    constructor(dcId: string, dcTag: string, guildId: string, role: number = Role.MEMBER) {
        // Primary Keys
        this.dcId = dcId;
        this.guildId = guildId;

        // Attributes
        this.dcTag = dcTag;
        this.role = role;

        this.level = 1;
        this.exp = 0;
        this.expCurrentLevel = 0;
        this.currentTaskId = null;
        this.currencies = {
            'silverCoin': 0,
            'royalPoint': 0,
        };
    }

    /**
     * Check if the player has a task.
     * @returns {boolean} True if the player has a task, false otherwise.
     */
    hasTask(): boolean {
        return this.currentTaskId !== null;
    }

    /**
     * Accept a task.
     * @param {string} taskId - The task ID.
     * @returns {boolean} True if the task was accepted, false otherwise.
     */
    acceptTask(taskId: string): boolean {
        if (this.hasTask()) {
            return false;
        }
        this.currentTaskId = taskId;
        return true;
    }

    /**
     * Update attributes from the store.
     * @param {Object} attributes - The attributes to update.
     */
    updateAttributeFromStore(attributes: { [key: string]: any }) {
        this.role = attributes['role'];
        this.exp = attributes['exp'];
        this.updateLevel();
        this.currentTaskId = attributes['currentTaskId'];
        this.currencies = attributes['currencies'];
    }

    /**
     * Return attributes to the store.
     * @returns {Object} The attributes to store.
     */
    returnAttributeToStore(): { [key: string]: any } {
        this.updateLevel();
        return {
            'dcId': this.dcId,
            'dcTag': this.dcTag,
            'guildId': this.guildId,
            'role': this.role,
            'level': this.level,
            'exp': this.exp,
            'currentTaskId': this.currentTaskId,
            'currencies': this.currencies,
        };
    }

    /**
     * Update the player's currency.
     * @param {string} currency - The currency to update.
     * @param {number} amount - The amount to update by.
     * @returns {boolean} True if the currency was updated, false otherwise.
     */
    updateCurrency(currency: string, amount: number): boolean {
        if (!Object.prototype.hasOwnProperty.call(this.currencies, currency)) {
            return false;
        }

        if (this.currencies[currency] + amount < 0) {
            return false;
        }

        this.currencies[currency] += amount;
        return true;
    }

    /**
     * Update the player's role.
     * @param {number} role - The new role.
     */
    updateRole(role: number) {
        this.role = role;
    }

    /**
     * Update the player's level based on their experience.
     */
    updateLevel() {
        this.expCurrentLevel = this.exp;
        for (let i = 1; i <= 100; i++) {
            if (this.exp >= ExpTotalMapping[i]) {
                this.level = i + 1;
                this.expCurrentLevel -= ExpLevelMapping[i];
            } else {
                break;
            }
        }
    }

    /**
     * Update the player's experience.
     * @param {number} exp - The amount of experience to add.
     */
    updateExp(exp: number) {
        this.exp += exp;
        this.updateLevel();
    }
}

export { Player };