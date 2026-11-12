<script>
  import { categorias } from '../../lib/categorias.js'

  // value es bindable: <SelectorCategoria bind:value={categoria} />
  // name tiene que ser distinto si hay dos selectores en la misma pantalla.
  let { value = $bindable(), name = 'categoria', disabled = false } = $props()
</script>

<fieldset {disabled}>
  <legend>Categoría</legend>
  <div class="chips">
    {#each categorias as opcion (opcion)}
      <label class="chip">
        <input type="radio" {name} value={opcion} bind:group={value} />
        <span>{opcion}</span>
      </label>
    {/each}
  </div>
</fieldset>

<style>
  fieldset {
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }

  legend {
    padding: 0;
    margin-bottom: 0.5rem;
    color: var(--texto-secundario);
    font-size: 0.84rem;
    font-weight: 650;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  /* Chip: un radio real, oculto visualmente, con el <span> como cara visible */
  .chip {
    position: relative;
  }

  .chip input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .chip span {
    display: inline-flex;
    align-items: center;
    min-height: 2.4rem;
    padding: 0.4rem 0.95rem;
    border: 1px solid var(--borde);
    border-radius: 999px;
    background: var(--campo);
    color: var(--texto-secundario);
    font-size: 0.88rem;
    font-weight: 650;
    cursor: pointer;
    transition:
      background 150ms ease,
      border-color 150ms ease,
      color 150ms ease;
  }

  .chip span:hover {
    border-color: var(--naranja);
    color: var(--texto);
  }

  .chip input:checked + span {
    border-color: var(--naranja);
    background: var(--naranja);
    color: #fffdf8;
  }

  .chip input:focus-visible + span {
    outline: 2px solid var(--naranja-claro);
    outline-offset: 2px;
  }

  fieldset:disabled .chip span {
    cursor: wait;
    opacity: 0.7;
  }
</style>