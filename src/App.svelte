<script>
  import { sesion } from './lib/sesion.svelte.js'
  import Acceso from './components/auth/Acceso.svelte'
  import Tablero from './components/pantallas/Tablero.svelte'
</script>

{#if sesion.cargando}
  <p role="status">Comprobando tu sesión...</p>
{:else if !sesion.usuario}
  <Acceso />
{:else}
  <Tablero />
{/if}