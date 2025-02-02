import { Category } from '@discordx/utilities'
import { CommandInteraction } from 'discord.js'

import { Discord, Slash } from '@/decorators'
import { Guard, UserPermissions } from '@/guards'
import { ggInfoEmbed } from '@/utils/functions'

@Discord()
@Category('Admin')
export default class GGCommand {

	@Slash({
		name: 'gg',
	})
	@Guard(
		UserPermissions(['Administrator'])
	)
	async gg(
		interaction: CommandInteraction
	) {
		ggInfoEmbed(interaction, 'GG Command for testing only...')
	}

}
