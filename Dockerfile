# stretch required for gc-stats post build
FROM node:14.15.4-stretch AS builder

WORKDIR /home/app

#COPY ./.npmrc /home/app/.npmrc

COPY package.json ./
COPY yarn.lock ./
RUN yarn install
#RUN rm .npmrc

COPY ./ ./

RUN yarn autoclean --force

ENV PORT 8080
ENV MONGODB_URI "mongodb://mongodb:27017/starter-api"
ENV NODE_ENV "development"

RUN yarn run build

CMD ["yarn", "run", "dev"]

FROM node:14.15.4-alpine3.12

WORKDIR /home/app

COPY --from=builder /home/app/dist .

RUN npm prune --production \
  && rm -rf test \
  && find . -type f -name "*.d.ts" -exec rm {} \;

RUN mv src dist

CMD ["node", "dist/index.js"]
