// TODO: generate utils from form
// TODO: removeEventListener for EventTargets

(() => {
  // 11 sloc: DOM events + basic custom events
  var $ = Object.assign((sel, node = document) => [...node.querySelectorAll(sel).values()], {
    Machine: function (state) {
      let es = {}, v = Object.values, r = Promise.resolve.bind(Promise); Object.seal(state);
      return Object.assign(this, {
        getState () { return state },
        on (e, fn) { (es[e] = es[e] || {})[fn.name] = fn; return this },
        stop (e, fname = '') { e in es && delete es[e][fname]; return this },
        emit (e, ...args) { return e in es && v(es[e]).reduce((s, fn) => (fn.apply(s, args), s), state) } }) },
    queries (obj, node) {
      for (let q in obj) for (let e in obj[q]) for (let ns = $(q, node) || [], es = e.split(' '), i = 0; i < es.length; i++)
        ns.forEach(n => n.addEventListener(es[i], obj[q][e].bind(n))) } });
})()

(() => {
  // 12 sloc: DOM events + async custom events
  var $ = Object.assign((sel, node = document) => [...node.querySelectorAll(sel).values()], {
    Machine: function (state) {
      let es = {}, v = Object.values, r = Promise.resolve.bind(Promise); Object.seal(state);
      return Object.assign(this, {
        getState () { return state },
        on (e, fn) { (es[e] = es[e] || {})[fn.name] = fn; return this },
        stop (e, fname = '') { e in es && delete es[e][fname]; return this },
        emit (e, ...args) { return e in es && v(es[e]).reduce((s, fn) => (fn.apply(s, args), s), state) },
        emitAsync (e, ...args) { return e in es && v(es[e]).reduce((p, fn) => p.then(s => r(fn.apply(s, args)).then(() => s)), r(state)) } }) },
    queries (obj, node) {
      for (let q in obj) for (let e in obj[q]) for (let ns = $(q, node) || [], es = e.split(' '), i = 0; i < es.length; i++)
        ns.forEach(n => n.addEventListener(es[i], obj[q][e].bind(n))) } });
})()

(() => {
  // 13 sloc: DOM + window events, async custom events
  var $ = Object.assign((sel, node = document) => [...node.querySelectorAll(sel).values()], {
    Machine: function (state) {
      let es = {}, v = Object.values, r = Promise.resolve.bind(Promise); Object.seal(state);
      return Object.assign(this, {
        getState () { return state },
        on (e, fn) { (es[e] = es[e] || {})[fn.name] = fn; return this },
        stop (e, fname = '') { e in es && delete es[e][fname]; return this },
        emit (e, ...args) { return e in es && v(es[e]).reduce((s, fn) => (fn.apply(s, args), s), state) },
        emitAsync (e, ...args) { return e in es && v(es[e]).reduce((p, fn) => p.then(s => r(fn.apply(s, args)).then(() => s)), r(state)) } }) },
    queries (obj, node) {
      for (var q in obj) for (var e in obj[q])
        for (var ns = q ? ($(q, node) || []) : [window, document], es = e.split(' '), i = 0; i < es.length; i++)
          ns.forEach(n => n.addEventListener(es[i], obj[q][e].bind(n))) } });
})()

(() => {
  // 18 sloc: DOM + single EventTarget events, async custom events
  var $ = Object.assign((sel, node = document) => [...node.querySelectorAll(sel).values()], {
    Machine: function (state) {
      let es = {}, v = Object.values, r = Promise.resolve.bind(Promise); Object.seal(state);
      return Object.assign(this, {
        getState () { return state },
        on (e, fn) { (es[e] = es[e] || {})[fn.name] = fn; return this },
        stop (e, fname = '') { e in es && delete es[e][fname]; return this },
        emit (e, ...args) { return e in es && v(es[e]).reduce((s, fn) => (fn.apply(s, args), s), state) },
        emitAsync (e, ...args) { return e in es && v(es[e]).reduce((p, fn) => p.then(s => r(fn.apply(s, args)).then(() => s)), r(state)) } }) },
    targets (obj, target = window) {
      let p, use = (m, fn) => { for (let es = p.split(' '), i = 0; i < es.length; i++) target[m](es[i], fn) };
      for (p in obj) if (Function.prototype.isPrototypeOf(obj[p])) {
        if (EventTarget.prototype.isPrototypeOf(target)) use('addEventListener', obj[p].bind(target));
        else if ($.Machine.prototype.isPrototypeOf(target)) use('on', obj[p])
      } else $.targets(obj[p], target[p]) },
    queries (obj, node) {
      for (let q in obj) for (let e in obj[q]) for (let ns = $(q, node) || [], es = e.split(' '), i = 0; i < es.length; i++)
        ns.forEach(n => n.addEventListener(es[i], obj[q][e].bind(n))) } });
})()

