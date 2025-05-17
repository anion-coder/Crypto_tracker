# Crypto Tracker Application

A full-stack application that tracks cryptocurrency statistics using Node.js, MongoDB, and NATS.

## Project Structure

```
.
├── api-server/         # API server for handling requests and storing data
└── worker-server/      # Worker server for scheduling updates
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- NATS server

## Environment Variables

Create `.env` files in both `api-server` and `worker-server` directories:

### api-server/.env
```
MONGODB_URI=your_mongodb_connection_string
COINGECKO_API_KEY=your_coingecko_api_key
PORT=3000
```

### worker-server/.env
```
NATS_URL=nats://localhost:4222
```

## Installation

1. Install dependencies for both servers:

```bash
# Install API server dependencies
cd api-server
npm install

# Install worker server dependencies
cd ../worker-server
npm install
```

2. Start the NATS server (if not already running)

3. Start both servers:

```bash
# Start API server
cd api-server
npm start

# Start worker server (in a new terminal)
cd worker-server
npm start
```

## API Endpoints

The deployed API is available at: `http://crypto-tracker-api.ap-south-1.elasticbeanstalk.com`

### GET /api/stats
Get the latest statistics for a cryptocurrency.

Query Parameters:
- `coin`: The cryptocurrency ID (bitcoin, ethereum, or matic-network)

Example Response:
```json
{
  "price": 40000,
  "marketCap": 800000000,
  "24hChange": 3.4
}
```

### GET /api/deviation
Get the standard deviation of the last 100 prices for a cryptocurrency.

Query Parameters:
- `coin`: The cryptocurrency ID (bitcoin, ethereum, or matic-network)

Example Response:
```json
{
  "deviation": 4082.48
}
```

## Architecture

The application consists of two servers:

1. **API Server**
   - Handles HTTP requests
   - Stores data in MongoDB
   - Subscribes to NATS events
   - Updates data when events are received

2. **Worker Server**
   - Runs a background job every 15 minutes
   - Publishes events to NATS
   - Triggers data updates in the API server

## Development

To run the servers in development mode with auto-reload:

```bash
# API server
cd api-server
npm run dev

# Worker server
cd worker-server
npm run dev
```