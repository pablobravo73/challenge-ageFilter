FROM node:18.12.1

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json app.js ./
RUN npm install

# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .

EXPOSE 8080
CMD ["node", "app.js"]
