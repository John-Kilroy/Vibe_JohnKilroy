-- Migration: Add password support to users table
-- This file can be run to update the existing database

USE simple_bank;

-- Add password_hash column if it doesn't exist
ALTER TABLE users ADD COLUMN password_hash VARCHAR(256) DEFAULT NULL;
