# Use Motia's base image (has Node + Python ready)
FROM motiadev/motia:latest
 
# For AWS Lightsail or other ARM platforms, use:
# FROM --platform=linux/arm64 motiadev/motia:latest
 
# Copy package files
COPY package*.json ./
 
# Install dependencies
RUN npm ci --only=production
 
# Copy your app
COPY . .
 
# If you have Python steps, uncomment this line:
# RUN npx motia@latest install
 
# Expose the port
EXPOSE 3000
 
# Start your app
CMD ["npm", "run", "start"]