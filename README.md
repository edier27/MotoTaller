# GlobalMotos Pro (MotoTaller)

Software de gestión para talleres de motos: caja POS, inventario, compras con foto de la factura, fiados, órdenes de servicio, facturas, empleados y reportes.

**Dirección del software:** https://edier27.github.io/MotoTaller/

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | El software completo |
| `manifest.json` | Permite instalarlo como aplicación (PC y celular) |
| `sw.js` | Hace que abra sin internet y que siempre cargue la versión más nueva |
| `version.json` | Número y notas de la versión que se muestran en el aviso de actualización |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` | Íconos de la aplicación instalada |

No subas al repositorio las copias de respaldo (`index_antes_rediseno_...`, `index_pre_iconos...`, `index_backup_...`): tienen el sistema de guardado viejo y si alguien las abre podría dañar los datos.

## Publicar una versión nueva

1. Sube el `index.html` nuevo al repositorio (rama `main`).
2. Opcional: cambia el número y las notas en `version.json`.
3. En unos minutos GitHub Pages lo publica. Los equipos que tengan el software abierto verán el aviso **"Hay una versión nueva del software"** con el botón **Actualizar**. No hace falta cambiar nada más: la versión nueva se detecta sola.

## Dónde quedan los datos

- Cada taller inicia sesión con su correo. Sus datos se guardan en Firebase (proyecto `globalacce-37997`), en `motos_clientes/{clientId}`, y solo esa cuenta y el administrador pueden leerlos.
- Cada cambio se guarda primero en el equipo y en menos de un segundo se sube a la nube. Sin internet queda en el equipo y se sube al volver la conexión.
- Si dos equipos trabajan al tiempo, los cambios se combinan por registro; no se pisan.
- Si los datos pasan de 1 MB se reparten en documentos `{clientId}__p0`, `__p1`...
- Recomendado: descargar un respaldo cada semana (menú **Respaldo**).

## Reglas de Firebase

Las reglas de seguridad (`firestore.rules`, `storage.rules`) están en la carpeta de **Acce7**, porque los dos programas usan el mismo proyecto de Firebase. No las copies aquí: al publicar reglas se reemplazan las de todo el proyecto.

Pendiente: quitar el bloque `match /globalmotos/{docId}` (documento antiguo con lectura pública) cuando ya no se necesite.

## Lectura automática de facturas (IA)

Cada taller pega una clave gratuita de Google Gemini en **Configuración → Lectura automática de facturas**. Se crea en https://aistudio.google.com/apikey (elegir "Crear clave en un proyecto nuevo" para no compartir el límite gratuito con Acce7). Se guarda en la cuenta del taller y sirve en todos sus equipos.

## Google Drive (fotos de facturas)

Usa el mismo ID de cliente OAuth que Acce7 (origen autorizado `https://edier27.github.io`). En Google Cloud Console la app debe estar **publicada** (no en "Prueba") y con el permiso `drive.file`.

Cada taller, en cada equipo: **Configuración → Google Drive → Conectar Google Drive** y elige su cuenta de Google. Las fotos quedan en su Drive en `GlobalMotos Pro / (taller) / Facturas de compra`. Solo funciona desde la dirección publicada, no abriendo el archivo desde el PC.
