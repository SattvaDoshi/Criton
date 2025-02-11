import mongoose from 'mongoose';


const connections = {}; // Cache for tenant connections

export const connectToTenantDB = async (shortenedTenantId) => {
  if (connections[shortenedTenantId]) {
    return connections[shortenedTenantId];
  }

  try {
    const dbName = `tenant_${shortenedTenantId}`;
    const dbUri = `${process.env.MONGO_URI}${dbName}${process.env.MONGO_URI_2}`;

    const connection = await mongoose.createConnection(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    connections[shortenedTenantId] = connection;
    console.log(`Connected to database: tenant_${shortenedTenantId}`);
    return connection;
  } catch (error) {
    console.error(`Failed to connect to tenant database: tenant_${shortenedTenantId}`, error);
    throw new Error(`Could not connect to tenant database: tenant_${shortenedTenantId}`);
  }
};

