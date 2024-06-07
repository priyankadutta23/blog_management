const mongoose=require('mongoose');

// const connection_string='mongodb+srv://' + process.env.DB_NAME + ':' + process.env.DB_PASSWORD + '@cluster0.jypa6xe.mongodb.net/' + process.env.DB_NAME + '?retryWrites=true&w=majority';
const connection_string = 'mongodb+srv://' + process.env.DB_NAME + ':' + process.env.DB_PASSWORD + '@cluster0.jypa6xe.mongodb.net/' + process.env.DB_NAME + '?retryWrites=true&w=majority';

let option = {
    auth: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    },
    useNewUrlParser: true,
    useUnifiedTopology: true
}

module.exports = () => {
    try {
        mongoose.connect(connection_string, option);
        console.log("DB connected successfully!");
    } catch (err) {
        console.log(err);
    }
}
