# 🌌 Astro Wiki

Una implementación moderna y performante de una Wiki personal, diseñada para gestionar contenido estructurado como documentación técnica, campañas de juegos o notas personales. Construida con **Astro 6** y **Tailwind CSS 4**.

---

## 🚀 Inicio Rápido

### Requisitos Previos

- **Node.js**: v22.12.0 o superior.
- **Gestor de paquetes**: [pnpm](https://pnpm.io/) (recomendado).

### Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repo>
   cd wiki
   ```

2. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   WIKI_NAME="Mi Wiki"
   WIKI_CONTENT_DIR=wiki
   ```
   *Nota: `WIKI_NAME` define el nombre que aparecerá en el Header y el título del sitio (por defecto: "Wiki"). `WIKI_CONTENT_DIR` define qué carpeta dentro de `src/content/` se usará como fuente principal.*

4. **Iniciar servidor de desarrollo:**
   ```bash
   pnpm dev
   ```

---

## 📂 Estructura de Contenido (MDX)

La wiki utiliza **MDX** para permitir componentes interactivos dentro del contenido estático. Los archivos deben ubicarse en `src/content/[NOMBRE_DE_TU_WIKI]/`.

### Requisitos del Archivo

Cada archivo `.mdx` debe contener al menos los siguientes campos en su frontmatter:

```md
---
title: "Nombre de la Página"  # Aparecerá en el Sidebar y título
order: 1                      # Orden de aparición en el menú (ascendente)
---

# Título Principal
Contenido aquí...
```

> [!IMPORTANT]
> **Archivo de Inicio del Proyecto**: La carpeta principal definida en `WIKI_CONTENT_DIR` **debe** contener un archivo `index.mdx` (o `.md`) con su respectivo `title` y `order: 0`. Este archivo sirve como la página de inicio de tu wiki.

### Organización de Carpetas e Índices

- **Folders**: Puedes crear subcarpetas para organizar el contenido (ej. `monstruos/`, `hechizos/`).
- **Páginas de Índice**: Para que una carpeta tenga su propia página de aterrizaje, crea un archivo `index.mdx` dentro de ella.
- **Navegación**: El Sidebar se construye automáticamente basándose en la estructura del sistema de archivos y el campo `order`.

---

## 🛠️ Stack Tecnológico

- **Framework**: [Astro 6](https://astro.build/) - Rendimiento estelar y arquitectura de islas.
- **Estilos**: [Tailwind CSS 4](https://tailwindcss.com/) - El motor de CSS más moderno con plugin nativo para Vite.
- **UI**: [Shadcn/UI](https://ui.shadcn.com/) - Componentes accesibles y elegantes.
- **Lógica**: [React 19](https://react.dev/) - Para componentes interactivos y estado del sidebar.
- **Búsqueda**: [Fuse.js](https://www.fusejs.io/) - Búsqueda difusa (fuzzy search) integrada en el navegador.

---

## ⌨️ Comandos Disponibles

| Comando | Acción |
| :--- | :--- |
| `pnpm dev` | Inicia el servidor de desarrollo en `localhost:4321`. |
| `pnpm build` | Compila el proyecto para producción en la carpeta `dist/`. |
| `pnpm preview` | Previsualiza la compilación de producción localmente. |
| `pnpm astro ...` | Ejecuta comandos directos del CLI de Astro. |

---

> [!TIP]
> Puedes usar componentes de **Shadcn** directamente en tus archivos MDX importándolos si el componente está registrado en el scope de MDX del proyecto.
