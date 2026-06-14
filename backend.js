// backend.js — conexión canon al backend del estudio (Supabase)
// Ver 03_Recursos/BACKEND.md. Para otro proyecto solo cambia PROYECTO_SLUG.

const SUPABASE_URL      = 'https://zpvdswqnhdqnpdtmgsmw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwdmRzd3FuaGRxbnBkdG1nc213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyOTMwODIsImV4cCI6MjA5Njg2OTA4Mn0.6i-ei2Z875hCce02sjE7g0byz9rD2wdLBq58qJUmtg8';
const PROYECTO_SLUG     = 'nashira';

async function supabaseGet(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}`);
  return res.json();
}

// Disponibilidad del proyecto: [{ nivel, tipo, m2, estado }]
async function fetchDisponibilidad() {
  return supabaseGet(
    `unidades?select=nivel,tipo,m2,estado,precio,torres!inner(proyectos!inner(slug))` +
    `&torres.proyectos.slug=eq.${PROYECTO_SLUG}`
  );
}

// Captura de lead. unidad: { nivel, tipo } opcional.
async function enviarLead({ nombre, email, telefono, mensaje }) {
  const proyectos = await supabaseGet(`proyectos?select=id&slug=eq.${PROYECTO_SLUG}`);
  if (!proyectos.length) throw new Error('Proyecto no encontrado');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ proyecto_id: proyectos[0].id, nombre, email, telefono, mensaje }),
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}`);
}

window.MonolitoBackend = { fetchDisponibilidad, enviarLead };
