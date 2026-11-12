<script>
  // children es el contenido; acciones es un snippet opcional al lado del título.
  let { titulo, acciones, children } = $props()
</script>

<section class="tarjeta">
  {#if titulo || acciones}
    <header>
      {#if titulo}
        <h2>{titulo}</h2>
      {/if}
      {@render acciones?.()}
    </header>
  {/if}
  {@render children?.()}
</section>

<style>
  .tarjeta {
    padding: clamp(1.2rem, 4vw, 1.75rem);
    border: 1px solid var(--borde);
    border-radius: 1rem;
    background: var(--tarjeta);
  }

  header {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  h2 {
    margin: 0;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 1.35rem;
    font-weight: 500;
    letter-spacing: -0.02em;
  }
</style>