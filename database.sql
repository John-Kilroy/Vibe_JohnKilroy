-- ============================================================
--  Simple Bank Application  –  Database Initialization Script
-- ============================================================

CREATE DATABASE IF NOT EXISTS simple_bank;
USE simple_bank;

-- ─────────────────────────────────────────────
-- 1. USERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  user_id    INT          PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────
-- 2. ACCOUNTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS accounts (
  account_id   INT            PRIMARY KEY AUTO_INCREMENT,
  user_id      INT            NOT NULL,
  balance      DECIMAL(10,2)  DEFAULT 0.00,
  account_type VARCHAR(50)    NOT NULL,
  created_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_account_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- ─────────────────────────────────────────────
-- 3. TRANSACTIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
  txn_id     INT           PRIMARY KEY AUTO_INCREMENT,
  account_id INT           NOT NULL,
  txn_type   VARCHAR(20)   NOT NULL,   -- 'DEPOSIT' | 'WITHDRAWAL'
  amount     DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_txn_account FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

-- ─────────────────────────────────────────────
-- 4. SEED DATA (optional demo rows)
-- ─────────────────────────────────────────────
INSERT INTO users (name, email) VALUES
  ('Alice Johnson', 'alice@example.com'),
  ('Bob Smith',     'bob@example.com');

INSERT INTO accounts (user_id, balance, account_type) VALUES
  (1, 1500.00, 'SAVINGS'),
  (2,  800.00, 'CHECKING');

INSERT INTO transactions (account_id, txn_type, amount) VALUES
  (1, 'DEPOSIT',    1500.00),
  (2, 'DEPOSIT',    1000.00),
  (2, 'WITHDRAWAL',  200.00);
