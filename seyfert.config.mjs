import { config } from "seyfert";

export default config.bot({
	token: process.env.BOT_TOKEN,
	locations: {
		base: "src",
		commands: "commands",
	},
	intents: [
		"Guilds",
		"GuildMembers",
		"GuildModeration",
		"GuildExpressions",
		"GuildIntegrations",
		"GuildWebhooks",
		"GuildInvites",
		"GuildVoiceStates",
		"GuildPresences",
		"GuildMessages",
		"GuildMessageReactions",
		"GuildMessageTyping",
		"DirectMessages",
		"DirectMessageReactions",
		"DirectMessageTyping",
		"MessageContent",
		"GuildScheduledEvents",
		"AutoModerationConfiguration",
		"AutoModerationExecution",
		"GuildMessagePolls",
		"DirectMessagePolls",
	],
	publicKey: process.env.PUBLIC_KEY,
	port: process.env.PORT,
});
