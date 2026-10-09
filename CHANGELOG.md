# Changelog

All notable changes to the **University Library Study Room Booking System** (Term Project: ค่อยทำขอรำก่อน) will be documented in this file.

## [1.0.0] - 2569-10-05

### Added
- Complete implementation of University Library Study Room Booking System based on the NEW ER Diagram and Use Case Diagrams.
- Student Portal:
  - Library Home & Study Room Browsing
  - Room Booking with transaction and double-booking prevention
  - My Bookings & Booking Details
  - Student Check-in & Check-out (`CHECK_INS`, `CHECK_IN_DETAILS`)
  - Personal Booking History (UC9) with search, filter, loading state, error state, and empty state `"ไม่พบประวัติการจอง"`
- Admin Portal:
  - Room Usage Statistics Report (UC10) with date range filters, summary cards, statistical tables, and empty state `"ไม่พบข้อมูลสถิติการใช้งานตามเงื่อนไขที่เลือก"`
  - System Audit Logs & Data History viewer (`AUDIT_LOGS`, `DATA_HISTORIES`)
- Comprehensive documentation (`README.md`, `DESIGN.md`, `CONTRIBUTING.md`, `LICENSE.md`, `CHANGELOG.md`).
