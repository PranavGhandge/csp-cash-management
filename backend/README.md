# CSP Cash Management System - Backend

A backend system for managing CSP (Customer Service Point) cash operations, bank-wise online CSP balances, physical cash, denominations, customer transactions, daily opening balances, and end-of-day cash reconciliation.

---

## 1. Overview

The CSP Cash Management System is designed to solve a common problem in CSP centers:

> At the end of the day, the physical cash available at the center may not match the expected cash based on the day's transactions.

The system automatically manages:

- Users and roles
- Admin and operator management
- Multiple banks/CSP accounts
- Bank-wise online balances
- Common physical cash
- Daily bank opening balances
- Physical cash opening
- Customer withdrawals
- Customer deposits
- Cash denominations
- Transaction history
- End-of-day cash closing
- Cash shortage/excess detection
- Bank closing snapshots
- Dashboard summary
- Authentication and authorization

The backend is built using a layered architecture with Fastify, TypeScript, Sequelize, and PostgreSQL.

---

# 2. Technology Stack

## Backend

- Node.js
- TypeScript
- Fastify
- Sequelize ORM
- PostgreSQL
- JWT
- bcrypt
- Zod

## Supporting Libraries

- dotenv
- pg
- jsonwebtoken
- bcrypt
- zod

---

# 3. Backend Architecture

The backend follows a layered architecture:

```text
Client
  |
  v
Route
  |
  v
Middleware
  |
  v
Controller
  |
  v
Service
  |
  v
Repository
  |
  v
Model
  |
  v
PostgreSQL