(() => {
  // 19 sloc: DOM + mass EventTarget events, async custom events
  var $ = Object.assign((sel, node = document) => [...node.querySelectorAll(sel).values()], {
    Machine: function (state) {
      let es = {}, v = Object.values, r = Promise.resolve.bind(Promise); Object.seal(state);
      return Object.assign(this, {
        getState () { return state },
        on (e, fn) { (es[e] = es[e] || {})[fn.name] = fn; return this },
        stop (e, fname = '') { e in es && delete es[e][fname]; return this },
        emit (e, ...args) { return e in es && v(es[e]).reduce((s, fn) => (fn.apply(s, args), s), state) },
        emitAsync (e, ...args) { return e in es && v(es[e]).reduce((p, fn) => p.then(s => r(fn.apply(s, args)).then(() => s)), r(state)) } }) },
    targets (obj, target = window) {
      let p, use = (m, fn) => { for (let es = p.split(' '), i = 0; i < es.length; i++) target[m](es[i], fn) };
      for (p in obj) if (Function.prototype.isPrototypeOf(obj[p])) {
        if (EventTarget.prototype.isPrototypeOf(target)) use('addEventListener', obj[p].bind(target));
        else if ($.Machine.prototype.isPrototypeOf(target)) use('on', obj[p])
      } else if (p in target) $.targets(obj[p], target[p]);
      else for (let k in target) if (k.match(new RegExp(`^${p}$`))) $.targets(obj[p], target[k]) },
    queries (obj, node) {
      for (let q in obj) for (let e in obj[q]) for (let ns = $(q, node) || [], es = e.split(' '), i = 0; i < es.length; i++)
        ns.forEach(n => n.addEventListener(es[i], obj[q][e].bind(n))) } });
})()

(() => {
  // 19 sloc: DOM + single EventTarget events, async custom events, single event queueing
  var $ = Object.assign((sel, node = document) => [...node.querySelectorAll(sel).values()], {
    Machine: function (state) {
      let es = {}, v = Object.values, r = Promise.resolve.bind(Promise); Object.seal(state);
      return Object.assign(this, {
        getState () { return state },
        on (e, fn) { (es[e] = es[e] || {})[fn.name] = fn; return this },
        stop (e, fname = '') { e in es && delete es[e][fname]; return this },
        emit (e, ...args) { return e in es && v(es[e]).reduce((s, fn) => (fn.apply(s, args), s), state) },
        emitAsync (e, ...args) { return e in es && v(es[e]).reduce((p, fn) => p.then(s => r(fn.apply(s, args)).then(() => s)), r(state)) } }) },
    pipe: (ps => (p, ...fns) => ps[p] = (ps[p] || Promise.resolve()).then(fn))({}),
    targets (obj, target = window) {
      let p, use = (m, fn) => { for (let es = p.split(' '), i = 0; i < es.length; i++) target[m](es[i], fn) };
      for (p in obj) if (Function.prototype.isPrototypeOf(obj[p])) {
        if (EventTarget.prototype.isPrototypeOf(target)) use('addEventListener', obj[p].bind(target));
        else if ($.Machine.prototype.isPrototypeOf(target)) use('on', obj[p])
      } else $.targets(obj[p], target[p]) },
    queries (obj, node) {
      for (let q in obj) for (let e in obj[q]) for (let ns = $(q, node) || [], es = e.split(' '), i = 0; i < es.length; i++)
        ns.forEach(n => n.addEventListener(es[i], obj[q][e].bind(n))) } });
})()

