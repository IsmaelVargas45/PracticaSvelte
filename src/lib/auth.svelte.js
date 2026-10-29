import { supabase } from './supabase.js'

export const auth = $state({ user: null, cargando: true })

export async function iniciarAuth() {
  const { data } = await supabase.auth.getSession()
  auth.user = data.session?.user ?? null
  auth.cargando = false

  supabase.auth.onAuthStateChange((_evento, session) => {
    auth.user = session?.user ?? null
  })
}

export async function registrar(email, password) {
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
}

export async function entrar(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function salir() {
  await supabase.auth.signOut()
}