#!/bin/bash

# Update system
sudo yum update -y

# Install Node.js and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 16

# Install PM2
npm install -g pm2

# Clone repository (replace with your repository URL)
git clone https://github.com/your-username/crypto-tracker.git
cd crypto-tracker/worker-server

# Install dependencies
npm install

# Create .env file
echo "NATS_URL=nats://your_ec2_nats_ip:4222" > .env

# Start the application with PM2
pm2 start server.js
pm2 startup
pm2 save 