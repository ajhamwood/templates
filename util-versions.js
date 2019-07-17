// TODO: generate utils from form
// TODO: removeEventListener for EventTargets

(() => {
  // 11 sloc: DOM events + basic custom events
  var $ = Object.assign((sel, node = document) => [...node.querySelectorAll(sel).values()], {
    Machine: function (state) {
      let es = {}, v = Object.values, r = Promise.resolve.bind(Promise); Object.seal(state);
      return Object.assign(this, {
        state () { return state },
        on (t, fn) { (es[t] = es[t] || {})[fn.name] = fn; return this },
        stop (t, fname = '') { t in es && delete es[t][fname] && v(es[t]).length || delete es[t]; return this },
        emit (t, ...args) { return t in es && v(es[t]).reduce((s, fn) => (fn.apply(s, args), s), state) },
    queries (obj, root) {
      for (let q in obj) { let ns = q ? $(q, root) : [window, document]; for (let ts in obj[q])
        ts.split(' ').forEach(t => ns.forEach(n => n.addEventListener(t, obj[q][e].bind(n)))) } } });
})()

(() => {
  // 12 sloc: DOM events + async custom events
  var $ = Object.assign((sel, node = document) => [...node.querySelectorAll(sel).values()], {
    Machine: function (state) {
      let es = {}, v = Object.values, r = Promise.resolve.bind(Promise); Object.seal(state);
      return Object.assign(this, {
        state () { return state },
        on (t, fn) { (es[t] = es[t] || {})[fn.name] = fn; return this },
        stop (t, fname = '') { t in es && delete es[t][fname] && v(es[t]).length || delete es[t]; return this },
        emit (t, ...args) { return t in es && v(es[t]).reduce((s, fn) => (fn.apply(s, args), s), state) },
        emitAsync (t, ...args) { return t in es && v(es[t]).reduce((p, fn) => p.then(s => r(fn.apply(s, args)).then(() => s)), r(state)) } }) },
    queries (obj, root) {
      for (let q in obj) { let ns = q ? $(q, root) : [window, document]; for (let ts in obj[q])
        ts.split(' ').forEach(t => ns.forEach(n => n.addEventListener(t, obj[q][e].bind(n)))) } } });
})()

(() => {
  // 13 sloc: DOM + window events, async custom events
  var $ = Object.assign((sel, node = document) => [...node.querySelectorAll(sel).values()], {
    Machine: function (state) {
      let es = {}, v = Object.values, r = Promise.resolve.bind(Promise); Object.seal(state);
      return Object.assign(this, {
        state () { return state },
        on (t, fn) { (es[t] = es[t] || {})[fn.name] = fn; return this },
        stop (t, fname = '') { t in es && delete es[t][fname] && v(es[t]).length || delete es[t]; return this },
        emit (t, ...args) { return t in es && v(es[t]).reduce((s, fn) => (fn.apply(s, args), s), state) },
        emitAsync (t, ...args) { return t in es && v(es[t]).reduce((p, fn) => p.then(s => r(fn.apply(s, args)).then(() => s)), r(state)) } }) },
    queries (obj, root) {
      for (let q in obj) { let ns = q ? $(q, root) : [window, document]; for (let ts in obj[q])
        ts.split(' ').forEach(t => ns.forEach(n => n.addEventListener(t, obj[q][e].bind(n)))) } } });
})()

(() => {
  // 17 sloc: DOM + single EventTarget events, async custom events
  var $ = Object.assign((sel, node = document) => [...node.querySelectorAll(sel).values()], {
    Machine: function (state) {
      let es = {}, v = Object.values, r = Promise.resolve.bind(Promise); Object.seal(state);
      return Object.assign(this, {
        state () { return state },
        on (t, fn) { (es[t] = es[t] || {})[fn.name] = fn; return this },
        stop (t, fname = '') { t in es && delete es[t][fname] && v(es[t]).length || delete es[t]; return this },
        emit (t, ...args) { return t in es && v(es[t]).reduce((s, fn) => (fn.apply(s, args), s), state) },
        emitAsync (t, ...args) { return t in es && v(es[t]).reduce((p, fn) => p.then(s => r(fn.apply(s, args)).then(() => s)), r(state)) } }) },
    targets (obj, target = window) {
      for (let ts in obj) if (Function.prototype.isPrototypeOf(obj[ts])) {
        if (EventTarget.prototype.isPrototypeOf(target)) ts.split(' ').forEach(t => target.addEventListener(t, obj[ts].bind(target)));
        else if ($.Machine.prototype.isPrototypeOf(target)) ts.split(' ').forEach(t => target.on(t, obj[ts]))
      } else $.targets(obj[ts], target[ts]) },
    queries (obj, root) {
      for (let q in obj) { let ns = $(q, root); if (ns.length) for (let ts in obj[q])
        ts.split(' ').forEach(t => ns.forEach(n => n.addEventListener(t, obj[q][e].bind(n)))) } } });
})()

(() => {
  // 18 sloc: DOM + mass EventTarget events, async custom events
  var $ = Object.assign((sel, node = document) => [...node.querySelectorAll(sel).values()], {
    Machine: function (state) {
      let es = {}, v = Object.values, r = Promise.resolve.bind(Promise); Object.seal(state);
      return Object.assign(this, {
        state () { return state },
        on (t, fn) { (es[t] = es[t] || {})[fn.name] = fn; return this },
        stop (t, fname = '') { t in es && delete es[t][fname] && v(es[t]).length || delete es[t]; return this },
        emit (t, ...args) { return t in es && v(es[t]).reduce((s, fn) => (fn.apply(s, args), s), state) },
        emitAsync (t, ...args) { return t in es && v(es[t]).reduce((p, fn) => p.then(s => r(fn.apply(s, args)).then(() => s)), r(state)) } }) },
    targets (obj, target = window) {
      for (let ts in obj) if (Function.prototype.isPrototypeOf(obj[ts])) {
        if (EventTarget.prototype.isPrototypeOf(target)) ts.split(' ').forEach(t => target.addEventListener(t, obj[ts].bind(target)));
        else if ($.Machine.prototype.isPrototypeOf(target)) ts.split(' ').forEach(t => target.on(t, obj[ts]))
      } else if (ts in target) $.targets(obj[ts], target[ts]);
      else for (let k in target) if (k.match(new RegExp(`^${ts}$`))) $.targets(obj[ts], target[k]) },
    queries (obj, root) {
      for (let q in obj) { let ns = $(q, root); if (ns.length) for (let ts in obj[q])
        ts.split(' ').forEach(t => ns.forEach(n => n.addEventListener(t, obj[q][e].bind(n)))) } } });
})()

(() => {
  // 18 sloc: DOM + single EventTarget events, async custom events, single event queueing
  var $ = Object.assign((sel, node = document) => [...node.querySelectorAll(sel).values()], {
    Machine: function (state) {
      let es = {}, v = Object.values, r = Promise.resolve.bind(Promise); Object.seal(state);
      return Object.assign(this, {
        state () { return state },
        on (t, fn) { (es[t] = es[t] || {})[fn.name] = fn; return this },
        stop (t, fname = '') { t in es && delete es[t][fname] && v(es[t]).length || delete es[t]; return this },
        emit (t, ...args) { return t in es && v(es[t]).reduce((s, fn) => (fn.apply(s, args), s), state) },
        emitAsync (t, ...args) { return t in es && v(es[t]).reduce((p, fn) => p.then(s => r(fn.apply(s, args)).then(() => s)), r(state)) } }) },
    pipe: (ps => (p, ...fns) => ps[p] = (ps[p] || Promise.resolve()).then(fn))({}),
    targets (obj, target = window) {
      for (let ts in obj) if (Function.prototype.isPrototypeOf(obj[ts])) {
        if (EventTarget.prototype.isPrototypeOf(target)) ts.split(' ').forEach(t => target.addEventListener(t, obj[ts].bind(target)));
        else if ($.Machine.prototype.isPrototypeOf(target)) ts.split(' ').forEach(t => target.on(t, obj[ts]))
      } else $.targets(obj[ts], target[ts]) },
    queries (obj, root) {
      for (let q in obj) { let ns = $(q, root); if (ns.length) for (let ts in obj[q])
        ts.split(' ').forEach(t => ns.forEach(n => n.addEventListener(t, obj[q][e].bind(n)))) } } });
})()

(() => {
  // 18 sloc: DOM + single EventTarget events, async custom events, combining event queueing
  var $ = Object.assign((sel, node = document) => [...node.querySelectorAll(sel).values()], {
    Machine: function (state) {
      let es = {}, v = Object.values, r = Promise.resolve.bind(Promise); Object.seal(state);
      return Object.assign(this, {
        state () { return state },
        on (t, fn) { (es[t] = es[t] || {})[fn.name] = fn; return this },
        stop (t, fname = '') { t in es && delete es[t][fname] && v(es[t]).length || delete es[t]; return this },
        emit (t, ...args) { return t in es && v(es[t]).reduce((s, fn) => (fn.apply(s, args), s), state) },
        emitAsync (t, ...args) { return t in es && v(es[t]).reduce((p, fn) => p.then(s => r(fn.apply(s, args)).then(() => s)), r(state)) } }) },
    pipe: (ps => (p, ...fns) => ps[p] = (ps[p] || Promise.resolve()).then(() => Promise.all(fns.map(fn => fn()))))({}),
    targets (obj, target = window) {
      for (let ts in obj) if (Function.prototype.isPrototypeOf(obj[ts])) {
        if (EventTarget.prototype.isPrototypeOf(target)) ts.split(' ').forEach(t => target.addEventListener(t, obj[ts].bind(target)));
        else if ($.Machine.prototype.isPrototypeOf(target)) ts.split(' ').forEach(t => target.on(t, obj[ts]))
      } else $.targets(obj[ts], target[ts]) },
    queries (obj, root) {
      for (let q in obj) { let ns = $(q, root); if (ns.length) for (let ts in obj[q])
        ts.split(' ').forEach(t => ns.forEach(n => n.addEventListener(t, obj[q][e].bind(n)))) } } });
})()

(() => {
  // 19 sloc: DOM + single EventTarget events, async custom events, complex event queueing
  var $ = Object.assign((sel, node = document) => [...node.querySelectorAll(sel).values()], {
    Machine: function (state) {
      let es = {}, v = Object.values, r = Promise.resolve.bind(Promise); Object.seal(state);
      return Object.assign(this, {
        state () { return state },
        on (t, fn) { (es[t] = es[t] || {})[fn.name] = fn; return this },
        stop (t, fname = '') { t in es && delete es[t][fname] && v(es[t]).length || delete es[t]; return this },
        emit (t, ...args) { return t in es && v(es[t]).reduce((s, fn) => (fn.apply(s, args), s), state) },
        emitAsync (t, ...args) { return t in es && v(es[t]).reduce((p, fn) => p.then(s => r(fn.apply(s, args)).then(() => s)), r(state)) } }) },
    pipe: (ps => (p, ...ands) => ps[p] = (ps[p] || Promise.resolve()).then(() =>
      Promise.all(ands.map(ors => Array.prototype.isPrototypeOf(ors) ? Promise.race(ors.map(fn => fn())) : ors()))))({}),
    targets (obj, target = window) {
      for (let ts in obj) if (Function.prototype.isPrototypeOf(obj[ts])) {
        if (EventTarget.prototype.isPrototypeOf(target)) ts.split(' ').forEach(t => target.addEventListener(t, obj[ts].bind(target)));
        else if ($.Machine.prototype.isPrototypeOf(target)) ts.split(' ').forEach(t => target.on(t, obj[ts]))
      } else $.targets(obj[ts], target[ts]) },
    queries (obj, root) {
      for (let q in obj) { let ns = $(q, root); if (ns.length) for (let ts in obj[q])
        ts.split(' ').forEach(t => ns.forEach(n => n.addEventListener(t, obj[q][e].bind(n)))) } } });
})()

(() => {
  // 19 sloc: DOM + single EventTarget events, async custom events, single event queueing, import elements
  var $ = Object.assign((sel, node = document) => [...node.querySelectorAll(sel).values()], {
    Machine: function (state) {
      let es = {}, v = Object.values, r = Promise.resolve.bind(Promise); Object.seal(state);
      return Object.assign(this, {
        state () { return state },
        on (t, fn) { (es[t] = es[t] || {})[fn.name] = fn; return this },
        stop (t, fname = '') { t in es && delete es[t][fname] && v(es[t]).length || delete es[t]; return this },
        emit (t, ...args) { return t in es && v(es[t]).reduce((s, fn) => (fn.apply(s, args), s), state) },
        emitAsync (t, ...args) { return t in es && v(es[t]).reduce((p, fn) => p.then(s => r(fn.apply(s, args)).then(() => s)), r(state)) } }) },
    pipe: (ps => (p, ...fns) => ps[p] = (ps[p] || Promise.resolve()).then(fn))({}),
    targets (obj, target = window) {
      for (let ts in obj) if (Function.prototype.isPrototypeOf(obj[ts])) {
        if (EventTarget.prototype.isPrototypeOf(target)) ts.split(' ').forEach(t => target.addEventListener(t, obj[ts].bind(target)));
        else if ($.Machine.prototype.isPrototypeOf(target)) ts.split(' ').forEach(t => target.on(t, obj[ts]))
      } else $.targets(obj[ts], target[ts]) },
    queries (obj, root) {
      for (let q in obj) { let ns = $(q, root); if (ns.length) for (let ts in obj[q])
        ts.split(' ').forEach(t => ns.forEach(n => n.addEventListener(t, obj[q][e].bind(n)))) } },
    load (id, dest = 'body') { $(dest).forEach(n => n.appendChild(document.importNode($('template#' + id)[0].content, true))) } });
})()

(() => {
  // 21 sloc: DOM + single EventTarget events, async custom events, single event queueing, import and return elements
  var $ = Object.assign((sel, node = document) => [...node.querySelectorAll(sel).values()], {
    Machine: function (state) {
      let es = {}, v = Object.values, r = Promise.resolve.bind(Promise); Object.seal(state);
      return Object.assign(this, {
        state () { return state },
        on (t, fn) { (es[t] = es[t] || {})[fn.name] = fn; return this },
        stop (t, fname = '') { t in es && delete es[t][fname] && v(es[t]).length || delete es[t]; return this },
        emit (t, ...args) { return t in es && v(es[t]).reduce((s, fn) => (fn.apply(s, args), s), state) },
        emitAsync (t, ...args) { return t in es && v(es[t]).reduce((p, fn) => p.then(s => r(fn.apply(s, args)).then(() => s)), r(state)) } }) },
    pipe: (ps => (p, ...fns) => ps[p] = (ps[p] || Promise.resolve()).then(fn))({}),
    targets (obj, target = window) {
      for (let ts in obj) if (Function.prototype.isPrototypeOf(obj[ts])) {
        if (EventTarget.prototype.isPrototypeOf(target)) ts.split(' ').forEach(t => target.addEventListener(t, obj[ts].bind(target)));
        else if ($.Machine.prototype.isPrototypeOf(target)) ts.split(' ').forEach(t => target.on(t, obj[ts]))
      } else $.targets(obj[ts], target[ts]) },
    queries (obj, root) {
      for (let q in obj) { let ns = $(q, root); if (ns.length) for (let ts in obj[q])
        ts.split(' ').forEach(t => ns.forEach(n => n.addEventListener(t, obj[q][e].bind(n)))) } },
    load (id, dest = 'body') {
      let stamp = document.importNode($('template#' + id)[0].content, true);
      return $(dest).map(n => [...stamp.cloneNode(true).childNodes.values()].map(c => n.appendChild(c))) } });
})()

(() => {
  // 23 sloc: full utils object without removeEventListener
  var $ = Object.assign((sel, node = document) => [...node.querySelectorAll(sel).values()], {
    Machine: function (state) {
      let es = {}, v = Object.values, r = Promise.resolve.bind(Promise); Object.seal(state);
      return Object.assign(this, {
        state () { return state },
        on (t, fn) { (es[t] = es[t] || {})[fn.name] = fn; return this },
        stop (t, fname = '') { t in es && delete es[t][fname] && v(es[t]).length || delete es[t]; return this },
        emit (t, ...args) { return t in es && v(es[t]).reduce((s, fn) => (fn.apply(s, args), s), state) },
        emitAsync (t, ...args) { return t in es && v(es[t]).reduce((p, fn) => p.then(s => r(fn.apply(s, args)).then(() => s)), r(state)) } }) },
    pipe: (ps => (p, ...ands) => ps[p] = (ps[p] || Promise.resolve()).then(() =>
      Promise.all(ands.map(ors => Array.prototype.isPrototypeOf(ors) ? Promise.race(ors.map(fn => fn())) : ors()))))({}),
    targets (obj, target = window) {
      for (let ts in obj) if (Function.prototype.isPrototypeOf(obj[ts])) {
        if (EventTarget.prototype.isPrototypeOf(target)) ts.split(' ').forEach(t => target.addEventListener(t, obj[ts].bind(target)));
        else if ($.Machine.prototype.isPrototypeOf(target)) ts.split(' ').forEach(t => target.on(t, obj[ts]))
      } else if (ts in target) $.targets(obj[ts], target[ts]);
      else for (let k in target) if (k.match(new RegExp(`^${ts}$`))) $.targets(obj[ts], target[k]) },
    queries (obj, root) {
      for (let q in obj) { let ns = $(q, root); if (ns.length) for (let ts in obj[q])
        ts.split(' ').forEach(t => ns.forEach(n => n.addEventListener(t, obj[q][e].bind(n)))) } },
    load (id, dest = 'body') {
      let stamp = document.importNode($('template#' + id)[0].content, true);
      return $(dest).map(n => [...stamp.cloneNode(true).childNodes.values()].map(c => n.appendChild(c))) } });
})()

(() => {
  // 29 sloc: full utils object
  var $ = (wm => { let v = Object.values, r = Promise.resolve.bind(Promise),
      test = (obj, con) => obj.constructor === con || con.prototype.isPrototypeOf(obj),
      add = (k, t, fn, es = wm.get(k) || {}) => { remove(k, t, fn.name); k.addEventListener(t, (es[t] = es[t] || {})[fn.name] = fn); wm.set(k, es) },
      remove = (k, t, fname, es = wm.get(k)) => { if (es && t in es && fname in es[t]) {
        k.removeEventListener(t, es[t][fname]); delete es[t][fname] && v(es[t]).length || delete es[t] && v(es).length || wm.delete(k) } };
    return Object.assign((sel, node = document) => v(node.querySelectorAll(sel)), {
      Machine: function (state) { let es = {}; Object.seal(state);
        return Object.assign(this, {
          state () { return state },
          on (t, fn) { (es[t] = es[t] || {})[fn.name] = fn; return this },
          stop (t, fname = '') { t in es && delete es[t][fname] && v(es[t]).length || delete es[t]; return this },
          emit (t, ...args) { return t in es && v(es[t]).reduce((s, fn) => (fn.apply(s, args), s), state) },
          emitAsync (t, ...args) { return t in es && v(es[t]).reduce((p, fn) => p.then(s => r(fn.apply(s, args)).then(() => s)), r(state)) } }) },
      pipe: (ps => (p, ...ands) => ps[p] = (ps[p] || r()).then(() =>
        Promise.all(ands.map(ors => test(ors, Array) ? Promise.race(ors.map(fn => fn())) : ors()))))({}),
      targets (obj, target = window) {
        for (let ts in obj) if (test(obj[ts], Function)) { if (test(target, $.Machine)) ts.split(' ').forEach(t => target.on(t, obj[ts]));
          else if (test(target, EventTarget)) ts.split(' ').forEach(t => add(target, t, obj[ts].bind(target))) }
        else if (test(obj[ts], String)) { if (test(target, $.Machine)) ts.split(' ').forEach(t => target.stop(t, obj[ts]));
          else if (test(target, EventTarget)) ts.split(' ').forEach(t => remove(target, t, 'bound ' + obj[ts])) }
        else if (ts in target) $.targets(obj[ts], target[ts]);
        else for (let k in target) if (k.match(new RegExp(`^${ts}$`))) $.targets(obj[ts], target[k]) },
      queries (obj, root) {
        for (let q in obj) { let ns = $(q, root); if (ns.length) for (let ts in obj[q])
          if (test(obj[q][ts], Function)) ts.split(' ').forEach(t => ns.forEach(n => add(n, t, obj[q][ts].bind(n))));
          else if (test(obj[q][ts], String)) ts.split(' ').forEach(t => ns.forEach(n => remove(n, t, 'bound ' + obj[q][ts]))) } },
      load (id, dest = 'body') {
        let stamp = document.importNode($('template#' + id)[0].content, true);
        return $(dest).map(n => v(stamp.cloneNode(true).childNodes).map(c => n.appendChild(c))) } }) })(new WeakMap());
})()
