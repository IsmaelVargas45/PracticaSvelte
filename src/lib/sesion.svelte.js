import { gastos } from './gastos.svelte.js'
import { supabase } from './supabase.js'

class Sesion {
  usuario = $state(null)
  cargando = $state(true)
  nombre = $derived(this.usuario?.user_metadata?.nombre?.trim() || '')

  #iniciada = false

  async iniciar() {
    if (this.#iniciada) return
    this.#iniciada = true

    supabase.auth.onAuthStateChange((_evento, sesion) => {
      this.#actualizar(sesion?.user ?? null)
    })

    const { data, error } = await supabase.auth.getSession()
    if (error) console.error('No se pudo recuperar la sesión:', error)

    let usuario = data?.session?.user ?? null

    // getSession() no consulta al servidor: comprobamos que el usuario siga existiendo.
    if (usuario) {
      const { error: errorUsuario } = await supabase.auth.getUser()
      if ([401, 403, 404].includes(errorUsuario?.status)) {
        await supabase.auth.signOut({ scope: 'local' })
        usuario = null
      }
    }

    this.#actualizar(usuario)
    this.cargando = false
  }

  async cerrarSesion() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  #actualizar(usuario) {
    // Si no hay usuario, se borran los gastos de la memoria
    if (!usuario) gastos.vaciar()
    this.usuario = usuario
  }
}

export const sesion = new Sesion()