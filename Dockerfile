FROM node:20.12-alpine as build

LABEL org.opencontainers.image.authors="Eling486"

WORKDIR /app/EasyAnime
RUN apk add python3 && \
    apk add gcc && \
    apk add g++ && \ 
    apk add make
ADD ./backend/ /app/EasyAnime/backend/
ADD ./package.json /app/EasyAnime/package.json
RUN npm i --production

FROM node:20.12-alpine
COPY --from=build /app/EasyAnime /app
RUN rm -rf /app/EasyAnime
WORKDIR /app
RUN npm i pm2 -g

EXPOSE 3486

ENTRYPOINT ["npm", "start"]