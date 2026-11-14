# ==========================================
# ETAPA 1: Compilación de Angular
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copiamos dependencias e instalamos
COPY package.json package-lock.json ./
RUN npm ci

# Copiamos el resto del código y compilamos para producción
COPY . .
RUN npm run build -- --configuration production

# ==========================================
# ETAPA 2: Servidor Nginx
# ==========================================
FROM nginx:alpine

# Borramos la página por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiamos nuestra configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos compilados de Angular
# NOTA: Ajusta 'peludos-front' si el nombre en tu angular.json es distinto
COPY --from=builder /app/dist/peludos-front/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]