const moneda = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })

export function formatearMoneda(valor) {
  return moneda.format(valor)
}

// Las fechas llegan como AAAA-MM-DD. Se arman a mediodía local para evitar

export function formatearFecha(fecha) {
  return new Date(`${fecha}T12:00:00`).toLocaleDateString('es-AR')
}