-- Tabela compartilhada de licencas para integracao com painel web
CREATE TABLE IF NOT EXISTS shared_licenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL DEFAULT 'basic',
  max_devices INTEGER NOT NULL DEFAULT 2,
  expires_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  revoked BOOLEAN DEFAULT false,
  revoked_at TIMESTAMPTZ,
  created_by TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index para busca rapida por chave
CREATE INDEX IF NOT EXISTS idx_shared_licenses_key ON shared_licenses(key);
CREATE INDEX IF NOT EXISTS idx_shared_licenses_active ON shared_licenses(active, revoked);

-- RLS policies
ALTER TABLE shared_licenses ENABLE ROW LEVEL SECURITY;

-- Anyone can read licenses (for validation)
CREATE POLICY "Allow read licenses" ON shared_licenses
  FOR SELECT USING (true);

-- Only authenticated users can insert/update
CREATE POLICY "Allow insert licenses" ON shared_licenses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update licenses" ON shared_licenses
  FOR UPDATE USING (true);

-- Function to validate a license key
CREATE OR REPLACE FUNCTION validate_shared_license(p_key TEXT, p_device_id TEXT)
RETURNS JSON AS $$
DECLARE
  v_license RECORD;
  v_device_count INTEGER;
  v_result JSON;
BEGIN
  -- Find the license
  SELECT * INTO v_license
  FROM shared_licenses
  WHERE key = p_key AND active = true AND (revoked = false OR revoked IS NULL);

  IF NOT FOUND THEN
    RETURN json_build_object('valid', false, 'error', 'Licenca nao encontrada ou revogada');
  END IF;

  -- Check expiry
  IF v_license.expires_at IS NOT NULL AND v_license.expires_at < NOW() THEN
    RETURN json_build_object('valid', false, 'error', 'Licenca expirada');
  END IF;

  -- Check device limit (count devices from device_history)
  SELECT COUNT(DISTINCT device_id) INTO v_device_count
  FROM license_devices
  WHERE license_key = p_key;

  IF v_device_count >= v_license.max_devices THEN
    -- Check if this device is already registered
    IF NOT EXISTS (
      SELECT 1 FROM license_devices
      WHERE license_key = p_key AND device_id = p_device_id
    ) THEN
      -- Revoke the license
      UPDATE shared_licenses
      SET revoked = true, revoked_at = NOW(), active = false
      WHERE key = p_key;

      RETURN json_build_object(
        'valid', false,
        'error', 'Limite de dispositivos atingido. Licenca revogada.',
        'revoked', true
      );
    END IF;
  END IF;

  -- Register this device
  INSERT INTO license_devices (license_key, device_id, first_seen, last_seen)
  VALUES (p_key, p_device_id, NOW(), NOW())
  ON CONFLICT (license_key, device_id)
  DO UPDATE SET last_seen = NOW();

  -- Return success
  RETURN json_build_object(
    'valid', true,
    'type', v_license.type,
    'max_devices', v_license.max_devices,
    'expires_at', v_license.expires_at,
    'is_admin', v_license.type IN ('life', 'pro')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Table for device tracking
CREATE TABLE IF NOT EXISTS license_devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  license_key TEXT NOT NULL,
  device_id TEXT NOT NULL,
  first_seen TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(license_key, device_id)
);

CREATE INDEX IF NOT EXISTS idx_license_devices_key ON license_devices(license_key);

-- RLS for license_devices
ALTER TABLE license_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all license_devices" ON license_devices
  FOR ALL USING (true);

-- Function to add a license (from web panel or admin)
CREATE OR REPLACE FUNCTION add_shared_license(
  p_key TEXT,
  p_type TEXT DEFAULT 'basic',
  p_max_devices INTEGER DEFAULT 2,
  p_expires_at TIMESTAMPTZ DEFAULT NULL,
  p_created_by TEXT DEFAULT 'admin'
)
RETURNS JSON AS $$
BEGIN
  INSERT INTO shared_licenses (key, type, max_devices, expires_at, created_by)
  VALUES (p_key, p_type, p_max_devices, p_expires_at, p_created_by)
  ON CONFLICT (key) DO UPDATE SET
    type = EXCLUDED.type,
    max_devices = EXCLUDED.max_devices,
    expires_at = EXCLUDED.expires_at,
    active = true,
    revoked = false,
    updated_at = NOW();

  RETURN json_build_object('success', true, 'key', p_key);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to revoke a license
CREATE OR REPLACE FUNCTION revoke_shared_license(p_key TEXT)
RETURNS JSON AS $$
BEGIN
  UPDATE shared_licenses
  SET revoked = true, revoked_at = NOW(), active = false
  WHERE key = p_key;

  RETURN json_build_object('success', true, 'key', p_key);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
