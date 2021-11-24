################################################################################
##                                 BASE IMAGE                                 ##
################################################################################


FROM node:16-alpine AS base

WORKDIR /usr/src/api

# Set API port
ENV API_PORT=3333

# Expose API port
EXPOSE ${API_PORT}

################################################################################
##                              DEVELOPMENT IMAGE                             ##
################################################################################

# Create development image from base
FROM base AS development

# Copy NPM packages
COPY package.json .
COPY yarn.lock .

# Install Node dependencies
RUN yarn install --silent

# Copy remaining API code
COPY . .

# Set development environment variables
ENV NODE_ENV=development

# Run the API in development mode
CMD ["yarn", "start:dev"]

################################################################################
##                              PRODUCTION IMAGE                              ##
################################################################################

# Create production image from base
FROM development AS production

# Build
RUN yarn build

# Remove all development dependencies
RUN rm -rf node_modules && yarn install --silent --production

# Set production environment variables
ENV NODE_ENV=production

# Run the API in production mode
CMD ["yarn", "start:prod"]
