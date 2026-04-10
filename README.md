# Proyecto Eventium

Aplicación web compuesta por:

- Un backend principal en **Laravel** que también integra el frontend en **React** mediante **Vite**
- Un backend independiente en **Spring Boot** para la gestión de usuarios
- Una base de datos **MySQL** para eventos y otra base de datos **MySQL** para usuarios

La aplicación permite gestionar eventos, registro e inicio de sesión de usuarios, preferencias personalizadas, compras de entradas e historial de compras.

## Tecnologías

- Laravel 12
- React 19
- Vite
- Spring Boot 4
- Java 25
- MySQL
- Bootstrap

## Estructura del proyecto

- `/TFG-main` -> Proyecto principal Laravel + React + API de eventos
- `/backend_usuarios` -> API Spring Boot para usuarios, autenticación, preferencias y compras

## Funcionalidades principales

- Listado de eventos
- Alta y eliminación de eventos
- Subida de imágenes de eventos
- Registro e inicio de sesión de usuarios
- Gestión de permisos de administrador
- Edición de perfil de usuario
- Preferencias por etiquetas
- Compra de entradas
- Historial de compras
- Consulta de asientos ocupados por evento

## Requisitos

- Node.js y npm
- PHP 8.2 o superior
- Composer
- Java 25
- Maven
- MySQL

## Ejecución sin Docker

### 1. Backend Laravel + React

Entrar en la carpeta:

```bash
cd TFG-main
```

Instalar dependencias de PHP:

```bash
composer install
```

Instalar dependencias de Node.js:

```bash
npm install
```

Configurar el archivo `.env` de Laravel con la base de datos de eventos.

Generar clave de aplicación si fuese necesario:

```bash
php artisan key:generate
```

Ejecutar migraciones si corresponde:

```bash
php artisan migrate
```

Crear carpeta de enlace para visualizar las imágenes:
```bash
php artisan storage:link
```

Levantar Laravel:

```bash
php artisan serve
```

En otra terminal, arrancar Vite:

```bash
npm run dev
```

### 2. Backend Spring Boot

Entrar en la carpeta:

```bash
cd backend_usuarios
```

Configurar el archivo `application.properties` con la base de datos de usuarios.

Levantar el backend:

```bash
mvn spring-boot:run
```

Si Maven no está instalado globalmente, usar el wrapper incluido:

```bash
mvnw.cmd spring-boot:run
```

## Configuración de entorno

### Archivo `.env` de Laravel

```env
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=eventos
DB_USERNAME=root
DB_PASSWORD=

VITE_API_EVENTS_URL=http://localhost:8000/api
VITE_API_USERS_URL=http://localhost:8080
```

### Archivo `application.properties` de Spring Boot

```properties
spring.application.name=backend_usuarios
spring.datasource.url=jdbc:mysql://localhost:3306/usuarios_eventium
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
```

## Bases de datos

El proyecto utiliza dos bases de datos MySQL:

- `eventos` -> usada por Laravel para la gestión de eventos
- `usuarios_eventium` -> usada por Spring Boot para usuarios, preferencias y compras

## Puertos

- Laravel: `http://127.0.0.1:8000`
- Vite (desarrollo frontend): `http://localhost:5173`
- Spring Boot: `http://localhost:8080`
- MySQL: `3306`

## Notas

- El frontend React está integrado dentro del proyecto Laravel, no está separado en una carpeta independiente.
- Para desarrollo local, Laravel y Vite deben ejecutarse al mismo tiempo.
- Spring Boot funciona como backend independiente para toda la lógica de usuarios.
- Laravel se encarga de la gestión de eventos y de servir la aplicación web principal.
- El proyecto guarda imágenes de eventos en el almacenamiento público de Laravel.
