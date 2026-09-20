# Informe de desarrollo

## Sistema de reservas de una aerolínea con JHipster

**Asignatura:** Fundamentos de Sistemas de Información

**Proyecto:** Sistema de reservas de aerolínea

**Autor:** Estudiante individual

**Fecha:** 19 de septiembre de 2026

## 1. Introducción

Este informe documenta la construcción de un sistema de reservas para una aerolínea utilizando JHipster. El desarrollo siguió la estructura trabajada en clase: generación de una aplicación base, definición del modelo mediante JDL, generación automática de las capas del sistema, ejecución de pruebas, configuración de MySQL y despliegue mediante Docker.

El proyecto se implementó como una aplicación monolítica con backend en Spring Boot, frontend en React y persistencia relacional en MySQL.

## 2. Objetivo

Desarrollar una aplicación web que permita administrar pasajeros, vuelos, asientos y reservas de una aerolínea. La aplicación debe permitir operaciones CRUD, manejar las relaciones entre las entidades, utilizar paginación, organizar la lógica mediante clases de servicio y ejecutarse con una base de datos MySQL y contenedores Docker.

## 3. Tecnologías utilizadas

- JHipster 9.4.0.
- Spring Boot 4.1.1.
- Java 21.
- Maven.
- React 19.3.0.
- TypeScript.
- MySQL 26.7.0.
- Liquibase para las migraciones de base de datos.
- Docker y Docker Compose.
- JWT para autenticación.
- JUnit, Mockito y pruebas de integración generadas por JHipster.

## 4. Configuración inicial de la aplicación

La aplicación se generó como un monolito con la siguiente configuración:

- Tipo de aplicación: `monolith`.
- Autenticación: JWT.
- Base de datos: SQL.
- Base de datos de desarrollo y producción: MySQL.
- Herramienta de construcción: Maven.
- Framework cliente: React.
- Proveedor de caché: Ehcache.
- Internacionalización habilitada con español como idioma principal.
- Paginación habilitada para las entidades del dominio.
- Clases de servicio habilitadas mediante `serviceClass`.

La aplicación generada conserva el nombre técnico `jhipster2026`, que corresponde al nombre utilizado al crear la plantilla inicial.

## 5. Modelo del dominio

El modelo se definió en [aerolinea.jdl](aerolinea.jdl). Las entidades son:

### 5.1 Pasajero

Representa a la persona que realiza una reserva.

Atributos:

- `nombre`: texto obligatorio.
- `apellido`: texto obligatorio.
- `email`: texto obligatorio y único.
- `telefono`: texto opcional.
- `fechaNacimiento`: fecha opcional.

### 5.2 Vuelo

Representa un vuelo disponible de la aerolínea.

Atributos:

- `numeroVuelo`: texto obligatorio y único.
- `origen`: texto obligatorio.
- `destino`: texto obligatorio.
- `fechaSalida`: fecha y hora obligatoria.
- `fechaLlegada`: fecha y hora obligatoria.

### 5.3 Asiento

Representa un asiento disponible dentro de un vuelo.

Atributos:

- `numero`: texto obligatorio.
- `clase`: texto obligatorio.
- `disponible`: valor booleano obligatorio.
- `vuelo`: vuelo al que pertenece el asiento.

### 5.4 Reserva

Representa la reserva realizada por un pasajero.

Atributos:

- `codigo`: texto obligatorio y único.
- `fechaReserva`: fecha y hora obligatoria.
- `estado`: texto obligatorio.
- `pasajero`: pasajero que realiza la reserva.
- `vuelo`: vuelo reservado.
- `asiento`: asiento seleccionado.

## 6. Relaciones

El modelo final contiene las siguientes relaciones:

```text
Pasajero 1 ---- * Reserva
Vuelo    1 ---- * Reserva
Vuelo    1 ---- * Asiento
Asiento  1 ---- * Reserva
```

En términos de JDL, se utilizaron estas relaciones:

```jdl
relationship OneToMany {
  Pasajero to Reserva
}

relationship ManyToOne {
  Reserva to Vuelo
  Reserva to Asiento
  Asiento to Vuelo
}
```

La relación entre `Asiento` y `Vuelo` es importante. La disponibilidad de un asiento debe ser independiente para cada vuelo. Por ejemplo, el asiento `1500` del vuelo 1 no es el mismo registro que el asiento `1500` del vuelo 2.

