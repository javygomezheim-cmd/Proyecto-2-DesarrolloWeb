# Actividades Académicas

## Integrantes

* Tomas Contreras
* Marcos Contreras
* Cristobal Magnata
* Javier Gomez

## Descripción del proyecto

**Actividades Académicas** es una aplicación web desarrollada con React que permite a estudiantes universitarios organizar y gestionar sus actividades académicas.

La problemática que aborda el proyecto es la dificultad de mantener organizadas las distintas tareas, trabajos, controles y entregas de diferentes asignaturas. La aplicación centraliza esta información en un solo lugar, permitiendo consultar las actividades pendientes, revisar sus fechas de entrega, organizarlas por asignatura y llevar un registro de las actividades completadas.

La aplicación utiliza almacenamiento local del navegador para conservar la información del usuario y además incorpora APIs públicas para complementar sus funcionalidades.

## Usuarios objetivo

La aplicación está dirigida principalmente a:

* Estudiantes universitarios.
* Estudiantes de educación superior que tengan varias asignaturas y actividades.
* Usuarios que necesiten organizar trabajos, tareas, controles y fechas de entrega.

## Funcionalidades principales

### Gestión de actividades

* Crear nuevas actividades académicas.
* Editar actividades existentes.
* Eliminar actividades.
* Marcar actividades como completadas.
* Visualizar el detalle de cada actividad.
* Agregar y gestionar subtareas.
* Visualizar fechas y horas de entrega.
* Identificar actividades atrasadas, urgentes, próximas y normales.
* Buscar actividades por título o descripción.
* Filtrar actividades por prioridad.
* Filtrar actividades por asignatura.

### Gestión de asignaturas

* Visualizar las asignaturas registradas.
* Crear nuevas asignaturas.
* Asociar actividades a una asignatura.
* Visualizar la cantidad de actividades pendientes por asignatura.
* Visualizar el próximo trabajo pendiente de cada asignatura.
* Eliminar una o varias asignaturas.
* Eliminar las actividades asociadas al eliminar una asignatura.

### Calendario

* Visualizar las actividades organizadas por fecha.
* Navegar entre los diferentes meses.
* Volver al mes actual.
* Identificar actividades completadas.
* Mostrar feriados de Chile.
* Consultar los feriados mediante una API pública.

### Historial

* Visualizar las actividades que han sido completadas.
* Consultar información de las actividades finalizadas.
* Acceder al detalle de una actividad desde el historial.

### Libros

* Buscar libros utilizando la API pública de Open Library.
* Mostrar título, autores, año de publicación y portada.
* Acceder a la información del libro en Open Library.
* Seleccionar una asignatura como contexto para la búsqueda de material bibliográfico.

### Persistencia de información

La aplicación utiliza `localStorage` del navegador para guardar:

* Actividades.
* Asignaturas.

De esta manera, los datos permanecen disponibles al volver a cargar la aplicación en el mismo navegador.

## Tecnologías utilizadas

### Frontend

* **React 19.2.8**
* **React DOM 19.2.8**
* **JavaScript**
* **JSX**
* **Bootstrap 5.3.8**
* **CSS**

### Herramientas de desarrollo

* **Vite 8.3.0**
* **ESLint 10.10.0**
* **Git**
* **GitHub**
* **Visual Studio Code**

### APIs públicas

* **Nager.Date API:** utilizada para obtener los feriados públicos de Chile.
* **Open Library API:** utilizada para realizar búsquedas de libros.

## Instrucciones para ejecutar el proyecto

### Requisitos

Se necesita tener instalado:

* Node.js
* npm
* Git

### Instalación

Clonar el repositorio:

```bash
git clone https://github.com/javygomezheim-cmd/Proyecto-2-DesarrolloWeb.git
```

Ingresar a la carpeta del proyecto:

```bash
cd Proyecto-2-DesarrolloWeb
```

Instalar las dependencias:

```bash
npm install
```

### Ejecutar en modo desarrollo

```bash
npm run dev
```

Luego abrir en el navegador la dirección indicada por Vite, normalmente:

```text
http://localhost:5173
```

### Otros comandos disponibles

Para generar la versión de producción:

```bash
npm run build
```

Para previsualizar la versión de producción:

```bash
npm run preview
```

Para revisar el código mediante ESLint:

```bash
npm run lint
```

## Estructura general de la aplicación

La estructura principal del proyecto es:

