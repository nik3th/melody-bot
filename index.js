const { executionAsyncResource } = require('async_hooks');
const Discord = require('discord.js');
const { measureMemory } = require('vm');
const ytdl = require('ytdl-core');
const fs = require('fs')

const { YTSearcher } = require('ytsearcher');

const searcher = new YTSearcher({
    key: "AIzaSyAttsPHe2Ik1l3GXSGVwn_DTy3113lZnEo",
    revealed: true
});

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir("./commands/", (e, f) => {
    if(e) return console.error(e);
    f.forEach(file => {
        if(!file.endsWith(".js")) return
        console.log(`${file} has been loaded`)
        let cmd = require(`./commands/${file}`);
        let cmdName = cmd.config.name;
        client.commands.set(cmdName, cmd)
        cmd.config.aliases.forEach(alias => {
            client.aliases.set(alias, cmdName);
        })
    })
})



const queue = new Map();

client.on("ready", () => {
    console.log("I am online!")
})

client.on('ready', async () => {
    await client.user.setPresence({ game: { name: '*help' }, status: 'online' });
 });



client.on("message", async(message) => {
    const prefix = '*';

    if(!message.content.startsWith(prefix)) return
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

    if(!cmd) return

    try {
        cmd.run(client, message, args, queue, searcher);
    }catch (err){
        return console.error(err)
    }
        
})

client.on('message', (message) => {
    if (message.author.bot) return;
    const prefix = '*';
    if (message.content.startsWith(prefix))    {
        const [CMD_NAME, ...args] = message.content
            .trim()
            .substring(prefix.length)
            .split(/\s+/);
        
        if (CMD_NAME === 'help')    {
            
        const msg = new Discord.MessageEmbed()
        msg.setTitle("𝓶𝓮𝓵𝓸𝓭𝔂 𝓱𝓮𝓵𝓹");
        msg.addField("*play, pl <song name> - play song", "___________________________")
        msg.addField("*pause, ps - pause song", "___________________________")
        msg.addField("*resume, r, rs - resume song", "___________________________")
        msg.addField("*skip, s, sk - skip song (requires majority)", "___________________________")
        msg.addField("*fksip, fs, fsk - force skip song (requires [DJ] role)", "___________________________")
        msg.addField("*stop, kys, st - stop bot playing (clears queue)", "___________________________")
        msg.addField("*queue, q, quueueue - view current queue", "___________________________")
        msg.addField("*clear, c, ct - clear the current queue but bot stays in channel", "___________________________")
        msg.addField("*lyrics <artist name> - will be prompted for song name for lyrics", "___________________________")
        msg.addField("*loop <one/all/off> - choose the current loop", "___________________________")
        msg.addField("*socials - niketh's socials", "___________________________")
        msg.addField("*help - list of commands", "___________________________")
        msg.addField("developed by niketh", "___________________________")        
        msg.setColor("PURPLE");
        message.channel.send(msg);
        }
        else if (CMD_NAME === 'socials')   {
            message.channel.send(`discord: niketh #3666 (may change)
test discord: discord.gg/5xQx8HuShV
instagram: niketh.keshavan
snapchat: nikethhh`);
        }
       
    }
});

client.login("Nzk2NjE1NDg5NTc3MTU2NjI4.X_af_Q.10Y4ndIJsiTgeo0An3z6Go-ruik");