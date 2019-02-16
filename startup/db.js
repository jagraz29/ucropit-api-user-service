const mongoose = require('mongoose')

module.exports = function () {
  mongoose.connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useCreateIndex: true
  }).then(() => console.log('Connected to MongoDB'))
}