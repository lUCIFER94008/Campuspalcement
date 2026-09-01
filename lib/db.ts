import connectMongoDB, { isMongoDBConnected } from './mongodb';

export const connectDB = connectMongoDB;
export const isDBConnected = isMongoDBConnected;

export default connectDB;
