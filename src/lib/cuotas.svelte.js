import { mesDe, mesesEntre } from './fechas.js'
import { borrarCuota, crearCuota, listarCuotas } from './repositorio.js'

class Cuotas {
  lista = $state.raw([])
  cargando = $state(false)
  error = $state('')

  ordenadas = $derived(
    [...this.lista].sort((a, b) => a.descripcion.localeCompare(b.descripcion, 'es')),
  )

  // Cuotas que se pagan en un mes ('AAAA-MM'), con el número de cuota que toca.
  delMes(mes) {
    if (!mes) return []

    const activas = []
    for (const cuota of this.lista) {
      const transcurridos = mesesEntre(mesDe(cuota.mes_inicio), mes)
      if (transcurridos < 0) continue
      if (cuota.total_cuotas !== null && transcurridos >= cuota.total_cuotas) continue
      activas.push({ ...cuota, numero: transcurridos + 1 })
    }
    return activas
  }

  async cargar() {
    this.lista = []
    this.cargando = true
    this.error = ''
    try {
      this.lista = await listarCuotas()
    } catch (error) {
      console.error('No se pudieron cargar las cuotas:', error)
      this.error = error.message || 'No se pudieron cargar las cuotas.'
    } finally {
      this.cargando = false
    }
  }

  async agregar(datos) {
    const nueva = await crearCuota(datos)
    this.lista = [...this.lista, nueva]
  }

  async eliminar(id) {
    await borrarCuota(id)
    this.lista = this.lista.filter((cuota) => cuota.id !== id)
  }

  vaciar() {
    this.lista = []
    this.error = ''
  }
}

export const cuotas = new Cuotas()