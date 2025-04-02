# Use the official Node.js image for building Angular
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install Angular dependencies
RUN npm install

# Copy the application code into the container
COPY . .

# Build the Angular app
RUN npm run build --prod

# Start the Nginx server
CMD ["npm", "run", "serve:ssr"]
