import { supabase } from './supabase.js'

const COLUMNAS_GASTO = 'id, descripcion, monto, categoria, fecha'
const COLUMNAS_CUOTA = 'id, descripcion, monto, categoria, mes_inicio, total_cuotas'

// ---------- Gastos ----------
// user_id no se envía: la base lo completa con auth.uid() (default de la columna).

export async function listarGastos() {
  const { data, error } = await supabase.from('gastos').select(COLUMNAS_GASTO)
  if (error) throw error
  return data
}

export async function crearGasto(datos) {
  const { data, error } = await supabase
    .from('gastos')
    .insert(datos)
    .select(COLUMNAS_GASTO)
    .single()
  if (error) throw error
  return data
}

export async function editarGasto(id, datos) {
  const { data, error } = await supabase
    .from('gastos')
    .update(datos)
    .eq('id', id)
    .select(COLUMNAS_GASTO)
    .single()
  if (error) throw error
  return data
}

export async function borrarGasto(id) {
  const { error } = await supabase.from('gastos').delete().eq('id', id)
  if (error) throw error
}

// ---------- Cuotas y servicios ----------

export async function listarCuotas() {
  const { data, error } = await supabase.from('cuotas').select(COLUMNAS_CUOTA)
  if (error) throw error
  return data
}

export async function crearCuota(datos) {
  const { data, error } = await supabase
    .from('cuotas')
    .insert(datos)
    .select(COLUMNAS_CUOTA)
    .single()
  if (error) throw error
  return data
}

export async function borrarCuota(id) {
  const { error } = await supabase.from('cuotas').delete().eq('id', id)
  if (error) throw error
}

// ---------- Ingreso mensual (una fila por usuario en user_data) ----------

export async function leerIngreso() {
  const { data, error } = await supabase
    .from('user_data')
    .select('ingreso_mensual')
    .maybeSingle()
  if (error) throw error
  return data?.ingreso_mensual ?? 0
}

export async function guardarIngreso(valor) {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) throw new Error('No hay una sesión activa.')

  const { error } = await supabase.from('user_data').upsert(
    {
      user_id: session.user.id,
      ingreso_mensual: valor,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  )
  if (error) throw error
}