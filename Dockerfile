FROM node:9.10.1-alpine

COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY ./ ./
RUN yarn run build

ENV PORT 8011

CMD ["node", "dist/index.js"]
