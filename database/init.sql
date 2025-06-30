-- Initial database setup for procurement automation app
-- This file is executed when the PostgreSQL container starts

-- Create additional schemas if needed
-- CREATE SCHEMA IF NOT EXISTS procurement;

-- Set default search path
-- ALTER DATABASE procurement_db SET search_path TO procurement, public;

-- Log initialization
SELECT 'Procurement database initialized successfully' AS status;
