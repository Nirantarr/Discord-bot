// Require the discord.js module
const { Client,  GatewayIntentBits } = require('discord.js');
const prefix = '!';
const verificationRoleName = 'Unverified';
// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildMessages  ]
  });

// When the client is ready, run this code
// This event will only trigger one time after logging in
client.once('ready', () => {
    console.log('Ready!');
});

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);

// Listen for new members joining the server
  client.on('guildMemberAdd', async member => {
    // Send a welcome message to the member's default channel
    member.guild.systemChannel.send(`Hello, ${member.user.username}! Welcome to the Brew block channel.`);
    // const verificationRole = member.guild.roles.cache.find(role => role.name === verificationRoleName);
    // member.roles.add(verificationRole);
    const verificationRole = member.guild.roles.cache.find(role => role.name === verificationRoleName);
    if (verificationRole) {
      try {
        await member.roles.add(verificationRole);
      } catch (error) {
        console.error(`Failed to add the "${verificationRoleName}" role to ${member.displayName}: ${error}`);
      }
    } else {
      console.error(`The role "${verificationRoleName}" does not exist!`);
    }
  });
 

  client.on('guildMemberRemove', (member) => {
    const channel = member.guild.channels.cache.find(channel => channel.name === 'general');
    if (!channel) return;
    channel.send(`Goodbye ${member.user.username}! We will miss you.`);
  });

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
  
    const inappropriateWords = ['fk', 'badword', 'scam'];
  
    const isBadWordUsed = inappropriateWords.some(word => message.content.toLowerCase().includes(word.toLowerCase()));
  
    if (isBadWordUsed) {
      // Warn the user and delete the message
      message.delete();
      message.author.send(`Please refrain from using inappropriate language, ${message.author.username}!`);
    }
  });


  client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
  
    if (command === 'verify') {
      const verificationRole = message.guild.roles.cache.find(role => role.name === verificationRoleName);
      if (!verificationRole) {
        return console.error(`The role "${verificationRoleName}" does not exist!`);
      }
      if (!message.member.roles.cache.has(verificationRole.id)) {
        return message.reply('You have already been verified!');
      }
      try {
        await message.member.roles.remove(verificationRole);
        message.reply('You have been verified! Welcome to the server.');
      } catch (error) {
        console.error(`Failed to remove the "${verificationRoleName}" role from ${message.member.displayName}: ${error}`);
      }
    }
  });