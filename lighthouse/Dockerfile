# Use an official Node.js image
FROM node:22-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

COPY run.sh /usr/local/bin/run
RUN chmod +x /usr/local/bin/run

RUN npm run build

CMD ["node", "dist/lighthouse.js"]