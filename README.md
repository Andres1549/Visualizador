# ToS Lens — Visor de términos y condiciones

Sitio estático para visualizar respuestas JSON de un sistema de extracción y resumen fiel de fragmentos de términos y condiciones de aplicaciones y redes sociales.

## Archivos
- `index.html`: estructura de la interfaz.
- `style.css`: diseño responsive, paleta editorial y modo oscuro.
- `script.js`: validación JSON y renderizado de la ficha.

## Despliegue en Render
1. Sube estos archivos a la raíz de un repositorio de GitHub.
2. En Render, selecciona **New + → Static Site** y conecta el repositorio.
3. Deja **Build Command** vacío.
4. Configura **Publish Directory** como `.`.
5. Pulsa **Create Static Site**.

No requiere backend, compilación, variables de entorno ni dependencias.

## Uso
Pega el JSON de tu sistema y pulsa **Analizar respuesta**. La página distingue los estados:
- `respondido`
- `informacion_insuficiente`
- `abstencion`

Muestra resumen, privacidad, derechos del usuario, citas textuales, advertencias y el valor recibido en `asesoria_legal`. Los campos adicionales se muestran en «Otros datos recibidos». Si tu JSON incluye `nombre_aplicacion` o `jurisdiccion`, también se muestran junto al identificador del caso.

## Privacidad y alcance
El contenido se procesa en el navegador. El proyecto no realiza solicitudes a servicios externos. La interfaz organiza lo recibido; no valida de forma independiente las citas, la interpretación del modelo ni la legalidad de cláusulas.
