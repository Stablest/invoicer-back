FROM node:20-alpine as build

RUN apk update && apk add dumb-init

WORKDIR /app

COPY . /app/

RUN npm install

#########

# DEV BUILD

########

FROM build as dev

CMD npx prisma migrate dev && dumb-init npx nest start --watch --preserveWatchOutput
# CMD tail -f /dev/null

#########

# PRE-PRODUCTION BUILD

########

FROM build as pre-prod

RUN npm run build

ENV NODE_ENV production

USER node

#########

# PRODUCTION

########

FROM node:20-alpine as prod

COPY --chown=node:node --from=stage /app/node_modules /app/node_modules/
COPY --chown=node:node --from=stage /app/prisma /app/prisma/
COPY --chown=node:node --from=pre-prod /app/dist /app/dist/

WORKDIR /app

CMD npx prisma migrate deploy && dumb-init node ./dist/main.js