(() => {
  // 19 sloc: DOM + single EventTarget events, async custom events, combining event queueing
  var $ = Object.assign((sel, node = document) => [...node.querySelectorAll(sel).values()], {
    Machine: function (state) {
      let es = {}, v = Object.values, r = Promise.resolve.bind(Promise); Object.seal(state);
      return Object.assign(this, {
        getState () { return state },
        on (e, fn) { (es[e] = es[e] || {})[fn.name] = fn; return this },
        stop (e, fname = '') { e in es && delete es[e][fname]; return this },
        emit (e, ...args) { return e in es && v(es[e]).reduce((s, fn) => (fn.apply(s, args), s), state) },
        emitAsync (e, ...args) { return e in es && v(es[e]).reduce((p, fn) => p.then(s => r(fn.apply(s, args)).then(() => s)), r(state)) } }) },
    pipe: (ps => (p, ...fns) => ps[p] = (ps[p] || Promise.resolve()).then(() => Promise.all(fns.map(fn => fn()))))({}),
    targets (obj, target = window) {
      let p, use = (m, fn) => { for (let es = p.split(' '), i = 0; i < es.length; i++) target[m](es[i], fn) };
      for (p in obj) if (Function.prototype.isPrototypeOf(obj[p])) {
        if (EventTarget.prototype.isPrototypeOf(target)) use('addEventListener', obj[p].bind(target));
        else if ($.Machine.prototype.isPrototypeOf(target)) use('on', obj[p])
      } else $.targets(obj[p], target[p]) },
    queries (obj, node) {
      for (let q in obj) for (let e in obj[q]) for (let ns = $(q, node) || [], es = e.split(' '), i = 0; i < es.length; i++)
        ns.forEach(n => n.addEventListener(es[i], obj[q][e].bind(n))) } });
})()

(() => {
  // 20 sloc: DOM + single EventTarget events, async custom events, complex event queueing
  var $ = Object.assign((sel, node = document) => [...node.querySelectorAll(sel).values()], {
    Machine: function (state) {
      let es = {}, v = Object.values, r = Promise.resolve.bind(Promise); Object.seal(state);
      return Object.assign(this, {
        getState () { return state },
        on (e, fn) { (es[e] = es[e] || {})[fn.name] = fn; return this },
        stop (e, fname = '') { e in es && delete es[e][fname]; return this },
        emit (e, ...args) { return e in es && v(es[e]).reduce((s, fn) => (fn.apply(s, args), s), state) },
        emitAsync (e, ...args) { return e in es && v(es[e]).reduce((p, fn) => p.then(s => r(fn.apply(s, args)).then(() => s)), r(state)) } }) },
    pipe: (ps => (p, ...ands) => ps[p] = (ps[p] || Promise.resolve()).then(() =>
      Promise.all(ands.map(ors => Array.prototype.isPrototypeOf(ors) ? Promise.race(ors.map(fn => fn())) : ors()))))({}),
    targets (obj, target = window) {
      let p, use = (m, fn) => { for (let es = p.split(' '), i = 0; i < es.length; i++) target[m](es[i], fn) };
      for (p in obj) if (Function.prototype.isPrototypeOf(obj[p])) {
        if (EventTarget.prototype.isPrototypeOf(target)) use('addEventListener', obj[p].bind(target));
        else if ($.Machine.prototype.isPrototypeOf(target)) use('on', obj[p])
      } else $.targets(obj[p], target[p]) },
    queries (obj, node) {
      for (let q in obj) for (let e in obj[q]) for (let ns = $(q, node) || [], es = e.split(' '), i = 0; i < es.length; i++)
        ns.forEach(n => n.addEventListener(es[i], obj[q][e].bind(n))) } });
})()

(() => {
  // 20 sloc: DOM + single EventTarget events, async custom events, single event queueing, import elements
  var $ = Object.assign((sel, node = document) => [...node.querySelectorAll(sel).values()], {
    Machine: function (state) {
      let es = {}, v = Object.values, r = Promise.resolve.bind(Promise); Object.seal(state);
      return Object.assign(this, {
        getState () { return state },
        on (e, fn) { (es[e] = es[e] || {})[fn.name] = fn; return this },
        stop (e, fname = '') { e in es && delete es[e][fname]; return this },
        emit (e, ...args) { return e in es && v(es[e]).reduce((s, fn) => (fn.apply(s, args), s), state) },
        emitAsync (e, ...args) { return e in es && v(es[e]).reduce((p, fn) => p.then(s => r(fn.apply(s, args)).then(() => s)), r(state)) } }) },
    pipe: (ps => (p, ...fns) => ps[p] = (ps[p] || Promise.resolve()).then(fn))({}),
    targets (obj, target = window) {
      let p, use = (m, fn) => { for (let es = p.split(' '), i = 0; i < es.length; i++) target[m](es[i], fn) };
      for (p in obj) if (Function.prototype.isPrototypeOf(obj[p])) {
        if (EventTarget.prototype.isPrototypeOf(target)) use('addEventListener', obj[p].bind(target));
        else if ($.Machine.prototype.isPrototypeOf(target)) use('on', obj[p])
      } else $.targets(obj[p], target[p]) },
    queries (obj, node) {
      for (let q in obj) for (let e in obj[q]) for (let ns = $(q, node) || [], es = e.split(' '), i = 0; i < es.length; i++)
        ns.forEach(n => n.addEventListener(es[i], obj[q][e].bind(n))) },
    load (id, dest = 'body') { $(dest).forEach(n => n.appendChild(document.importNode($('template#' + id)[0].content, true))) } });
})()

