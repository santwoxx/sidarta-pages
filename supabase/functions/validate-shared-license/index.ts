import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { key, device_id } = await req.json();

    if (!key || !device_id) {
      return new Response(
        JSON.stringify({ valid: false, error: "Key and device_id required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const normalizedKey = key.trim().toUpperCase();

    // Check hardcoded keys first
    if (normalizedKey === "VITALICIO-3437-37773-37737") {
      return new Response(
        JSON.stringify({ valid: true, type: "life", max_devices: 99, is_admin: true, is_owner: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (normalizedKey === "SATURE-ADMIN-MASTER") {
      return new Response(
        JSON.stringify({ valid: true, type: "life", max_devices: 5, is_admin: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (normalizedKey === "SATURE-LIFE-2026") {
      return new Response(
        JSON.stringify({ valid: true, type: "life", max_devices: 5, is_admin: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check pattern-based keys
    const matchSature = normalizedKey.match(/^SATURE-(BASIC|PRO|TEST|LIFE)-([A-Z0-9]{4})$/);
    if (matchSature) {
      const typeMap: Record<string, string> = { BASIC: "basic", PRO: "pro", TEST: "test", LIFE: "life" };
      const devsMap: Record<string, number> = { basic: 2, pro: 3, test: 1, life: 5 };
      const t = typeMap[matchSature[1]];
      return new Response(
        JSON.stringify({ valid: true, type: t, max_devices: devsMap[t], is_admin: t === "life" || t === "pro" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const matchLov4 = normalizedKey.match(/^LOV4-([A-Z0-9]{4,12})$/);
    if (matchLov4) {
      return new Response(
        JSON.stringify({ valid: true, type: "life", max_devices: 5, is_admin: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // MS-T/B/P/L-XXX-XXXX-XXXX (admin generated keys with type prefix)
    const matchMS = normalizedKey.match(/^MS-([TBPLX])([A-Z0-9]{4})-([A-Z0-9]{4})-([A-Z0-9]{4})$/);
    if (matchMS) {
      const typeMap: Record<string, string> = { T: "test", B: "basic", P: "pro", L: "life", X: "life" };
      const devsMap: Record<string, number> = { test: 1, basic: 2, pro: 3, life: 5 };
      const t = typeMap[matchMS[1]] || "life";
      // Fall through to table check, but we know the type
    }

    // MS-XXXX-XXXX (shorter format)
    const matchMS2 = normalizedKey.match(/^MS-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    if (matchMS2) {
      // Fall through to table check below
    }

    const matchGeneric = normalizedKey.match(/^MS-([A-Z]+)-([A-Z0-9]{4,12})$/);
    if (matchGeneric) {
      // Fall through to table check below
    }

    // Check shared_licenses table (new column names)
    const { data: license, error: licError } = await supabase
      .from("shared_licenses")
      .select("*")
      .eq("license_key", normalizedKey)
      .single();

    if (licError || !license) {
      // If table doesn't exist or key not found, allow pattern-matched keys
      if (matchMS || matchMS2 || matchGeneric) {
        const typeMap: Record<string, string> = { T: "test", B: "basic", P: "pro", L: "life", X: "life" };
        const devsMap: Record<string, number> = { test: 1, basic: 2, pro: 3, life: 5 };
        const t = matchMS ? (typeMap[matchMS[1]] || "life") : "life";
        return new Response(
          JSON.stringify({ valid: true, type: t, max_devices: devsMap[t] || 5, is_admin: t === "life" || t === "pro" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ valid: false, error: "Licenca nao encontrada" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if revoked
    if (license.status === "revoked") {
      return new Response(
        JSON.stringify({ valid: false, error: "Licenca revogada", revoked: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check expiry
    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ valid: false, error: "Licenca expirada" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check device limit
    const { count: deviceCount } = await supabase
      .from("license_devices")
      .select("device_id", { count: "exact", head: true })
      .eq("license_key", normalizedKey);

    if (deviceCount && deviceCount >= license.max_devices) {
      const { data: existingDevice } = await supabase
        .from("license_devices")
        .select("device_id")
        .eq("license_key", normalizedKey)
        .eq("device_id", device_id)
        .single();

      if (!existingDevice) {
        await supabase
          .from("shared_licenses")
          .update({ status: "revoked", revoked_at: new Date().toISOString() })
          .eq("license_key", normalizedKey);

        return new Response(
          JSON.stringify({ valid: false, error: "Limite de dispositivos atingido. Licenca revogada.", revoked: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Register this device
    await supabase
      .from("license_devices")
      .upsert(
        { license_key: normalizedKey, device_id, last_seen: new Date().toISOString() },
        { onConflict: "license_key,device_id" }
      );

    return new Response(
      JSON.stringify({
        valid: true,
        type: license.plan_type,
        max_devices: license.max_devices,
        expires_at: license.expires_at,
        is_admin: license.plan_type === "life" || license.plan_type === "pro",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ valid: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
