# Informe de desarrollo

## Sistema de reservas de una aerolínea con JHipster

**Asignatura:** Fundamentos de Sistemas de Información
**Proyecto:** Sistema de reservas de aerolínea
**Autor:** Estudiante individual
**Fecha:** 19 de septiembre de 2026

## 1. Introducción

Este informe presenta el desarrollo de un sistema web para administrar reservas de una aerolínea. La aplicación permite gestionar pasajeros, vuelos, asientos y reservas mediante operaciones CRUD, relaciones entre entidades y reglas de negocio propias del dominio.

El proyecto se implementó como una aplicación monolítica con JHipster, Spring Boot, React, TypeScript y MySQL. Además, se incorporaron autenticación JWT, migraciones con Liquibase, paginación, pruebas automatizadas y despliegue mediante Docker.

## 2. Objetivos

### 2.1 Objetivo general

Desarrollar una aplicación web funcional para la gestión de reservas de una aerolínea utilizando el flujo de trabajo y las herramientas estudiadas en la asignatura.

### 2.2 Objetivos específicos

- Modelar pasajeros, vuelos, asientos y reservas mediante un archivo JDL.
- Generar las capas principales del sistema con JHipster.
- Implementar relaciones entre las entidades y operaciones CRUD con paginación.
- Validar que solo se puedan reservar asientos disponibles y pertenecientes al vuelo seleccionado.
- Configurar la persistencia en MySQL mediante migraciones Liquibase.
- Ejecutar pruebas unitarias, de integración y validaciones de estilo.
- Construir y desplegar la aplicación utilizando Docker y Docker Compose.

## 3. Breve marco teórico

### 3.1 JHipster

JHipster es una plataforma de generación de aplicaciones que integra tecnologías de backend, frontend, persistencia, seguridad y despliegue. A partir de una configuración y un modelo JDL puede generar entidades JPA, repositorios, servicios, controladores REST, migraciones de base de datos y pantallas CRUD.

### 3.2 Arquitectura de la aplicación

El sistema sigue una arquitectura monolítica por capas. Spring Boot gestiona el backend y expone servicios REST; las capas `domain`, `repository`, `service` y `web.rest` separan el modelo, el acceso a datos, la lógica de negocio y la comunicación HTTP. React y TypeScript proporcionan la interfaz web.

### 3.3 Persistencia y migraciones

MySQL almacena la información de la aplicación. Liquibase permite versionar los cambios del esquema mediante migraciones, de modo que la estructura de la base de datos pueda crearse y actualizarse de forma controlada.

### 3.4 Seguridad, pruebas y contenedores

La autenticación utiliza tokens JWT. JUnit y Mockito permiten verificar el comportamiento del código, mientras que las pruebas de integración validan la interacción entre sus componentes. Docker y Docker Compose empaquetan la aplicación y MySQL para facilitar su ejecución en un entorno reproducible.

## 4. Procedimiento a seguir

### 4.1 Configuración inicial

La aplicación se generó como un monolito con autenticación JWT, base de datos SQL en MySQL, frontend React, caché Ehcache, internacionalización en español, paginación y clases de servicio mediante `serviceClass`. El nombre técnico generado fue `jhipster2026`.

Las tecnologías utilizadas fueron JHipster 9.4.0, Spring Boot 4.1.1, Java 21, Maven, React 19.3.0, TypeScript, MySQL, Liquibase, Docker, Docker Compose, JUnit y Mockito.

### 4.2 Diseño del modelo

El modelo se definió en [aerolinea.jdl](aerolinea.jdl). Sus entidades son:

- **Pasajero:** `nombre`, `apellido`, `email` único, `telefono` y `fechaNacimiento`.
- **Vuelo:** `numeroVuelo` único, `origen`, `destino`, `fechaSalida` y `fechaLlegada`.
- **Asiento:** `numero`, `clase`, `disponible` y el vuelo al que pertenece.
- **Reserva:** `codigo` único, `fechaReserva`, `estado`, pasajero, vuelo y asiento.

Las relaciones finales son:

```text
Pasajero 1 ---- * Reserva
Vuelo    1 ---- * Reserva
Vuelo    1 ---- * Asiento
Asiento  1 ---- * Reserva
```

En JDL se expresaron de la siguiente manera:

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

La relación entre `Asiento` y `Vuelo` garantiza que la disponibilidad sea independiente para cada vuelo. Por ejemplo, el asiento `1500` de un vuelo no es el mismo registro que el asiento `1500` de otro vuelo.

### 4.3 Generación de la aplicación

La generación se realizó con:

```powershell
npx jhipster import-jdl aerolinea.jdl --skip-checks --skip-git
```

