# Backend – ระบบอนุมัติเอกสาร

## วัตถุประสงค์
Backend ส่วนนี้รับผิดชอบด้าน Business Logic และการจัดการข้อมูลเอกสาร  
ออกแบบให้แยก Layer ชัดเจน เพื่อให้ง่ายต่อการดูแลและทดสอบ

---

## เทคโนโลยีที่ใช้
- ภาษา Go
- Gin Framework
- GORM (ORM)
- SQLite / Mock Database

---

## โครงสร้างการออกแบบ
ใช้แนวคิด Layered Architecture

- Handler: รับ HTTP Request / Response
- Service: ประมวลผล Business Logic
- Repository: จัดการการเข้าถึงข้อมูล
- Model: โครงสร้างข้อมูลเอกสาร

---

## กฎทางธุรกิจ (Business Rules)
- เอกสารที่อนุมัติแล้ว ไม่สามารถอนุมัติซ้ำได้
- การอนุมัติและไม่อนุมัติต้องระบุเหตุผล
- รองรับการอัปเดตเอกสารหลายรายการพร้อมกัน (Bulk)

---

## API หลัก
- GET `/api/documents`  
  ดึงรายการเอกสารทั้งหมด

- PUT `/api/documents/approve`  
  อนุมัติเอกสารที่เลือก

- PUT `/api/documents/reject`  
  ไม่อนุมัติเอกสารที่เลือก

---

## การทดสอบ
- มี Unit Test แยกตาม Layer
- ใช้ Mock Repository เพื่อทดสอบ Service
- ตรวจสอบความถูกต้องของ Business Logic โดยไม่พึ่งฐานข้อมูลจริง

---

## การรันระบบ
```bash
go run ./cmd/server
