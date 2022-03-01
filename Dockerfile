FROM node:10.15-alpine

# Ensure good permissions and create required directories
RUN chown -R root /opt && \
    chmod 755 /usr/local/bin/* && \
    mkdir -p /app

# Go to service directory
WORKDIR /app

# Copy dependency definitions
COPY package.json yarn.lock /app/

# Install dependencies
RUN yarn install --pure-lockfile && \
    yarn cache clean

# Copy sources
COPY . /app

# Compile app
RUN yarn dist

# Switch to service user
USER node

# Define the entry point
ENTRYPOINT ["yarn"]

CMD ["start:prod"]
