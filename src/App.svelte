<script>
  import { auth, iniciarAuth, salir } from './lib/auth.svelte.js'
  import Login from './lib/pages/login.svelte'

  $effect(() => {
    iniciarAuth()
  })
</script>

{#if auth.cargando}
  <p>Cargando...</p>
{:else if auth.user}
  <p>Sesión iniciada como {auth.user.email}</p>
  <button onclick={salir}>Cerrar sesión</button>
{:else}
  <Login />
{/if}