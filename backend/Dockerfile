# ใช้ Node.js base image
FROM node:18

# ตั้ง working directory ภายใน container
WORKDIR /app

# คัดลอก package.json และ package-lock.json (ถ้ามี)
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์โปรเจกต์ทั้งหมดเข้า container
COPY . .

# เปิดพอร์ตที่ Express ใช้งาน (เช่น 4000 หรือแล้วแต่คุณตั้งใน .env)
EXPOSE 4000

# คำสั่งเริ่มต้นเมื่อ container รัน
CMD ["node", "server.js"]
