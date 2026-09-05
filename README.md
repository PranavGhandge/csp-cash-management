# CSP Cash Management System

A Cash Management System designed for CSP (Customer Service Point) centers to manage daily cash transactions, bank-wise online CSP balances, physical cash denominations, opening balances, and end-of-day cash reconciliation.

---

## 1. Project Overview

In a CSP center, customers perform two major types of transactions:

1. Withdrawal
2. Deposit

A CSP operator needs to manage:

- Physical cash available at the center
- Multiple bank CSP accounts
- Bank-wise online CSP balances
- Customer transactions
- Cash denominations
- Daily opening balances
- End-of-day cash closing
- Cash shortage or excess
- Transaction history

Managing all these things manually can lead to calculation errors and cash mismatches.

The purpose of this system is to automatically maintain these balances and provide accurate daily cash reconciliation.

---

# 2. Main Business Problem

Suppose a CSP center has:

Physical Cash:

    ₹14,200

Bank-wise online balances:

    SBI CSP          ₹50,000
    Maharashtra CSP  ₹50,000

During the day:

    SBI Withdrawal       ₹2,000
    Maharashtra Deposit  ₹3,000

At the end of the day, the system should automatically calculate:

    Expected Physical Cash

    = Opening Physical Cash
      + Total Deposits
      - Total Withdrawals

    = ₹14,200
      + ₹3,000
      - ₹2,000

    = ₹15,200

The operator then counts the actual physical cash.

If actual cash is:

    ₹15,200

Then:

    Expected Cash = ₹15,200
    Actual Cash   = ₹15,200
    Difference    = ₹0
    Status        = MATCHED

If actual cash is:

    ₹14,200

Then:

    Expected Cash = ₹15,200
    Actual Cash   = ₹14,200
    Difference    = -₹1,000
    Status        = SHORT

If actual cash is:

    ₹16,200

Then:

    Expected Cash = ₹15,200
    Actual Cash   = ₹16,200
    Difference    = +₹1,000
    Status        = EXCESS

---

# 3. Core Concept

The system maintains two different types of balances.

## 3.1 Physical Cash

Physical cash means the actual cash available at the CSP center.

It is COMMON across all banks.

Supported denominations:

    ₹500
    ₹200
    ₹100
    ₹50
    ₹20
    ₹10

Example:

    ₹500 × 20 = ₹10,000
    ₹200 × 10 = ₹2,000
    ₹100 × 15 = ₹1,500
    ₹50  × 10 = ₹500
    ₹20  × 5  = ₹100
    ₹10  × 10 = ₹100

    Total = ₹14,200

Physical cash is NOT maintained separately for each bank.

---

## 3.2 Online CSP Balance

Online balance is maintained separately for each bank.

Example:

    SBI CSP          = ₹50,000
    Maharashtra CSP  = ₹50,000

Each bank has its own:

- Bank name
- CSP ID
- Online balance

---

# 4. Transaction Business Logic

## 4.1 Withdrawal

Suppose customer withdraws:

    ₹2,000 from SBI

The customer receives physical cash.

Therefore:

    Physical Cash ↓ ₹2,000
    SBI Online Balance ↑ ₹2,000

Example:

Before:

    Physical Cash = ₹14,200
    SBI Online    = ₹50,000

After:

    Physical Cash = ₹12,200
    SBI Online    = ₹52,000

Maharashtra balance remains unchanged.

---

## 4.2 Deposit

Suppose customer deposits:

    ₹3,000 into Maharashtra Bank

The CSP receives physical cash from customer.

Therefore:

    Physical Cash ↑ ₹3,000
    Maharashtra Online Balance ↓ ₹3,000

Example:

Before:

    Physical Cash = ₹12,200
    Maharashtra Online = ₹50,000

After:

    Physical Cash = ₹15,200
    Maharashtra Online = ₹47,000

SBI balance remains unchanged.

---

# 5. Complete Transaction Flow

Example:

Opening:

    Physical Cash = ₹14,200

    SBI = ₹50,000
    Maharashtra = ₹50,000

Transaction 1:

    SBI Withdrawal = ₹2,000

