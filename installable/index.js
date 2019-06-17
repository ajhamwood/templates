// Utilities
//   $ enhances querySelectorAll
var $ = Object.assign((sel, node = document) => [...node.querySelectorAll(sel).values()], {

//   $.Machine creates state machines for the page
  Machine: function (state) {
    let es = {}, v = Object.values, r = Promise.resolve.bind(Promise); Object.seal(state);
    return Object.assign(this, {
      getState () { return state },
      on (e, fn) { (es[e] = es[e] || {})[fn.name] = fn; return this },
      stop (e, fname = '') { e in es && delete es[e][fname]; return this },
      emit (e, ...args) { return e in es && v(es[e]).reduce((s, fn) => (fn.apply(s, args), s), state) },
      emitAsync (e, ...args) { return e in es && v(es[e]).reduce((p, fn) => p.then(s => r(fn.apply(s, args)).then(() => s)), r(state)) } }) },

//   $.pipe manages event chronology
  pipe: (ps => (p, ...ands) => ps[p] = (ps[p] || Promise.resolve()).then(() =>
    Promise.all(ands.map(ors => Array.prototype.isPrototypeOf(ors) ? Promise.race(ors.map(fn => fn())) : ors()))))({}),

//   $.targets recursively adds event listeners to objects, indexed by regex
  targets (obj, target = window) {
    let p, use = (m, fn) => { for (let es = p.split(' '), i = 0; i < es.length; i++) target[m](es[i], fn) };
    for (p in obj) if (Function.prototype.isPrototypeOf(obj[p])) {
      if (EventTarget.prototype.isPrototypeOf(target)) use('addEventListener', obj[p].bind(target));
      else if ($.Machine.prototype.isPrototypeOf(target)) use('on', obj[p])
    } else if (p in target) $.targets(obj[p], target[p]);
    else for (let k in target) if (k.match(new RegExp(`^${p}$`))) $.targets(obj[p], target[k]) },

//   $.queries adds event listeners to DOM nodes, indexed by selector
  queries (obj, node) {
    for (let q in obj) for (let e in obj[q]) for (let ns = $(q, node) || [], es = e.split(' '), i = 0; i < es.length; i++)
      ns.forEach(n => n.addEventListener(es[i], obj[q][e].bind(n))) },

//   $.load enhances importNode
  load (id, dest = 'body') {
    let stamp = document.importNode($('template#' + id)[0].content, true);
    return $(dest).map(n => [...stamp.cloneNode(true).childNodes.values()].map(c => n.appendChild(c))) } });


// Example app
var example = new $.Machine({});

$.targets({
  example: {
    start () { pwa.emit('check-update') } // Use whenever appropriate to check for an update
  }
});


// Common functionality

var app = new $.Machine({})
  .on('notification', function (obj) {
    let note = $.load('notification', '#notifications')[0][0];
    $('div', note)[0].textContent = obj.text;
    note.id = obj.type;
    $('button', note).forEach(el => {
      let which = el.id;
      el.textContent = obj[which + 'Text'];
      el.id = obj.type + '-' + which;
      $.queries({ ['button#' + el.id]: { click (e) {
        note.remove();
        obj[which + 'Handler'].bind(this)(e)
      } } }, note)
    })
  })
  .on('debug', function (data) { $('.debug')[0].textContent = data.version });


// PWA functionality

var pwa = new $.Machine({
  version: null,
  swReady: false,
  allowUpdate: false,
  a2hsPrompt: null
});

$.targets({

  // Window events

  load () {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js')
      .then(reg => this.swReady = !reg.installing)
      .then(() => pwa.emitAsync('debug')).then(() => {
        // Check for updates every hour on the hour, every minute in development mode
        let check = () => ((this.allowUpdate = true), check);
        /-dev$/.test(this.version) ?
          setTimeout(() => setInterval(check(), 6e4), 6e4 - Date.now() + new Date().setSeconds(0, 0)) :
          setTimeout(() => setInterval(check(), 3.6e6), 3.6e6 - Date.now() + new Date().setMinutes(0, 0, 0))
      })
  },

  beforeinstallprompt (e) {
    e.preventDefault();
    if (sessionStorage.suppressA2hs) return false;
    pwa.emit('deferA2hs', e);
    app.emit('notification', {
      type: 'install',
      text: 'Add to home screen / desktop?',
      okText: 'OK',
      cancelText: 'Cancel',
      okHandler (e) {
        sessionStorage.suppressA2hs = true;
        pwa.emit('a2hs')
      },
      cancelHandler () { sessionStorage.suppressA2hs = true }
    })
  },

  // ServiceWorker events

  navigator: { serviceWorker: { controllerchange (e) { pwa.emit('update') } } },

  // PWA events

  pwa: {
    deferA2hs (e) { this.a2hsPrompt = e },
    a2hs () {
      this.a2hsPrompt.prompt();
      this.a2hsPrompt.userChoice.then(() => this.a2hsPrompt = null)
    },

    'check-update' () {
      if (this.allowUpdate) navigator.serviceWorker.ready.then(reg => reg.update())
        .then(() => this.allowUpdate = false)
    },
    update () {
      if (this.swReady) app.emit('notification', {
        type: 'update',
        text: 'New update available!',
        okText: 'Refresh',
        cancelText: 'Dismiss',
        okHandler (e) { location.reload() },
        cancelHandler () {}
      });
      this.swReady = true
    },

    debug () { // BUG: Cannot recover from Ctrl-F5
      let recover;
      return $.pipe('debug', () => new Promise((resolve, reject) => this.version === null ? reject() : resolve())
        .catch(recover = () => fetch('/version')
          .then(res => res.status === 404 ? recover() : res.text().then(ver => this.version = ver)))
        .then(() => /-dev$/.test(this.version) && app.emit('debug', {version: this.version})))
    }
  }
})
