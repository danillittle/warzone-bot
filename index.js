import Discord, { MessageEmbed } from "discord.js";
import api from "./api";
import humanizeDuration from "humanize-duration";

const client = new Discord.Client();
const prefix = "!";

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  await client.user.setActivity(
    `with about ${client.users.cache.size} users (${prefix}help)`
  );
  setInterval(() => {
    console.log(client.users.size);
    client.user.setActivity(`Call of Duty: Modern Warfare (${prefix}help)`);
  }, 60000 * 7);
});

client.on("message", async (msg) => {
  if (msg.author.bot || !msg.content.startsWith(prefix)) return;

  const commandBody = msg.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  if (command === "help") {
    const embed = new MessageEmbed()
      .setColor("BLACK")
      .setDescription("View Warzone player stats!")
      .addField(
        "Commands",
        [
          `\`${prefix}help\``,
          `\`${prefix}stat <platform> <gametag>\``,
          `\`${prefix}matches <platform> <gametag> <count>\``,
          // `\`${prefix}server (game|discord)\``,
          // `\`${prefix}ping\``,
          // `\`${prefix}punishments\``,
          // `\`${prefix}leaderboard (xp|kills|losses|wins)\``,
          // `\`${prefix}deaths\``,
        ].join("\n"),
        true
      )
      .addField(
        "Links",
        [
          "[Play with friends](https://discord.gg/qwypwN)",
          `[Invite the bot](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=2048&scope=bot)`,
          "[Warzone's website](https://warz.one)",
          "[Creator's website](https://monkey.link/danil_little)",
        ],
        true
      )
      .setFooter("Copyright 2020 © Danil Little");
    msg.channel.send({ embed });
  } else if (command === "stat") {
    try {
      const { data } = await api.stat(args[1].replace(/#/g, "%2523"), args[0]);
      if (data.error) {
        const embed = new MessageEmbed()
          .setTitle("FAIL!!!")
          .setColor("YELLOW")
          .setDescription(data.message);
        msg.channel.send(embed);
      } else {
        const { br } = data;
        const embed = new MessageEmbed()
          .setTitle(`${args[1]}'s statistics`)
          .setColor("GREEN")
          .setDescription(`Displaying **${args[1]}**'s Warzone statistics.`)

          .addField("Matches played", br.gamesPlayed, true)
          .addField("Wins", br.wins ? br.wins : "0", true)
          .addField(
            "Wins %",
            ((br.wins / br.gamesPlayed) * 100).toFixed(2),
            true
          )
          .addField("Kills", br.kills ? br.kills : "0", true)
          .addField("Deaths", br.deaths ? br.deaths : "0", true)
          .addField("K/D", br.kdRatio ? br.kdRatio.toFixed(2) : "0", true)
          .addField("Top 5", br.topFive ? br.topFive : "0", true)
          .addField("Top 10", br.topTen ? br.topTen : "0", true)
          .addField("Top 25", br.topTwentyFive ? br.topTwentyFive : "0", true);

        msg.channel.send(embed);
      }
    } catch (error) {
      console.error(error);
      const embed = new MessageEmbed()
        .setTitle("ERROR!!!")
        .setColor("RED")
        .setDescription("Undefined error.");
      msg.channel.send(embed);
    }
  } else if (command === "matches") {
    try {
      const { data } = await api.matches(args[1].replace(/#/g, "%2523"), args[0]);
      if (data.error) {
        const embed = new MessageEmbed()
          .setTitle("Sorry...")
          .setColor("ORANGE")
          .setDescription(data.message);
        msg.channel.send(embed);
      } else {
        const { matches } = data;
        for (let i = 0; i < args[2]; i++) {
          const match = matches[i];
          const embed = new MessageEmbed()
            .setTitle(`ID: ${match.matchID}`)
            .setColor("BLUE")
            .addField(
              "Team placement",
              match.playerStats.teamPlacement
                ? match.playerStats.teamPlacement
                : "0",
              true
            )
            .addField("Mode", match.mode, true)
            .addField(
              "Score",
              match.playerStats.score ? match.playerStats.score : "0",
              true
            )
            .addField(
              "Kills",
              match.playerStats.kills ? match.playerStats.kills : "0",
              true
            )
            .addField(
              "Damage",
              match.playerStats.damageDone ? match.playerStats.damageDone : "0",
              true
            )
            .addField(
              "Deaths",
              match.playerStats.deaths ? match.playerStats.deaths : "0",
              true
            );

          msg.channel.send(embed);
        }
      }
    } catch (error) {
      console.error(error);
      const embed = new MessageEmbed()
        .setColor("RED")
        .setDescription("Undefined error.");
      msg.channel.send(embed);
    }
  }
});

client.login(process.env.BOT_TOKEN);
