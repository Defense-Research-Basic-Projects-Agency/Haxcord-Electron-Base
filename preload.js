// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
let ejs = require('ejs')
let fs = require('fs')
let store = require('store')
var Haxcord = require('./scripts/haxcord.js')
var hax = new Haxcord();

if (!store.get('logins')) store.set('logins', {})

var handlers = {
  tokenInput: {
    id: 'token',
    event: 'click',
    handler: authorize,
    fields: {
      token: 'tokenInput'
    }
  }
}

var sessions = {
  clients: {}
}
function switchView(options, handlers)
{
  ejs.renderFile('views/index.ejs', options, {}, function (err, str) {

    if (err) {
      console.log(err)
      return;
    }
    document.write(str);

    if (handlers)
    {
      for (f in handlers.tokenInput.fields)
      {
        handlers.tokenInput.fields[f] = document.getElementById(handlers.tokenInput.fields[f])
      }
      document.getElementById(handlers.tokenInput.id).addEventListener(handlers.tokenInput.event, () => { handlers.tokenInput.handler(handlers.tokenInput.fields.token.value, event) })
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {

switchView({
  page: 'loading',
})

  var last = store.get('lastLogin')
  if (last)
  {
    authorize(store.get('logins')[last].token)
  }
  else
    switchView({
      page: 'login',
      handlers: handlers.tokenInput,
      logins: store.get('logins'),
    })
})

function authorize(token)
{
  hax.login(token).then(client => {

    var logins = store.get('logins')
    if (!logins) {
      logins = {}
    }
    logins[client.user.id] = {
      token: token,
      tag: client.user.tag
    }
    sessions.clients[client.user.id] = client
    sessions.selected = client;

    store.set('lastLogin', client.user.id)
    store.set('logins', logins)

    sessions.views[client.user.id] = ejs.compile(fs.readFileSync(__dirname + '/views/index.ejs', 'utf8'));
    document.write(sessions.views[sessions.selected.user.id]({
      page: __dirname + '/views/main.ejs'
    }))
  })
  .catch(e => {
    console.log(e);
  })

}
