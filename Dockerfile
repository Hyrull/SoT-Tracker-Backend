FROM node:20
WORKDIR /usr/src/app

# Copy only package files first
COPY package*.json ./

# Clear npm cache and reinstall dependencies cleanly
RUN npm cache clean --force && npm install --build-from-source

# Copy source code
COPY . .

# Default command (nodemon for live reload)
CMD ["npx", "nodemon", "server.js"]
