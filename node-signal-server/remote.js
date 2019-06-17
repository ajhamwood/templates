var Remote = (function () {
  let _ = {};
  function Remote(uri) {
    _.ws && _.ws.close();
    _ = { wsuri: uri }
  }

  Remote.prototype = {
    makeCall: function (pass) {
      return createWS.call(this).then(id => {
        _.ws.send(JSON.stringify({type: "register", id, plaintext: pass}));
        return new Promise(resolve => _.resolveCall = resolve)
      })
    },
    answerCall: function (pass) {
      return createWS.call(this).then(() => {
        _.ws.send(JSON.stringify({type: "passphrase", plaintext: pass}));
        return new Promise(resolve => _.resolveCall = resolve)
      })
    },
    postMessage: function (val) { _.conn.dc.send(val) },
    set onmessage (fn) { _.conn.dc.onmessage = fn },
    get onmessage () { return _.conn.dc.onmessage },
    close: function () { _.conn && _.conn.pc.close() },
    constructor: Remote
  };

  function unvendor (apiname) {
    return ["", "webkit", "moz", "ms", "o"].reduce((a, v) => a || window[v + apiname], null)
  }
  function createWS () {
    return new Promise((resolve, reject) => {
      let ws = _.ws = new WebSocket(_.wsuri);
      ws.onmessage = m => {
        let data = JSON.parse(m.data);
        if (data.type === "connect") resolve(_.id = data.id);
        else if (data.type === "register") {
          _.call_id = data.id;
          rtc.call(this)
        }
        else if (data.type === "error") reject("Passphrase failed");
        else if (data.sessionDescription.type === "offer") rtc.call(this, data.sessionDescription);
        else if (data.sessionDescription.type === "answer") {
          _.conn.pc.setRemoteDescription(new (unvendor("RTCSessionDescription"))(data.sessionDescription))
        }
      };
      ws.error = reject
    })
  }
  function rtc(desc) {
    let pc = new (unvendor("RTCPeerConnection"))( /*servers*/
      { iceServers: [{ urls: "stun:stun.l.google.com:19302" }]},
      { optional: [{ RtpDataChannels: false }] }
    );
    _.conn = { pc, dc: null };
    pc.onicecandidate = function (e) {
      e.candidate || _.ws.send( JSON.stringify({ id: _.call_id, sessionDescription: pc.localDescription }) )
    };
    pc.onconnectionstatechange = e => console.log(e);
    let dc_start = dc => {
      dc.onopen = () => {
        _.ws.close();
        _.resolveCall(this);
      }
      dc.onmessage = () => _resolveCall(this)
    };
    if (desc) {
      pc.ondatachannel = e => dc_start(_.conn.dc = e.channel || e);
      pc.setRemoteDescription(new (unvendor("RTCSessionDescription"))(desc))
        .then(() => pc.createAnswer())
        .then(ans => pc.setLocalDescription(ans));
    } else {
      dc_start(_.conn.dc = pc.createDataChannel('remotePort', {reliable: true}));
      pc.createOffer().then(desc => pc.setLocalDescription(desc))
    }
  }

  return Remote
})()
