# Stage 1: build the React app using Node
# use node image for building
FROM node:20-alpine AS builder

# working dir in builder
WORKDIR /app

# copy package files (for caching)
COPY package*.json ./

# install dependencies (all)
RUN npm ci

# copy source code
COPY . .

# build static files into /app/dist
RUN npm run build                                

# Stage 2: serve built assets with a tiny nginx image
# nginx to serve static files
FROM nginx:stable-alpine                         

# copy build output to nginx html folder
COPY --from=builder /app/dist /usr/share/nginx/html

# replace default nginx config (for proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf   

# expose port 80
EXPOSE 80

# run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]               
