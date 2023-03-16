# stretch required for gc-stats post build
FROM node:16.16.0-bullseye AS builder

WORKDIR /home/app

# todo on init skeleton: if you need npmrc file for private packages you have 2 options:
# 1. use custom docker image that has the .npmrc file in it (recommended):
#    - replace FROM node:16.16.0-bullseye AS builder with FROM <your-image> AS builder
#    - remove "COPY ./.npmrc /home/app/.npmrc" comment
# 2. use .npmrc file in the project (not recommended):
#    - uncomment "COPY ./.npmrc /home/app/.npmrc" line
# if you dint need .npmrc file you can remove "COPY ./.npmrc /home/app/.npmrc" comment

#COPY ./.npmrc /home/app/.npmrc

COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY ./ ./

RUN yarn autoclean --force

ENV PORT 8080
ENV NODE_ENV "development"

RUN yarn run build

CMD ["yarn", "run", "dev"]

FROM node:16.16.0-alpine3.15

WORKDIR /home/app

COPY --from=builder /home/app/dist .
# copy yarn cache to allow yarn install to rerun offline
ARG YARN_CACHE_PATH=/usr/local/share/.cache/yarn/v6
COPY --from=builder ${YARN_CACHE_PATH} ${YARN_CACHE_PATH}

# TODO: fix this by migrating to yarn 2 : https://github.com/yarnpkg/yarn/issues/6373#issuecomment-760068356
RUN node -e "const package = require('./package.json'); delete package.devDependencies; require('fs').writeFileSync('package.json', JSON.stringify(package, null, 2));"

RUN yarn install --offline \
  && rm -rf test \
  && rm yarn.lock \
  && find . -type f -name "*.d.ts" -exec rm {} \; \
  && mv src dist \
  && rm -rf ${YARN_CACHE_PATH}

CMD ["node", "dist/index.js"]
