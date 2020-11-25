FROM node:lts-alpine

WORKDIR /app

COPY package.json index.js encryptionMethods.js ./
RUN npm install

EXPOSE 3000

ENTRYPOINT [ "node" ]
CMD ["index.js"]



