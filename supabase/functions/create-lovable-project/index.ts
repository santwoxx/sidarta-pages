import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { token_lovable, name = "Novo Projeto Spoofer" } = await req.json();

    if (!token_lovable) {
      return new Response(JSON.stringify({ success: false, error: 'Missing token' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const workspacesRes = await fetch("https://api.lovable.dev/user/workspaces", {
      headers: { 'Authorization': `Bearer ${token_lovable}` }
    });
    const workspaces = await workspacesRes.json();
    if (!workspaces || workspaces.length === 0 || !workspaces[0]?.id) {
      return new Response(JSON.stringify({ success: false, error: 'Nenhum workspace encontrado' }), {
        status: 400,
        headers: corsHeaders
      });
    }
    const workspaceId = workspaces[0].id;

    const createRes = await fetch(`https://api.lovable.dev/workspaces/${workspaceId}/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token_lovable}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, template: "blank" })
    });

    if (!createRes.ok) {
      return new Response(JSON.stringify({ success: false, error: 'Falha ao criar projeto no Lovable' }), {
        status: createRes.status,
        headers: corsHeaders
      });
    }

    const project = await createRes.json();

    return new Response(JSON.stringify({
      success: true,
      link: `https://lovable.dev/projects/${project.id}`,
      projectId: project.id
    }), { headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
});
