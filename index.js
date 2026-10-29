require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const path = require('path');

const TOKEN = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Bot connected as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.content === '!start') {
    const member = message.member;
    if (!member.voice.channel) {
      return message.reply('You need to be in a voice channel.');
    }

    const connection = joinVoiceChannel({
      channelId: member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    const resource = createAudioResource(path.join(__dirname, 'audio.mp3'));

    connection.subscribe(player);
    player.play(resource);

    message.reply('Jungle BOT activated!');

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });
  }

  if (message.content === '!stop') {
    const member = message.member;
    if (member.voice.channel) {
      const connection = joinVoiceChannel({
        channelId: member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });
      connection.destroy();
      message.reply('Bot disconnected.');
    }
  }
});

client.login(TOKEN);