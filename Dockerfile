FROM node:lts-alpine

WORKDIR /src

COPY ["package.json", "package-lock.json", "/src/"]
RUN npm install

CMD ["npm", "--version"]