# ng-hub-ui-loading

**Español** | [English](./README.md)

[![NPM Version](https://img.shields.io/npm/v/ng-hub-ui-loading.svg)](https://www.npmjs.com/package/ng-hub-ui-loading)
[![Angular](https://img.shields.io/badge/Angular-21%2B-red.svg)](https://angular.dev)
[![License](https://img.shields.io/npm/l/ng-hub-ui-loading.svg)](LICENSE)

Bloque de carga standalone para Angular 21+ — un indicador en línea, una capa superpuesta sobre el contenedor que está ocupado, o una cortina a pantalla completa, todo desde un único elemento `<hub-loading>`. Cinco indicadores puramente CSS, la opción de sustituirlos por un logo o una imagen, un mensaje opcional y un `HubLoadingService` con contador de referencias para el caso global. Junto a él, `<hub-loading-bar>`: la franja fina de progreso de página que va bajo la barra de navegación, conectada al router y a `HttpClient`. Sin dependencias externas; cada color y cada dimensión es una propiedad CSS `--hub-loading-*`.

## Documentación y ejemplos en vivo

Este paquete es parte de [Hub UI](https://hubui.dev/en/), una colección de bibliotecas de componentes Angular para apps standalone.

- Docs: https://hubui.dev/en/loading/overview/
- Ejemplos en vivo: https://hubui.dev/en/loading/examples/
- Hub UI: https://hubui.dev/en/

## 🧩 Familia de bibliotecas `ng-hub-ui`

Esta biblioteca forma parte del ecosistema **ng-hub-ui**:

- [**ng-hub-ui-action-sheet**](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-badges**](https://www.npmjs.com/package/ng-hub-ui-badges)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [**ng-hub-ui-buttons**](https://www.npmjs.com/package/ng-hub-ui-buttons)
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [**ng-hub-ui-ds**](https://www.npmjs.com/package/ng-hub-ui-ds)
- [**ng-hub-ui-forms**](https://www.npmjs.com/package/ng-hub-ui-forms)
- [**ng-hub-ui-history**](https://www.npmjs.com/package/ng-hub-ui-history)
- [**ng-hub-ui-icons**](https://www.npmjs.com/package/ng-hub-ui-icons)
- [**ng-hub-ui-loading**](https://www.npmjs.com/package/ng-hub-ui-loading) ← Estás aquí
- [**ng-hub-ui-metrics**](https://www.npmjs.com/package/ng-hub-ui-metrics)
- [**ng-hub-ui-milestones**](https://www.npmjs.com/package/ng-hub-ui-milestones)
- [**ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal)
- [**ng-hub-ui-nav**](https://www.npmjs.com/package/ng-hub-ui-nav)
- [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [**ng-hub-ui-panels**](https://www.npmjs.com/package/ng-hub-ui-panels)
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal)
- [**ng-hub-ui-signature**](https://www.npmjs.com/package/ng-hub-ui-signature)
- [**ng-hub-ui-skeleton**](https://www.npmjs.com/package/ng-hub-ui-skeleton)
- [**ng-hub-ui-sortable**](https://www.npmjs.com/package/ng-hub-ui-sortable)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [**ng-hub-ui-toast**](https://www.npmjs.com/package/ng-hub-ui-toast)
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

## 📑 Índice

- [📦 Descripción](#-descripción)
- [✨ Características](#-características)
- [🚀 Inicio rápido](#-inicio-rápido)
- [🎯 Modos](#-modos)
- [🎛️ Variantes](#️-variantes)
- [🖼️ Imagen y marca](#️-imagen-y-marca)
- [🧰 API programática](#-api-programática)
- [📊 Barra de progreso de página](#-barra-de-progreso-de-página)
- [📖 Referencia de la API](#-referencia-de-la-api)
- [🎨 Estilos / Variables CSS](#-estilos--variables-css)
- [♿ Accesibilidad](#-accesibilidad)
- [🖥️ Renderizado en servidor](#️-renderizado-en-servidor)
- [📦 Dependencias entre pares](#-dependencias-entre-pares)
- [📊 Changelog](#-changelog)
- [🤝 Contribución](#-contribución)
- [☕ Soporte](#-soporte)
- [📄 Licencia](#-licencia)

## 📦 Descripción

`ng-hub-ui-loading` cubre el hueco entre las demás primitivas de «algo está pasando» de la
familia y el spinner que vivía atrapado dentro de un botón: un bloque standalone que muestra
un indicador de actividad, una imagen o un logo opcionales y un mensaje opcional, y que puede
renderizarse en el flujo, sobre su propio contenedor o sobre todo el viewport.

### Cuándo usar cada biblioteca

| Paquete | Úsalo cuando |
| --- | --- |
| **`ng-hub-ui-loading`** | No puedes decir cuánto falta y la forma del resultado todavía no importa. Un indicador de actividad — en su sitio, sobre el contenedor ocupado o sobre toda la aplicación. |
| [`ng-hub-ui-skeleton`](https://www.npmjs.com/package/ng-hub-ui-skeleton) | Ya conoces la forma de lo que va a llegar y quieres que el layout reserve su sitio — placeholders estructurales con shimmer en lugar de un spinner. |
| [`ng-hub-ui-metrics`](https://www.npmjs.com/package/ng-hub-ui-metrics) | Conoces la cifra de progreso — una barra, un medidor o un anillo determinados que informan de un valor. |

> **`<hub-loading-bar>` frente a `<hub-progress>`.** Se parecen y responden a preguntas distintas. `hub-progress`, en `ng-hub-ui-metrics`, *muestra un valor que ya conoces*: es un componente de datos y su número es cierto. `hub-loading-bar` avisa de que algo está pasando cuando nadie sabe cuánto tardará: se inventa el número y no deja que llegue nunca al final. Usa el de metrics para una subida que informa de bytes; usa este para la franja bajo la barra de navegación.

Las tres se combinan: un skeleton para la lista que está llegando, un `<hub-loading mode="overlay">`
sobre el panel que se refresca y un `<hub-progress>` para la subida que informa de bytes.

## ✨ Características

- **Tres modos en un solo componente** — `inline`, superposición sobre el contenedor (`overlay`) y `fullscreen` sobre el viewport.
- **Cinco indicadores puramente CSS** — `spinner`, `dots`, `bars`, `pulse` y `ring`; sin bucle de animación en JavaScript, sin sprite SVG y sin fuente de iconos.
- **Soporte de imagen / logo** — sustituye el indicador por tu propio recurso de marca y anímalo con `spin` o `pulse`.
- **Mensaje y contenido proyectado opcionales** — un texto bajo el indicador más un slot `<ng-content>` para lo que haga falta.
- **Superposiciones programáticas** — `HubLoadingService` monta un `<hub-loading>` a pantalla completa bajo demanda, con `show()` / `hide()` contados por referencia para que dos tareas concurrentes no se desmonten la superposición mutuamente.
- **Valores por defecto para toda la aplicación** — `provideHubLoading()` redefine el valor por defecto de cada input, para el servicio *y* para cada `<hub-loading>` escrito en una plantilla, sin tocar un solo archivo de marcado.
- **Cualquier color de acento** — `color` acepta un nombre semántico del design system, un valor hex, `oklch()` o una referencia `var(...)`, resuelto con `resolveHubAccent()` de `ng-hub-ui-utils`.
- **Tematización por variables CSS** — cada color, dimensión y velocidad es una propiedad `--hub-loading-*`, con un mixin Sass `hub-loading-theme()` para re-vestir el bloque en una sola llamada.
- **Accesible por defecto** — `role="status"`, `aria-live="polite"` y `aria-busy="true"`, con un `ariaLabel` configurable y un tratamiento de `prefers-reduced-motion` que calma el movimiento en lugar de congelarlo.
- **Barra de progreso de página** — `<hub-loading-bar>`, la franja fina bajo la barra de navegación: en el flujo, anclada a un ancestro posicionado o fijada al viewport a la distancia que elijas.
- **Conexión con router y HTTP** — `provideHubLoadingBarRouter()` mantiene la barra exactamente lo que dura una navegación (incluida la que rechaza un guard), `hubLoadingBarInterceptor` lo que vive cada petición, y `withoutHubLoadingBar()` deja fuera de la cuenta los sondeos y los latidos.
- **Un avance que no miente** — la barra progresa a pasos cada vez menores y se detiene antes del final, no llega a pintarse para el trabajo que acaba dentro de su periodo de gracia, y retiene `aria-valuenow` mientras el número es inventado.
- **Standalone, `OnPush`, inputs signal** — y compatible con SSR: en el servidor el contador sigue funcionando, solo se omite el montaje en el DOM.

## 🚀 Inicio rápido

### 1. Instalar

```bash
npm install ng-hub-ui-loading ng-hub-ui-utils
```

> **Tematización (recomendado):** instala los tokens de diseño compartidos para que el bloque
> de carga — y todas las demás bibliotecas ng-hub-ui — usen la misma paleta y el mismo modo oscuro:
>
> ```bash
> npm install ng-hub-ui-ds
> ```
>
> ```css
> @import 'ng-hub-ui-ds/styles/tokens/hub-tokens.css';
> ```
>
> Es una peer dependency **opcional**: el componente incluye fallbacks CSS razonables
> y funciona sin ella.

### 2. Importar el componente standalone

```typescript
import { HubLoadingComponent } from 'ng-hub-ui-loading';

@Component({
	standalone: true,
	imports: [HubLoadingComponent],
	template: `
		@if (isLoading()) {
			<hub-loading message="Cargando resultados…" />
		}
	`
})
export class ResultsComponent {
	readonly isLoading = signal(true);
}
```

## 🎯 Modos

El input `mode` decide dónde se pinta el bloque. Todo lo demás — variante, imagen, mensaje,
tamaño, color — funciona igual en los tres.

### `inline` (por defecto)

Se renderiza en el flujo del documento, como cualquier otro bloque. Úsalo dentro del hueco
que está sustituyendo: el cuerpo de un panel, el placeholder de una tabla, una tarjeta que
todavía no se ha resuelto.

```html
<hub-loading message="Obteniendo facturas…" />
```

### `overlay`

Posicionado en absoluto sobre su contenedor, de modo que el contenido anterior sigue visible
por debajo mientras se ejecuta el refresco.

> El contenedor debe establecer un contexto de posicionamiento — dale `position: relative`.

```html
<section class="panel" style="position: relative">
	<article>…contenido ya renderizado…</article>

	@if (refreshing()) {
		<hub-loading mode="overlay" variant="ring" message="Actualizando…" />
	}
</section>
```

### `fullscreen`

Fijado al viewport, cubriendo la aplicación. Decláralo en una plantilla cuando el componente
sea el dueño del estado, o deja que [`HubLoadingService`](#-api-programática) lo monte por ti.

```html
@if (booting()) {
	<hub-loading mode="fullscreen" variant="pulse" message="Iniciando…" />
}
```

### Backdrop

`backdrop` pinta la capa translúcida detrás del indicador. Solo se aplica a `overlay` y
`fullscreen` — un bloque en línea no tiene nada que cubrir — y está activo por defecto.

```html
<hub-loading mode="overlay" [backdrop]="false" />
```

## 🎛️ Variantes

Cinco indicadores, todos dibujados con CSS. Se eligen con el input `variant`.

| Variante | Forma |
| --- | --- |
| `spinner` | Arco que gira (la opción por defecto). |
| `dots` | Tres puntos que laten en secuencia. |
| `bars` | Barras que suben y bajan. |
| `pulse` | Un único disco que se expande y se desvanece. |
| `ring` | Un anillo completo con un destello que lo recorre. |

```html
<hub-loading variant="dots" />
<hub-loading variant="bars" size="lg" color="success" />
<hub-loading variant="ring" color="#7c3aed" />
```

`size` elige entre `sm`, `md` (por defecto) y `lg`. Cada paso reajusta los tokens en lugar de
fijar dimensiones a fuego — `--hub-loading-size` (`1.5rem` / `2.5rem` / `4rem`), el grosor del
indicador `--hub-loading-thickness` y el `--hub-loading-font-size` del mensaje —, así que
cualquier valor fuera de esos tres pasos está a una propiedad CSS de distancia:

```css
.hero-loading {
	--hub-loading-size: 6rem;
}
```

`color` acepta un nombre de acento semántico (`primary`, `success`, `brand`…), un color literal
(`#7c3aed`, `rgb(...)`, `oklch(...)`) o una referencia `var(...)`. Las palabras simples se resuelven
al token del design system `var(--hub-sys-color-<nombre>, <nombre>)`, de modo que los nombres no
registrados y los colores con nombre de CSS siguen pintando.

## 🖼️ Imagen y marca

Asigna a `image` una URL o un data URI y sustituirá al indicador integrado — el caso habitual
es el logo del producto en la pantalla de arranque. `imageAnimation` le da movimiento.

```html
<hub-loading mode="fullscreen" image="/assets/logo.svg" imageAnimation="pulse" message="Preparando tu espacio…" />
```

| `imageAnimation` | Efecto |
| --- | --- |
| `none` | Imagen estática (por defecto). |
| `spin` | Rotación continua. |
| `pulse` | Latido rítmico de escala/opacidad. |

Dimensiona el recurso con `--hub-loading-image-size` y usa `--hub-loading-speed` para mantener
la animación al compás del resto del movimiento de tu marca.

Todo lo que se proyecte en el componente se renderiza bajo el mensaje, que es donde encaja el
contexto adicional o una vía de escape:

```html
<hub-loading mode="fullscreen" message="Importando 12.480 filas…">
	<button type="button" (click)="cancel()">Cancelar importación</button>
</hub-loading>
```

## 🧰 API programática

`HubLoadingService` cubre el caso que el componente declarativo no puede: trabajo que arranca
en un servicio, en un guard de rutas o en un effect, donde ninguna plantilla es dueña del flag.
Monta un único `<hub-loading>` a pantalla completa sobre `document.body` la primera vez que hace falta.

```typescript
import { inject } from '@angular/core';
import { HubLoadingService } from 'ng-hub-ui-loading';

@Injectable({ providedIn: 'root' })
export class ReportService {
	private readonly loading = inject(HubLoadingService);

	async export(): Promise<void> {
		this.loading.show({ message: 'Generando el informe…' });
		try {
			await this.buildReport();
		} finally {
			this.loading.hide();
		}
	}
}
```

### Contador de referencias

`show()` incrementa un contador interno y `hide()` lo decrementa; la superposición solo se
destruye cuando el contador llega a cero. Así, dos tareas concurrentes pueden llamar cada una
a `show()` / `hide()` sin que la primera en terminar desmonte la superposición que la segunda
todavía necesita. `hideAll()` fuerza el contador a cero — la llamada correcta desde un manejador
global de errores o un cambio de ruta, donde puede que los `hide()` pendientes no lleguen nunca.

```typescript
this.loading.show(); // contador 1 — aparece la superposición
this.loading.show(); // contador 2 — la misma superposición
this.loading.hide(); // contador 1 — la superposición sigue
this.loading.hide(); // contador 0 — la superposición se destruye
```

El contador está limitado a cero, así que un `hide()` de más es inofensivo: no puede dejarlo
en negativo ni convertir un `show()` posterior en una operación vacía.

### Actualizar una superposición viva

`update()` cambia in situ la superposición visible — normalmente el mensaje, según una tarea
larga avanza por sus fases.

```typescript
this.loading.show({ variant: 'ring', message: 'Conectando…' });
this.loading.update({ message: 'Descargando…' });
this.loading.update({ message: 'Casi está…' });
this.loading.hide();
```

Las opciones se acumulan en lugar de reemplazarse, y los dos valores vacíos significan cosas
distintas: una clave **omitida** (o `undefined`) deja el valor actual como está, mientras que
`null` lo borra. Por eso `{ message: null }` elimina el texto y `{ message: undefined }` lo
conserva. Las opciones acumuladas se descartan cuando el contador llega a cero, de modo que la
siguiente superposición nunca hereda un mensaje viejo de una operación terminada.

`isLoading` es un signal, así que el resto de la aplicación puede reaccionar al mismo estado:

```typescript
readonly busy = this.loading.isLoading; // Signal<boolean>
```

### Valores por defecto con `provideHubLoading()`

Registra el provider una vez para redefinir los valores por defecto de toda la aplicación — la
imagen de marca, la variante preferida, una etiqueta traducida — en lugar de repetirlos en cada
punto de llamada. Alcanza a **ambos** consumidores: las superposiciones del servicio *y* cada
`<hub-loading>` escrito en una plantilla, porque cada input del componente recurre a la misma
configuración. Un binding por instancia sigue ganando en local, y las opciones concretas de
`show()` / `update()` se fusionan por encima.

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHubLoading } from 'ng-hub-ui-loading';

export const appConfig: ApplicationConfig = {
	providers: [
		provideHubLoading({
			variant: 'ring',
			color: 'brand',
			backdrop: true,
			ariaLabel: 'Cargando, espera un momento'
		})
	]
};
```

La configuración se respalda en el token de inyección `HUB_LOADING_CONFIG`, que puedes proveer
directamente si necesitas calcularla a partir de otra dependencia. Su valor sin configurar se
exporta como `HUB_LOADING_DEFAULT_CONFIG` — los mismos valores que figuran abajo como valor por
defecto de cada input.

## 📊 Barra de progreso de página

`<hub-loading-bar>` es la otra mitad de «algo está pasando»: no *esta zona está ocupada*,
sino *la página misma está en camino*. Es la franja fina que ya conoces bajo una barra de
navegación, y la gobierna `HubLoadingBarService`.

### Las tres decisiones que la hacen creíble

- **Cuenta a quienes la piden.** Una navegación y las tres peticiones que lanza la página
  al llegar son cuatro referencias. La barra termina con la última, no con la primera: con
  un booleano, la petición más rápida la retiraría con la página todavía vacía.
- **Espera antes de pintar nada.** El trabajo que acaba dentro de `delay` (100 ms por
  defecto) no llega a mostrar barra. Una ruta cacheada que hace parpadear un indicador
  durante 40 ms se lee como un fallo, no como velocidad.
- **Su avance no llega nunca.** Aquí nadie conoce el porcentaje real, así que la barra
  progresa a pasos cada vez menores y se detiene en `max` (99). Solo `complete()` puede
  mostrar el 100 %, porque solo `complete()` sabe que es cierto.

### Colocación

```html
<!-- Colgando del canto inferior de una barra de navegación. El position: relative de la
     barra es lo que confina el overlay en ella — el mismo contrato que <hub-loading mode="overlay">. -->
<nav class="navbar" style="position: relative">
	…
	<hub-loading-bar mode="overlay" placement="bottom" />
</nav>
```

```html
<!-- Bajo una barra de navegación que a su vez está fijada: fija la barra al viewport y bájala. -->
<hub-loading-bar mode="fixed" style="--hub-loading-bar-offset: 56px" />
```

```html
<!-- En el flujo. Reserva su propia fila de 3px, así nada se desplaza al aparecer. -->
<hub-loading-bar />
```

### Conectarla a la página

Las dos integraciones son opcionales y se combinan a través del contador, así que ninguna
necesita saber de la otra.

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { hubLoadingBarInterceptor, provideHubLoadingBar, provideHubLoadingBarRouter } from 'ng-hub-ui-loading';

bootstrapApplication(AppComponent, {
	providers: [
		provideRouter(routes),

		// Una referencia por navegación, liberada al asentarse — también cuando la rechaza
		// un guard o la termina un error: los dos casos que suelen dejar la barra colgada.
		provideHubLoadingBarRouter(),

		// Una referencia por petición. finalize() la compensa igual en éxito, en error y en
		// cancelación, así que un typeahead cancelado no puede dejar la barra al 90 %.
		provideHttpClient(withInterceptors([hubLoadingBarInterceptor])),

		provideHubLoadingBar({ color: 'primary', delay: 120 })
	]
});
```

Sin el interceptor, la barra termina en cuanto se asienta la navegación, que es cuando se
crea el componente, no cuando llegan sus datos. Con los dos, cubre toda la espera.

Deja fuera de la cuenta las peticiones que el lector no ha pedido, o la barra no terminará
nunca:

```typescript
this.http.get('/api/heartbeat', { context: withoutHubLoadingBar() });
```

### Gobernarla a mano

```typescript
private readonly bar = inject(HubLoadingBarService);

async import(): Promise<void> {
	this.bar.start();
	try {
		await this.api.import();
	} finally {
		this.bar.complete(); // cada start() necesita exactamente un complete()
	}
}
```

Cuando el porcentaje es real, enlázalo y la barra deja de seguir al servicio:

```html
<!-- Un número gobierna la barra y se publica como aria-valuenow -->
<hub-loading-bar [progress]="uploaded()" color="success" />

<!-- null la oculta; dejar el input sin enlazar devuelve la barra al servicio -->
<hub-loading-bar [progress]="null" />
```

Y cuando no hay porcentaje que merezca inventarse, desplaza en lugar de llenar:

```html
<hub-loading-bar indeterminate [progress]="100" />
```

## 📖 Referencia de la API

### `HubLoadingComponent`

Selector: `hub-loading`. Standalone, `OnPush`, inputs signal.

| Input | Tipo | Por defecto | Descripción |
| --- | --- | --- | --- |
| `mode` | `'inline' \| 'overlay' \| 'fullscreen'` | `'inline'` | Dónde se pinta el bloque. `overlay` se posiciona en absoluto sobre el contenedor (que necesita `position: relative`); `fullscreen` queda fijado al viewport. |
| `variant` | `'spinner' \| 'dots' \| 'bars' \| 'pulse' \| 'ring'` | `'spinner'` | Qué indicador CSS dibujar. Se ignora cuando `image` está definido. |
| `image` | `string \| null` | `null` | URL o data URI que se renderiza en lugar del indicador integrado. |
| `imageAnimation` | `'none' \| 'spin' \| 'pulse'` | `'none'` | Animación aplicada a `image`. |
| `message` | `string \| null` | `null` | Texto renderizado bajo el indicador. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Escala del indicador; mapea sobre `--hub-loading-size`, que siempre lo sobrescribe. |
| `color` | `string \| null` | `null` | Color de acento: nombre semántico, hex, `rgb()`, `oklch()` o `var(...)`. Se resuelve con `resolveHubAccent()`. |
| `backdrop` | `boolean` | `true` | Capa translúcida detrás del indicador. Solo aplica a `overlay` y `fullscreen`. Se lee con `booleanAttribute`, así que el atributo `backdrop` a secas también funciona. |
| `ariaLabel` | `string` | `'Loading'` | Nombre accesible de la región de estado. |

Este componente no tiene outputs. El contenido proyectado en él se renderiza bajo el mensaje.

> Todos los valores por defecto salvo el de `mode` vienen del `HUB_LOADING_CONFIG` inyectado.
> Los de la tabla son los valores sin configurar; `provideHubLoading()` los redefine para toda
> la aplicación.

### `HubLoadingService`

Inyectable (`providedIn: 'root'`). Gobierna una única superposición a pantalla completa adjunta a `document.body`.

| Miembro | Firma | Descripción |
| --- | --- | --- |
| `show` | `(options?: HubLoadingOptions) => void` | Incrementa el contador y crea la superposición si aún no está montada. |
| `hide` | `() => void` | Decrementa el contador; destruye la superposición cuando llega a cero. |
| `hideAll` | `() => void` | Fuerza el contador a cero y destruye la superposición. |
| `update` | `(options: HubLoadingOptions) => void` | Aplica nuevas opciones a la superposición visible. |
| `isLoading` | `Signal<boolean>` | `true` mientras al menos una llamada mantenga su referencia — el contador, no el montaje. En renderizado en servidor sigue siendo veraz aunque no haya ninguna superposición montada. |

### `provideHubLoading(config?)`

Provider de entorno que registra los valores por defecto de los que parte cada indicador, a
través del token de inyección `HUB_LOADING_CONFIG`. Las claves omitidas conservan su valor de
`HUB_LOADING_DEFAULT_CONFIG`.

```typescript
function provideHubLoading(config?: Partial<HubLoadingConfig>): EnvironmentProviders;
```

### `HubLoadingOptions`

Las opciones visuales que aceptan `show()` y `update()`, y que `provideHubLoading()` recibe como
valores por defecto de la aplicación. Reflejan los inputs del componente, menos `mode` — una
superposición programática siempre es a pantalla completa.

| Opción | Tipo | Descripción |
| --- | --- | --- |
| `variant` | `'spinner' \| 'dots' \| 'bars' \| 'pulse' \| 'ring'` | Indicador a dibujar. |
| `image` | `string \| null` | Imagen o logo que sustituye al indicador. |
| `imageAnimation` | `'none' \| 'spin' \| 'pulse'` | Animación aplicada a `image`. |
| `message` | `string \| null` | Texto bajo el indicador. |
| `size` | `'sm' \| 'md' \| 'lg'` | Escala del indicador. |
| `color` | `string \| null` | Color de acento. |
| `backdrop` | `boolean` | Capa translúcida detrás del indicador. |
| `ariaLabel` | `string` | Nombre accesible de la región de estado. |

`HubLoadingConfig` es la misma forma con todos los miembros obligatorios — es lo que contiene el
token de inyección una vez resuelto.

### `HubLoadingBarComponent`

Selector: `hub-loading-bar`. Standalone, `OnPush`, inputs signal.

| Input | Tipo | Por defecto | Descripción |
| --- | --- | --- | --- |
| `mode` | `'inline' \| 'overlay' \| 'fixed'` | `'inline'` | Dónde se sitúa la franja. `inline` reserva su propia fila en el flujo; `overlay` se posiciona en absoluto contra el ancestro posicionado más cercano; `fixed` la fija al viewport a la distancia de `--hub-loading-bar-offset`. |
| `placement` | `'top' \| 'bottom'` | `'top'` | Borde al que se anclan los modos `overlay` y `fixed`. `inline` lo ignora. |
| `progress` | `number \| null \| undefined` | `undefined` | Tres significados. Sin enlazar: sigue a `HubLoadingBarService`. Un número (0–100): gobierna la barra directamente y se publica como `aria-valuenow`. `null`: la oculta. |
| `indeterminate` | `boolean` | `false` | Desplaza un fragmento en lugar de llenarse. Se lee con `booleanAttribute`, así que el atributo suelto también vale. |
| `glow` | `boolean` | `true` | Resplandor suave tras el borde de avance. |
| `color` | `string \| null` | `null` | Acento del relleno: nombre semántico, hex, `oklch()` o `var(...)`. Se resuelve con `resolveHubAccent()`. |
| `ariaLabel` | `string` | `'Loading'` | Nombre accesible de la barra de progreso. |

Este componente no tiene outputs ni proyecta contenido.

> Todos los valores por defecto salvo los de `mode` y `placement` vienen del
> `HUB_LOADING_BAR_CONFIG` inyectado; `provideHubLoadingBar()` los redefine para toda la
> aplicación.

### `HubLoadingBarService`

Inyectable (`providedIn: 'root'`). Es dueño del estado compartido de progreso de página que
representa cada `<hub-loading-bar>` sin enlazar. Proporciónalo en un componente para dar a
una barra su propio estado.

| Miembro | Firma | Descripción |
| --- | --- | --- |
| `start` | `() => void` | Registra una petición. La primera inicia un ciclo, tras el periodo de gracia y no de inmediato. |
| `complete` | `() => void` | Retira una petición. A cero, la barra llega al 100 % y se desvanece, o desaparece sin haberse visto si nunca llegó a pintarse. |
| `completeAll` | `() => void` | Descarta todas las peticiones pendientes y cierra la barra de golpe. |
| `set` | `(value: number) => void` | Lleva la barra a un valor exacto y la muestra sin esperar el periodo de gracia. Se limita a 0–100, no a `max`. |
| `inc` | `(amount?: number) => void` | Avanza la barra y la muestra. Sin cantidad decide la curva de avance configurada. Se limita a `max`. |
| `reset` | `() => void` | Cancela todo: sin animación de cierre, sin peticiones pendientes, sin nada en pantalla. |
| `progress` | `Signal<number>` | Relleno actual, de 0 a 100. |
| `isActive` | `Signal<boolean>` | Si queda alguien esperando; cierto incluso durante el periodo de gracia. |
| `isVisible` | `Signal<boolean>` | Si la barra está realmente pintada: falso durante el periodo de gracia, aún cierto durante la cola de cierre. |

### `provideHubLoadingBar(config?)`

Proveedor de entorno que registra los valores de partida de la barra mediante el token
`HUB_LOADING_BAR_CONFIG`. Las claves omitidas conservan su valor de
`HUB_LOADING_BAR_DEFAULT_CONFIG`.

```typescript
function provideHubLoadingBar(config?: Partial<HubLoadingBarConfig>): EnvironmentProviders;
```

### `HubLoadingBarConfig`

| Clave | Tipo | Por defecto | Descripción |
| --- | --- | --- | --- |
| `min` | `number` | `8` | Valor al que salta la barra al aparecer. Nunca cero: una barra vacía se lee como una barra que no funciona. |
| `max` | `number` | `99` | Techo que el avance automático no puede cruzar, para que no prometa un final que no conoce. |
| `trickleSpeed` | `number` | `250` | Milisegundos entre pasos del avance automático. |
| `trickle` | `boolean` | `true` | Si la barra avanza por su cuenta mientras espera. |
| `trickleFn` | `(progress: number) => number` | `hubLoadingBarTrickle` | Función de paso. La exportada por defecto devuelve 10 / 4 / 2 / 0,5 según se llena. |
| `delay` | `number` | `100` | Periodo de gracia antes de pintar nada. El trabajo que acaba dentro no muestra barra. Con `0` la barra se revela de forma síncrona, así que el trabajo que se resuelve dentro de su propia tarea también se ve. |
| `completeDelay` | `number` | `300` | Cuánto permanece la barra completada al 100 % antes de desvanecerse. Conviene que sea al menos `--hub-loading-bar-speed`. |
| `color` | `string \| null` | `null` | Acento por defecto. |
| `glow` | `boolean` | `true` | Resplandor por defecto. |
| `ariaLabel` | `string` | `'Loading'` | Nombre accesible por defecto. |

### `provideHubLoadingBarRouter()`

Proveedor de entorno que mantiene la barra exactamente lo que dura cada navegación, incluida
la que cancela un guard y la que termina en error. Las navegaciones se siguen con un
indicador propio en lugar de emparejar eventos uno a uno, así que un `NavigationStart`
perdido durante el arranque no puede dejar un `complete()` sin pareja.

Necesita `@angular/router`, declarado como dependencia entre pares **opcional**: nada más en
el paquete lo toca.

### `hubLoadingBarInterceptor` y `withoutHubLoadingBar()`

Un `HttpInterceptorFn` funcional que mantiene una referencia mientras vive cada petición,
compensada en `finalize` para que un error o una cancelación también la liberen.
`withoutHubLoadingBar()` construye el `HttpContext` que saca una petición de la cuenta:
úsalo en todo lo que el lector no haya pedido, o la barra no terminará nunca.
`HUB_LOADING_BAR_SKIP` es el `HttpContextToken` subyacente.

### Tipos exportados

```typescript
type HubLoadingMode = 'inline' | 'overlay' | 'fullscreen';
type HubLoadingVariant = 'spinner' | 'dots' | 'bars' | 'pulse' | 'ring';
type HubLoadingSize = 'sm' | 'md' | 'lg';
type HubLoadingImageAnimation = 'none' | 'spin' | 'pulse';
```

También se exportan: `HubLoadingOptions`, `HubLoadingConfig`, `HUB_LOADING_CONFIG` y
`HUB_LOADING_DEFAULT_CONFIG`.

## 🎨 Estilos / Variables CSS

El componente declara los valores por defecto de sus tokens en su propio elemento anfitrión, con
especificidad cero (`:where(:host)`), así que cualquier regla del consumidor gana — y cada uno sube por la escalera
de la familia: primero la capa semántica `--hub-sys-*`, después la primitiva `--hub-ref-*` y por
último un literal. Por eso el bloque ya encaja con tu tema, y con su modo oscuro, antes de
sobrescribir nada. Los valores sin equivalente honesto en el design system (el diámetro de un
indicador, el periodo de un ciclo, un radio de desenfoque) llevan un literal en lugar de tomar
prestado un token `sys` que significa otra cosa.

Los estilos van encapsulados, y eso no quita nada a poder re-vestir el indicador desde una hoja
global: la clase `hub-loading` está en el elemento anfitrión, así que una regla escrita contra
`.hub-loading` lo alcanza igual que antes, y una propiedad personalizada declarada ahí se hereda
hasta el último elemento de dentro. La superposición que `HubLoadingService` monta en
`document.body` es una instancia real del componente creada con `createComponent()`, así que se
lleva esta hoja consigo.

| Variable | Por defecto | Descripción |
| --- | --- | --- |
| `--hub-loading-accent` | `var(--hub-sys-color-primary, #0d6efd)` | Color del indicador. Es donde escribe el input `color`. |
| `--hub-loading-size` | `2.5rem` | Tamaño de la caja del indicador. Es donde mapea el input `size`. |
| `--hub-loading-thickness` | `calc(var(--hub-ref-border-width, 1px) * 3)` | Grosor del trazo de los indicadores `spinner` y `ring`. |
| `--hub-loading-speed` | `0.9s` | Duración de un ciclo de animación, para los indicadores y para las animaciones de imagen. |
| `--hub-loading-gap` | `var(--hub-sys-gap-2, var(--hub-ref-space-2, 0.5rem))` | Espacio entre indicador, mensaje y contenido proyectado. |
| `--hub-loading-text-color` | `var(--hub-sys-text-primary, var(--hub-ref-color-gray-900, #212529))` | Color del mensaje. |
| `--hub-loading-font-size` | `var(--hub-ref-font-size-sm, 0.875rem)` | Tamaño de fuente del mensaje. |
| `--hub-loading-backdrop-bg` | `color-mix(in srgb, var(--hub-sys-surface-page, #fff) 72%, transparent)` | Fondo del backdrop en `overlay` / `fullscreen`. Sigue la superficie de página del propio tema, así que el velo es blanco en temas claros y oscuro en temas oscuros. |
| `--hub-loading-backdrop-blur` | `2px` | Radio de desenfoque del backdrop. |
| `--hub-loading-z-index` | `var(--hub-sys-zindex-modal, 1055)` | Orden de apilado de la capa `fullscreen`. |
| `--hub-loading-image-size` | `var(--hub-loading-size)` | Tamaño con el que se renderiza el recurso de `image` — sigue al tamaño del indicador mientras no digas lo contrario. |

```css
hub-loading {
	--hub-loading-accent: var(--hub-sys-color-brand);
	--hub-loading-size: 3rem;
	--hub-loading-speed: 1.2s;
	--hub-loading-backdrop-blur: 4px;
}
```

### El mixin Sass `hub-loading-theme()`

Para proyectos con Sass, `hub-loading-theme()` re-viste el bloque en un solo include. Todos los
parámetros son opcionales y valen `null` por defecto, así que solo se emiten los que pasas como
overrides `--hub-loading-*` — el resto conserva los valores del componente. Está basado en tokens
y es autocontenido (sin dependencia de Bootstrap).

```scss
@use 'ng-hub-ui-loading/styles' as hub;

.app-shell {
	@include hub.hub-loading-theme(
		$accent: var(--hub-sys-color-brand),
		$size: 3.5rem,
		$speed: 1.2s,
		$backdrop-bg: rgba(15, 23, 42, 0.72),
		$backdrop-blur: 4px
	);
}
```

Parámetros disponibles: `$accent`, `$size`, `$thickness`, `$speed`, `$gap`, `$text-color`,
`$font-size`, `$backdrop-bg`, `$backdrop-blur`, `$z-index`, `$image-size`.

### Las variables de la barra de carga

Declaradas en el elemento anfitrión de la barra (`:where(:host)`), con el mismo contrato de especificidad cero. Las
dos duraciones son literales en lugar de `--hub-sys-transition-*`: el relleno tiene que
llegar más o menos cuando cae el siguiente paso del avance, así que está acoplado a
`trickleSpeed`, y tomar prestada la escala de transiciones de la aplicación dejaría la barra
un paso por detrás del número que dibuja en un tema lento.

| Variable | Por defecto | Descripción |
| --- | --- | --- |
| `--hub-loading-bar-accent` | `var(--hub-sys-color-primary, #0d6efd)` | Color del relleno. Es donde escribe el input `color`. |
| `--hub-loading-bar-height` | `3px` | Grosor de la franja. |
| `--hub-loading-bar-track-bg` | `transparent` | Pista sin rellenar. Transparente para que una barra en reposo no dibuje una línea permanente bajo la navegación. |
| `--hub-loading-bar-radius` | `0` | Radio de las esquinas de la franja y su relleno. |
| `--hub-loading-bar-speed` | `200ms` | Cuánto tarda el relleno en alcanzar un valor nuevo. |
| `--hub-loading-bar-fade` | `300ms` | Aparición y desaparición de toda la franja. |
| `--hub-loading-bar-easing` | `linear` | Curva del relleno. Lineal se lee como avance constante y no como un adorno. |
| `--hub-loading-bar-glow-color` | `var(--hub-loading-bar-accent)` | Color del resplandor del borde de avance. |
| `--hub-loading-bar-glow-blur` | `10px` | Radio de desenfoque de ese resplandor. |
| `--hub-loading-bar-glow-spread` | `1px` | Radio de expansión de ese resplandor. |
| `--hub-loading-bar-indeterminate-speed` | `1.6s` | Periodo de un recorrido `indeterminate`. Se calma con `prefers-reduced-motion`. |
| `--hub-loading-bar-offset` | `0px` | Distancia al borde al que se anclan los modos `overlay` y `fixed`: cuánto cuelga la barra bajo la navegación. |
| `--hub-loading-bar-z-index` | `var(--hub-sys-zindex-sticky, 1020)` | Orden de apilado de los modos posicionados. Nivel de chrome, deliberadamente por debajo de diálogos y toasts. |

```css
hub-loading-bar {
	--hub-loading-bar-accent: var(--hub-sys-color-brand);
	--hub-loading-bar-height: 2px;
	--hub-loading-bar-offset: 56px;
}
```

`hub-loading-bar-theme()` es el mixin Sass equivalente, con el mismo contrato de parámetros
opcionales que `hub-loading-theme()`.

### Clases BEM

La estructura interna es estable y direccionable, para los casos a los que un token no llega:

| Clase | Elemento |
| --- | --- |
| `.hub-loading` | Bloque anfitrión. |
| `.hub-loading--inline` · `--overlay` · `--fullscreen` | Modificadores de modo. |
| `.hub-loading--sm` · `--md` · `--lg` | Modificadores de tamaño; cada uno reajusta los tokens de tamaño, grosor y tipografía. |
| `.hub-loading--backdrop` | Presente solo cuando se pinta el velo (nunca en modo `inline`). |
| `.hub-loading__indicator` | El indicador puramente CSS, con un modificador `--spinner` / `--dots` / `--bars` / `--pulse` / `--ring`. |
| `.hub-loading__dot` · `.hub-loading__bar` | Las piezas individuales de los indicadores `dots` y `bars`. |
| `.hub-loading__image` | El recurso de `image`, con `--spin` / `--pulse` cuando está animado. |
| `.hub-loading__message` | El texto del mensaje. |

La barra tiene su propio juego, y conviene conocerlo: casi todo lo que hay ahí es estado al
que puedes engancharte desde CSS, no estructura en la que tengas que meterte:

| Clase | Elemento |
| --- | --- |
| `.hub-loading-bar` | Bloque anfitrión. |
| `.hub-loading-bar--inline` · `--overlay` · `--fixed` | Modificadores de modo. |
| `.hub-loading-bar--top` · `--bottom` | Modificadores de colocación; solo los emiten los dos modos posicionados, así que nunca alcanzan a una barra en flujo. |
| `.hub-loading-bar--visible` | Presente solo mientras la barra está pintada. La transición del relleno está acotada a él, de modo que el rebobinado entre ciclos no se anima hacia atrás. |
| `.hub-loading-bar--indeterminate` | El recorrido está en marcha en lugar de un relleno. |
| `.hub-loading-bar--glow` | El resplandor del borde de avance está activo — es el valor por defecto, salvo que `[glow]="false"` o un `provideHubLoadingBar()` reajustado lo apaguen. |
| `.hub-loading-bar__indicator` | El relleno en sí; su `::after` pinta el resplandor. |

### De derecha a izquierda

Con `[dir='rtl']` el recorrido `indeterminate` se invierte, de forma que viaja con el texto
y no contra él. No hay nada que activar: la hoja de estilos lee la dirección de la propia
barra o de cualquier ancestro que lleve el atributo, que es donde una aplicación RTL ya la
marca. El relleno determinado no necesita esa regla — se maqueta con propiedades lógicas y
se refleja solo.

## ♿ Accesibilidad

- El bloque es una **región de estado**: `role="status"`, `aria-live="polite"` y
  `aria-busy="true"`. Una región viva «polite» se anuncia en la siguiente pausa natural, así que
  iniciar una carga nunca interrumpe lo que la persona está leyendo.
- `ariaLabel` (por defecto `'Loading'`) da nombre a esa región. Ponle algo específico cuando la
  página pueda tener varias — «Cargando facturas» es mejor que un segundo «Cargando» genérico.
- Como `message` vive dentro de la región viva, cambiarlo — incluso mediante
  `HubLoadingService.update()` — se anuncia, y eso es lo que hace legible una tarea por fases
  sin necesidad de verla.
- El indicador y la `image` son decorativos (`aria-hidden`, `alt` vacío), así que nada se anuncia
  dos veces. Lo que carga el significado es `ariaLabel` y el `message`.
- Renderiza el bloque solo mientras el trabajo esté realmente en curso. Una región con
  `aria-busy="true"` montada de forma permanente le dice a la tecnología de apoyo que la
  aplicación está cargando para siempre.
- Con `prefers-reduced-motion: reduce` la animación se **calma, no se congela** — un loader
  congelado se lee como una interfaz colgada. El ciclo se ralentiza a `2.4s` y toda rotación o
  escalado se sustituye por un simple fundido, de modo que nada gira ni da saltos.

### La barra de carga

- La barra es un `role="progressbar"` con `aria-valuemin` / `aria-valuemax` estáticos,
  nombrado por `ariaLabel`, y `aria-hidden` mientras no está pintada.
- **`aria-valuenow` se retiene salvo que el valor sea real.** Mientras el servicio avanza
  solo, el número en pantalla está inventado —nadie conoce el porcentaje real de una carga
  de página— y una barra de progreso sin `aria-valuenow` es exactamente como ARIA escribe
  «indeterminada». Anunciar un «43 %» falso sería peor que no anunciar nada. El valor
  aparece únicamente cuando alguien ha enlazado uno, y vuelve a retenerse con
  `indeterminate`.
- Con `prefers-reduced-motion: reduce` el recorrido `indeterminate` se ralentiza bastante.
  El relleno determinado se deja intacto a propósito: no es decoración, es el valor que se
  está informando, y congelarlo dejaría una barra que no dice nada.

## 🖥️ Renderizado en servidor

- `<hub-loading>` es marcado declarativo y CSS, sin ninguna API de navegador en la ruta de
  renderizado, así que se renderiza en el servidor como cualquier otro componente.
- `HubLoadingService` se puede llamar sin riesgo durante el renderizado en servidor: `show()`,
  `update()`, `hide()` y `hideAll()` no necesitan su propia guarda de plataforma. Solo se omite
  el montaje en el DOM — el contador de referencias sigue funcionando, así que `isLoading` sigue
  siendo veraz y la hidratación no encuentra marcado huérfano de la superposición.

- `HubLoadingBarService` **no crea ningún temporizador** en el servidor. Esto importa más
  de lo que parece: un intervalo repetido dentro de la zona de Angular mantendría
  `ApplicationRef.isStable` en falso para siempre y colgaría el renderizado. El contador
  sigue funcionando, así que `isActive` dice la verdad, y la barra nunca se pinta en
  servidor, de modo que no hay nada que descuadre en la hidratación. En el navegador los
  temporizadores corren fuera de la zona, donde escribir un signal sigue programando la
  detección de cambios pero un tic de 250 ms no arrastra a toda la aplicación.

## 📦 Dependencias entre pares

```json
{
	"@angular/common": ">=21.0.0",
	"@angular/core": ">=21.0.0",
	"@angular/router": ">=21.0.0",
	"ng-hub-ui-utils": ">=22.8.0",
	"rxjs": ">=7.5.0"
}
```

`@angular/router` es **opcional** (`peerDependenciesMeta`). Solo lo toca
`provideHubLoadingBarRouter()`; todo lo demás del paquete funciona sin router.

## 📊 Changelog

Consulta [CHANGELOG.md](./CHANGELOG.md) para el historial completo de versiones, y
[BREAKING_CHANGES.md](./BREAKING_CHANGES.md) para las notas de migración.

## 🤝 Contribución

Las contribuciones son bienvenidas. Abre una issue para discutir cambios sustanciales antes de
enviar un pull request, y asegúrate de documentar cada cambio de la biblioteca en `CHANGELOG.md`.

## ☕ Soporte

- **Issues**: [GitHub Issues](https://github.com/carlos-morcillo/ng-hub-ui/issues)
- **Autor**: [Carlos Morcillo](https://www.carlosmorcillo.com)

## 📄 Licencia

MIT © [Carlos Morcillo](https://www.carlosmorcillo.com)
