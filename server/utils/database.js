const mongoose = require('mongoose');

if (!process.env.MONGO_URI) {
    throw "please export MONGO_URI=<URI>"
}
mongoose.connect(process.env.MONGO_URI, {
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