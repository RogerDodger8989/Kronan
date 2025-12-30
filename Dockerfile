FROM node:alpine

WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose port 80
EXPOSE 80

# Start the server
CMD [ "npm", "start" ]
