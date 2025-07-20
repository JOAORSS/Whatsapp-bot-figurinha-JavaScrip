FROM node:20-bullseye

RUN apt-get update && apt-get install -y \
    libnss3 \
    libxss1 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libasound2 \
    libdrm2 \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8080
CMD ["npm", "start"]