module.exports = {
	name: 'message',
	execute(message) {
	if (message.author.bot) return;
	if (!message.guild) return;

	const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const serverPrefix = "!";
	const prefix = new RegExp(`^(<@!?${message.client.user.id}>|${escapeRegex(serverPrefix)})\\s*`);

	if (!prefix.test(message.content) || message.author.id === message.client.user.id) return;

	const [, matchedPrefix] = message.content.match(prefix);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
	const cooldowns = message.client.cooldowns;
	const commandName = args.shift().toLowerCase();

    const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = command.cooldown * 1000;

    if (command.ownerOnly && message.author.id !== message.client.config.ownerID) return message.reply("Only owner can use it.");

	if (command.args && !args.length) {
		let reply = `You did not specify an argument!`;

		if (command.usage) {
			reply += `\nUsage: \`${dbguild.prefix}${command.name} ${command.usage}\``;
		}

		return message.reply(reply);
	}

	if (timestamps.has(message.author.id)) {
		const expTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expTime) {
			const timeleft = (expTime - now) / 1000;
			return message.reply(
				`please wait ${timeleft.toFixed(1)} seconds before you can use the ${command.name} command.`
			);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
        command.execute(message.client, message, args);
	} catch (error) {
	message.reply('An error occurred while running the command, please contact the developers.')
	console.error(error);
	}
	},
};