# Use Node.js base image
FROM node:18

# Set working directory in container
WORKDIR /app

# Copy package.json files and install dependencies
COPY package*.json ./
RUN npm install

# Copy remaining files
COPY . .

# App listens on port 3000
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]

