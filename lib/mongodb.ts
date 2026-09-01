import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export function getMongoURI(): string | null {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.trim() === '') {
    return null;
  }
  return uri.trim();
}

export function getSafeDiagnosticError(error: any): string {
  if (!error) return 'Database unavailable';
  const msg = String(error.message || error);

  if (msg.includes('MONGODB_URI is missing')) {
    return 'MONGODB_URI is missing from environment variables.';
  }
  if (msg.includes('bad auth') || msg.includes('Authentication failed') || msg.includes('auth failed')) {
    return 'MongoDB authentication failed. Please check your database user credentials.';
  }
  if (msg.includes('ENOTFOUND') || msg.includes('querySrv EREFUSED') || msg.includes('querySrv ENOTFOUND')) {
    return 'MongoDB cluster resolution failed. Please verify your cluster hostname in MONGODB_URI.';
  }
  if (msg.includes('ETIMEDOUT') || msg.includes('selection timed out') || msg.includes('ECONNREFUSED')) {
    return 'MongoDB Atlas connection timed out. Ensure your server/IP is allowed in Atlas Network Access (e.g. 0.0.0.0/0).';
  }
  if (msg.includes('SSL') || msg.includes('TLS')) {
    return 'MongoDB SSL/TLS handshake failed.';
  }

  return 'MongoDB connection error: ' + (error.name || 'ConnectionError');
}

export async function connectMongoDB() {
  const uri = getMongoURI();

  if (!uri) {
    console.error('[MongoDB Error] MONGODB_URI is missing from environment variables.');
    throw new Error('MONGODB_URI is missing from environment variables.');
  }

  // If already connected, return active connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If previous promise failed or connection was lost, reset promise to allow retries
  if (mongoose.connection.readyState === 0) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 8000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((m) => {
        console.log('[MongoDB] Connected successfully to Atlas cluster.');
        return m;
      })
      .catch((err) => {
        console.error('[MongoDB Connection Failure]', getSafeDiagnosticError(err));
        // Reset promise so subsequent requests retry connecting
        cached.promise = null;
        cached.conn = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    throw e;
  }

  return cached.conn;
}

export function isMongoDBConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export default connectMongoDB;
