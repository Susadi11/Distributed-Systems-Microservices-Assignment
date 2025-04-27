# Use Node.js base image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy everything into the container
COPY . .

# Expose the app port
EXPOSE 5552

# Command to start the service
CMD ["npm", "start"]
