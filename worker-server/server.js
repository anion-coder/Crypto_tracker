const { connect } = require('nats');
const cron = require('node-cron');
require('dotenv').config();

// Function to publish update event
const publishUpdateEvent = async (nc) => {
  const message = JSON.stringify({ trigger: 'update' });
  await nc.publish('crypto.update', message);
  console.log('Published update event:', new Date().toISOString());
};

// Initialize NATS and start the worker
const startWorker = async () => {
  try {
    // Connect to NATS
    const nc = await connect({ servers: process.env.NATS_URL });
    console.log('Connected to NATS');

    // Schedule the job to run every 15 minutes
    console.log('Starting worker server...');
    cron.schedule('*/15 * * * *', () => {
      publishUpdateEvent(nc);
    });

    // Publish initial event
    await publishUpdateEvent(nc);

    // Handle NATS connection events
    nc.closed().then(() => {
      console.log('NATS connection closed');
    });

  } catch (err) {
    console.error('Error in worker server:', err);
    process.exit(1);
  }
};

startWorker(); 