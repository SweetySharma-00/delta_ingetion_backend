# 🚀 Delta Ingestion Service with Lookup Resolution

A scalable backend service designed to efficiently ingest customer data by identifying and inserting only new records (delta), while maintaining referential integrity using lookup tables.

---

## 📌 Problem Overview

In real-world systems, data ingestion does not happen on empty databases. Instead:

- A destination table already contains existing records  
- New data arrives periodically via APIs, files, or streams  
- Incoming data may contain:
  - Existing records  
  - New records  
  - Invalid or inconsistent values  

### ❗ Challenges

- Avoid inserting duplicate records  
- Maintain referential integrity with lookup tables  
- Ensure high performance for large datasets (up to millions of records)  
- Handle invalid or missing data gracefully  
- Support repeated runs without side effects (idempotency)  

---

## 🎯 What This Service Solves

This service addresses the above challenges by:

- Identifying **only new records (delta)** from incoming data  
- Preventing duplicate inserts using **unique constraints and filtering**  
- Resolving lookup dependencies like:
  - `country_code → country_id`
  - `status_code → status_id`
- Ensuring **efficient and scalable ingestion** using batching and bulk operations  
- Providing **safe re-execution** without creating duplicate data  

---

## 🧠 Solution Approach

The ingestion pipeline follows these steps:

1. **Input Validation**
   - Incoming data is validated for required fields and format

2. **Data Normalization**
   - Standardizes values (e.g., uppercase codes, trimming input)

3. **Lookup Preloading**
   - Loads all lookup tables into memory for fast resolution

4. **Delta Detection**
   - Compares incoming records with existing database records using `external_id`
   - Filters out already existing records

5. **Lookup Resolution**
   - Converts `country_code` and `status_code` into corresponding database IDs

6. **Failure Handling**
   - Records with missing or invalid lookup values are skipped

7. **Batch Processing**
   - Data is processed in chunks to handle large datasets efficiently

8. **Bulk Insert**
   - Only new, valid records are inserted into the database

9. **Transaction Handling**
   - Ensures atomicity of operations

10. **Dry Run Support**
   - Allows previewing records that would be inserted without modifying the database

---

## 📡 API Endpoint

### ▶️ POST `/customers/ingest`

This endpoint ingests customer data and performs delta processing.

---
### 📥 Request Body

An array of customer objects:

```json
[
  {
    "external_id": "cust_001",
    "name": "Alice",
    "email": "alice@example.com",
    "country_code": "US",
    "status_code": "ACTIVE"
  }
]
```
---
### 📥 Response

An array of customer objects:

```json
{
  "received": 1000,
  "inserted": 120,
  "skipped_existing": 880,
  "failed": 0,
  "metrics": {
    "duration_ms": 120,
    "rows_scanned": 1000
  }
}
```
---

## ✨ Features

- ✅ Delta-based ingestion (only new records are inserted)  
- ✅ Lookup resolution using in-memory caching  
- ✅ Idempotent processing (safe to run multiple times)  
- ✅ Bulk insert operations for high performance  
- ✅ Chunk-based processing for large datasets (100k+ records)  
- ✅ Input validation using schema validation  
- ✅ Graceful handling of invalid or missing lookup values  
- ✅ Transaction-safe database operations  
- ✅ Dry-run mode to preview inserts without DB writes  
- ✅ Structured and centralized error handling  

---

## ⚙️ Setup Instructions

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Configure environment variables

```json
DB_NAME=your_database
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost
PORT=3000
```

### 3️⃣ Start the server

```bash
npm start
```

### 4️⃣ Verify server is running

```bash
GET /health
```
---

## 🚀 Performance Considerations

- **Bulk Inserts**: Reduces the number of database operations by inserting records in batches  
- **Chunk Processing**: Handles large datasets efficiently by splitting data into manageable chunks (up to 100k records)  
- **Lookup Caching**: Preloads lookup tables into memory to eliminate repeated database queries (avoids N+1 problem)  
- **Index Utilization**: Leverages indexed fields such as `external_id` and `code` for faster lookups  
- **Transaction Handling**: Ensures atomicity and consistency during batch processing  
- **Scalable Design**: Suitable for handling millions of records with minimal performance degradation  

---

## 🔒 Idempotency

The system ensures safe and repeatable ingestion:

- Running the same input multiple times will not create duplicate records  
- Existing records are identified and skipped before insertion  

This is achieved using:
- Unique constraint on `external_id`  
- Efficient delta detection before database operations  

---

## ⚠️ Edge Case Handling

- Missing lookup values → safely skipped  
- Invalid input data → rejected during validation  
- Case sensitivity issues → normalized (e.g., `us` → `US`)  
- Duplicate existing records → ignored  
- Partial failures → processed without halting the entire batch  

---

## 📊 Metrics

The service provides ingestion insights:

- `duration_ms` → Total time taken to process the request  
- `rows_scanned` → Total number of records processed  

---

## 💡 Design Decisions

### Insert-Only Strategy

- Prevents unintended overwriting of existing records  
- Keeps ingestion predictable and consistent  
- Aligns with delta-based ingestion requirements  

---

## 🎯 Summary

This service demonstrates:

- Efficient delta-based data ingestion  
- Scalable and performance-oriented backend design  
- Clean separation of concerns and maintainable architecture  
- Real-world handling of lookup dependencies and large datasets  

---

## 👨‍💻 Author

**Sweety Sharma**





