<script>
  let { tipo = 'info', children } = $props()
</script>

<p class="aviso" class:error={tipo === 'error'} role={tipo === 'error' ? 'alert' : 'status'}>
  {@render children?.()}
</p>

<style>
  .aviso {
    margin: 0 0 0.75rem;
    padding: 0.7rem 0.9rem;
    border-radius: 0.55rem;
    background: var(--campo);
    color: var(--texto-secundario);
    font-size: 0.86rem;
    line-height: 1.45;
  }

  .error {
    border: 1px solid var(--error);
    background: var(--tarjeta);
    color: var(--error);
  }
</style>