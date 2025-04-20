const mongoose = require('mongoose');

const connect = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 45000,
        });

        // Log connection details
        console.log('MongoDB Connected Successfully');
        console.log('Connected to database:', connection.connection.db.databaseName);
        
        // List all collections
        const collections = await connection.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

        return connection;
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        throw error;
    }
};

module.exports = connect; 