FROM node:20-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg xvfb chromium ca-certificates fonts-liberation && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY . .
ENV PORT=8080 DISPLAY=:99
EXPOSE 8080
CMD ["node", "server.js"]
