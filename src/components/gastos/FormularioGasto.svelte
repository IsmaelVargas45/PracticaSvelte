<script>
  import { categorias } from '../../lib/categorias.js'
  import Aviso from '../ui/Aviso.svelte'
  import SelectorCategoria from '../ui/SelectorCategoria.svelte'

  let { gastoEditando = null, onGuardar, onCancelar } = $props()

  // El padre usa {#key} para recrear este formulario al cambiar de gasto,
  // por eso alcanza con leer la prop una sola vez para los valores iniciales.
  // svelte-ignore state_referenced_locally
  let descripcion = $state(gastoEditando?.descripcion ?? '')
  // svelte-ignore state_referenced_locally
  let monto = $state(gastoEditando?.monto ?? '')
  // svelte-ignore state_referenced_locally
  let categoria = $state(gastoEditando?.categoria ?? categorias[0])
  // svelte-ignore state_referenced_locally
  let fecha = $state(gastoEditando?.fecha ?? new Date().toLocaleDateString('en-CA'))

  let error = $state('')
  let guardando = $state(false)
  let campoDescripcion = $state()

  async function enviar(event) {
    event.preventDefault()
    error = ''
    guardando = true

    try {
      await onGuardar({
        descripcion: descripcion.trim(),
        monto: Number(monto),
        categoria,
        fecha,
      })

      if (!gastoEditando) {
        descripcion = ''
        monto = ''
        campoDescripcion?.focus()
      }
    } catch (errorGuardado) {
      console.error('No se pudo guardar el gasto:', errorGuardado)
      error = errorGuardado.message || 'No se pudo guardar el gasto.'
    } finally {
      guardando = false
    }
  }
</script>

<form onsubmit={enviar}>
  <div class="fila-principal">
    <div class="campo descripcion">
      <label for="descripcion">Descripción</label>
      <input
        id="descripcion"
        type="text"
        placeholder="Ej: Supermercado"
        maxlength="80"
        bind:value={descripcion}
        bind:this={campoDescripcion}
        required
        disabled={guardando}
      />
    </div>

    <div class="campo">
      <label for="monto">Monto</label>
      <div class="monto">
        <span class="prefijo" aria-hidden="true">$</span>
        <input
          id="monto"
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
      <label for="fecha">Fecha</label>
      <input id="fecha" type="date" bind:value={fecha} required disabled={guardando} />
    </div>
  </div>

  <div class="fila-inferior">
    <SelectorCategoria bind:value={categoria} name="categoria" disabled={guardando} />

    <div class="acciones">
      {#if gastoEditando}
        <button class="boton secundario" type="button" onclick={onCancelar} disabled={guardando}>
          Cancelar
        </button>
      {/if}
      <button class="boton" type="submit" disabled={guardando}>
        {guardando ? 'Guardando...' : gastoEditando ? 'Guardar cambios' : 'Anotar gasto'}
      </button>
    </div>
  </div>

  {#if error}
    <Aviso tipo="error">{error}</Aviso>
  {/if}
</form>

<style>
  form {
    display: grid;
    gap: 1rem;
  }

  .fila-principal {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr);
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

  .fila-inferior {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
  }

  .acciones {
    display: flex;
    gap: 0.65rem;
  }

  @media (max-width: 700px) {
    .fila-principal {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .descripcion {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 420px) {
    .fila-principal {
      grid-template-columns: 1fr;
    }

    .acciones,
    .acciones :global(.boton) {
      width: 100%;
    }
  }
</style>