JHipster generó entidades JPA, repositorios Spring Data, clases de servicio, controladores REST, migraciones Liquibase, datos de prueba, modelos TypeScript, pantallas CRUD en React, rutas y pruebas. Las entidades generadas se encuentran en `.jhipster/` y el código se distribuye en los paquetes `domain`, `repository`, `service` y `web.rest`.

### 4.4 Implementación de las reglas de negocio

Además del código generado, se implementaron las siguientes reglas:

1. Si `disponible` es `false`, la reserva se rechaza con HTTP 400.
2. Cuando una reserva se crea correctamente, el asiento cambia a `disponible = false`.
3. El asiento debe pertenecer al mismo vuelo seleccionado en la reserva.

Estas validaciones se implementaron en [ReservaService.java](src/main/java/com/udea/service/ReservaService.java), utilizando `SeatUnavailableException` y `SeatBelongsToDifferentFlightException`. Los mensajes en español se agregaron en [error.json](src/main/webapp/i18n/es/error.json).

### 4.5 Persistencia y ejecución en desarrollo

Liquibase crea y actualiza el esquema de MySQL. La migración final agrega `vuelo_id` a la tabla `asiento` y su clave foránea hacia `vuelo`.

Para iniciar la base de datos y la aplicación en Windows se utilizaron:

```powershell
docker compose -f src/main/docker/mysql.yml up --wait
npm run backend:start
npm run start
```

La aplicación de desarrollo se consulta en `http://localhost:9000` y el backend en `http://localhost:8080`. Durante el cambio de modelo fue necesario recrear el volumen local de MySQL para aplicar limpiamente el esquema actualizado.

### 4.6 Pruebas

Las pruebas se ejecutaron con:

```powershell
.\mvnw.cmd verify
```

El resultado fue de 189 pruebas exitosas, sin fallos ni errores, sin violaciones de Checkstyle y con construcción Maven exitosa. Las pruebas específicas de `ReservaService` verifican el rechazo de asientos no disponibles, el bloqueo del asiento después de reservarlo y el rechazo de asientos pertenecientes a otro vuelo.

### 4.7 Despliegue

La imagen de producción se construyó con Jib:

```powershell
.\mvnw.cmd -ntp verify "-DskipTests=true" "-Dskip.npm=true" -Pprod jib:dockerBuild
```

La propiedad `-Dskip.npm=true` fue necesaria por la política local de npm 12; las dependencias ya estaban instaladas. Después se inició el sistema completo:

```powershell
docker compose -f src/main/docker/app.yml up -d --wait
```

El despliegue incluye los contenedores de la aplicación y MySQL, una red interna, health checks y migraciones Liquibase durante el arranque. La aplicación desplegada respondió en `http://localhost:8080` y su endpoint de salud devolvió HTTP 200 con estado `UP`.

### 4.8 Comparación con el procedimiento de clase

El proyecto cumple las actividades principales trabajadas en clase: creación de una aplicación JHipster, uso de JDL, generación automática de entidades, repositorios, servicios, controladores y frontend, configuración de relaciones, paginación, MySQL, Liquibase, pruebas y Docker.

Como diferencias justificadas, se conservó el nombre técnico `jhipster2026` de la plantilla inicial, se agregó la relación `Asiento -> Vuelo` para modelar correctamente la disponibilidad por vuelo y se implementaron validaciones adicionales de reserva. También se adaptaron los comandos Maven a Windows mediante `mvnw.cmd` y propiedades entre comillas.

## 5. Conclusiones

Se desarrolló un sistema funcional de reservas de aerolínea siguiendo el flujo de trabajo de JHipster. La aplicación permite administrar pasajeros, vuelos, asientos y reservas, incorpora paginación y clases de servicio, utiliza MySQL y puede ejecutarse mediante Docker.

La relación entre asientos y vuelos permite representar correctamente la disponibilidad, mientras que las reglas de negocio evitan reservas inválidas o inconsistentes. La solución fue validada con 189 pruebas exitosas, sin errores de Checkstyle, y mediante la comprobación del despliegue Docker y de su endpoint de salud.

## 6. Bibliografía

- JHipster. (s. f.). _JHipster documentation_. https://www.jhipster.tech/
- Spring. (s. f.). _Spring Boot documentation_. https://docs.spring.io/spring-boot/documentation.html
- React. (s. f.). _React documentation_. https://react.dev/
- Liquibase. (s. f.). _Liquibase documentation_. https://docs.liquibase.com/
- Docker. (s. f.). _Docker documentation_. https://docs.docker.com/
- MySQL. (s. f.). _MySQL documentation_. https://dev.mysql.com/doc/

## 7. Código en GitHub

El código fuente del proyecto está disponible en el siguiente repositorio:

[https://github.com/AldoSP/Lab1](https://github.com/AldoSP/Lab1)
