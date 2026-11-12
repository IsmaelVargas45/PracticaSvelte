import './app.css'
import { mount } from 'svelte'
import App from './App.svelte'
import { sesion } from './lib/sesion.svelte.js'

sesion.iniciar() // sin await: así se ve "Comprobando tu sesión..." mientras tanto

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app