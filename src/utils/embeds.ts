import { type CommandContext, Embed } from "seyfert";

export const Embeds = {
	successEmbed(title: string, description?: string): Embed {
		return new Embed()
			.setTitle(title)
			.setDescription(description)
			.setColor("Green");
	},
	errorEmbed(title: string, description?: string): Embed {
		return new Embed()
			.setTitle(title)
			.setDescription(description)
			.setColor("Red");
	},

	noPermissionsEmbed(): Embed {
		return new Embed()
			.setColor("Red")
			.setTitle("🚫 Acceso Denegado")
			.setDescription("No tienes permiso para usar este comando.");
	},

	suggestionEmbed(ctx: CommandContext, suggestion: string): Embed {
		return new Embed()
			.setTitle(`**NUEVA SUGERENCIA**`)
			.setThumbnail(ctx.author.avatarURL())
			.setDescription(
				`<@${ctx.author.id}> ha enviado una nueva sugerencia.` +
					`\n\n` +
					`**Sugerencia:**` +
					`\n\n` +
					`${suggestion}`,
			)
			.setAuthor({
				name: "Sugerencia registrada con exito",
				iconUrl: ctx.author.avatarURL(),
			});
	},
};
