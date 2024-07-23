const tmi = require("tmi.js-reply-fork");
const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

const axios = require("axios");
const url = "http://10.6.0.2:20727/json";
const instance = axios.create();
instance.defaults.timeout = 2500;

const client = new tmi.Client({
  options: { debug: true, messagesLogLevel: "info" },
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: "",
    password: "",
  },
  channels: ["netamaru"],
});

const bot = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS] });

function sendToDiscord(message, tags) {
  const text = `${tags["display-name"]}: \`${message}\``;
  const embed = new MessageEmbed()
    .setColor("PURPLE")
    .setTitle(text)
    .setDescription(
      `<t:${~~(Date.now() / 1000)}:t> | <t:${~~(Date.now() / 1000)}:R>`
    );
  bot.channels.cache.get("").send({ embeds: [embed] });
}

client.connect().catch(console.error);
client.on("message", (channel, tags, message, self) => {
  sendToDiscord(message, tags);

  if (self) return;

  if (message.toLowerCase() === "!roll" || message.toLowerCase() === "!rolls") {
    client.reply(
      channel,
      `${tags["display-name"]} rolls ${~~(Math.random() * 99 + 1)}`,
      tags
    );
  }

  if (message.toLowerCase() === "!skin") {
    client.reply(channel, `Skin: https://l.netamaru.id/skin`, tags);
  }

  if (message.toLowerCase() === "!np" || message.toLowerCase() === "!map") {
    instance
      .get(url)
      .then((res) => {
        if (res.data.mapDiff === undefined)
          return client.reply(
            channel,
            `Netamaru is currently not playing osu!`,
            tags
          );
        client.reply(
          channel,
          `${res.data.mapArtistTitle} ${res.data.mapDiff} => ${res.data.dl}`,
          tags
        );
      })
      .catch((err) => {
        client.reply(channel, `Netamaru is currently not playing osu!`, tags);
      });
  }

  if (message.toLowerCase() === "!mod" || message.toLowerCase() === "!pp") {
    instance
      .get(url)
      .then((res) => {
        if (res.data.mods === undefined)
          return client.reply(
            channel,
            `Netamaru is currently not playing osu!`,
            tags
          );
        client.reply(
          channel,
          `Mod(s):${res.data.mods} || ${res.data.ppIfMapEndsNow}pp(current) || ${res.data.ppIfRestFced}pp(if FC)`,
          tags
        );
      })
      .catch((err) => {
        client.reply(channel, `Netamaru is currently not playing osu!`, tags);
      });
  }
});

bot.login("");
