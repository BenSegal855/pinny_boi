const { Client } = require('discord.js');
const { token, pins, invite } = require('./config.json');

const bot = new Client();
bot.login(token);

bot.once('ready', async () => {
	bot.user.setActivity('for pins', { type: 'WATCHING' })
	for (const channel of bot.channels.cache.array()) {
		if (channel.isText() && channel.viewable) {
			await channel.messages.fetch();
		}
	}
	console.log(`Pinny Boi is ready in ${bot.guilds.cache.size} guilds!`);
});

bot.on('messageReactionAdd', reaction => {
	if (!pins.includes(reaction.emoji.name)
		|| reaction.message.pinned) return;
	reaction.message.pin();
});

bot.on('messageReactionRemove', reaction => {
	if (!pins.includes(reaction.emoji.name)
		|| reaction.count !== 0
		|| !reaction.message.pinned) return;

	reaction.message.unpin();
});

bot.on('messageReactionRemoveAll', msg => {
	if (msg.pinned) msg.unpin();
})

bot.on('messageReactionRemoveEmoji', reaction => {
	if (!pins.includes(reaction.emoji.name)
		|| !reaction.message.pinned) return;

	reaction.message.unpin();
})

bot.on('message', msg => {
	if (msg.author.id === bot.user.id && msg.system) msg.delete();

	if (msg.mentions.has(bot.user)) msg.reply(`Get ${bot.user.username} in your own server\n${invite}`)
})
