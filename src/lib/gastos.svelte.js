import { borrarGasto, crearGasto, editarGasto, listarGastos } from './repositorio.js'

class Gastos {
  // $state.raw: la lista solo se reemplaza (nunca se muta por dentro).
  lista = $state.raw([])
  cargando = $state(false)
  error = $state('')

  ordenados = $derived(
    [...this.lista].sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id),
  )

  total = $derived(this.lista.reduce((suma, gasto) => suma + gasto.monto, 0))

  porCategoria = $derived.by(() => {
    const totales = {}
    for (const gasto of this.lista) {
      totales[gasto.categoria] = (totales[gasto.categoria] ?? 0) + gasto.monto
    }
    return totales
  })

  async cargar() {
    this.lista = []
    this.cargando = true
    this.error = ''
    try {
      this.lista = await listarGastos()
    } catch (error) {
      console.error('No se pudieron cargar los gastos:', error)
      this.error = error.message || 'No se pudieron cargar los gastos.'
    } finally {
      this.cargando = false
    }
  }

  // agregar, editar y eliminar dejan que el error llegue al componente,
  // que decide cómo mostrarlo.
  async agregar(datos) {
    const nuevo = await crearGasto(datos)
    this.lista = [nuevo, ...this.lista]
  }

  async editar(id, datos) {
    const actualizado = await editarGasto(id, datos)
    this.lista = this.lista.map((gasto) => (gasto.id === id ? actualizado : gasto))
  }

  async eliminar(id) {
    await borrarGasto(id)
    this.lista = this.lista.filter((gasto) => gasto.id !== id)
  }

  vaciar() {
    this.lista = []
    this.error = ''
  }
}

export const gastos = new Gastos()