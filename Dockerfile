FROM node:18-alpine
# Creating app directory
WORKDIR /usr/src/app
#Installing the dependencies
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p public
# Define environment variables
ENV PORT=3000
ENV NODE_ENV=production
# Expose the port
EXPOSE 3000
# Starting the application
CMD ["node", "server.js"]