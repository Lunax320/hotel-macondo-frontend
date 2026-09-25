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

3. Levantar el servidor de desarrollo:

```bash
ng serve
```

4. Abrir en el navegador:

```
http://localhost:4200
```

El servidor recargará automáticamente al detectar cambios en los archivos fuente.

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
