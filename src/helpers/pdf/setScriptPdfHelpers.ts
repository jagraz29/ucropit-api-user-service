import MomentHandlebars from 'helper-moment'
import helpers from 'handlebars-helpers'

export const setScriptPdf = (handlebars) => {
  handlebars.registerHelper('moment', MomentHandlebars)
  handlebars.registerHelper(helpers.string())
  handlebars.registerHelper(helpers.comparison())
  handlebars.registerHelper(helpers.array())
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

  handlebars.registerHelper('ifCond', function (value, list, options) {
    const activities = list.split(',')
    if (activities.includes(value)) {
      return options.fn(this)
    }
    return handlebars
  })

  return handlebars
}
