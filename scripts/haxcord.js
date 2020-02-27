const Discord = require('discord.js');
var moment = require('moment')

class Haxcord {
  constructor() {
    this.clients = []
    this.listeners = {}
  }

  login(token)
  {
    var hax = this;
    return new Promise( (resolve, reject) => {
      var discord = new Discord.Client();

      discord.login(token).catch(e => {
        reject(e);


      });


      discord.on('ready', () => {

        //discord.user.setActivity(`Haxcord - [weaponize your experience]`, {url: 'https://trapan.net', type: "PLAYING"});
        //discord.user.setActivity(`this won't appear in the bot's custom status!`, {type: 4})
        function setStatus() {

          let expiration = "2020-03-14"
          const now = moment();
          const exp = moment(expiration);
          var left = {}
          left.days = exp.diff(now, 'days');
          left.hours = exp.subtract(left.days, 'days').diff(now, 'hours');
          left.minutes = exp.subtract(left.hours, 'hours').diff(now, 'minutes');

          const sin = moment(new Date("2020-02-23 14:00:00"));
          var since = {}
          since.days = now.diff(sin, 'days');
          since.hours = now.subtract(since.days, 'days').diff(sin, 'hours');
          since.minutes = now.subtract(since.hours, 'hours').diff(sin, 'minutes');

          var text = [
            `who are those shadow guys, have I seen that type of enemy?`,
          ]
          fetch('https://discordapp.com/api/v6/users/@me/settings', {
            'headers': {
              'Authorization': discord.token,
              'Content-Type': 'application/json'
            },
            'method': 'PATCH',
            'body': JSON.stringify({
              "custom_status" : {
                "text" : `Doing better for ${since.days > 0 ? since.days+"d, " : ""}${since.hours}h, ${since.minutes}m.\n ~${text[Math.floor((text.length-1)*Math.random())]}`,
                "emoji_id":"680512750400700538",
                "emoji_name":"vore"
              }
            })
          }).then(r => {
            return r.json()
          }).then(json => {
            console.log(json)
          }).catch(e => {
            console.log(e)
          })
        }
        setStatus();
        setInterval(setStatus, 60 * 1000)

        resolve(discord);
      })

      discord.on('message', (msg) => {
        // create and dispatch the event
        if (hax.listeners['message'])
          hax.listeners['message'](msg);
      })
      discord.on('guildDelete', (msg) => {
        // create and dispatch the event
        if (hax.listeners['guildDelete'])
          hax.listeners['guildDelete'](msg);
      })
    })
  }
  on(type, callback)
  {
    this.listeners[type] = callback;
  }
}
module.exports = Haxcord
