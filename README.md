# Visor JSON — Render Static Site

Página estática que convierte respuestas JSON en una ficha visual organizada. No requiere backend, base de datos, dependencias ni compilación. El contenido se procesa localmente en el navegador.

## Archivos

- `index.html`: estructura de la página.
- `style.css`: diseño adaptable y modo oscuro.
- `script.js`: lectura, validación y representación del JSON.

## Probar localmente

Abre `index.html` en un navegador moderno. También puedes subir estos archivos a un repositorio de GitHub.

## Desplegar en Render

1. Crea un repositorio en GitHub y sube `index.html`, `style.css`, `script.js` y `README.md`.
2. En Render, elige **New + → Static Site**.
3. Conecta el repositorio.
4. Configura:
   - **Build Command:** déjalo vacío.
   - **Publish Directory:** `.`
5. Pulsa **Create Static Site** y espera a que termine el despliegue.

## Uso

1. Pega el JSON completo en el cuadro.
2. Pulsa **Procesar JSON**.
3. Revisa el resultado organizado, consulta el JSON formateado o copia el contenido.

El botón **Cargar ejemplo** restaura el ejemplo incluido. Los campos conocidos tienen secciones específicas y los campos adicionales aparecen en «Otros campos».

## Privacidad

La página no contiene llamadas a servicios externos ni envía el contenido pegado a un servidor. El procesamiento se realiza en el navegador del usuario.
