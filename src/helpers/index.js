const getShortYear = function (date) {
  return new Date(date).getFullYear().toString().substr(-2)
}

module.exports = { getShortYear }