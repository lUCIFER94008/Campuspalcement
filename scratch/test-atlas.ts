import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:admin123@cluster0.qfhlmp1.mongodb.net/Campushire';

console.log('Testing Atlas Connection...');
console.log('URI provided:', uri ? 'YES (Length: ' + uri.length + ')' : 'NO');

mongoose
  .connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB Atlas!');
    console.log('Connection readyState:', mongoose.connection.readyState);
    console.log('Database name:', mongoose.connection.name);
    process.exit(0);
  })
  .catch((err) => {
    console.error('FAILURE: Connection failed with error:');
    console.error('Code:', err.code);
    console.error('Name:', err.name);
    console.error('Message:', err.message);
    process.exit(1);
  });
