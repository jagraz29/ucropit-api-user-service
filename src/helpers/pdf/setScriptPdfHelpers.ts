import MomentHandlebars from 'helper-moment'
import helpers from 'handlebars-helpers'

export const setScriptPdf = handlebars => {

  handlebars.registerHelper('moment', MomentHandlebars)
  handlebars.registerHelper(helpers.regex())
  handlebars.registerHelper(helpers.string())
  handlebars.registerHelper('switch', (value, options) => {
    this.switch_value = value
    this.switch_break = false
    return options.fn(this)
  })
  handlebars.registerHelper('case', (value, options) => {
    if (value === this.switch_value) {
      this.switch_break = true
      return options.fn(this)
    }
  })
  handlebars.registerHelper('default', (value, options) => {
    if (this.switch_break === false) {
      return options.fn(this)
    }
  })
  handlebars.registerHelper('ifCond', (v1, v2, options) => {
    if (v1 === v2) {
      return options.fn(this)
    }
    return options.inverse(this)
  })
  handlebars.registerHelper('ifNotCond', (v1, v2, options) => {
    if (v1 !== v2) {
      return options.fn(this)
    }
    return options.inverse(this)
  })

  return handlebars
}
