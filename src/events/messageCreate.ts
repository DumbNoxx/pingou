import { createEvent } from "seyfert";
import { aiService } from "../services/ai";
import { cooldownService } from "../services/cooldown";
import { bumpService } from "../services/bumpService";
import { Embeds } from "../utils/embeds";

const DISBOARD_ID = "302050872383242240";

export default createEvent({
	data: { once: false, name: "messageCreate" },
	async run(message, client) {
		if (message.author.id === DISBOARD_ID) {
			await bumpService.handleBump(message);
			return;
		}

		if (message.author.bot) return;

		if (message.mentions.users.some((u) => u.id === client.me.id)) {
			const userId = message.author.id;
			const cooldownKey = "ai-mention";

			const currentCooldown = await cooldownService.getCooldown(
				userId,
				cooldownKey,
			);

			if (currentCooldown) {
				const remaining = Math.ceil(
					(currentCooldown.expiresAt.getTime() - Date.now()) / 1000,
				);
				return message.reply({
					embeds: [
						Embeds.errorEmbed(
							"Calma!",
							`Estás saturando la IA. Espera **${remaining} segundos** por favor.`,
						),
					],
				});
			}

			let contextLimit = 2;
			const content = message.content ?? "";
			const match = /contexto:\s*(\d+)/i.exec(content);
			if (match?.[1]) {
				contextLimit = Math.min(Number.parseInt(match[1], 10), 10);
			}

			const prevMessages = await aiService.getLatestMessages(
				client,
				message.channelId,
				contextLimit + 1,
				message.author.id,
			);

			if (!prevMessages) return;

			const promptMessages = [...prevMessages]
				.reverse()
				.map((m) => `${m.author.username}: ${m.content ?? ""}`);

			const { text, usage } = await aiService.chat(promptMessages);

			await cooldownService.setCooldown(userId, cooldownKey, 15);

			const embeds = Embeds.aiReplyEmbeds(text, usage);
			for (const embed of embeds) {
				await message.reply({ embeds: [embed] });
			}
		}
	},
});
