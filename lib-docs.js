// Utilities

//   $ enhances querySelectorAll
//     @param {String} sel - CSS-style node selector
//     @param {ParentNode} [node = document] - Optional selector root

function $ (sel, node = document) {
  return [
    ... node.querySelectorAll(sel)
            .values()
  ]
}


//   $.Machine creates state machines for the page
//     @param {Object} state - State of the machine at instantiation
//     @method getState () - Returns current machine state
//     @method on (String, Function)
//     - Defines an event listener
//     - Use accessors of 'this' to alter machine state
//     - Use a named function if you plan to remove listener at a later time
//     @method emit (String, ...any) - Dispatches an event with the given arguments
//     @method emitAsync (String, ...any) - Asynchronous emit returning a Promise
//     @method stop (String, String)
//     - Removes an event listener
//     - Optional string to specify listener function to remove

$.Machine = function (state) {
  let es = {},
      v = Object.values,
      r = Promise.resolve.bind(Promise);

  Object.seal(state);

  return Object.assign(
    this,
    {
      state () {
        return state
      },

      on (t, fn) {
        (es[t] = es[t] || {})
          [fn.name] = fn;
        return this
      },

      stop (t, fname = '') {
        t in es &&
          delete es[t][fname] &&
            ( v(es[t]).length ||
              delete es[t] );
        return this
      },

      emit (t, ... args) {
        return t in es &&
          v(es[t]).reduce(
            (s, fn) => (fn.apply(s, args), s),
            state
          )
      },

      emitAsync (t, ... args) {
        return t in es &&
          v(es[t]).reduce(
            (p, fn) =>
              p.then(s =>
                r(fn.apply(s, args))
                  .then(() => s)
              ),
            r(state)
          )
      }
    }
  )
};


//   $.pipe creates asynchronous pipelines
//     @param {String} p - Chooses pipeline to connect to
//     @param {...(Function|Array.Function)} ands - Promises to be combined and pipelined
//       - Pipeline is released after all first level Promises, and one second level Promise from each Array, resolves

$.pipe = (ps =>
  (p, ... ands) =>
    ps[p] = (ps[p] || Promise.resolve())
      .then(() =>
        Promise.all(
          ands.map(ors =>
            Array.prototype.isPrototypeOf(ors) &&
              Promise.race(
                ors.map(fn =>
                  fn()
                )
              ) ||
            Function.prototype.isPrototypeOf(ors) &&
              ors()
          )
        )
      )
)({}),


//   $.queries enhances addEventListener for DOM nodes, and is indexed by selector - requires $
//     @param {Object} obj
//     - Takes the following form: { '.selector': { 'event1 event2' (...args) { /*listener*/ } } }
//     @param {ParentNode} [node = document] - Optional selector root

$.queries = function (obj, node) {
  for (let q in obj) {
    let ns = $(q, node);

    if (ns.length)
      for (let e in obj[q])
        e .split(' ')
          .forEach(t =>
            ns.forEach(n =>
              n.addEventListener(t, obj[q][e].bind(n))
            )
          )
  }
},


//   $.targets enhances addEventListener for objects, and is indexed by regex - requires $.Machine
//     @param {Object} obj
//     - Takes the following form: { 'event1 event2' (...args) { /*listener*/ }, 'propert(y|ies)': { ... } }
//     - Targetable properties must inherit from either EventTarget or $.Machine
//     @param {Object} [target = window] - Optional property root

$.targets = function (obj, target = window, p) {
  for (p in obj)
    if (Function.prototype.isPrototypeOf(obj[p])) {
      if (EventTarget.prototype.isPrototypeOf(target))
        p .split(' ')
          .forEach(t =>
            target.addEventListener(t, obj[p].bind(target))
          );
      else if ($.Machine.prototype.isPrototypeOf(target))
        p .split(' ')
          .forEach(t =>
            target.on(t, obj[p])
          )
    }
    else if (p in target)
      $.targets(obj[p], target[p]);
    else
      for (let k in target)
        if (k.match(new RegExp(`^${p}$`)))
          $.targets(obj[p], target[k])
},


//   $.load enhances importNode - requires $
//     @param {String} id - Select template node by id to load
//     @param {String} [dest = 'body'] - Optional selector indicating which nodes to append the template to
//     @return {Array.Array} - The imported nodes at each destination selector hit

$.load = function (id, dest = 'body') {
  let stamp = document.importNode(
    $('template#' + id)[0].content,
    true
  );

  return $(dest).map(n =>
    [
      ... stamp.cloneNode(true).childNodes
               .values()
    ]
      .map(c =>
        n.appendChild(c)
      )
  )
};



//   Drum interfaces indexedDB
//   - Accessible through the global drum object
//   - To be altered according to dev needs

function Drum () {
  return new Promise(resolve => {
    var req = indexedDB.open('example', 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore('exampleStore', {autoIncrement: true});
    req.onsuccess = e => { this._db = e.target.result; resolve(this) }
  })
}

Drum.prototype = {
  get: function (ix) {
    var store = this._db.transaction(['exampleStore'], 'readwrite').objectStore('exampleStore');
    return new Promise(resolve => store.get(ix).onsuccess = e => resolve(e.target.result))
  },
  set: function (ix, content) {
    var store = this._db.transaction(['exampleStore'], 'readwrite').objectStore('exampleStore');
    return new Promise(resolve => resolve(store.put(content, ix)))
  },
  purge: function () {
    this._db.close();
    return new Promise(resolve => indexedDB.deleteDatabase('example').onsuccess = resolve)
  },
  constructor: Drum
};

Drum.init = function () { return new Drum().then(d => self.drum = d) };



// Private properties

var Example = (function () {
  function Example () {
    p.prop = 'hello'
  }
  Example.prototype = {
    getProp: () => p.prop,
    setProp: val => p.prop = val
  };

  // Boilerplate start
  var p, priv = new WeakMap();
  return new Proxy(Example, { construct (con, args) {
    p = {}; var obj = new con(...args); priv.set(obj, p);
    return new Proxy(obj, { get (obj, key) {
      p = priv.get(obj); return obj[key]
    }})
  }})
  // end

})();

// uuid v4
function uuid () {
  var u = crypto.getRandomValues(new Uint8Array(16));
  u[6] &= 0x0f | 0x40; u[8] &= 0xbf | 0x80;
  return u.reduce((a, x, i) => a + (~[4, 6, 8, 10].indexOf(i) ? '-' : '') + x.toString(16).padStart(2, 0), '')
}

// clone object
function structuredClone (obj) {
  return new Promise(resolve => {
    let {port1, port2} = new MessageChannel();
    port2.onmessage = e => resolve(e.data);
    port1.postMessage(obj)
  })
}