## 7. Generación del código

La generación se realizó importando el archivo JDL con JHipster:

```powershell
npx jhipster import-jdl aerolinea.jdl --skip-checks --skip-git
```

JHipster generó automáticamente:

- Entidades JPA.
- Repositorios Spring Data.
- Clases de servicio.
- Controladores REST.
- Migraciones Liquibase.
- Datos de prueba.
- Modelos TypeScript.
- Pantallas CRUD en React.
- Rutas y opciones de navegación.
- Pruebas unitarias e integración.

Las entidades generadas se encuentran en `.jhipster/`, y el código resultante se distribuye en los paquetes `domain`, `repository`, `service` y `web.rest`.

## 8. Reglas de negocio implementadas

Además del código generado automáticamente, se implementaron reglas específicas para que el sistema se comporte como una aplicación real de reservas.

### 8.1 No se puede reservar un asiento no disponible

Cuando el atributo `disponible` del asiento es `false`, el servicio rechaza la reserva y devuelve un error HTTP 400.

### 8.2 El asiento se bloquea después de una reserva

Cuando una reserva se crea correctamente, el asiento seleccionado se actualiza con `disponible = false`.

### 8.3 El asiento debe pertenecer al vuelo seleccionado

El servicio verifica que el vuelo asociado al asiento sea el mismo vuelo indicado en la reserva. Si son diferentes, la reserva es rechazada.

Estas reglas se implementaron en [ReservaService.java](src/main/java/com/udea/service/ReservaService.java), utilizando las excepciones:

- `SeatUnavailableException`.
- `SeatBelongsToDifferentFlightException`.

La traducción al español se agregó en [error.json](src/main/webapp/i18n/es/error.json):

- `El asiento seleccionado no está disponible para esta reserva.`
- `El asiento seleccionado pertenece a otro vuelo.`

## 9. Persistencia y migraciones

JHipster configuró Liquibase para crear y actualizar el esquema de MySQL. La migración final agrega la columna `vuelo_id` en la tabla `asiento` y su clave foránea hacia `vuelo`.

La base de datos se ejecuta mediante:

```powershell
docker compose -f src/main/docker/mysql.yml up --wait
```

Durante el cambio de modelo fue necesario recrear el volumen local de MySQL para aplicar limpiamente el nuevo esquema. Esto eliminó los datos de prueba existentes, pero no afectó al código ni a las migraciones del proyecto.

## 10. Ejecución en desarrollo

Para ejecutar la base de datos:

```powershell
docker compose -f src/main/docker/mysql.yml up --wait
```

Para ejecutar el backend en Windows:

```powershell
npm run backend:start
```

Para ejecutar el frontend con Vite:

```powershell
npm run start
```

La aplicación de desarrollo se puede consultar normalmente en:

```text
http://localhost:9000
```

El backend se ejecuta en:

```text
http://localhost:8080
```

## 11. Pruebas realizadas

Se ejecutaron pruebas unitarias y de integración con Maven:

```powershell
.\mvnw.cmd verify
```

Resultado:

- 189 pruebas ejecutadas correctamente.
- 0 fallos.
- 0 errores.
- 0 pruebas omitidas con error.
- 0 violaciones de Checkstyle.
- Construcción Maven exitosa.

También se añadieron pruebas específicas para `ReservaService` que verifican:

- Rechazo de un asiento no disponible.
- Cambio del asiento a no disponible después de reservarlo.
- Rechazo de un asiento perteneciente a otro vuelo.

## 12. Despliegue con Docker

Se construyó la imagen de producción con Jib mediante Maven:

```powershell
.\mvnw.cmd -ntp verify "-DskipTests=true" "-Dskip.npm=true" -Pprod jib:dockerBuild
```

La opción `-Dskip.npm=true` fue necesaria porque la política local de npm 12 bloqueaba la instalación de dependencias durante el proceso Maven. Las dependencias ya estaban instaladas y el frontend podía construirse con los archivos disponibles.

Luego se inició el sistema completo:

```powershell
docker compose -f src/main/docker/app.yml up -d --wait
```

El despliegue contiene:

- Contenedor de la aplicación JHipster.
- Contenedor de MySQL.
- Red interna entre los servicios.
- Health checks para MySQL y la aplicación.
- Migraciones Liquibase ejecutadas durante el arranque.

