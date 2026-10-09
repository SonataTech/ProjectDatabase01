# System Design & Architecture (University Library Study Room Booking System)

## Term Project Information
- **Group Name:** ค่อยทำขอรำก่อน
- **Project Title:** ระบบจองห้องอ่านหนังสือภายในห้องสมุดมหาวิทยาลัย (University Library Study Room Booking System)
- **Members:** 
  1. 683380364-7 ณภัทรา พนาลิกุล
  2. 683380392-2 ศุภกร วนสันเทียะ
  3. 683380394-8 ศุภวัทน์ หอมกลิ่น
  4. 683380395-6 สิรวุฒิ ปลัดขวา

---

## Architectural Flow (Source of Truth)
```
NEW ER Diagram (3NF Normalized, Constraints, Transactions)
        ↓
Database (PostgreSQL / MySQL)
        ↓
Backend / API (REST API / Transactions)
        ↓
Frontend (React + Vite + TypeScript + Tailwind CSS)
```

## Database Schema & 3NF Improvements
The new database design solves previous issues (redundancy, missing audit logs, lack of transactions, weak password storage, unconstrained status updates) across 12 core tables:
1. `ROLES`
2. `PERMISSIONS`
3. `ROLE_PERMISSIONS`
4. `DEPARTMENTS`
5. `POSITIONS`
6. `USERS` (with `password_hash`, `email` UNIQUE)
7. `STUDENTS`
8. `WORKS` (representing study room sessions/reservations with start_time, end_time, location)
9. `CHECK_INS` (representing bookings and check-in statuses)
10. `CHECK_IN_DETAILS` (representing check-in and check-out timestamps 'IN' / 'OUT')
11. `AUDIT_LOGS` (tracking who, what, when, table name, record id)
12. `DATA_HISTORIES` (field-level change logs)

---

## Transactions in System Design
- **Transaction 1: Create Room Booking Transaction**
  - Validates user, study room availability, and conflict check.
  - Inserts booking into `CHECK_INS`, logs history, and commits. Rolls back on any failure (double booking or invalid room).
- **Transaction 2: Room Check-in / Check-out Transaction**
  - Validates booking status and time window.
  - Updates booking status (`CHECKED_IN` / `COMPLETED`).
  - Records timestamp in `CHECK_IN_DETAILS`.
  - Records action in `AUDIT_LOGS`.

---

## Role-Based Access Control & Navigation
- **Student Portal (`/student/...`):**
  - Library Home & Room Browsing (`/student/library-home`, `/student/rooms`)
  - Room Booking & Details (`/student/rooms/:id`, `/student/book`)
  - Active Bookings (`/student/my-bookings`)
  - Check-in & Check-out (`/student/check-in`, `/student/check-out`)
  - Personal Booking History - UC9 (`/student/booking-history`) with empty state `"ไม่พบประวัติการจอง"`
  - Student Dashboard (`/student/dashboard`)
- **Admin Portal (`/admin/...`):**
  - Room Usage Statistics Report - UC10 (`/admin/statistics`) with conditional filters and empty state `"ไม่พบข้อมูลสถิติการใช้งานตามเงื่อนไขที่เลือก"`
  - System Audit Logs & Data History (`/admin/audit-logs`)
