# ---------- Stage 1: Build Angular App ----------
FROM node:23 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build -- --configuration production

# ---------- Stage 2: Serve with NGINX ----------
FROM nginx:stable-alpine

COPY --from=build /app/dist/next-call-ui/browser /usr/share/nginx/html

# Replace default nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
