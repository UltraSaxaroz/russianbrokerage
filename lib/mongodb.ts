import { MongoClient } from 'mongodb';

// Ensure you have MONGO_URI in your environment variables
if (!process.env.MONGO_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
}

// Create a new MongoClient instance without the deprecated options
const client = new MongoClient(process.env.MONGO_URI);

// Create a promise that resolves to a MongoClient instance
const clientPromise: Promise<MongoClient> = client.connect();

export default clientPromise;
