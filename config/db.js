const mongoose = require('mongoose');

const connection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = connection;