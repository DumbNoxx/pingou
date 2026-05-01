import {
	Command,
	type CommandContext,
	createIntegerOption,
	createUserOption,
	Declare,
	Middlewares,
	Options,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { CONFIG } from "../../config/config";
import { reputationService } from "../../services/reputationService";
import { Embeds } from "../../utils/embeds";

const options = {
	usuario: createUserOption({
		description: "Usuario al que agregar reputación",
		required: true,
	}),
	cantidad: createIntegerOption({
		description: "Cantidad de puntos a agregar (por defecto 1)",
		required: false,
		min_value: 1,
		max_value: 100,
	}),
};

@Declare({
	name: "add-rep",
	description: "Agrega puntos de reputación a un usuario",
	props: {
		requiredRoles: [
			CONFIG.ROLES.ADMIN,
			CONFIG.ROLES.MODERATOR,
			CONFIG.ROLES.HELPER,
		],
	},
})
@Options(options)
@Middlewares(["auth"])
export default class AddRepCommand extends Command {
	override async run(ctx: CommandContext<typeof options>) {
		const { usuario, cantidad: cantidadRaw = 1 } = ctx.options;
		const guildId = ctx.guildId;
		if (!guildId) return;

		if (usuario.bot) {
			return ctx.write({
				embeds: [Embeds.errorEmbed("Error", "No podés darle rep a un bot.")],
				flags: MessageFlags.Ephemeral,
			});
		}

		const userRoles = ctx.member?.roles.keys ?? [];
		const isAdmin =
			CONFIG.ROLES.ADMIN && userRoles.includes(CONFIG.ROLES.ADMIN);
		const cantidad = isAdmin ? cantidadRaw : 1;

		if (!isAdmin && cantidadRaw > 1) {
			await ctx.write({
				embeds: [
					Embeds.errorEmbed(
						"Sin permiso",
						"Solo los admins pueden dar más de 1 punto a la vez.",
					),
				],
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const { points, prevPoints, newRoles } =
			await reputationService.addRepAndCheckRoles(
				ctx.client,
				guildId,
				usuario.id,
				ctx.author.id,
				cantidad,
				"manual",
			);

		if (newRoles.length > 0) {
			const roleNames = await Promise.all(
				newRoles.map(async (roleId) => {
					try {
						const role = await ctx.client.roles.fetch(guildId, roleId);
						return role?.name ?? roleId;
					} catch {
						return roleId;
					}
				}),
			);
			ctx.client.messages
				.write(ctx.channelId, {
					embeds: [
						Embeds.repRoleUpEmbed({
							userId: usuario.id,
							roleNames,
							points,
						}),
					],
				})
				.catch(() => {});
		}

		if (CONFIG.CHANNELS.REP_LOG) {
			ctx.client.messages
				.write(CONFIG.CHANNELS.REP_LOG, {
					content:
						`**${ctx.author.username}** le ha dado +${cantidad} rep al usuario: \`${usuario.username}\`` +
						` (Comando manual)` +
						`\n> *Puntos anteriores: ${prevPoints}. Puntos actuales: ${points}*`,
				})
				.catch(() => {});
		}

		await ctx.write({
			embeds: [
				Embeds.successEmbed(
					"Reputación agregada",
					`Se ${cantidad === 1 ? "agregó **1 punto**" : `agregaron **${cantidad} puntos**`} de reputación a <@${usuario.id}>.\nPuntos actuales: **${points}**${newRoles.length > 0 ? `\nNuevo rol: ${newRoles.map((r) => `<@&${r}>`).join(", ")}` : ""}`,
				),
			],
			flags: MessageFlags.Ephemeral,
		});
	}
}
