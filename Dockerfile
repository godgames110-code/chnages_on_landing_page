# Stage único: Desenvolvimento
FROM node:20-alpine AS development

WORKDIR /usr/src/app

# Copiar package.json para cache de dependências
COPY package*.json ./

# Instala dependências (dev + prod)
RUN npm install

# Copiar restante do código
COPY . .

# Porta padrão Next.js
EXPOSE 3000

# Rodar Next.js com hot reload
CMD ["npm", "run", "dev"]
