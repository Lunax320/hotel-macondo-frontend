# Hotel Macondo — Frontend (Angular)

Aplicación web frontend para la gestión de reservas, catálogo de hospedaje y experiencias temáticas del **Hotel Macondo**, inspirada en el universo literario de _Cien años de soledad_ y situada frente al mar Caribe en Cartagena de Indias.

Este repositorio corresponde a la capa de presentación desacoplada del sistema, desarrollada en **Angular v19** como Single Page Application.

---

## Stack Tecnológico

- **Framework:** [Angular v19](https://angular.dev/) (Standalone Components, Signals y Control Flow moderno: `@if`, `@for`).
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) (modelado estricto con `interface`).
- **Estilos:** Sass / SCSS con la paleta de identidad oficial de Macondo (Azul Caribe, Dorado Colonial y Crema Arena).
- **Gestor de Paquetes:** npm / Node.js (LTS).
- **Herramientas de Desarrollo:** Angular CLI.

---

## Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado en tu entorno local:

- **Node.js** (versión 18.19+ o 20+ recomendada).
- **npm** (incluido habitualmente con Node.js).
- **Angular CLI** instalado globalmente:

```bash
npm install -g @angular/cli@19
```

---

## Instalación y Ejecución

1. Clonar el repositorio:

```bash
git clone https://github.com/TU-USUARIO/hotel-macondo-frontend.git
cd hotel-macondo-frontend
```

2. Instalar las dependencias del proyecto:

```bash
npm install
```

3. Levantar el servidor en desarrollo:

```powershell
npm run start:dev
```

4. Levantar el servidor en producción:

```powershell
npm run start:prod
```

El modo de desarrollo usa `http://localhost:8080/api` y el modo de producción
usa `https://macondo-api.kusare.fyi/api`.

Abrir desarrollo en el navegador:

```
http://localhost:4200
```

El servidor de desarrollo recargará automáticamente al detectar cambios en los
archivos fuente.

---

## Configuración de entornos

Los endpoints se administran desde `src/environments`:

| Archivo | Uso |
|---|---|
| `environment.development.ts` | Angular en desarrollo |
| `environment.ts` | Angular en producción |

Configuración de desarrollo:

```typescript
apiUrl: 'http://localhost:8080/api'
baseUrl: 'http://localhost:8080/'
```

Configuración de producción:

```typescript
apiUrl: 'https://macondo-api.kusare.fyi/api'
baseUrl: 'https://macondo-api.kusare.fyi/'
```

`angular.json` reemplaza automáticamente `environment.ts` por
`environment.development.ts` al compilar o servir con la configuración
`development`.

---

## Publicación

El frontend publicado debe servir los archivos compilados desde
`dist/HotelMacondo/browser`. Para compilar producción:

```powershell
npm run build -- --configuration production
```

La configuración publicada puede exponerse con Cloudflare Tunnel:

| Servicio | URL pública | Origen local |
|---|---|---|
| Frontend | `https://macondo.kusare.fyi` | `http://localhost:4200` |
| Backend | `https://macondo-api.kusare.fyi` | `http://localhost:8080` |

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── app.ts             # Componente raíz (standalone)
│   ├── app.html           # Plantilla raíz
│   ├── app.scss           # Estilos del componente raíz
│   ├── app.config.ts      # Configuración de providers
│   └── app.routes.ts      # Definición de rutas
├── public/                # Recursos estáticos (favicon, imágenes)
├── index.html             # Documento HTML principal
├── main.ts                # Punto de entrada de la aplicación
└── styles.scss            # Estilos globales
```
