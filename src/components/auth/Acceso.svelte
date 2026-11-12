<script>
  import { supabase } from '../../lib/supabase.js'

  let modo = $state('ingresar')
  let nombre = $state('')
  let email = $state('')
  let password = $state('')
  let error = $state('')
  let mensaje = $state('')
  let cargando = $state(false)

  function cambiarModo() {
    modo = modo === 'ingresar' ? 'registrar' : 'ingresar'
    nombre = ''
    error = ''
    mensaje = ''
  }

  async function enviar(event) {
    event.preventDefault()
    error = ''
    mensaje = ''
    cargando = true

    try {
      const resultado =
        modo === 'ingresar'
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({
              email,
              password,
              options: { data: { nombre: nombre.trim() } }
            })

      if (resultado.error) throw resultado.error

      if (modo === 'registrar' && !resultado.data.session) {
        mensaje = 'Revisá tu correo para confirmar la cuenta y después iniciá sesión.'
      }
    } catch (errorAutenticacion) {
      console.error('No se pudo completar la autenticación:', errorAutenticacion)
      error = errorAutenticacion.message || 'No se pudo completar la solicitud.'
    } finally {
      cargando = false
    }
  }
</script>

<main class="acceso">
  <section class="tarjeta-acceso" aria-labelledby="titulo-acceso">
    <p class="sobretitulo">TUS GASTOS, SOLO TUYOS</p>
    <h1 id="titulo-acceso">
      {modo === 'ingresar' ? 'Qué bueno verte.' : 'Creá tu cuenta.'}
    </h1>
    <p class="descripcion">
      {modo === 'ingresar'
        ? 'Iniciá sesión para ver tus gastos y seguir organizando tu plata.'
        : 'Registrate para guardar tus gastos de forma privada y acceder desde tus dispositivos.'}
    </p>

    <form onsubmit={enviar}>
      {#if modo === 'registrar'}
        <div class="campo">
          <label for="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            autocomplete="given-name"
            placeholder="Tu nombre"
            bind:value={nombre}
            maxlength="40"
            required
            disabled={cargando}
          />
        </div>
      {/if}

      <div class="campo">
        <label for="email">Correo electrónico</label>
        <input
          id="email"
          type="email"
          autocomplete="email"
          placeholder="nombre@correo.com"
          bind:value={email}
          required
          disabled={cargando}
        />
      </div>
      <div class="campo">
        <label for="password">Contraseña</label>
        <input
          id="password"
          type="password"
          autocomplete={modo === 'ingresar' ? 'current-password' : 'new-password'}
          placeholder="Mínimo 6 caracteres"
          bind:value={password}
          minlength="6"
          required
          disabled={cargando}
        />
      </div>

      {#if error}
        <p class="aviso error" role="alert">{error}</p>
      {:else if mensaje}
        <p class="aviso mensaje" role="status">{mensaje}</p>
      {/if}

      <button class="principal" type="submit" disabled={cargando}>
        {cargando
          ? 'Un momento...'
          : modo === 'ingresar'
            ? 'Iniciar sesión'
            : 'Crear cuenta'}
      </button>
    </form>

    <p class="alternativa">
      {modo === 'ingresar' ? '¿Todavía no tenés cuenta?' : '¿Ya tenés cuenta?'}
      <button type="button" onclick={cambiarModo}>
        {modo === 'ingresar' ? 'Registrate' : 'Iniciá sesión'}
      </button>
    </p>
    <p class="privacidad">Cada cuenta accede únicamente a sus propios datos.</p>
  </section>
</main>

<style>
  .acceso {
    display: grid;
    min-height: 100vh;
    place-items: center;
    padding: 1.25rem;
  }

  .tarjeta-acceso {
    width: min(100%, 27rem);
    padding: clamp(1.5rem, 6vw, 2.5rem);
    border: 1px solid var(--borde);
    border-radius: 1rem;
    background: var(--tarjeta);
    box-shadow: 0 1rem 3rem rgb(60 48 30 / 8%);
  }

  .sobretitulo {
    margin: 0 0 0.4rem;
    color: var(--naranja);
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.12em;
  }

  h1 {
    margin: 0;
    color: var(--texto);
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(1.8rem, 7vw, 2.35rem);
    font-weight: 500;
    letter-spacing: -0.04em;
  }

  .descripcion {
    margin: 0.6rem 0 1.6rem;
    color: var(--texto-secundario);
    font-size: 0.9rem;
    line-height: 1.55;
  }

  form,
  .campo {
    display: grid;
    gap: 0.5rem;
  }

  form {
    gap: 1rem;
  }

  label {
    color: var(--texto-secundario);
    font-size: 0.84rem;
    font-weight: 650;
  }

  input {
    box-sizing: border-box;
    width: 100%;
    min-height: 2.9rem;
    padding: 0.7rem 0.8rem;
    border: 1px solid var(--borde);
    border-radius: 0.55rem;
    background: var(--campo);
    color: var(--texto);
  }

  input:focus-visible,
  button:focus-visible {
    outline: 2px solid var(--naranja-claro);
    outline-offset: 2px;
  }

  .principal {
    min-height: 2.9rem;
    border: 0;
    border-radius: 0.55rem;
    background: var(--naranja);
    color: #fffdf8;
    font-weight: 700;
    cursor: pointer;
  }

  .principal:hover:not(:disabled) {
    background: var(--naranja-claro);
  }

  .principal:disabled {
    cursor: wait;
    opacity: 0.7;
  }

  .aviso {
    margin: 0;
    font-size: 0.82rem;
    line-height: 1.45;
  }

  .error {
    color: var(--error);
  }

  .mensaje {
    color: var(--naranja);
  }

  .alternativa {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.3rem;
    margin: 1.25rem 0 0;
    color: var(--texto-secundario);
    font-size: 0.84rem;
  }

  .alternativa button {
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--naranja);
    font-weight: 700;
    cursor: pointer;
  }

  .privacidad {
    margin: 1.2rem 0 0;
    padding-top: 1rem;
    border-top: 1px solid var(--borde);
    color: var(--texto-secundario);
    font-size: 0.75rem;
    text-align: center;
  }
</style>