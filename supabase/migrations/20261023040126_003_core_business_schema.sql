-- DallasCircle Core Schema

-- Enums
CREATE TYPE field_source AS ENUM ('google_business_profile', 'merchant_submission', 'website_crawl', 'ai_extraction', 'manual_entry');
CREATE TYPE verification_method AS ENUM ('api_sync', 'email_verification', 'document_upload', 'phone_verification', 'in_person_verification', 'none');
CREATE TYPE merchant_claim_status AS ENUM ('pending', 'approved', 'rejected', 'disputed');
CREATE TYPE merchant_role AS ENUM ('owner', 'manager', 'analyst');
CREATE TYPE audit_status AS ENUM ('pending', 'in_progress', 'complete', 'failed');
CREATE TYPE business_category AS ENUM ('restaurant', 'hvac', 'plumbing', 'electrical', 'construction', 'professional_services', 'retail', 'healthcare', 'education', 'other');

-- Core Tables
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category business_category NOT NULL,
  website VARCHAR(2048),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'USA',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  verified_owner_id UUID,
  verified_at TIMESTAMP,
  verification_method verification_method DEFAULT 'none',
  disputed BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_city ON businesses(city);
CREATE INDEX idx_businesses_verified_owner ON businesses(verified_owner_id);

CREATE TABLE business_field_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  field_name VARCHAR(100) NOT NULL,
  field_value TEXT NOT NULL,
  data_type VARCHAR(50),
  source field_source NOT NULL,
  verified_at TIMESTAMP NOT NULL,
  verification_method verification_method NOT NULL,
  confidence DECIMAL(3, 2) NOT NULL,
  previous_value TEXT,
  changed_by UUID,
  changed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(business_id, field_name)
);

CREATE INDEX idx_field_values_business ON business_field_values(business_id);
CREATE INDEX idx_field_values_source ON business_field_values(source);

CREATE TABLE business_field_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_value_id UUID NOT NULL REFERENCES business_field_values(id) ON DELETE CASCADE,
  old_value TEXT,
  new_value TEXT NOT NULL,
  changed_by UUID,
  changed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_field_history_field ON business_field_history(field_value_id);

-- Merchant Tables
CREATE TABLE merchant_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  company_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_merchants_email ON merchant_accounts(email);

CREATE TABLE business_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES merchant_accounts(id) ON DELETE CASCADE,
  status merchant_claim_status DEFAULT 'pending',
  claimed_at TIMESTAMP DEFAULT NOW(),
  verified_at TIMESTAMP,
  verification_method verification_method DEFAULT 'none',
  verification_evidence JSONB,
  disputed BOOLEAN DEFAULT false,
  dispute_reason TEXT,
  dispute_evidence JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(business_id, merchant_id)
);

CREATE INDEX idx_claims_business ON business_claims(business_id);
CREATE INDEX idx_claims_merchant ON business_claims(merchant_id);
CREATE INDEX idx_claims_status ON business_claims(status);

CREATE TABLE merchant_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES merchant_accounts(id) ON DELETE CASCADE,
  role merchant_role NOT NULL,
  granted_at TIMESTAMP DEFAULT NOW(),
  granted_by UUID,
  revoked_at TIMESTAMP,
  revoked_by UUID,
  revocation_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(business_id, merchant_id)
);

CREATE INDEX idx_permissions_business ON merchant_permissions(business_id);
CREATE INDEX idx_permissions_merchant ON merchant_permissions(merchant_id);
CREATE INDEX idx_permissions_role ON merchant_permissions(role);

-- Audit Product
CREATE TABLE website_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES merchant_accounts(id) ON DELETE CASCADE,
  status audit_status DEFAULT 'pending',
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  findings JSONB,
  report_sent_at TIMESTAMP,
  follow_up_offer VARCHAR(255),
  follow_up_sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audits_business ON website_audits(business_id);
CREATE INDEX idx_audits_merchant ON website_audits(merchant_id);
CREATE INDEX idx_audits_status ON website_audits(status);

-- Editorial Content
CREATE TABLE editorial_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL,
  published_at TIMESTAMP,
  requires_approval BOOLEAN DEFAULT true,
  approved_by UUID,
  approved_at TIMESTAMP,
  content_type VARCHAR(50) NOT NULL,
  meta_description VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_content_slug ON editorial_content(slug);
CREATE INDEX idx_content_published ON editorial_content(published_at);

CREATE TABLE editorial_business_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  editorial_content_id UUID NOT NULL REFERENCES editorial_content(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  is_sponsored BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  mention_context TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mentions_content ON editorial_business_mentions(editorial_content_id);
CREATE INDEX idx_mentions_business ON editorial_business_mentions(business_id);

-- Service Leads
CREATE TABLE service_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  business_name VARCHAR(255),
  website VARCHAR(2048),
  service_type VARCHAR(100),
  budget VARCHAR(100),
  status VARCHAR(50) DEFAULT 'inquiry',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sl_email ON service_leads(email);
CREATE INDEX idx_sl_status ON service_leads(status);

-- Row Level Security
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_field_values ENABLE ROW LEVEL SECURITY;
