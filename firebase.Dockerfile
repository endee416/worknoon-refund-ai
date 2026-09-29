FROM node:20-trixie-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends openjdk-21-jre-headless \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY firebase.json ./
COPY firestore.rules ./
COPY firestore.indexes.json ./

EXPOSE 8080
EXPOSE 4000

CMD ["npx", "firebase", "emulators:start", "--only", "firestore", "--project", "demo-worknoon-refund"]