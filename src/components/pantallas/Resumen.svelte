<script>
  import { cuotas } from '../../lib/cuotas.svelte.js'
  import { mesActual, mesDe } from '../../lib/fechas.js'
  import { formatearMoneda } from '../../lib/formato.js'
  import { gastos } from '../../lib/gastos.svelte.js'
  import { presupuesto } from '../../lib/presupuesto.svelte.js'
  import GraficaTorta from '../gastos/GraficaTorta.svelte'
  import Aviso from '../ui/Aviso.svelte'
  import Tarjeta from '../ui/Tarjeta.svelte'

  let mes = $state(mesActual())
  let guardando = $state(false)
  let errorIngreso = $state('')

  let gastosDelMes = $derived(gastos.lista.filter((gasto) => mesDe(gasto.fecha) === mes))
  let cuotasDelMes = $derived(cuotas.delMes(mes))

  let totalGastos = $derived(gastosDelMes.reduce((suma, gasto) => suma + gasto.monto, 0))
  let totalCuotas = $derived(cuotasDelMes.reduce((suma, cuota) => suma + cuota.monto, 0))
  let disponible = $derived(presupuesto.ingreso - totalGastos - totalCuotas)

  let porCategoria = $derived.by(() => {
    const totales = {}
    for (const gasto of gastosDelMes) {
      totales[gasto.categoria] = (totales[gasto.categoria] ?? 0) + gasto.monto
    }
    for (const cuota of cuotasDelMes) {
      totales[cuota.categoria] = (totales[cuota.categoria] ?? 0) + cuota.monto
    }
    return Object.entries(totales)
      .map(([categoria, total]) => ({ categoria, total }))
      .sort((a, b) => b.total - a.total)
  })

  async function guardarIngreso(event) {
    event.preventDefault()
    // Se lee antes del await: después, currentTarget ya no está disponible.
    const valor = Number(new FormData(event.currentTarget).get('ingreso'))

    errorIngreso = ''
    guardando = true
    try {
      await presupuesto.guardar(valor)
    } catch (error) {
      console.error('No se pudo guardar el ingreso:', error)
      errorIngreso = error.message || 'No se pudo guardar el ingreso.'
    } finally {
      guardando = false
    }
  }
</script>

<div class="selector">
  <label for="mes">Mes</label>
  <input id="mes" type="month" bind:value={mes} />
</div>

{#if gastos.cargando || cuotas.cargando || presupuesto.cargando}
  <Aviso>Cargando tus datos...</Aviso>
{:else if gastos.error || cuotas.error || presupuesto.error}
  <Aviso tipo="error">{gastos.error || cuotas.error || presupuesto.error}</Aviso>
{:else}
  <Tarjeta titulo="Tu presupuesto">
    <div class="presupuesto">
      <div class="entrada">
        <form class="ingreso" onsubmit={guardarIngreso}>
          <label for="ingreso">Ingreso mensual</label>
          <div class="fila">
            <input
              id="ingreso"
              name="ingreso"
              type="number"
              min="0"
              step="0.01"
              inputmode="decimal"
              value={presupuesto.ingreso}
              required
              disabled={guardando}
            />
            <button class="boton" type="submit" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>

        {#if errorIngreso}
          <Aviso tipo="error">{errorIngreso}</Aviso>
        {/if}

        {#if presupuesto.ingreso === 0}
          <p class="ayuda">Cargá tu ingreso mensual para ver cuánto te queda.</p>
        {/if}
      </div>

      <dl class="cuentas">
        <div>
          <dt>Gastos</dt>
          <dd>{formatearMoneda(totalGastos)}</dd>
        </div>
        <div>
          <dt>Cuotas y servicios</dt>
          <dd>{formatearMoneda(totalCuotas)}</dd>
        </div>
        {#if presupuesto.ingreso > 0}
          <div class="resultado" class:negativo={disponible < 0}>
            <dt>{disponible < 0 ? 'Te pasaste por' : 'Te quedan'}</dt>
            <dd>{formatearMoneda(Math.abs(disponible))}</dd>
          </div>
        {/if}
      </dl>
    </div>
  </Tarjeta>

  <Tarjeta titulo="Cómo se reparte el mes">
    <GraficaTorta datos={porCategoria} />
  </Tarjeta>
{/if}

<style>
  .selector {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
  }

  .selector input {
    width: auto;
  }

  .presupuesto {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.5rem 3rem;
    align-items: start;
  }

  .fila {
    display: flex;
    gap: 0.65rem;
    margin-top: 0.4rem;
  }

  .fila input {
    flex: 1;
    min-width: 0;
  }

  .cuentas {
    display: grid;
    gap: 0.6rem;
    margin: 0;
  }

  .cuentas div {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 0.6rem;
    border-bottom: 1px solid var(--borde);
  }

  dt {
    color: var(--texto-secundario);
    font-size: 0.9rem;
  }

  dd {
    margin: 0;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .cuentas .resultado {
    border-bottom: 0;
    color: var(--naranja);
    font-size: 1.1rem;
  }

  .cuentas .resultado dt {
    color: inherit;
    font-weight: 650;
  }

  .cuentas .negativo {
    color: var(--error);
  }

  .ayuda {
    margin: 1rem 0 0;
    color: var(--texto-secundario);
    font-size: 0.86rem;
  }

  @media (max-width: 700px) {
    .presupuesto {
      grid-template-columns: 1fr;
    }
  }
</style>