## API de Usuarios

Esta es una API REST para la gestión de usuarios, con operaciones CRUD y paginación.

## Características

Creación, obtención, actualización y eliminación de usuarios.
Validaciones para emails duplicados y datos requeridos.
Búsqueda de usuarios por ciudad.
Implementación de paginación en la consulta de usuarios.

## Instalación

Clona este repositorio:

git clone https://github.com/semoate/prueba_backend.git

## verificar si tienes mongo instalado
mongod --version
o mongod --version

si está instalado verás la versión

## en caso de no tener instalado mongodb

Descarga MongoDB desde la página oficial: MongoDB Community Server
Instala MongoDB siguiendo las instrucciones.
Agrega MongoDB a las variables de entorno (opcional).

## Instala las dependencias:

npm install

## Configura las variables de entorno en un archivo .env:

PORT=3000
MONGO_URI=mongodb://localhost:27017/mi_base_de_datos

## Inicia el servidor:

npm start

si todo esta bien saldrán estos mensajes:

 Servidor corriendo en http://localhost:3000
 
 Conectado a MongoDB


### Uso de la API

## Endpoints principales

# Crear un usuario

- POST /usuarios

          Body (JSON):

          {
          "nombre": "juan",
          "email": "ana.martinez@example7.com",
          "edad": 32,
          "direcciones": [
              {
              "calle": "Av. Reforma",
              "ciudad": "lima",
              "pais": "Peru",
              "codigo_postal": "06600"
              }
          ]

  }

# Obtener todos los usuarios

- GET /usuarios

# Obtener un usuario por ID

- GET /usuarios/:id

# Obtener todos los usuarios (con paginación)

- GET /usuarios?page=2&limit=1

# Buscar usuarios por ciudad

- GET /usuarios/buscar?ciudad=xxxx

# Actualizar un usuario por ID

- PUT /usuarios/:id

        Body (JSON):

            {
                "nombre": "Carlos Ramírez 2",
                "email": "ana.martinez@example2.com",
                "edad": 34,
                "direcciones": [
                    {
                        "calle": "Calle 123",
                        "ciudad": "Bogotá",
                        "pais": "Colombia",
                        "codigo_postal": "110111"
                    }
                ]
            }

# Eliminar un usuario por ID

- DELETE /usuarios/:id

### Licencia

Este proyecto está bajo la licencia MIT.
