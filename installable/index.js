// Utilities
var $ = (wm => { let v = Object.values, r = Promise.resolve.bind(Promise),
    test = (obj, con) => obj.constructor === con || con.prototype.isPrototypeOf(obj),
    add = (k, t, fn, es = wm.get(k) || {}) => { remove(k, t, fn.name); k.addEventListener(t, (es[t] = es[t] || {})[fn.name] = fn); wm.set(k, es) },
    remove = (k, t, fname, es = wm.get(k)) => { if (es && t in es && fname in es[t]) {
      k.removeEventListener(t, es[t][fname]); delete es[t][fname] && (v(es[t]).length || delete es[t]) && (v(es).length || wm.delete(k)) } };

//   $ enhances querySelectorAll
  return Object.assign((sel, node = document) => v(node.querySelectorAll(sel)), {

//   $.Machine creates state machines for the page
    Machine: function (state) { let es = {}; Object.seal(state);
      return Object.assign(this, {
        state () { return state },
        on (t, fn) { (es[t] = es[t] || {})[fn.name] = fn; return this },
        stop (t, fname = '') { t in es && delete es[t][fname] && (v(es[t]).length || delete es[t]); return this },
        emit (t, ...args) { return t in es && v(es[t]).reduce((s, fn) => (fn.apply(s, args), s), state) },
        emitAsync (t, ...args) { return t in es && v(es[t]).reduce((p, fn) => p.then(s => r(fn.apply(s, args)).then(() => s)), r(state)) } }) },

//   $.pipe manages async event chronology
    pipe: (ps => (p, ...ands) => ps[p] = (ps[p] || r()).then(() => Promise.all(ands.map(ors =>
      test(ors, Array) && Promise.race(ors.map(fn => fn())) || test(ors, Function) && ors()))))({}),

//   $.targets recursively adds event listeners to objects and removes them by name, indexed by regex
    targets (obj, target = window) {
      for (let ts in obj) if (test(obj[ts], Function)) { if (test(target, $.Machine)) ts.split(' ').forEach(t => target.on(t, obj[ts]));
        else if (test(target, EventTarget)) ts.split(' ').forEach(t => add(target, t, obj[ts].bind(target))) }
      else if (test(obj[ts], String)) { if (test(target, $.Machine)) ts.split(' ').forEach(t => target.stop(t, obj[ts]));
        else if (test(target, EventTarget)) ts.split(' ').forEach(t => remove(target, t, 'bound ' + obj[ts])) }
      else if (ts in target) $.targets(obj[ts], target[ts]);
      else for (let k in target) if (k.match(new RegExp(`^${ts}$`))) $.targets(obj[ts], target[k]) },

//   $.queries adds event listeners to DOM nodes and removes them by name, indexed by selector
    queries (obj, root) {
      for (let q in obj) { let ns = $(q, root); if (ns.length) for (let ts in obj[q])
        if (test(obj[q][ts], Function)) ts.split(' ').forEach(t => ns.forEach(n => add(n, t, obj[q][ts].bind(n))));
        else if (test(obj[q][ts], String)) ts.split(' ').forEach(t => ns.forEach(n => remove(n, t, 'bound ' + obj[q][ts]))) } },

//   $.load enhances importNode
    load (id, dest = 'body') {
      let stamp = document.importNode($('template#' + id)[0].content, true);
      return $(dest).map(n => v(stamp.cloneNode(true).childNodes).map(c => n.appendChild(c))) } }) })(new WeakMap());


// Example app

var app = new $.Machine({});

$.targets({
  app: {
    update () { // Use whenever appropriate to check for an update
      return pwa.emitAsync('check-update')
        .then(console.log)
        .catch(console.log)
    }
  }
});


// PWA

var pwa = new $.Machine({
      version: null,
      allowUpdate: true,
      finaliseUpdate: null,
      a2hsPrompt: null
    });

$.targets({

  // Common functionality

  app: {
    notification (obj) {
      let note = $.load('notification', '#notifications')[0][0];
      $('div', note)[0].textContent = obj.text;
      note.id = obj.type;
      $('button', note).forEach(el => {
        let which = el.id,
            fnPair = Object.entries(obj.handlers).find(p => p[1].name === which);
        el.textContent = fnPair[0];
        el.id = obj.type + '-' + which;
        $.queries({ ['button#' + el.id]: { click (e) {
          note.remove();
          fnPair[1].bind(this)(e)
        } } }, note)
      })
    },
    debug (data) { $('.debug')[0].textContent = data.version }
  },

  // Window events

  load () {
    // TODO: Convert skipWaiting to purely client triggered
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js')
      .then(() => pwa.emitAsync('debug'))
  },

  beforeinstallprompt (e) {
    e.preventDefault();
    if (sessionStorage.suppressA2hs) return false;
    pwa.emit('deferA2hs', e);
    app.emit('notification', {
      type: 'install',
      text: 'Add to home screen / desktop?',
      handlers: {
        OK: function ok () {
          sessionStorage.suppressA2hs = true;
          pwa.emit('a2hs')
        },
        Cancel: function cancel () { sessionStorage.suppressA2hs = true }
      }
    })
  },

  // ServiceWorker events

  navigator: { serviceWorker: { controllerchange () { pwa.emit('update') } } },

  // PWA events

  pwa: {
    deferA2hs (e) { this.a2hsPrompt = e },
    a2hs () {
      this.a2hsPrompt.prompt();
      this.a2hsPrompt.userChoice.then(() => this.a2hsPrompt = null)
    },

    'check-update' () {
      return this.allowUpdate ?
        navigator.serviceWorker.ready.then(reg => reg.update())
          .then(() => this.allowUpdate = false)
          .then(() => new Promise(r => setTimeout(this.finaliseUpdate = r, 1e3))) :
        Promise.reject('Update checks exceed rate limit')
    },
    update () {
      this.finaliseUpdate && this.finaliseUpdate();
      app.emit('notification', {
        type: 'update',
        text: 'New update available!',
        handlers: {
          Refresh: function ok () { location.reload() },
          Dismiss: function cancel () {}
        }
      })
    },

    debug () { // BUG: Cannot recover from Ctrl-F5
      let recover;
      return $.pipe('debug', () => new Promise((resolve, reject) => this.version === null ? reject() : resolve())
        .catch(recover = () => fetch('/version')
          .then(res => res.status === 404 ?
            pwa.emitAsync('check-update').then(recover) :
            res.text().then(ver => Object.assign(this, { version: ver, allowUpdate: false }))))
        .then(() => /-dev$/.test(this.version) && app.emit('debug', {version: this.version}))
        .then(() => pwa.emit('scheduler')))
    },
    scheduler () { // Check for updates every hour on the hour, every minute in development mode
      let check = () => ((this.allowUpdate = true), check);
      /-dev$/.test(this.version) ?
        setTimeout(() => setInterval(check(), 6e4), 6e4 - Date.now() + new Date().setSeconds(0, 0)) :
        setTimeout(() => setInterval(check(), 3.6e6), 3.6e6 - Date.now() + new Date().setMinutes(0, 0, 0));
      pwa.stop('scheduler')
    },
    uninstall () {
      navigator.serviceWorker.ready.then(reg => reg.unregister());
      caches.delete('offline')
    }
  }
})
