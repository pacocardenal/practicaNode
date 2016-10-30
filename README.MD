USO DEL API

1. Anuncios

Los anuncios mostrarán información de:

- Nombre
- Venta o compra
- Precio
- Foto (en carpeta /images/anuncios)
- Tags

1.1. Mostrar anuncios

Se realizará mediante la llamada a la API: /apiv1/anuncios/

1.1.1. Filtros anuncios

Los anuncios podrán filtrarse por:

- tag : etiqueta del anuncio
- venta : venta (true) o compra (false)
- nombre : comienzo del nombre del producto
- precio : se podrán indicar los rangos:
    - precio = precio_exacto
    - precio = precio_minimo-precio_maximo
    - precio = precio_minimo-
    - precio = -precio_maximo

1.1.2. Paginación

La paginación se podrá realizar mediante:

- start : anuncio en el que se desea comenzar
- limit : numero máximo de anuncios a mostrar a partir del start

1.1.3. Ordenación

- sort = filtro_de_ordenación

2. Usuarios

Los usuarios contendrán información de:

- Nombre
- Email
- Clave

2.1. Registro

Se realizará mediante una orden POST con los datos anteriormente comentados

2.2. Login

Autenticación mediante JSON Web Token.

Se accederá a la dirección /apiv1/authenticate. Será obligatorio para la visualización de anuncios.