Result:

    Physical Cash = ₹12,200
    SBI = ₹52,000
    Maharashtra = ₹50,000

Transaction 2:

    Maharashtra Deposit = ₹3,000

Result:

    Physical Cash = ₹15,200
    SBI = ₹52,000
    Maharashtra = ₹47,000

End of day:

    Expected Cash = ₹15,200

If actual cash counted by operator is ₹15,200:

    MATCHED

---

# 6. User Roles

The system has three roles:

    SUPER_ADMIN
    ADMIN
    OPERATOR

---

## 6.1 SUPER_ADMIN

There is exactly one Super Admin.

Super Admin is created directly in the database.

There is no public signup for Super Admin.

Responsibilities:

- Login
- Create Admin users
- Manage system-level administration

---

## 6.2 ADMIN

An Admin represents a CSP business/scope.

Admin can:

- Login
- Create Operators
- Create Banks
- Add bank CSP IDs
- Enter daily bank-wise opening balances
- Enter physical cash opening
- Create transactions
- View transactions
- Perform cash closing
- View dashboard
- View closing history

---

## 6.3 OPERATOR

Operator works under an Admin.

Operator can:

- Login
- Create transactions
- View transactions
- Enter opening balances
- Perform cash closing
- View dashboard

An Operator can only access data belonging to their Admin.

---

# 7. Multi-Tenant / Data Isolation

Every business-related record contains an `admin_id`.

Example:

    Admin A
      |
      |-- Operator A1
      |-- Operator A2
      |-- SBI
      |-- Maharashtra
      |-- Transactions
      |
      |
    Admin B
      |
      |-- Operator B1
      |-- HDFC
      |-- Transactions

Admin A must never see Admin B's data.

Therefore database queries are scoped using:

    admin_id

Example:

    where: {
        admin_id
    }

This provides tenant-level data isolation.

---

# 8. Authentication

The system uses JWT authentication.

Login flow:

    Email + Password
            |
            v
       Check User
            |
            v
     Compare Password
            |
            v
       Generate JWT
            |
            v
          Token

The token contains:

    id
    role
    admin_id

Every protected API sends:

    Authorization: Bearer <TOKEN>

The authentication middleware verifies the token.

---

# 9. Authorization

Authentication answers:

    "Who is this user?"

Authorization answers:

    "What can this user do?"

The system uses role-based authorization.

Example:

    SUPER_ADMIN
        |
        +-- Create Admin

    ADMIN
        |
        +-- Create Operator
        +-- Create Bank
        +-- Opening Balance
        +-- Transactions
        +-- Closing

    OPERATOR
        |
        +-- Transactions
        +-- Opening Balance
        +-- Closing

Role middleware checks whether the logged-in user has permission.

---

# 10. Database Tables

Main tables:

    users
    banks
    opening_balances
    physical_cash_openings
    physical_cash_balances

    transactions
    transaction_denominations

    cash_closings
    cash_closing_denominations
    cash_closing_banks

---

# 11. users

Stores all system users.

Important fields:

    id
    first_name
    last_name
    email
    password
    role
    admin_id
    status
    created_at
    updated_at

Role values:

    SUPER_ADMIN
    ADMIN
    OPERATOR

`admin_id` is used to associate an Operator with an Admin.

---

# 12. banks

Stores banks/CSP accounts belonging to an Admin.

Important fields:

    id
    admin_id
    bank_name
    csp_id
    online_balance
    status
    created_at
    updated_at

Example:

    SBI
    CSP ID = SBI-CSP-001
    Online Balance = ₹50,000

Important:

Bank creation does NOT require an opening balance.

The current online balance starts from:

    ₹0

Daily opening balance is entered separately.

---

# 13. opening_balances

Stores bank-wise daily opening balances.

Example:

    SBI
    Opening = ₹50,000

    Maharashtra
    Opening = ₹50,000

Each bank has its own opening balance.

---

# 14. physical_cash_openings

Stores the common physical cash opening for an Admin.

Example:

    ₹500 × 20
    ₹200 × 10
    ₹100 × 15
    ₹50  × 10
    ₹20  × 5
    ₹10  × 10

Total:

    ₹14,200

This is common physical cash.

It is NOT bank-wise.

---

