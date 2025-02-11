import { Guild, GuildMember } from 'discord.js'
import { ArgsOf } from 'discordx'

import { Discord, Injectable, On } from '@/decorators'
import { Logger } from '@/services'

@Discord()
@Injectable()
export default class GuildAvailableEvent {

	constructor(
		private logger: Logger
	) {}

	/**
	 * Handler for the 'guildAvailable' event.
	 * @param {ArgsOf<'guildAvailable'>} args - The event arguments.
	 */
	@On('guildAvailable')
	async guildAvailableHandler(
		[readyGuild]: ArgsOf<'guildAvailable'>
	) {
		this.logger.log(`[guildAvailableHandler]`, 'debug', true)
		this.onGuildAvailableInfoLog(readyGuild)
		this.onGuildAvailableScanUsers(readyGuild)
	}

	/**
	 * Log information about the available guild.
	 * @param {Guild} guild - The available guild.
	 */
	private async onGuildAvailableInfoLog(guild: Guild) {
		this.logger.log('[onGuildAvailableInfoLog]', 'debug', true)
		this.logger.log(`Guild available: ${guild.name}`, 'info')
		this.logger.log(`Guild ID: ${guild.id}`, 'info')
		this.logger.log(`Guild member count: ${guild.memberCount}`, 'info')
		this.logger.log(`Guild owner: ${guild.ownerId}`, 'info')
	}

	/**
	 * Scan and log information about the users in the available guild.
	 * @param {Guild} guild - The available guild.
	 */
	private async onGuildAvailableScanUsers(guild: Guild) {
		this.logger.log('[onGuildAvailableScanUsers]', 'debug', true)
		try {
			const members = await guild.members.fetch()
			members.forEach((member: GuildMember) => {
				this.logger.log(`Member: ${member.user.id} | ${member.user.tag}`, 'info')
			})
		} catch (error) {
			this.logger.log(`Error scanning users in guild: ${guild.name}`, 'error', true)
		}
	}

}