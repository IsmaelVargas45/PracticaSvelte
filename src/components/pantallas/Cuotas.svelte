<script>
  import { categorias } from '../../lib/categorias.js'
  import { cuotas } from '../../lib/cuotas.svelte.js'
  import { formatearMes, mesActual, mesDe } from '../../lib/fechas.js'
  import { formatearMoneda } from '../../lib/formato.js'
  import Aviso from '../ui/Aviso.svelte'
  import SelectorCategoria from '../ui/SelectorCategoria.svelte'
  import Tarjeta from '../ui/Tarjeta.svelte'

  const hoy = mesActual()

  let descripcion = $state('')
  let monto = $state('')
  let categoria = $state(categorias[0])
  let mesInicio = $state(hoy)
  let totalCuotas = $state(null)
  let error = $state('')
  let guardando = $state(false)
  let errorAccion = $state('')
  let campoDescripcion = $state()

  // id de cada cuota que se paga este mes -> número de cuota que toca
  let numeroEsteMes = $derived(new Map(cuotas.delMes(hoy).map((c) => [c.id, c.numero])))

  async function enviar(event) {
    event.preventDefault()
    error = ''
    guardando = true

    try {
      await cuotas.agregar({
        descripcion: descripcion.trim(),
        monto: Number(monto),
        categoria,
        mes_inicio: `${mesInicio}-01`,
        total_cuotas: totalCuotas ? Number(totalCuotas) : null,
      })
      descripcion = ''
      monto = ''
      totalCuotas = null
      campoDescripcion?.focus()
    } catch (errorGuardado) {
      console.error('No se pudo guardar la cuota:', errorGuardado)
      error = errorGuardado.message || 'No se pudo guardar la cuota.'
    } finally {
      guardando = false
    }
  }

  async function eliminar(id) {
    if (!confirm('¿Seguro que querés eliminar esta cuota? Se quita de todos los meses.')) return

    errorAccion = ''
    try {
      await cuotas.eliminar(id)
    } catch (errorEliminar) {
      console.error('No se pudo eliminar la cuota:', errorEliminar)
      errorAccion = errorEliminar.message || 'No se pudo eliminar la cuota.'
    }
  }
</script>

<Tarjeta titulo="Nueva cuota o servicio">
  <form onsubmit={enviar}>
    <div class="fila-principal">
      <div class="campo descripcion">
        <label for="cuota-descripcion">Descripción</label>
        <input
          id="cuota-descripcion"
          type="text"
          placeholder="Ej: Heladera en cuotas"
          maxlength="80"
          bind:value={descripcion}
          bind:this={campoDescripcion}
          required
          disabled={guardando}
        />
      </div>

      <div class="campo">
        <label for="cuota-monto">Monto mensual</label>
        <div class="monto">
          <span class="prefijo" aria-hidden="true">$</span>
          <input
            id="cuota-monto"
            type="number"
            min="0.01"
            step="0.01"
            inputmode="decimal"
            placeholder="0,00"
            bind:value={monto}
            required
            disabled={guardando}
          />
        </div>
      </div>

      <div class="campo">
        <label for="cuota-total">Cantidad de cuotas</label>
        <input
          id="cuota-total"
          type="number"
          min="1"
          step="1"
          placeholder="Sin fin"
          bind:value={totalCuotas}
          disabled={guardando}
        />
      </div>

      <div class="campo">
        <label for="cuota-inicio">Primera cuota</label>
        <input id="cuota-inicio" type="month" bind:value={mesInicio} required disabled={guardando} />
      </div>
    </div>

    <p class="ayuda">
      Dejá la cantidad de cuotas vacía para servicios sin fecha de fin, como internet o una
      suscripción.
    </p>

    <div class="fila-inferior">
      <SelectorCategoria bind:value={categoria} name="cuota-categoria" disabled={guardando} />

      <div class="acciones">
        <button class="boton" type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Agregar'}
        </button>
      </div>
    </div>

    {#if error}
      <Aviso tipo="error">{error}</Aviso>
    {/if}
  </form>
</Tarjeta>

<Tarjeta titulo="Tus cuotas y servicios">
  {#if errorAccion}
    <Aviso tipo="error">{errorAccion}</Aviso>
  {/if}

  {#if cuotas.cargando}
    <Aviso>Cargando tus cuotas...</Aviso>
  {:else if cuotas.error}
    <Aviso tipo="error">{cuotas.error}</Aviso>
    <button class="boton secundario" type="button" onclick={() => cuotas.cargar()}>
      Reintentar
    </button>
  {:else if cuotas.ordenadas.length === 0}
    <p class="ayuda">Todavía no cargaste ninguna cuota ni servicio.</p>
  {:else}
    <ul class="lista">
      {#each cuotas.ordenadas as cuota (cuota.id)}
        <li>
          <div class="info">
            <strong>{cuota.descripcion}</strong>
            <span>{cuota.categoria}</span>
            <span>Desde {formatearMes(mesDe(cuota.mes_inicio))}</span>
            <span>
              {cuota.total_cuotas ? `${cuota.total_cuotas} cuotas` : 'Sin fecha de fin'}
            </span>
            {#if numeroEsteMes.has(cuota.id)}
              <span class="estado">
                Este mes: cuota {numeroEsteMes.get(cuota.id)}{cuota.total_cuotas
                  ? ` de ${cuota.total_cuotas}`
                  : ''}
              </span>
            {/if}
          </div>
          <div class="derecha">
            <strong>{formatearMoneda(cuota.monto)}</strong>
            <button class="boton secundario" type="button" onclick={() => eliminar(cuota.id)}>
              Eliminar
            </button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</Tarjeta>

<style>
  form {
    display: grid;
    gap: 1rem;
  }

  .fila-principal {
    display: grid;
    grid-template-columns: minmax(0, 2fr) repeat(3, minmax(0, 1fr));
    gap: 0.85rem;
  }

  .campo {
    display: grid;
    gap: 0.4rem;
  }

  /* Monto con el signo $ dentro del campo */
  .monto {
    position: relative;
  }

  .prefijo {
    position: absolute;
    top: 50%;
    left: 0.85rem;
    transform: translateY(-50%);
    color: var(--texto-secundario);
    font-weight: 700;
    pointer-events: none;
  }

  .monto input {
    padding-left: 1.9rem;
  }

  .ayuda {
    margin: 0;
    color: var(--texto-secundario);
    font-size: 0.84rem;
    line-height: 1.5;
  }

  .fila-inferior {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
  }

  .lista {
    display: grid;
    gap: 0.75rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--borde);
  }

  .info {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.25rem 0.9rem;
    min-width: 0;
  }

  .info span {
    color: var(--texto-secundario);
    font-size: 0.84rem;
  }

  .info .estado {
    color: var(--naranja);
    font-weight: 650;
  }

  .derecha {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .derecha strong {
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: 900px) {
    .fila-principal {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .descripcion {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 560px) {
    .fila-principal {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 420px) {
    .fila-principal {
      grid-template-columns: 1fr;
    }

    .fila-inferior :global(.boton) {
      width: 100%;
    }
  }
</style>