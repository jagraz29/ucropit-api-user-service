'use strict'

class ProductionFactory {
  
  set stage(item) {
    this._stage = item
  }

  get generate() {
    return this._production
  }
}

module.exports = ProductionFactory