// Description: This file contains the utility models for the bot.

/**
 * Class representing a UserDailyCounter.
 */
class UserDailyCounter {

	dcId: string | null
	dcTag: string | null
	textChatDailyCounter: number
	voiceChatDailyCounter: number
	lastResetTime: Date | null

	/**
	 * Create a Counter.
	 */
	constructor() {
		this.dcId = null
		this.dcTag = null
		this.textChatDailyCounter = 0
		this.voiceChatDailyCounter = 0
		this.lastResetTime = null
		this.resetDaily()
	}

	/**
	 * Set the Discord ID.
	 * @param {string | null} dcId - The Discord ID.
	 */
	setDcId(dcId: string | null) {
		this.dcId = dcId
	}

	/**
	 * Set the Discord Tag.
	 * @param {string | null} dcTag - The Discord Tag.
	 */
	setDcTag(dcTag: string | null) {
		this.dcTag = dcTag
	}

	/**
	 * Reset the daily counters and update the last reset time.
	 */
	resetDaily() {
		this.lastResetTime = new Date()
		this.resetAllCounters()
	}

	/**
	 * Increment the text chat counter.
	 * @param {number} exp - The amount to increment by.
	 */
	incrementTextChatCounter(exp: number) {
		this.textChatDailyCounter += exp
	}

	/**
	 * Increment the voice chat counter.
	 * @param {number} exp - The amount to increment by.
	 */
	incrementVoiceChatCounter(exp: number) {
		this.voiceChatDailyCounter += exp
	}

	/**
	 * Decrement the text chat counter.
	 */
	decrementTextChatCounter() {
		this.textChatDailyCounter--
	}

	/**
	 * Reset the text chat counter.
	 */
	resetTextChatCounter() {
		this.textChatDailyCounter = 0
	}

	/**
	 * Reset the voice chat counter.
	 */
	resetVoiceChatCounter() {
		this.voiceChatDailyCounter = 0
	}

	/**
	 * Reset both the text and voice chat counters.
	 */
	resetAllCounters() {
		this.textChatDailyCounter = 0
		this.voiceChatDailyCounter = 0
	}

	/**
	 * Get the text chat daily counter.
	 * @returns {number} The text chat daily counter.
	 */
	getTextChatDailyCounter(): number {
		return this.textChatDailyCounter
	}

	/**
	 * Get the voice chat daily counter.
	 * @returns {number} The voice chat daily counter.
	 */
	getVoiceChatDailyCounter(): number {
		return this.voiceChatDailyCounter
	}

	/**
	 * Update attributes from the store.
	 * @param {object} attributes - The attributes to update.
	 */
	updateAttributeFromStore(attributes: { [key: string]: any }) {
		this.dcId = attributes.dcId
		this.dcTag = attributes.dcTag
		this.textChatDailyCounter = attributes.textChatDailyCounter
		this.voiceChatDailyCounter = attributes.voiceChatDailyCounter
		this.lastResetTime = attributes.lastResetTime ? new Date(attributes.lastResetTime) : null
	}

	/**
	 * Return attributes to the store.
	 * @returns {object} The attributes to store.
	 */
	returnAttributeToStore(): object {
		return {
			dcId: this.dcId,
			dcTag: this.dcTag,
			textChatDailyCounter: this.textChatDailyCounter,
			voiceChatDailyCounter: this.voiceChatDailyCounter,
			lastResetTime: this.lastResetTime,
		}
	}

}

export default {
	UserDailyCounter,
}