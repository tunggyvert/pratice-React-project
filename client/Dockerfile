FROM node:18

# ตั้ง working directory
WORKDIR /app

# คัดลอกและติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# คัดลอก source code ทั้งหมด
COPY . .

# Build โปรเจกต์ Vite
RUN npm run build

# ติดตั้ง serve เพื่อเสิร์ฟ static files
RUN npm install -g serve

# เปิดพอร์ต 5173 (Vite default)
EXPOSE 5173

# เสิร์ฟไฟล์จากโฟลเดอร์ dist (ที่ Vite build ไว้)
CMD ["serve", "-s", "dist", "-l", "5173","--single"]
