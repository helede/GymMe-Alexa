const store = {}

class AlexaStore {

  static save (id, key, val) {
    //console.log( 'save', id, key, val)
    if (!store[id]) {
      store[id] = {}
    }
    store[id][key] = val
    return store[id][key]
  }

  static retrieve (id, key) {
    let val
    try { val = store[id][key]}
    catch (e) { val = undefined }

    //console.log( 'get', id, key, val)
    return val
  }
}

module.exports = AlexaStore
