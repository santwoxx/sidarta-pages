-- Migration 003: Reseller System
-- Run this in Supabase SQL Editor

-- Tabela de Revendedores
CREATE TABLE IF NOT EXISTS public.resellers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  whatsapp TEXT,
  password TEXT,
  tier TEXT NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze', 'prata', 'ouro', 'diamante')),
  keys_limit INTEGER NOT NULL DEFAULT 20,
  keys_used INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Vendas
CREATE TABLE IF NOT EXISTS public.sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reseller_id UUID REFERENCES public.resellers(id) ON DELETE SET NULL,
  license_key TEXT,
  plan_type TEXT,
  client_name TEXT,
  price NUMERIC(10,2) DEFAULT 0,
  commission NUMERIC(10,2) DEFAULT 0,
  commission_pct NUMERIC(5,2) DEFAULT 0,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'cancelled', 'refunded')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reseller_id UUID REFERENCES public.resellers(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  contact TEXT,
  license_type TEXT,
  license_key TEXT,
  price NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_resellers_email ON public.resellers(email);
CREATE INDEX IF NOT EXISTS idx_resellers_tier ON public.resellers(tier);
CREATE INDEX IF NOT EXISTS idx_sales_reseller ON public.sales(reseller_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON public.sales(created_at);
CREATE INDEX IF NOT EXISTS idx_clients_reseller ON public.clients(reseller_id);
CREATE INDEX IF NOT EXISTS idx_clients_license ON public.clients(license_key);

-- RLS Policies
ALTER TABLE public.resellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "resellers_select" ON public.resellers FOR SELECT USING (true);
CREATE POLICY "sales_select" ON public.sales FOR SELECT USING (true);
CREATE POLICY "clients_select" ON public.clients FOR SELECT USING (true);

-- Allow authenticated insert/update/delete
CREATE POLICY "resellers_insert" ON public.resellers FOR INSERT WITH CHECK (true);
CREATE POLICY "resellers_update" ON public.resellers FOR UPDATE USING (true);
CREATE POLICY "resellers_delete" ON public.resellers FOR DELETE USING (true);

CREATE POLICY "sales_insert" ON public.sales FOR INSERT WITH CHECK (true);
CREATE POLICY "sales_update" ON public.sales FOR UPDATE USING (true);
CREATE POLICY "sales_delete" ON public.sales FOR DELETE USING (true);

CREATE POLICY "clients_insert" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "clients_update" ON public.clients FOR UPDATE USING (true);
CREATE POLICY "clients_delete" ON public.clients FOR DELETE USING (true);

-- Function: Get reseller stats
CREATE OR REPLACE FUNCTION public.get_reseller_stats(p_reseller_id UUID)
RETURNS JSON AS $$
DECLARE
  v_sales_count INTEGER;
  v_total_revenue NUMERIC;
  v_total_commission NUMERIC;
  v_keys_used INTEGER;
BEGIN
  SELECT COUNT(*), COALESCE(SUM(price), 0), COALESCE(SUM(commission), 0)
  INTO v_sales_count, v_total_revenue, v_total_commission
  FROM public.sales WHERE reseller_id = p_reseller_id;

  SELECT keys_used INTO v_keys_used FROM public.resellers WHERE id = p_reseller_id;

  RETURN json_build_object(
    'sales_count', v_sales_count,
    'total_revenue', v_total_revenue,
    'total_commission', v_total_commission,
    'keys_used', COALESCE(v_keys_used, 0)
  );
END;
$$ LANGUAGE plpgsql;

-- Function: Create sale with commission calculation
CREATE OR REPLACE FUNCTION public.create_sale(
  p_reseller_id UUID,
  p_license_key TEXT,
  p_plan_type TEXT,
  p_client_name TEXT,
  p_price NUMERIC
)
RETURNS JSON AS $$
DECLARE
  v_tier TEXT;
  v_commission_pct NUMERIC;
  v_commission NUMERIC;
  v_sale_id UUID;
BEGIN
  -- Get reseller tier and commission %
  SELECT tier INTO v_tier FROM public.resellers WHERE id = p_reseller_id;

  v_commission_pct := CASE v_tier
    WHEN 'bronze' THEN 10
    WHEN 'prata' THEN 15
    WHEN 'ouro' THEN 20
    WHEN 'diamante' THEN 25
    ELSE 10
  END;

  v_commission := p_price * (v_commission_pct / 100);

  -- Insert sale
  INSERT INTO public.sales (reseller_id, license_key, plan_type, client_name, price, commission, commission_pct)
  VALUES (p_reseller_id, p_license_key, p_plan_type, p_client_name, p_price, v_commission, v_commission_pct)
  RETURNING id INTO v_sale_id;

  -- Increment keys_used
  UPDATE public.resellers SET keys_used = keys_used + 1, updated_at = NOW() WHERE id = p_reseller_id;

  RETURN json_build_object(
    'success', true,
    'sale_id', v_sale_id,
    'commission', v_commission,
    'commission_pct', v_commission_pct
  );
END;
$$ LANGUAGE plpgsql;
