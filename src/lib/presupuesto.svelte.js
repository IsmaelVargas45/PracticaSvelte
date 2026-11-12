import { guardarIngreso, leerIngreso } from './repositorio.js'

class Presupuesto {
  ingreso = $state(0)
  cargando = $state(false)
  error = $state('')

  async cargar() {
    this.cargando = true
    this.error = ''
    try {
      this.ingreso = await leerIngreso()
    } catch (error) {
      console.error('No se pudo cargar el ingreso:', error)
      this.error = error.message || 'No se pudo cargar el ingreso.'
    } finally {
      this.cargando = false
    }
  }

  async guardar(valor) {
    await guardarIngreso(valor)
    this.ingreso = valor
  }

  vaciar() {
    this.ingreso = 0
    this.error = ''
  }
}

export const presupuesto = new Presupuesto()