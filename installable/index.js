// Example app

var app = new $.Machine({});

$.targets({
  app: {
    update () { // Use whenever appropriate to check for an update
      return pwa.emitAsync('update')
        .then(console.log)
        .catch(console.log)
    }
  }
})
