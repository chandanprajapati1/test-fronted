ARG BASE_IMAGE=722163322018.dkr.ecr.ap-south-1.amazonaws.com/node:20.13.1-alpine
FROM ${BASE_IMAGE} As build

LABEL Marketplace-frontend-apisversion="1.0.0.1" \
      contact="Compliance Kart" \
      description="A minimal Node.js Docker image for marketplace-frontend application in Staging" \
      base.image="Node" \
      maintainer="rkumardevops8@gmail.com"

ENV TZ=Asia/Kolkata

# Set the timezone
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app
ADD . /app


# Install dependencies again
#test123456
 # Install dependencies (this is where npm install will happen)
RUN npm install

# Build the app
RUN npm run build

# Final stage
FROM 722163322018.dkr.ecr.ap-south-1.amazonaws.com/node:20.13.1-alpine
WORKDIR /app
COPY --from=build /app .

# Set a non-root user
USER node

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl --fail http://staging.marketplace.envr.earth/health || exit 1

# Start the app
CMD ["npm", "run", "start"]
