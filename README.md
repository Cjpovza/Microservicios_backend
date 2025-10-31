Introducción 
Este proyecto de arquitectura en base a microservicios, realiza una tarea independiente (sumar, restar, multiplicar y dividir), donde en esta ultima actualización que se realizo, se implemento un CRUD para la base de datos de las operaciones. 

1. Programas requeridos: Antes de ejecutar el proyecto, asegúrese de tener instalado:

XAMPP (para levantar el servicio de MySQL)
VS Code 
Node del sitio oficial de Node.js v18 o superior

2. Instalación del proyecto: Con sus dependencias y paquetes requeridos 

Descargue y descomprima el archivo ZIP del proyecto.
Abra la carpeta del proyecto en VS Code
En la terminal, ubíquese en el directorio raíz:  MicroServicios2
Instale las dependencias: npm install, y adicionalmente instalar los paquetes: npm install node-fetch // cors // install express // mysql2 //swagger-jsdoc // swagger-ui-express // concurrently --save-dev
Extensión Live Server para verificar en tiempo real los cambios realizados en el código VSCODE
Extensión Thunder Client par probar y desarrollar la API directamente desde el VSCODE

3. Estructura del proyecto: 
MicroServicios2/
backend/
-MicroServSuma.mjs <-- operación con, body, query y path params + Swagger
-MicroServResta.mjs <--  operación con, body, query y path params + Swagger
-MicroServMultiplicaciónmjs <--  operación con, body, query y path params + Swagger
-MicroServDivision.mjs <--  operación con, body, query y path params + Swagger
-RegistrosService.mjs <-- CRUD + Swagger
-db.mjs <-- Conexión con la DB 
frontend/                
-index.html <-- interfaz principal
-script.js <-- lógica de interacción con los microservicios
-style.css <-- estilos
package.json
package-lock.json
readme.md

4. Configurar la DB MySQL: Debe tener XAMPP en ejecución y activar el módulo MySQL Database.
Abra phpMyAdmin desde XAMPP o en: http://localhost/phpmyadmin/
Cree una base de datos llamada: microservicios2_db
Cree una tabla llamada registros con la siguiente estructura:
CREATE DATABASE microservicios_db;
USE microservicios2_db;
CREATE TABLE registros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  metodo VARCHAR(50),
  dato1 VARCHAR(50),
  dato2 VARCHAR(50),
  resultado VARCHAR(50),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

5. Ejecución de los microservicios: El proyecto utiliza concurrently para ejecutar todos los microservicios al mismo tiempo. concurrently es un paquete de Node.js que permite ejecutar varios comandos en paralelo dentro de la misma terminal.
En la terminal, se debe ejecutar: npm run start:all
Se iniciarán los siguientes servicios:
Microserv        
Port

Suma
3000

Resta
3001

Multiplicacio
3002

División
3003

Registros
3004

En consola se debería mostrar:
Microservicio Suma en http://localhost:3000
Microservicio Resta corriendo en http://localhost:3001
Microservicio Multiplicación corriendo en http://localhost:3002
Microservicio División corriendo en http://localhost:3003
Conexión exitosa con la base de datos
Microservicio Registros corriendo en http://localhost:3004
Swagger disponible en http://localhost:3004/api-docs
El archivo package.json contiene los siguientes scripts:
"scripts": {
  "start:suma": "node backend/MicroServSuma.mjs",
  "start:resta": "node backend/MicroServResta.mjs",
  "start:multiplicacion": "node backend/MicroServMultiplicacion.mjs",
  "start:division": "node backend/MicroServDivision.mjs",
  "start:registros": "node backend/RegistrosService.mjs",
  "start:all": "concurrently \"npm run start:suma\" \"npm run start:resta\" \"npm run start:multiplicacion\" \"npm run start:division\" \"npm run start:registros\""
}
Esto facilita el desarrollo, ya que no es necesario abrir varias terminales para cada microservicio.

6. Documentación Swagger: Cada microservicio incluye su propia documentación Swagger.
Para acceder a la interfaz interactiva, abrir el navegador en:
Suma → http://localhost:3000/api-docs
Resta → http://localhost:3001/api-docs
Multiplicación → http://localhost:3002/api-docs
División → http://localhost:3003/api-docs
Registros (CRUD) → http://localhost:3004/api-docs
Desde aca se pueden probar las operaciones en cada servicio, y el CRUD completo en de registros.

7. Verificación final: Si todos los servicios se inician correctamente:
Swagger mostrará cada microservicio con sus endpoints.
El microservicio de registros permitirá crear, leer, actualizar y eliminar datos.
La conexión MySQL será confirmada en consola
Con esto, el sistema de microservicios queda completamente funcional, integrando operaciones matemáticas, sus datos y documentación con Swagger.