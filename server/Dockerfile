FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY migrations ./migrations
COPY src ./src
RUN mkdir -p /data/uploads
EXPOSE 8080
CMD ["npm", "start"]
