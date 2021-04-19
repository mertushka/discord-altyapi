const Discord = require('discord.js');
const client = new Discord.Client();
const PluginManager = require("plugincord");

const manager = new PluginManager(client);

manager.start("src/plugins");

client.login("TOKEN");