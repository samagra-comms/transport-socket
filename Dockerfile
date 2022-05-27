FROM node:12 AS builder
LABEL maintainer = "Chakshu Gautam"
LABEL maintainer_email = "chakshu@samagragovernance.in"

# Create app directory
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

# Install app dependencies
RUN yarn install

COPY . .

RUN yarn run build
RUN ls -lah /app/dist

FROM node:12

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist ./dist

EXPOSE 3005
CMD [ "npm", "run", "start:prod" ]