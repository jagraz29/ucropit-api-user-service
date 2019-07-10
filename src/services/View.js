'use strict'

const pug = require('pug')

class View {
  /**
   * JSON data template
   * 
   * @param {string} template
   * @param {JSON|Object} data
   */
  static render({ template, data }) {
    const compiledFunction = pug.compileFile(template)
    return compiledFunction(data)
  }
}

module.exports = View