# -- BUILD STAGE
FROM node:15.14.0 as build-stage

WORKDIR /usr/src/app

# Install packages
COPY package.json yarn.lock ./
RUN yarn

# Build the app
COPY . ./
RUN yarn build

# -- RUN STAGE
FROM nginx:1.19.9

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html/schematic-viewer

EXPOSE 80
