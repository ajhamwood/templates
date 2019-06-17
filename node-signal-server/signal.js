const
  express = require('express'),
  router = express.Router();

function uuid () {
  var u = require('crypto').randomBytes(16);
  u[6] &= 0x0f | 0x40; u[8] &= 0xbf | 0x80;
  return u.reduce((a, x, i) => a + (~[4, 6, 8, 10].indexOf(i) ? '-' : '') + x.toString(16).padStart(2, 0), '')
}

router.ws('/', function (ws, req) {
  ws.on('message', function (msg) {
    let data, peer;
    try { data = JSON.parse(msg) }
    catch (e) { debugWs('JSON error: %O', e) }
    if (!data) return;
    if ('sessionDescription' in data) {
      debugWs('Message: %O', data.sessionDescription.type);
      if (data.sessionDescription.type == 'offer') {
        if (peer = peers.find(x => x.id == data.id && x.ws != ws)) {
          let wsself = peers.find(x => x.ws == ws);
          wsself.peer = peer.ws;
          data.id = wsself.id;
          peer.ws.send(JSON.stringify(data))
        }
      } else if (data.sessionDescription.type == 'answer') {
        if (peer = peers.find(x => x.peer == ws)) {
          data.id = peers.find(x => x.ws == ws).id;
          peer.ws.send(JSON.stringify(data));
          peer.peer = null
        }
      }
    } else if (data.type == 'register') {
      (peer = peers.find(x => x.ws == ws)).passphrase = data.plaintext
    } else if (data.type == 'passphrase') {
      if (peer = peers.find(x => x.passphrase == data.plaintext)) {
        debugWs('Passphrase: %s -> %s', id, peer.id);
        ws.send(JSON.stringify({type: 'register', id: peer.id}))
      } else ws.send(JSON.stringify({type: 'error'}))
    } else debug('%O', data)
  });

  ws.on('close', function (e) {
    debugWs('Close: %s %O', id, e);
    peers = peers.filter(x => x.ws != ws)
  });

  let id = uuid();
  debugWs('Open: %s', id);
  peers.push({ ws, id, peer: null, passphrase: null });
  ws.send(JSON.stringify({type: 'connect', id}))
});

module.exports = router