(() => {
  // 22 sloc: DOM + single EventTarget events, async custom events, single event queueing, import and return elements
  var $ = Object.assign((sel, node = document) => [...node.querySelectorAll(sel).values()], {
    Machine: function (state) {
      let es = {}, v = Object.values, r = Promise.resolve.bind(Promise); Object.seal(state);
      return Object.assign(this, {
        getState () { return state },
        on (e, fn) { (es[e] = es[e] || {})[fn.name] = fn; return this },
        stop (e, fname = '') { e in es && delete es[e][fname]; return this },
        emit (e, ...args) { return e in es && v(es[e]).reduce((s, fn) => (fn.apply(s, args), s), state) },
        emitAsync (e, ...args) { return e in es && v(es[e]).reduce((p, fn) => p.then(s => r(fn.apply(s, args)).then(() => s)), r(state)) } }) },
    pipe: (ps => (p, ...fns) => ps[p] = (ps[p] || Promise.resolve()).then(fn))({}),
    targets (obj, target = window) {
      let p, use = (m, fn) => { for (let es = p.split(' '), i = 0; i < es.length; i++) target[m](es[i], fn) };
      for (p in obj) if (Function.prototype.isPrototypeOf(obj[p])) {
        if (EventTarget.prototype.isPrototypeOf(target)) use('addEventListener', obj[p].bind(target));
        else if ($.Machine.prototype.isPrototypeOf(target)) use('on', obj[p])
      } else $.targets(obj[p], target[p]) },
    queries (obj, node) {
      for (let q in obj) for (let e in obj[q]) for (let ns = $(q, node) || [], es = e.split(' '), i = 0; i < es.length; i++)
        ns.forEach(n => n.addEventListener(es[i], obj[q][e].bind(n))) },
    load (id, dest = 'body') {
      let stamp = document.importNode($('template#' + id)[0].content, true);
      return $(dest).map(n => [...stamp.cloneNode(true).childNodes.values()].map(c => n.appendChild(c))) } });
})()

(() => {
  // 24 sloc: full utils object
  var $ = Object.assign((sel, node = document) => [...node.querySelectorAll(sel).values()], {
    Machine: function (state) {
      let es = {}, v = Object.values, r = Promise.resolve.bind(Promise); Object.seal(state);
      return Object.assign(this, {
        getState () { return state },
        on (e, fn) { (es[e] = es[e] || {})[fn.name] = fn; return this },
        stop (e, fname = '') { e in es && delete es[e][fname]; return this },
        emit (e, ...args) { return e in es && v(es[e]).reduce((s, fn) => (fn.apply(s, args), s), state) },
        emitAsync (e, ...args) { return e in es && v(es[e]).reduce((p, fn) => p.then(s => r(fn.apply(s, args)).then(() => s)), r(state)) } }) },
    pipe: (ps => (p, ...ands) => ps[p] = (ps[p] || Promise.resolve()).then(() =>
      Promise.all(ands.map(ors => Array.prototype.isPrototypeOf(ors) ? Promise.race(ors.map(fn => fn())) : ors()))))({}),
    targets (obj, target = window) {
      let p, use = (m, fn) => { for (let es = p.split(' '), i = 0; i < es.length; i++) target[m](es[i], fn) };
      for (p in obj) if (Function.prototype.isPrototypeOf(obj[p])) {
        if (EventTarget.prototype.isPrototypeOf(target)) use('addEventListener', obj[p].bind(target));
        else if ($.Machine.prototype.isPrototypeOf(target)) use('on', obj[p])
      } else if (p in target) $.targets(obj[p], target[p]);
      else for (let k in target) if (k.match(new RegExp(`^${p}$`))) $.targets(obj[p], target[k]) },
    queries (obj, node) {
      for (let q in obj) for (let e in obj[q]) for (let ns = $(q, node) || [], es = e.split(' '), i = 0; i < es.length; i++)
        ns.forEach(n => n.addEventListener(es[i], obj[q][e].bind(n))) },
    load (id, dest = 'body') {
      let stamp = document.importNode($('template#' + id)[0].content, true);
      return $(dest).map(n => [...stamp.cloneNode(true).childNodes.values()].map(c => n.appendChild(c))) } });
})()
