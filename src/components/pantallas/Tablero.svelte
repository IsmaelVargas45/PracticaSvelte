<script>
  import { onMount } from 'svelte'
  import { cuotas } from '../../lib/cuotas.svelte.js'
  import { gastos } from '../../lib/gastos.svelte.js'
  import { presupuesto } from '../../lib/presupuesto.svelte.js'
  import { sesion } from '../../lib/sesion.svelte.js'
  import Aviso from '../ui/Aviso.svelte'
  import Cuotas from './Cuotas.svelte'
  import Movimientos from './Movimientos.svelte'
  import Resumen from './Resumen.svelte'

  const pantallas = [
    { id: 'resumen', etiqueta: 'Resumen' },
    { id: 'movimientos', etiqueta: 'Movimientos' },
    { id: 'cuotas', etiqueta: 'Cuotas' },
  ]

  let actual = $state('resumen')
  let errorSesion = $state('')

  let inicial = $derived((sesion.nombre || sesion.usuario?.email || '?').charAt(0).toUpperCase())

  // Los datos se cargan una sola vez al entrar y se vacían al salir
  
  onMount(() => {// (este componente se desmonta cuando se cierra la sesión).
    void gastos.cargar()
    void cuotas.cargar()
    void presupuesto.cargar()

    return () => {
      gastos.vaciar()
      cuotas.vaciar()
      presupuesto.vaciar()
    }
  })

  async function salir() {
    errorSesion = ''
    try {
      await sesion.cerrarSesion()
    } catch (error) {
      console.error('No se pudo cerrar la sesión:', error)
      errorSesion = error.message || 'No se pudo cerrar la sesión.'
    }
  }
</script>

<div class="tablero">
  <header class="superior">
    <div class="saludo">
      <p class="marca">Gestor de gastos</p>
      <h1>
        {#if sesion.nombre}
          Hola, <span>{sesion.nombre}</span>
        {:else}
          Hola de nuevo
        {/if}
      </h1>
      <p class="correo">{sesion.usuario?.email}</p>
    </div>

    <div class="cuenta">
      <span class="avatar" aria-hidden="true">{inicial}</span>
      <button class="salir" type="button" onclick={salir}>Cerrar sesión</button>
    </div>
  </header>

  {#if errorSesion}
    <Aviso tipo="error">{errorSesion}</Aviso>
  {/if}

  <nav class="pestanas" aria-label="Secciones principales">
    {#each pantallas as pantalla (pantalla.id)}
      <button
        type="button"
        class:activa={actual === pantalla.id}
        aria-current={actual === pantalla.id ? 'page' : undefined}
        onclick={() => (actual = pantalla.id)}
      >
        {pantalla.etiqueta}
      </button>
    {/each}
  </nav>

  <main>
    {#if actual === 'resumen'}
      <Resumen />
    {:else if actual === 'movimientos'}
      <Movimientos />
    {:else}
      <Cuotas />
    {/if}
  </main>
</div>

<style>
  .tablero {
    padding-block: 1.5rem 3rem;
  }

  .superior {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .marca {
    margin: 0 0 0.3rem;
    color: var(--naranja);
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.13em;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(1.9rem, 6vw, 2.6rem);
    font-weight: 500;
    letter-spacing: -0.04em;
    line-height: 1.1;
  }

  h1 span {
    color: var(--naranja);
    font-style: italic;
  }

  .correo {
    margin: 0.4rem 0 0;
    color: var(--texto-secundario);
    font-size: 0.85rem;
    overflow-wrap: anywhere;
  }

  .cuenta {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .avatar {
    display: grid;
    width: 2.5rem;
    height: 2.5rem;
    place-items: center;
    border-radius: 50%;
    background: var(--naranja);
    color: #fffdf8;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 1.1rem;
    font-weight: 700;
  }

  .salir {
    min-height: 2.5rem;
    padding: 0.4rem 0.8rem;
    border: 1px solid transparent;
    border-radius: 0.55rem;
    background: transparent;
    color: var(--texto-secundario);
    font-size: 0.85rem;
    font-weight: 650;
    cursor: pointer;
  }

  .salir:hover {
    border-color: var(--borde);
    background: var(--tarjeta);
    color: var(--texto);
  }

  .pestanas {
    display: flex;
    gap: 0.35rem;
    margin-bottom: 1.25rem;
    padding: 0.3rem;
    border: 1px solid var(--borde);
    border-radius: 0.75rem;
    background: var(--tarjeta);
  }

  .pestanas button {
    flex: 1;
    min-height: 2.8rem;
    padding: 0.5rem 0.9rem;
    border: 0;
    border-radius: 0.5rem;
    background: transparent;
    color: var(--texto-secundario);
    font-weight: 650;
    cursor: pointer;
  }

  .pestanas button:hover {
    color: var(--texto);
  }

  .pestanas button.activa {
    background: var(--texto);
    color: #fffdf8;
  }

  main {
    display: grid;
    gap: 1rem;
  }
</style>