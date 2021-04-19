const fs = require('fs');
const { Collection } = require("discord.js");

module.exports = {
	name: "command-handler",
	run(client) {
		client.commands = new Collection();
		client.aliases = new Collection();
		client.cooldowns = new Collection();

		const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const command = require(`../commands/${file}`);

			if (!command.execute) {
				new Error(`[ERROR][COMMANDS]: 'execute' function is required for commands! (${file})`);
				process.exit();
			  }
	  
			  if (!command.name || command.name === "") {
				new Error(`[ERROR][COMMANDS]: 'name' is required for commands! (${file})`);
				process.exit();
			  }
	  
			  client.commands.set(command.name, command);
	  
			  command.aliases?.forEach((alias) => {
				client.aliases.set(alias, command.name);
			  });
	  
			  if (!client.cooldowns.has(command.name)) {
				client.cooldowns.set(command.name, new Collection());
			  }
			  delete require.cache[file];
		}
	},
};