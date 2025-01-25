# Step 1: Use an official Node.js image as the base image
FROM node:16-alpine

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the React application source code
COPY . .

# Step 6: Expose the port the app will run on (default is 3000 for React development server)
EXPOSE 3000

# Step 7: Start the React development server
CMD ["npm", "start"]
