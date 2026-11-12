<script>
  import { formatearFecha, formatearMoneda } from '../../lib/formato.js'

  let { gastos, onEditar, onEliminar } = $props()
</script>

{#if gastos.length === 0}
  <p class="vacio">Todavía no anotaste ningún gasto. Empezá con el formulario de arriba.</p>
{:else}
  <div class="contenedor">
    <table>
      <thead>
        <tr>
          <th scope="col">Fecha</th>
          <th scope="col">Descripción</th>
          <th scope="col">Categoría</th>
          <th scope="col" class="monto">Monto</th>
          <th scope="col"><span class="solo-lectores">Acciones</span></th>
        </tr>
      </thead>
      <tbody>
        {#each gastos as gasto (gasto.id)}
          <tr>
            <td>{formatearFecha(gasto.fecha)}</td>
            <td>{gasto.descripcion}</td>
            <td>{gasto.categoria}</td>
            <td class="monto">{formatearMoneda(gasto.monto)}</td>
            <td class="acciones">
              <button type="button" onclick={() => onEditar(gasto)}>Editar</button>
              <button type="button" class="borrar" onclick={() => onEliminar(gasto.id)}>
                Eliminar
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<style>
  .contenedor {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;
  }

  th,
  td {
    padding: 0.7rem 0.6rem;
    border-bottom: 1px solid var(--borde);
    text-align: left;
    white-space: nowrap;
  }

  th {
    color: var(--texto-secundario);
    font-size: 0.78rem;
    font-weight: 650;
  }

  .monto {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  .acciones {
    display: flex;
    justify-content: flex-end;
    gap: 0.4rem;
  }

  button {
    min-height: 2.4rem;
    padding: 0.4rem 0.7rem;
    border: 1px solid var(--borde);
    border-radius: 0.45rem;
    background: var(--tarjeta);
    color: var(--texto);
    font: inherit;
    font-size: 0.78rem;
    font-weight: 650;
    cursor: pointer;
  }

  button:hover {
    border-color: var(--naranja);
  }

  .borrar:hover {
    border-color: var(--error);
    color: var(--error);
  }

  button:focus-visible {
    outline: 2px solid var(--naranja-claro);
    outline-offset: 2px;
  }

  .vacio {
    margin: 0;
    color: var(--texto-secundario);
    font-size: 0.9rem;
  }

  .solo-lectores {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
</style>