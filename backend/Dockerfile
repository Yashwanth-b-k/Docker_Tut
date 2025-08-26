# Use small Node base image for building/runtime
# base image with Node 18 on Alpine
FROM node:18-alpine                             

# set working dir inside container
WORKDIR /usr/src/app                              

# copy package info separately to leverage Docker layer caching
COPY package*.json ./                             

# install only production dependencies (faster, smaller)
RUN npm ci --only=production                      

# copy application source code
COPY . .                                          

# set NODE_ENV to production
ENV NODE_ENV=production                           

# document container listens on 4000
EXPOSE 4000                                       

# start the app using node default command
CMD ["node", "src/index.js"]                      
