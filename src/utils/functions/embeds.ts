import { CommandInteraction, EmbedBuilder, EmbedField } from 'discord.js'

import { replyToInteraction, resolveAction,	resolveChannel,	resolveCommandName,	resolveGuild, resolveLocale, resolveUser } from '@/utils/functions'

/**
 * Send a simple success embed
 * @param interaction - discord interaction
 * @param message - message to log
 */
export function simpleSuccessEmbed(interaction: CommandInteraction, message: string) {
	const embed = new EmbedBuilder()
		.setColor(0x57F287) // GREEN // see: https://github.com/discordjs/discord.js/blob/main/packages/discord.js/src/util/Colors.js
		.setTitle(`✅ ${message}`)

	replyToInteraction(interaction, { embeds: [embed] })
}

/**
 * Send a simple error embed
 * @param interaction - discord interaction
 * @param message - message to log
 */
export function simpleErrorEmbed(interaction: CommandInteraction, message: string) {
	const embed = new EmbedBuilder()
		.setColor(0xED4245) // RED // see: https://github.com/discordjs/discord.js/blob/main/packages/discord.js/src/util/Colors.js
		.setTitle(`❌ ${message}`)

	replyToInteraction(interaction, { embeds: [embed] })
}

/**
 * Send a simple info embed used by gg command
 * @param interaction - discord interaction
 * @param message - message to log
 */
export function ggInfoEmbed(interaction: CommandInteraction, message: string) {
	const resolveEverything = (interaction: CommandInteraction) => {
		const action = resolveAction(interaction)
		const guild = resolveGuild(interaction)
		const channel = resolveChannel(interaction)
		const commandName = resolveCommandName(interaction)
		const locale = resolveLocale(interaction)
		const user = resolveUser(interaction)

		return {
			action,
			guild,
			channel,
			commandName,
			locale,
			user,
		}
	}

	const embed = new EmbedBuilder()
		.setColor(0x57F287) // GREEN // see:
		.setTitle(`✅ ${message}`)
		.setDescription('GG Information')
	const fields: EmbedField[] = []
	const { guild, channel, commandName, locale, user, action } = resolveEverything(interaction)

	/**
	 * Guild field
	 */
	const guildName = guild?.name
	const guildId = guild?.id

	if (guild) {
		fields.push({
			name: 'Owner',
			value: `Guild Name: \`${guildName}\`\nGuild ID: \`${guildId}\``,
			inline: false,
		})
	}

	/**
	 * User field
	 */
	const userName = user?.username
	const userId = user?.id
	const userAvatar = user?.avatar

	if (user) {
		fields.push({
			name: 'User',
			value: `\`${userName} : ${userId} : ${userAvatar}\``,
			inline: false,
		})
	}

	/**
	 * Channel field
	 */
	const channelBase = channel?.isTextBased()
	const channelId = channel?.id

	if (channel) {
		fields.push({
			name: 'Channel',
			value: `\`${channelId}\`\nText-based: \`${channelBase}\``,
			inline: false,
		})
	}

	/**
	 * Command field
	 */
	if (commandName) {
		fields.push({
			name: 'Command',
			value: `\`${commandName}\``,
			inline: true,
		})
	}

	/**
	 * Locale field
	 */
	if (locale) {
		fields.push({
			name: 'Locale',
			value: `\`${locale}\``,
			inline: true,
		})
	}

	/**
	 * Action field
	 */
	if (action) {
		fields.push({
			name: 'Action',
			value: `\`${action}\``,
			inline: true,
		})
	}

	embed.addFields(fields)
	replyToInteraction(interaction, { embeds: [embed] })
}