```text
Proyecto-2-DesarrolloWeb/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── AsignaturaCard.jsx
│   │   ├── AsignaturaModal.jsx
│   │   ├── AsignaturasEstadisticas.jsx
│   │   ├── ConfirmarEliminarModal.jsx
│   │   ├── FormularioActividad.jsx
│   │   ├── ListaSubtareas.jsx
│   │   └── Sidebar.jsx
│   │
│   ├── data/
│   │   ├── actividades.json
│   │   └── asignaturas.json
│   │
│   ├── pages/
│   │   ├── AsignaturasPage.jsx
│   │   ├── Calendariopage.jsx
│   │   ├── DetalleActividadPage.jsx
│   │   ├── HistorialPage.jsx
│   │   ├── LibrosPage.jsx
│   │   ├── ListaActividadesPage.jsx
│   │   └── NuevaActividadPage.jsx
│   │
│   ├── services/
│   │   └── publicApi.js
│   │
│   ├── styles/
│   │   ├── DetalleActividad.css
│   │   └── styles.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

### Organización

* `components/`: contiene componentes reutilizables de la interfaz.
* `data/`: contiene los datos iniciales de actividades y asignaturas.
* `pages/`: contiene las diferentes vistas principales de la aplicación.
* `services/`: contiene funciones relacionadas con servicios externos.
* `styles/`: contiene los estilos propios de la aplicación.
* `App.jsx`: administra el estado principal y la navegación entre las vistas.
* `main.jsx`: punto de entrada de la aplicación.

La navegación entre las páginas se realiza mediante el estado de React, utilizando la variable `vista`, sin utilizar React Router.

## API pública utilizada

### Nager.Date API

La aplicación utiliza **Nager.Date** para obtener los feriados públicos de Chile correspondientes al año 2026.

La información obtenida permite complementar el calendario de actividades y mostrar los feriados junto con las fechas académicas.

### Documentación oficial

[Documentación oficial de Nager.Date](https://date.nager.at/)

### Endpoint utilizado

```text
GET https://date.nager.at/api/v3/PublicHolidays/2026/CL
```

El endpoint recibe:

* `2026`: año consultado.
* `CL`: código de país correspondiente a Chile.

La respuesta contiene información sobre los feriados, incluyendo su fecha y nombre local.

La aplicación transforma los datos recibidos para utilizar principalmente:

* Fecha.
* Nombre del feriado.
* Tipo de feriado.

### Justificación funcional

La API de Nager.Date se utiliza porque permite incorporar información de feriados reales al calendario de la aplicación.

Esto permite que el estudiante pueda visualizar sus actividades académicas considerando también fechas festivas, entregando mayor contexto al calendario.

---

## Open Library API

La aplicación también utiliza **Open Library** para realizar búsquedas de libros.

### Documentación oficial

[Open Library API](https://openlibrary.org/developers/api)

### Endpoint utilizado

```text
https://openlibrary.org/search.json
```

La aplicación realiza solicitudes utilizando parámetros de búsqueda, por ejemplo:

```text
https://openlibrary.org/search.json?q=algorithms&limit=12&fields=key,title,author_name,first_publish_year,cover_i,isbn,subject
```

Se utiliza el método:

```text
GET
```

La respuesta permite obtener información como:

* Título.
* Autor.
* Año de publicación.
* Portada.
* Identificador del libro.
* Asignaturas asociadas al libro.

### Justificación funcional

Open Library permite complementar la aplicación con una herramienta de búsqueda bibliográfica. Los estudiantes pueden buscar libros relacionados con sus necesidades académicas y acceder posteriormente a la información disponible en Open Library.

## Uso de Inteligencia Artificial

Durante el desarrollo del proyecto se utilizaron herramientas de Inteligencia Artificial como apoyo al proceso de desarrollo.

### Herramientas utilizada

**ChatGPT**
**Claude**
**Gemini**

### Propósito

La herramienta fue utilizada como apoyo en diferentes etapas del desarrollo, principalmente para:

* Resolver dudas relacionadas con React y JavaScript.
* Detectar y solucionar errores en el código.
* Comprender conceptos de React.
* Revisar posibles problemas de implementación.
* Apoyar la creación y modificación de componentes.
* Apoyar la documentación del proyecto.
* Revisar la estructura general de la aplicación.

### Prompt o consulta representativa

Un ejemplo de consulta realizada fue:

> "Tengo este código de React y quiero agregar una funcionalidad sin cambiar lo que ya tengo. Explícame qué debo modificar y como hacerlo"

También se utilizaron consultas para comprender errores específicos, revisar componentes y conectar funcionalidades entre las distintas páginas.

### Resultado

La herramienta entregó explicaciones, recomendaciones y ejemplos de código que sirvieron como apoyo para implementar y corregir distintas partes de la aplicación.

Entre las áreas en las que se utilizó como apoyo se encuentran:

* Manejo de estados con `useState`.
* Uso de `useEffect`.
* Persistencia mediante `localStorage`.
* Componentización de React.
* Integración de APIs públicas.
* Manejo de errores.
* Organización del proyecto.
* Corrección de errores de código.

### Modificación humana

El código sugerido por la herramienta fue revisado y adaptado por los integrantes del equipo antes de incorporarlo al proyecto.

Se realizaron modificaciones según las necesidades de la aplicación, se probaron las funcionalidades y se descartaron o corrigieron recomendaciones que no se ajustaban al proyecto.

La implementación final fue integrada y probada dentro de la estructura existente del proyecto.

### Aprendizaje

El uso de Inteligencia Artificial permitió reforzar conocimientos sobre React, especialmente sobre el manejo de estados, componentes, efectos, eventos y comunicación entre componentes.

También permitió comprender mejor el uso de APIs mediante `fetch`, el almacenamiento de información utilizando `localStorage` y la forma de organizar una aplicación React en componentes y páginas.

La IA fue utilizada como herramienta de apoyo y no como reemplazo de la comprensión del código desarrollado.

## Trabajo colaborativo y Git

El proyecto fue desarrollado utilizando Git y GitHub para mantener un flujo de trabajo colaborativo.

Se utilizaron las ramas principales:

```text
main
develop
```

Además, se utilizaron ramas `feature/` para desarrollar funcionalidades específicas antes de integrarlas a `develop`.

El trabajo se integró mediante Pull Requests, permitiendo mantener un historial de cambios y facilitar la colaboración entre los integrantes del equipo.

## Limitaciones conocidas

* La información se almacena mediante `localStorage`, por lo que los datos están asociados al navegador utilizado.
* No existe un backend ni una base de datos externa.
* Si se eliminan los datos del navegador, las actividades y asignaturas creadas por el usuario pueden perderse.
* Los feriados consultados mediante Nager.Date están configurados actualmente para el año 2026.
* La disponibilidad de los feriados depende del funcionamiento de la API externa.
* La búsqueda de libros depende de la disponibilidad de Open Library.
* Los libros no necesariamente corresponden a un uso académico
* La aplicación no cuenta con autenticación ni cuentas de usuario.
* La navegación entre vistas se maneja mediante estado de React y no mediante un sistema de rutas como React Router.
