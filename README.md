# ระบบจองห้องอ่านหนังสือภายในห้องสมุดมหาวิทยาลัย
# University Library Study Room Booking System

## Term Project Information
- **Group Name (ชื่อกลุ่ม):** ค่อยทำขอรำก่อน
- **Members (สมาชิก):**
  - 683380364-7 ณภัทรา พนาลิกุล
  - 683380392-2 ศุภกร วนสันเทียะ
  - 683380394-8 ศุภวัทน์ หอมกลิ่น
  - 683380395-6 สิรวุฒิ ปลัดขวา
- **Submission Date:** 5/10/2569

---

## Project Overview
This project is a production-ready frontend prototype for the **University Library Study Room Booking System** (ระบบจองห้องอ่านหนังสือภายในห้องสมุดมหาวิทยาลัย), built strictly in accordance with the NEW ER Diagram (3NF normalized, robust constraints, audit logging, status history, and transaction support).

## Main Features & Roles

### 1. Student Portal (ระบบนักศึกษา)
- **Library Home & Room Browsing (`/student/library-home`, `/student/rooms`):** Browse available library study/reading rooms, building locations, and equipment.
- **Study Room Booking (`/student/book`):** Reserve library study rooms with conflict prevention and transaction validation.
- **My Bookings (`/student/my-bookings`):** View active and upcoming bookings.
- **Check-in & Check-out (`/student/check-in`, `/student/check-out`):** Perform check-in and check-out actions for confirmed room bookings (`CHECK_INS`, `CHECK_IN_DETAILS`).
- **Personal Booking History (UC9) (`/student/booking-history`):** Complete student history with search, filter, loading state, empty state ("`ไม่พบประวัติการจอง`"), and error handling.
- **Student Dashboard (`/student/dashboard`):** Portal overview and quick statistics.

### 2. Admin Portal (ระบบผู้ดูแลระบบ)
- **Room Usage Statistics Report (UC10) (`/admin/statistics`):** Generate library study room usage statistics reports with date range, building filters, summary metrics, statistical tables, and empty state ("`ไม่พบข้อมูลสถิติการใช้งานตามเงื่อนไขที่เลือก`").
- **System Audit Logs & Data History (`/admin/audit-logs`):** Monitor system audit logs (`AUDIT_LOGS`, `DATA_HISTORIES`) and database change tracking.

---

## Technology Stack
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons
- **Architecture:** Clean service layer with mock data adhering strictly to the NEW ER Diagram.

## Installation & Running
```bash
npm install
npm run dev
```

To build for production:
```bash
npm run build
```
