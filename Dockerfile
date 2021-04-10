# -- BUILD STAGE
FROM node:15.14.0 as build-stage

WORKDIR /usr/src/app

# Install packages
COPY package.json yarn.lock ./
RUN yarn

# Build the app
COPY . ./
ENV PUBLIC_URL=/schematic-viewer
RUN yarn build

# -- RUN STAGE
FROM nginx:1.19.9

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html/schematic-viewer
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
