# =============================================
# Stage 1: Development
# =============================================
FROM node:20-slim AS dev-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

# =============================================
# Stage 2: Build
# =============================================
FROM node:20-slim AS build-stage
WORKDIR /app

ARG VITE_ENV
ARG VITE_API_BASE_URL
ARG VITE_KEYCLOAK_URL
ARG VITE_KEYCLOAK_REALM
ARG VITE_KEYCLOAK_CLIENT_DOCTOR
ARG VITE_KEYCLOAK_CLIENT_PATIENT
ARG VITE_GA_MEASUREMENT_ID

ENV VITE_ENV=$VITE_ENV
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_KEYCLOAK_URL=$VITE_KEYCLOAK_URL
ENV VITE_KEYCLOAK_REALM=$VITE_KEYCLOAK_REALM
ENV VITE_KEYCLOAK_CLIENT_DOCTOR=$VITE_KEYCLOAK_CLIENT_DOCTOR
ENV VITE_KEYCLOAK_CLIENT_PATIENT=$VITE_KEYCLOAK_CLIENT_PATIENT
ENV VITE_GA_MEASUREMENT_ID=$VITE_GA_MEASUREMENT_ID

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# =============================================
# Stage 3: Production
# =============================================
FROM nginx:alpine AS prod-stage
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx/nginx.dev.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]