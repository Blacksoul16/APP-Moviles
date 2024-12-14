# **Proyecto Semestral | Aplicaciones Móviles**
> [!NOTE]
> **Integrantes**: Seth Garday, Franco Murillo, Matías Morales y Gabriel Sepúlveda.
> 
> **Sección**: 002D
> 
> **Profesor**: Cristian Gómez Vega

---

## Ejecutando la aplicación

### Añadir soporte a las distintas plataformas

| Plataforma | Comando |
|------------|---------|
| Android | `ionic cap add android` |
| iOS | `ionic cap add ios` |

> [!IMPORTANT]
> Cada vez que se hagan cambios en el código, debes sincronizar capacitor y android usando el comando `npx cap sync android`.

### Ejecutar la aplicación en el celular

| Livereload | Comando |
|------------|---------|
| Con | `ionic cap run android -l --external --host=<ip> --port=<puerto> --target=<id>` |
| Sin | `ionic cap run android` |

### Explicación de los parámetros

| Parámetro | Descripción |
|-----------|-------------|
| -l | Determina si se tiene que usar o no livereload. |
| --external | Indica que el servidor de desarrollo estará alojado en todas las interfaces de la red. |
| --host | Dirección IP del servidor de aplicaciones. |
| --port | Puerto del servidor de aplicaciones. |
| --target | La ID de tu celular. Para averiguar cuál es la ID del tuyo debes ejecutar el comando `adb devices` en la consola. |

> [!IMPORTANT]
> Para el parámetro `--host`, debes asegurarte de que tanto tu PC como tu celular estén conectados a la misma red.

### Depuración del programa

Cuando la aplicación se esté ejecutando en el celular, abre tu navegador en el PC y escribe en la URL `chrome://inspect/#devices`, con este comando podrás ver qué sucede con tu aplicación en la consola del desarrollador (DevTools), tanto para errores como advertencias o mensajes de depuración.
