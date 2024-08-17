document.addEventListener('DOMContentLoaded', function () {
    cargarTiposProducto();
    mostrarProductos();

    document.getElementById('searchForm').addEventListener('submit', function (event) {
        event.preventDefault();
        buscarProductos();
    });
});

$(document).on("click", ".boton-eliminar-producto", function () {
    const _producto = $(this).data("producto");

    Swal.fire({
        title: "¿Está seguro?",
        text: `Eliminar producto "${_producto.nombre}"`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, volver"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/Producto/EliminarProducto/${_producto.id}`, {
                method: "DELETE"
            })
                .then(response => {
                    return response.ok ? response.json() : Promise.reject(response);
                })
                .then(responseJson => {
                    if (responseJson.valor) {
                        Swal.fire("¡Listo!", "Producto fue eliminado", "success");
                        MostrarProductos();
                    } else {
                        Swal.fire("Lo sentimos", "No se pudo eliminar", "error");
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire("Error", "Ocurrió un error al procesar la solicitud", "error");
                });
        }
    });
});


function cargarTiposProducto() {
    fetch('/Producto/ObtenerTiposProducto')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('cboTipo');
            data.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo.nombre;
                option.text = tipo.nombre;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar tipos de producto:', error));
}
function mostrarProductos() {
    fetch('/Producto/CargarProductos')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return response.json();
        })
        .then(responseJson => {
            console.log(responseJson); // Verifica los datos en la consola
            const tbody = document.querySelector("#tablaProductos tbody");
            tbody.innerHTML = ""; // Limpiar el contenido existente

            if (responseJson.length > 0) {
                responseJson.forEach(producto => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${producto.clave}</td>
                        <td>${producto.nombre}</td>
                        <td>${producto.refTipoProducto.nombre}</td>
                        <td>${producto.esActivo ? "Sí" : "No"}</td>
                        <td>${producto.precio !== undefined ? producto.precio.toFixed(2) : "N/A"}</td>
                        <td>
                            <button class="btn btn-primary btn-sm boton-editar-producto" data-producto='${JSON.stringify(producto)}'>Editar</button>
                            <button class="btn btn-danger btn-sm ms-2 boton-eliminar-producto" data-producto='${JSON.stringify(producto)}'>Eliminar</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });

                // Mostrar notificación de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Productos cargados',
                    text: 'Los productos se han cargado correctamente.',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                tbody.innerHTML = "<tr><td colspan='6'>No se encontraron productos.</td></tr>";
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Mostrar notificación de error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al cargar los productos.',
            });
        });
}

function buscarProductos() {
    var clave = document.getElementById('clave').value;
    var tipo = document.getElementById('cboTipo').value; // Asegúrate de que el ID sea correcto

    fetch(`/Producto/Buscar?clave=${clave}&tipo=${tipo}`)
        .then(response => {
            return response.ok ? response.json() : Promise.reject(response);
        })
        .then(responseJson => {
            console.log(responseJson); // Verifica los datos en la consola
            const tbody = document.querySelector("#tablaProductos tbody");
            tbody.innerHTML = ""; // Limpiar el contenido existente

            if (responseJson.length > 0) {
                responseJson.forEach(producto => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${producto.clave}</td>
                        <td>${producto.nombre}</td>
                        <td>${producto.refTipoProducto.nombre}</td>
                        <td>${producto.esActivo ? "Sí" : "No"}</td>
                        <td>${producto.precio !== undefined ? producto.precio.toFixed(2) : "N/A"}</td>
                        <td>
                            <button class="btn btn-primary btn-sm boton-editar-producto" data-producto='${JSON.stringify(producto)}'>Editar</button>
                            <button class="btn btn-danger btn-sm ms-2 boton-eliminar-producto" data-producto='${JSON.stringify(producto)}'>Eliminar</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });

                // Mostrar notificación de éxito con el número de productos encontrados
                Swal.fire({
                    icon: 'success',
                    title: 'Productos encontrados',
                    text: `Se encontraron ${responseJson.length} producto(s).`,
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                tbody.innerHTML = "<tr><td colspan='6'>No se encontraron productos.</td></tr>";
                // Mostrar notificación de que no se encontraron productos
                Swal.fire({
                    icon: 'info',
                    title: 'Sin resultados',
                    text: 'No se encontraron productos con los criterios especificados.',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Mostrar notificación de error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al buscar los productos.',
            });
        });
}

$(document).on("click", ".boton-eliminar-producto", function () {
    const _producto = $(this).data("producto");

    Swal.fire({
        title: "¿Está seguro?",
        text: `Eliminar producto "${_producto.nombre}"`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, volver"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/Producto/EliminarProducto/${_producto.id}`, {
                method: "DELETE"
            })
                .then(response => {
                    return response.ok ? response.json() : Promise.reject(response);
                })
                .then(responseJson => {
                    if (responseJson.valor) {
                        Swal.fire("¡Listo!", "Producto fue eliminado", "success");
                        mostrarProductos();

                    } else {
                        Swal.fire("Lo sentimos", "No se pudo eliminar", "error");
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire("Error", "Ocurrió un error al procesar la solicitud", "error");
                });
        }
    });
});
