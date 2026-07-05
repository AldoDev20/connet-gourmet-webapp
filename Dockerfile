# --- Etapa 1: Compilación de la aplicación ---
FROM node:22-alpine AS build
WORKDIR /app

# Copiar archivos de dependencias e instalar para aprovechar la caché de Docker
COPY package.json package-lock.json ./
RUN npm ci

# Copiar el código fuente y compilar la aplicación para producción
COPY . .
RUN npm run build -- --configuration=production

# --- Etapa 2: Servidor web de producción ---
FROM nginx:alpine

# Copiar los recursos compilados de Angular desde la etapa previa a la carpeta de Nginx
COPY --from=build /app/dist/gourmet-connect-webapp/browser /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx para soportar SPA routing (Angular router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