# 15. physical_cash_balances

Stores the current physical cash state.

Example:

Opening:

    ₹14,200

After withdrawal:

    ₹12,200

After deposit:

    ₹15,200

This table represents the current physical cash balance.

---

# 16. transactions

Stores every customer transaction.

Important fields:

    id
    admin_id
    bank_id
    operator_id
    customer_name
    transaction_type
    amount
    transaction_date
    created_at
    updated_at

Transaction types:

    WITHDRAWAL
    DEPOSIT

---

# 17. transaction_denominations

Stores denomination details of every transaction.

Example:

Transaction:

    Withdrawal = ₹2,000

Denomination:

    ₹500 × 4
    ₹200 × 0
    ₹100 × 0
    ₹50  × 0
    ₹20  × 0
    ₹10  × 0

Total:

    ₹2,000

This is important because transaction history should preserve the exact notes used.

---

# 18. cash_closings

Stores end-of-day cash closing.

Important fields:

    id
    admin_id
    closing_date
    expected_cash
    actual_cash
    difference
    status
    created_by
    created_at
    updated_at

Status values:

    MATCHED
    SHORT
    EXCESS

---

# 19. cash_closing_denominations

Stores the actual denominations counted during closing.

Example:

    ₹500 × 22
    ₹200 × 10
    ₹100 × 15
    ₹50  × 10
    ₹20  × 5
    ₹10  × 10

Total:

    ₹15,200

This preserves the closing count history.

---

# 20. cash_closing_banks

Stores a snapshot of each bank's balance during closing.

Example:

    SBI
    Opening = ₹50,000
    Closing = ₹52,000

    Maharashtra
    Opening = ₹50,000
    Closing = ₹47,000

This is a historical snapshot.

If the current bank balance changes tomorrow, yesterday's closing record should remain unchanged.

---

# 21. Expected Cash Calculation

Expected physical cash is calculated as:

    Expected Cash
    =
    Opening Physical Cash
    + Total Deposits
    - Total Withdrawals

Example:

    Opening Cash     = ₹14,200
    Deposits         = ₹3,000
    Withdrawals      = ₹2,000

    Expected Cash
    = 14,200 + 3,000 - 2,000
    = ₹15,200

---

# 22. Closing Difference

The difference is:

    Difference
    =
    Actual Cash - Expected Cash

Example 1:

    Expected = ₹15,200
    Actual   = ₹15,200

    Difference = ₹0
    Status = MATCHED

Example 2:

    Expected = ₹15,200
    Actual   = ₹14,200

    Difference = -₹1,000
    Status = SHORT

Example 3:

    Expected = ₹15,200
    Actual   = ₹16,200

    Difference = +₹1,000
    Status = EXCESS

---

# 23. Transaction Safety

Transaction creation uses a database transaction.

Example:

    BEGIN TRANSACTION

        Update Physical Cash
        Update Bank Online Balance
        Create Transaction
        Create Denomination

    COMMIT

If any operation fails:

    ROLLBACK

This prevents partial updates.

For example, if physical cash is updated but bank balance update fails, the entire operation is rolled back.

---

# 24. Validation

The project uses Zod for request validation.

Example:

    Amount must be greater than 0

    Bank ID must be a valid UUID

    Transaction type must be:
        WITHDRAWAL
        or
        DEPOSIT

Denomination total must also match the transaction amount.

Example:

    Amount = ₹2,000

    ₹500 × 4 = ₹2,000

Valid.

But:

    Amount = ₹2,000

    ₹500 × 2 = ₹1,000

Invalid.

This business rule is handled in the service layer.

---

# 25. Error Handling

The project uses a centralized global error handler.

Business errors are represented using:

    AppError

Example:

    throw new AppError(
        "Bank not found",
        404
    );

The global error handler converts it into:

    {
        "success": false,
        "message": "Bank not found"
    }

This avoids repeating try/catch blocks in every controller.

---

# 26. Backend Architecture

The backend follows layered architecture.

    Request
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

---

# 27. Route Layer

Routes define API endpoints.

