FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY backend/package.json ./backend/
RUN cd backend && npm install

COPY frontend/package.json ./frontend/
RUN cd frontend && npm install

COPY . .
RUN echo "rebuild-1694520000" > /tmp/rebuild-marker
RUN cd frontend && npm run build

EXPOSE 5000

CMD ["node", "backend/server.js"]
