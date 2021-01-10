const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/tankz', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then((res) => {
    console.log('connected to db!')
}).catch((err) => {
    console.log(err);
});

module.exports = { mongoose };