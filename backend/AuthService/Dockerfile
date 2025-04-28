# Use Node.js official image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm# Use Node.js official image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your AuthService uses
EXPOSE 5000

# Start the service
CMD ["npm", "start"]
install

# Copy the rest of your application code
COPY . .

# Expose the port your AuthService uses
EXPOSE 5000

# Start the service
CMD ["npm", "start"]
