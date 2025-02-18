ARG BASE_IMAGE=957779811736.dkr.ecr.ap-south-1.amazonaws.com/node
FROM ${BASE_IMAGE} As build

LABEL Brandpts-node="1.0.0.0" \
      contact="Chandan" \
      description="A minimal Node.js Docker image for fronted application in Staging" \
      base.image="Node" \
      maintainer="chandanprajapati00001@gmail.com"

ENV TZ=Asia/Kolkata

# Set the timezone
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app
ADD . /app

#
# Install dependencies again
 # Install dependencies (this is where npm install will happen)
RUN npm install

# Build the app
RUN npm run build

# Final stage
FROM 957779811736.dkr.ecr.ap-south-1.amazonaws.com/node
WORKDIR /app
COPY --from=build /app .

# Set a non-root user
USER node
#test
EXPOSE 3000

# Health check
#HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
 # CMD curl --fail http://staging.marketplace.envr.earth/health || exit 1

# Start the app11
CMD ["npm", "run", "start"]
