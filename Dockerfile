FROM node:alpine
ENV REFRESHED_AT=2025-12-30-Attempt-100

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