Example:

    POST /api/login
    POST /api/admin
    POST /api/operator
    POST /api/bank
    GET  /api/bank

    POST /api/opening-balance

    POST /api/transaction
    GET  /api/transaction
    GET  /api/transaction/:id

    POST /api/closing
    GET  /api/closing
    GET  /api/closing/:id

    GET /api/dashboard

---

# 28. Controller Layer

Controller handles:

- Request
- Params
- Query
- Request body
- Calling service
- Sending response

Controllers should not contain major business logic.

Example:

    Controller
        |
        +-- Get admin_id
        +-- Validate request
        +-- Call Service
        +-- Send response

---

# 29. Service Layer

Service contains business logic.

Example:

Withdrawal:

    Check Bank
        |
    Check Denominations
        |
    Check Physical Cash
        |
    Decrease Physical Cash
        |
    Increase Bank Online Balance
        |
    Create Transaction
        |
    Create Denomination
        |
    Commit

---

# 30. Repository Layer

Repository handles database operations.

Examples:

    findOne()
    findAll()
    create()
    findAndCountAll()

Repository should mainly focus on database access.

---

# 31. Model Layer

Models represent PostgreSQL tables using Sequelize ORM.

Technology:

    Sequelize ORM

Database:

    PostgreSQL

---

# 32. Dashboard

Dashboard provides a summarized view of the CSP center.

Dashboard API:

    GET /api/dashboard

It provides:

    Current Physical Cash

    Physical Cash Denominations

    Bank-wise Online Balances

    Today's Total Deposit

    Today's Total Withdrawal

    Today's Transaction Count

    Today's Expected Cash

    Last Closing Information

Example:

    Physical Cash
        ₹15,200

    SBI
        ₹24,000

    Maharashtra
        ₹0

    Today's Deposit
        ₹3,000

    Today's Withdrawal
        ₹2,000

    Transactions
        2

    Expected Cash
        ₹15,200

    Last Closing
        MATCHED / SHORT / EXCESS

---

# 33. Project Structure

Backend:

    backend/
    │
    ├── src/
    │   ├── config/
    │   ├── controller/
    │   ├── interface/
    │   ├── middleware/
    │   ├── model/
    │   ├── repository/
    │   ├── routes/
    │   ├── service/
    │   ├── types/
    │   ├── utils/
    │   ├── app-error.ts
    │   └── server.ts
    │
    ├── .env
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    └── README.md

Frontend:

    frontend/
    │
    ├── src/
    ├── public/
    ├── package.json
    └── ...

---

# 34. Technologies Used

## Backend

- Node.js
- TypeScript
- Fastify
- Sequelize
- PostgreSQL
- JWT
- bcrypt
- Zod

## Frontend

- React
- TypeScript
- Vite

---

# 35. Environment Variables

Backend `.env` should contain database and authentication configuration.

Example:

    DB_NAME=your_database_name
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    DB_HOST=localhost
    DB_PORT=5432

    JWT_SECRET=your_jwt_secret

Do not commit `.env` to Git.

---

# 36. Running the Backend

Install dependencies:

    npm install

Development:

    npm run dev

Build:

    npm run build

Production:

    npm start

---

# 37. API Authentication Example

Login:

    POST /api/login

Request:

    {
        "email": "admin@example.com",
        "password": "password"
    }

Response contains:

    token

Use the token for protected APIs:

    Authorization: Bearer <token>

---

# 38. Typical Daily Workflow

A normal CSP working day looks like this:

## Morning

1. Admin/Operator logs in.
2. Enter bank-wise opening balances.
3. Enter common physical cash opening.
4. System starts tracking transactions.

## During the day

5. Customer performs withdrawal/deposit.
6. Operator selects bank.
7. Operator enters customer details.
8. Operator enters amount.
9. Operator enters denominations.
10. System validates transaction.
11. Physical cash is updated.
12. Bank online balance is updated.
13. Transaction history is stored.

## End of day

14. Operator counts physical cash.
15. Enters denomination counts.
16. System calculates actual cash.
17. System calculates expected cash.
18. System calculates difference.
19. System marks:

        MATCHED
        SHORT
        EXCESS

20. Bank closing balances are stored as a snapshot.

---

# 39. Important Design Principles

## Physical cash is common