La aplicación desplegada responde en:

```text
http://localhost:8080
```

El endpoint de salud respondió con HTTP 200 y estado `UP`.

## 13. Comparación con el ejemplo desarrollado en clase

La implementación sigue la misma estructura general mostrada en clase:

| Elemento solicitado o mostrado en clase | Estado en el proyecto |
| --------------------------------------- | --------------------- |
| Crear una aplicación con JHipster       | Cumplido              |
| Usar un archivo JDL                     | Cumplido              |
| Generar entidades automáticamente       | Cumplido              |
| Generar repositorios                    | Cumplido              |
| Generar servicios                       | Cumplido              |
| Generar controladores REST              | Cumplido              |
| Generar interfaz React                  | Cumplido              |
| Configurar relaciones                   | Cumplido              |
| Usar paginación                         | Cumplido              |
| Utilizar MySQL                          | Cumplido              |
| Utilizar Liquibase                      | Cumplido              |
| Ejecutar pruebas                        | Cumplido              |
| Crear configuración Docker              | Cumplido              |
| Verificar el despliegue                 | Cumplido              |

Por lo tanto, la estructura técnica y el flujo de trabajo coinciden con el ejemplo de clase. La diferencia principal es que el proyecto aplica el procedimiento al dominio de una aerolínea y no al dominio utilizado durante la demostración.

## 14. Diferencias con el ejemplo de clase y justificación

### 14.1 Nombre de la aplicación

La aplicación se llama técnicamente `jhipster2026` en lugar de `aerolineaVirtual`. Esto se debe a que la plantilla inicial ya había sido generada con ese nombre. Cambiarlo posteriormente habría implicado modificar innecesariamente el nombre base, el paquete principal y varias configuraciones.

### 14.2 Relación entre vuelo y asiento

La relación `Asiento -> Vuelo` se agregó aunque el modelo inicial podía interpretarse solamente con `Reserva -> Asiento` y `Reserva -> Vuelo`. La relación adicional es necesaria para representar correctamente la realidad: cada vuelo tiene su propio conjunto de asientos y su propia disponibilidad.

Sin esta relación, reservar el asiento `1500` en un vuelo bloquearía el asiento `1500` para todos los demás vuelos, lo cual sería incorrecto.

### 14.3 Reglas de negocio adicionales

El ejemplo de clase se centraba principalmente en la generación automática de CRUD y relaciones. En este proyecto se agregaron validaciones de negocio para impedir reservas inválidas y bloquear los asientos después de una reserva.

Estas reglas no reemplazan la estructura de JHipster; la complementan dentro de la clase de servicio correspondiente.

### 14.4 Compatibilidad con Windows

Algunos scripts generados utilizaban `./mvnw`, que funciona en entornos Unix pero no directamente en PowerShell. Para ejecutar el proyecto en Windows se ajustaron los scripts relevantes para utilizar `mvnw.cmd`.

También se utilizaron propiedades Maven entre comillas, por ejemplo:

```powershell
"-Dskip.npm=true"
```

Esto evita que PowerShell interprete incorrectamente los parámetros y los convierta en fases inválidas de Maven.

### 14.5 Datos de prueba

Al modificar el modelo de base de datos se recreó el volumen local de MySQL. Por esa razón, los registros creados manualmente durante la verificación inicial no se conservaron. El esquema actual se creó nuevamente mediante Liquibase y quedó alineado con el modelo final.

## 15. Conclusiones

Se construyó un sistema funcional de reservas de aerolínea utilizando el flujo de trabajo de JHipster estudiado en clase. La generación automática produjo las capas principales del sistema, la interfaz CRUD, las migraciones de base de datos, las pruebas y la configuración de despliegue.

El proyecto cumple con la administración de pasajeros, vuelos, asientos y reservas, incluye paginación y clases de servicio, utiliza MySQL y puede ejecutarse mediante Docker.

Además, se corrigió la disponibilidad de los asientos para que dependa del vuelo correspondiente y se implementaron reglas que evitan reservas duplicadas o inconsistentes. La aplicación fue validada con 189 pruebas exitosas, sin errores de Checkstyle, y se comprobó el funcionamiento del despliegue Docker mediante el endpoint de salud.
