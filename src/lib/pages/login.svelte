<script>
  import { entrar, registrar } from '../auth.svelte.js'

  let modo = $state('login')
  let email = $state('')
  let password = $state('')
  let error = $state(null)
  let mensaje = $state(null)
  let enviando = $state(false)

  async function enviar(e) {
    e.preventDefault()
    error = null
    mensaje = null
    enviando = true
    try {
      if (modo === 'login') {
        await entrar(email, password)
      } else {
        await registrar(email, password)
        mensaje = 'Cuenta creada. Si pide confirmación, revisá tu mail.'
      }
    } catch (err) {
      error = err.message
    } finally {
      enviando = false
    }
  }
</script>

<form onsubmit={enviar}>
  <h2>{modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h2>

  <label>
    Email
    <input type="email" bind:value={email} required />
  </label>

  <label>
    Contraseña
    <input type="password" bind:value={password} minlength="6" required />
  </label>

  {#if error}<p class="error">{error}</p>{/if}
  {#if mensaje}<p class="ok">{mensaje}</p>{/if}

  <button type="submit" disabled={enviando}>
    {modo === 'login' ? 'Entrar' : 'Registrarme'}
  </button>

  <button type="button" onclick={() => (modo = modo === 'login' ? 'registro' : 'login')}>
    {modo === 'login' ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Entrá'}
  </button>
</form>

<style>
  form { max-width: 360px; margin: 3rem auto; display: grid; gap: 0.8rem; }
  label { display: grid; gap: 0.3rem; }
  .error { color: #e74c3c; }
  .ok { color: #2ecc71; }
</style>