Do NOT maintain:

    SBI Physical Cash
    Maharashtra Physical Cash

Instead maintain:

    Common Physical Cash

---

## Online balances are bank-wise

Maintain:

    SBI Online Balance
    Maharashtra Online Balance
    HDFC Online Balance
    etc.

---

## History should never be lost

Current balances can change.

Historical records should remain.

For example:

    Current Bank Balance
        |
        +-- banks.online_balance

    Transaction History
        |
        +-- transactions

    Closing History
        |
        +-- cash_closings

---

# 40. Example Database Relationship

    Users
      |
      | admin_id
      v
    Admin
      |
      +--------------------+
      |                    |
      v                    v
    Operators            Banks
                           |
                           |
                           v
                       Transactions
                           |
                           v
                 Transaction Denominations


    Admin
      |
      +--> Physical Cash Opening
      |
      +--> Physical Cash Balance
      |
      +--> Cash Closing
                |
                +--> Closing Denominations
                |
                +--> Closing Bank Snapshots

---

# 41. Security Considerations

The application should:

- Never store plain-text passwords.
- Hash passwords using bcrypt.
- Protect private APIs using JWT.
- Validate user roles.
- Scope data using admin_id.
- Prevent inactive users from logging in.
- Never expose `.env` secrets.
- Validate request payloads.
- Use database transactions for financial operations.

---

# 42. Future Improvements

Possible future modules/features:

- Advanced transaction reports
- Daily/monthly reports
- PDF reports
- Excel export
- Email notifications
- SMS notifications
- Audit logs
- Operator activity tracking
- Bank-wise reports
- Cash denomination reports
- Dashboard charts
- Date-wise closing reports
- Search and advanced filters
- Automated backups
- Deployment
- Docker
- CI/CD
- Production monitoring

---

# 43. Current Project Status

Backend modules completed:

    ✅ User & Role Management
    ✅ Super Admin
    ✅ Admin Creation
    ✅ Operator Creation
    ✅ Login
    ✅ JWT Authentication
    ✅ Role Authorization
    ✅ Bank Management
    ✅ Bank-wise Opening Balance
    ✅ Physical Cash Opening
    ✅ Physical Cash Balance
    ✅ Withdrawal
    ✅ Deposit
    ✅ Transaction Denominations
    ✅ Transaction History
    ✅ Cash Closing
    ✅ Closing Denominations
    ✅ Closing Bank Snapshot
    ✅ Pagination
    ✅ Search / Filters
    ✅ Zod Validation
    ✅ AppError
    ✅ Global Error Handling
    ✅ Dashboard API

Frontend:

    🚧 Dashboard UI
    🚧 Authentication UI
    🚧 Admin UI
    🚧 Operator UI
    🚧 Bank Management UI
    🚧 Opening Balance UI
    🚧 Transaction UI
    🚧 Closing UI
    🚧 History UI

---

# 44. Final Business Flow

The complete system flow is:

    SUPER ADMIN
         |
         v
    Create ADMIN
         |
         v
    ADMIN
      |
      +---- Create Operators
      |
      +---- Create Banks
      |
      +---- Set Bank Opening Balances
      |
      +---- Set Physical Cash Opening
      |
      v
    DAILY OPERATIONS
      |
      +---- Withdrawal
      |       |
      |       +--> Physical Cash decreases
      |       +--> Bank Online Balance increases
      |
      +---- Deposit
              |
              +--> Physical Cash increases
              +--> Bank Online Balance decreases
      |
      v
    END OF DAY
      |
      v
    CASH CLOSING
      |
      +---- Expected Cash
      +---- Actual Cash
      +---- Difference
      |
      +---- MATCHED
      +---- SHORT
      +---- EXCESS
      |
      v
    CLOSING HISTORY

---

# 45. Project Goal

The ultimate goal of this system is to make CSP cash management:

    Accurate
    Simple
    Traceable
    Secure
    Automated

The operator should not need to manually calculate:

    "How much cash should I have?"

The system should calculate it automatically and clearly show:

    Expected Cash
    Actual Cash
    Difference
    Bank-wise Online Balances
    Transaction History

This helps identify cash mismatch at the end of the day and provides a complete history of CSP financial operations.