-- =====================================================================
-- IndoHood (इण्डोहूड) Civic Waste Segregation & Circular Economy Schema
-- Dialect: Standard SQL / SQLite / PostgreSQL Compatible DDL
-- =====================================================================

-- 1. Users Table (Residents & Eco-Pickers)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    role VARCHAR(32) DEFAULT 'resident', -- 'resident' | 'picker' | 'admin'
    address TEXT NOT NULL,
    phone VARCHAR(32),
    avatar TEXT,
    bio TEXT,
    wallet_balance INTEGER DEFAULT 120,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Waste Item Classification Taxonomy
CREATE TABLE IF NOT EXISTS waste_categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    stream VARCHAR(32) NOT NULL, -- 'degradable' | 'non-degradable' | 'landfill'
    stream_label VARCHAR(64) NOT NULL,
    bin_color VARCHAR(32) NOT NULL, -- 'green' | 'blue' | 'black'
    bin_name VARCHAR(64) NOT NULL,
    scrap_rate VARCHAR(64) NOT NULL,
    base_credits_awarded INTEGER NOT NULL,
    avg_co2_offset_grams INTEGER NOT NULL,
    disposal_tips TEXT
);

-- 3. Doorstep Pickups & Scrap Handovers
CREATE TABLE IF NOT EXISTS pickups (
    id VARCHAR(64) PRIMARY KEY,
    booking_ref VARCHAR(32) UNIQUE NOT NULL,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id VARCHAR(64),
    item_name VARCHAR(128) NOT NULL,
    item_icon VARCHAR(16) DEFAULT '📦',
    stream VARCHAR(32) NOT NULL,
    stream_label VARCHAR(64) NOT NULL,
    weight_est VARCHAR(32) NOT NULL,
    credits INTEGER NOT NULL,
    co2_grams INTEGER NOT NULL,
    pickup_date DATE NOT NULL,
    time_slot VARCHAR(64) NOT NULL,
    address TEXT NOT NULL,
    instructions TEXT,
    status VARCHAR(32) DEFAULT 'SCHEDULED', -- 'SCHEDULED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED'
    verified_by_picker_id VARCHAR(64) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- 4. Neighborhood Activity Stream
CREATE TABLE IF NOT EXISTS activities (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(128) NOT NULL,
    user_location VARCHAR(128) NOT NULL,
    society VARCHAR(128) DEFAULT 'Green Valley Society',
    user_avatar TEXT,
    action_title TEXT NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'Dry Scrap' | 'Composting' | 'E-Waste' | 'Community Drives' | 'Upcycling DIY'
    badge_color VARCHAR(32) DEFAULT 'emerald',
    impact_stat VARCHAR(128) NOT NULL,
    credits_earned INTEGER DEFAULT 25,
    image_url TEXT,
    notes TEXT,
    verified BOOLEAN DEFAULT TRUE,
    cheers_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Waste Awareness & Environmental Articles
CREATE TABLE IF NOT EXISTS articles (
    id VARCHAR(64) PRIMARY KEY,
    title TEXT NOT NULL,
    topic VARCHAR(64) NOT NULL,
    read_time VARCHAR(32) NOT NULL,
    summary TEXT NOT NULL,
    image_url TEXT,
    takeaways TEXT, -- JSON array of bullet points
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Fast Lookups
CREATE INDEX IF NOT EXISTS idx_pickups_user ON pickups(user_id);
CREATE INDEX IF NOT EXISTS idx_pickups_status ON pickups(status);
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category);
CREATE INDEX IF NOT EXISTS idx_activities_created ON activities(created_at DESC);
