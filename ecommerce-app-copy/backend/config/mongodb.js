import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const normalizeUri = (value = '') => {
    let uri = value.trim();
    if (uri.startsWith('"') && uri.endsWith('"')) {
        uri = uri.slice(1, -1).trim();
    }
    return uri.replace(/\s+/g, '');
};

const appendDatabase = (uri, dbName) => {
    if (!uri) return null;
    return uri.endsWith('/') ? `${uri}${dbName}` : `${uri}/${dbName}`;
};

let memoryServer;

const startMemoryServer = async (dbName) => {
    memoryServer = await MongoMemoryServer.create({ instance: { dbName } });
    const uri = memoryServer.getUri();
    console.log('Started in-memory MongoDB for development');
    return uri;
};

const connectDB = async () => {
    const dbName = 'e-commerce';
    const rawUri = normalizeUri(process.env.MONGODB_URI);
    const atlasUri = rawUri ? appendDatabase(rawUri, dbName) : null;
    const localUri = `mongodb://127.0.0.1:27017/${dbName}`;

    mongoose.connection.on('connected', () => {
        console.log('DB CONNECTED..');
    });

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err.message || err);
    });

    if (atlasUri) {
        try {
            console.log('Trying MongoDB Atlas:', atlasUri);
            await mongoose.connect(atlasUri, { serverSelectionTimeoutMS: 5000 });
            console.log('Connected to MongoDB Atlas');
            return;
        } catch (atlasError) {
            console.warn('Atlas connection failed:', atlasError.message || atlasError);
        }
    }

    try {
        console.log('Trying local MongoDB:', localUri);
        await mongoose.connect(localUri, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected to local MongoDB');
        return;
    } catch (localError) {
        console.warn('Local MongoDB connection failed:', localError.message || localError);
    }

    const memoryUri = await startMemoryServer(dbName);
    await mongoose.connect(memoryUri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to in-memory MongoDB');
};

export default connectDB;
