const mongoose = require('mongoose');

const connectionURL = process.env.MONGODB_CONNECTION;
mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('Connection successful!');
}).catch(() => {
    console.log('Unable to connect to MongoDB!');
});