FROM node:26.13.1-trixie-slim

WORKDIR /app

COPY ./ /app

RUN npm ci && npm run build

EXPOSE 3000

CMD [ "sh","-c","npx prisma migrate deploy && exec npm run start" ]