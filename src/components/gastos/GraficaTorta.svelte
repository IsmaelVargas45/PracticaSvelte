<script>
  // Solo se registran las piezas necesarias: la dona y sus arcos.
  // El tooltip y la leyenda de Chart.js no se usan (se reemplazan por HTML propio).
  import { ArcElement, Chart, DoughnutController } from 'chart.js'
  import { formatearMoneda } from '../../lib/formato.js'

  Chart.register(DoughnutController, ArcElement)

  // datos: [{ categoria, total }], por ejemplo porCategoria de Resumen.
  let { datos } = $props()

  const COLORES = [
    '#266452',
    '#e0a14f',
    '#5b84b1',
    '#c8553d',
    '#9a86bd',
    '#8fb58a',
    '#c2a878',
    '#9a9a92',
  ]

  const porcentaje = new Intl.NumberFormat('es-AR', {
    style: 'percent',
    maximumFractionDigits: 1,
  })

  const pesos = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  })

  // Índice de la porción sobre la que está el mouse (null = ninguna)
  let activa = $state(null)

  let total = $derived(datos.reduce((suma, dato) => suma + dato.total, 0))
  let activo = $derived(activa === null ? null : (datos[activa] ?? null))

  // Attachment: conecta Chart.js con el <canvas>. Al leer `datos` acá adentro,
  // se vuelve a crear el gráfico cuando cambian (por ejemplo, al cambiar de mes).
  function grafica(canvas) {
    const instancia = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: datos.map((dato) => dato.categoria),
        datasets: [
          {
            data: datos.map((dato) => dato.total),
            backgroundColor: COLORES,
            borderWidth: 0,
            borderRadius: 6,
            spacing: 3,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        layout: { padding: 10 },
        animation: { duration: 700 },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        onHover: (_evento, elementos) => {
          activa = elementos[0]?.index ?? null
        },
      },
    })

    return () => {
      instancia.destroy()
      activa = null
    }
  }
</script>

{#if total === 0}
  <p class="vacio">No hay gastos ni cuotas en este mes para graficar.</p>
{:else}
  <div class="grafica">
    <div class="dona">
      <canvas aria-label="Reparto del gasto por categoría"
      {@attach grafica}></canvas>
      <div class="centro">
        <span class="etiqueta">{activo ? activo.categoria : 'Total del mes'}</span>
        <strong>{pesos.format(activo ? activo.total : total)}</strong>
        {#if activo}
          <span class="detalle">{porcentaje.format(activo.total / total)}</span>
        {/if}
      </div>
    </div>

    <ul class="leyenda">
      {#each datos as dato, i (dato.categoria)}
        <li class:atenuado={activa !== null && activa !== i}>
          <span class="color" style:background={COLORES[i % COLORES.length]} aria-hidden="true"
          ></span>
          <span class="nombre">{dato.categoria}</span>
          <span class="monto">{formatearMoneda(dato.total)}</span>
          <span class="porcentaje">{porcentaje.format(dato.total / total)}</span>
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  .grafica {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 1.5rem 4rem;
  }

  .dona {
    position: relative;
    flex: 0 0 auto;
    width: min(100%, 16rem);
    aspect-ratio: 1;
  }

  /* Texto del hueco central. No captura el mouse para no tapar la dona. */
  .centro {
    position: absolute;
    inset: 0;
    display: grid;
    align-content: center;
    justify-items: center;
    gap: 0.15rem;
    padding: 0 20%;
    text-align: center;
    pointer-events: none;
  }

  .etiqueta {
    color: var(--texto-secundario);
    font-size: 0.74rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .centro strong {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 1.3rem;
    font-weight: 500;
    letter-spacing: -0.02em;
  }

  .detalle {
    color: var(--naranja);
    font-size: 0.82rem;
    font-weight: 700;
  }

  .leyenda {
    display: grid;
    flex: 1 1 18rem;
    max-width: 32rem;
    gap: 0.35rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: grid;
    grid-template-columns: auto 1fr auto 3.5rem;
    align-items: center;
    gap: 0.7rem;
    padding: 0.55rem 0.75rem;
    border-radius: 0.55rem;
    font-size: 0.9rem;
    transition: opacity 150ms ease, background 150ms ease;
  }

  li.atenuado {
    opacity: 0.4;
  }

  .color {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
  }

  .monto {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .porcentaje {
    color: var(--texto-secundario);
    font-size: 0.82rem;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  .vacio {
    margin: 0;
    color: var(--texto-secundario);
    font-size: 0.86rem;
  }
</style>