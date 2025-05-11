# Use official Node.js image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (for efficient caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application (including src folder)
COPY . .

# Expose the app port
EXPOSE 5555

# Set the command to run your app (pointing to src/index.js)
CMD ["node", "src/index.js"]
