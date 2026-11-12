<script>
  import { formatearMoneda } from '../../lib/formato.js'
  import { gastos } from '../../lib/gastos.svelte.js'
  import FormularioGasto from '../gastos/FormularioGasto.svelte'
  import TablaGastos from '../gastos/TablaGastos.svelte'
  import Aviso from '../ui/Aviso.svelte'
  import Tarjeta from '../ui/Tarjeta.svelte'

  // Los gastos los carga Tablero una sola vez; acá solo se muestran y se editan.
  let gastoEditando = $state(null)
  let errorAccion = $state('')

  async function guardar(datos) {
    if (gastoEditando) {
      await gastos.editar(gastoEditando.id, datos)
      gastoEditando = null
      return
    }

    await gastos.agregar(datos)
  }

  async function eliminar(id) {
    if (!confirm('¿Seguro que querés eliminar este gasto?')) return

    errorAccion = ''
    try {
      await gastos.eliminar(id)
      if (gastoEditando?.id === id) gastoEditando = null
    } catch (error) {
      console.error('No se pudo eliminar el gasto:', error)
      errorAccion = error.message || 'No se pudo eliminar el gasto.'
    }
  }
</script>

<Tarjeta titulo={gastoEditando ? 'Editar gasto' : 'Anotar un gasto'}>
  {#key gastoEditando?.id ?? 'nuevo'}
    <FormularioGasto
      {gastoEditando}
      onGuardar={guardar}
      onCancelar={() => (gastoEditando = null)}
    />
  {/key}
</Tarjeta>

<Tarjeta titulo="Todos tus movimientos">
  {#snippet acciones()}
    <p class="total">Total: <strong>{formatearMoneda(gastos.total)}</strong></p>
  {/snippet}

  {#if errorAccion}
    <Aviso tipo="error">{errorAccion}</Aviso>
  {/if}

  {#if gastos.cargando}
    <Aviso>Cargando tus gastos...</Aviso>
  {:else if gastos.error}
    <Aviso tipo="error">{gastos.error}</Aviso>
    <button class="boton secundario" type="button" onclick={() => gastos.cargar()}>
      Reintentar
    </button>
  {:else}
    <TablaGastos
      gastos={gastos.ordenados}
      onEditar={(gasto) => (gastoEditando = gasto)}
      onEliminar={eliminar}
    />
  {/if}
</Tarjeta>

<style>
  .total {
    margin: 0;
    color: var(--texto-secundario);
    font-size: 0.9rem;
  }
</style>