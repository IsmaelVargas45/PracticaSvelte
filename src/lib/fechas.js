// Los meses se manejan como texto 'AAAA-MM' (es lo que entrega <input type="month">).

export function mesActual() {
  return new Date().toLocaleDateString('en-CA').slice(0, 7)
}

export function mesDe(fecha) {
  return fecha.slice(0, 7)
}

// Cantidad de meses entre dos meses 'AAAA-MM'. Negativa si hasta es anterior a desde.
export function mesesEntre(desde, hasta) {
  const [anioDesde, mesDesde] = desde.split('-').map(Number)
  const [anioHasta, mesHasta] = hasta.split('-').map(Number)
  return (anioHasta - anioDesde) * 12 + (mesHasta - mesDesde)
}

export function formatearMes(mes) {
  return new Date(`${mes}-15T12:00:00`).toLocaleDateString('es-AR', {
    month: 'long',
    year: 'numeric',
  })
}