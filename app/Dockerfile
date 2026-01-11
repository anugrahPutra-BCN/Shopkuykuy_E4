FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Copy sisa source code
COPY . .

# Expose port aplikasi (internal container)
EXPOSE 3000

# Command default (bisa di-override oleh docker-compose untuk mode dev)
CMD ["npm", "start"]