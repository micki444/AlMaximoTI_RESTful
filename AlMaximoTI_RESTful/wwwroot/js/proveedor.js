const _modeloProveedor = {
    productoId: 0,
    refProveedor: {
        id: 0,
        nombre: ""
    },
    claveProveedor: "",
    costo: 0.0
};

function cargarNombreProveedores() {
    fetch("/Proveedor/ObtenerProveedores")
        .then(response => {
            return response.ok ? response.json() : Promise.reject(response);
        })
        .then(responseJson => {
            if (responseJson.length > 0) {
                responseJson.forEach((item) => {
                    $("#cboProveedores").append(
                        $("<option>").val(item.id).text(item.nombre)
                    );
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function cargarProveedores() {
    const id = parseInt($("#productoId").val(), 10);

    fetch(`/Proveedor/CargarProveedores?id=${id}`)
        .then(response => {
            return response.ok ? response.json() : Promise.reject(response);
        })
        .then(responseJson => {
            console.log(responseJson); // Verifica los datos en la consola
            const tbody = document.querySelector("#tablaProveedores tbody");
            tbody.innerHTML = ""; // Limpiar el contenido existente

            if (responseJson.length > 0) {
                responseJson.forEach(productoproveedor => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${productoproveedor.refProveedor.nombre}</td>
                        <td>${productoproveedor.clave}</td>
                        <td>${productoproveedor.costo}</td>
                        <td>
                            <button class="btn btn-primary btn-sm boton-editar-proveedor" data-proveedor='${JSON.stringify(productoproveedor)}'>Editar</button>
                            <button class="btn btn-danger btn-sm ms-2 boton-eliminar-proveedor" data-proveedor='${JSON.stringify(productoproveedor)}'>Eliminar</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });

                // Mostrar notificación de éxito con el número de productos encontrados
                Swal.fire({
                    icon: 'success',
                    title: 'Proveedores Asociados',
                    text: `Se encontraron ${responseJson.length} proveedor(es).`,
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                tbody.innerHTML = "<tr><td colspan='4'>No se encontraron proveedores.</td></tr>";
                // Mostrar notificación de que no se encontraron productos
                Swal.fire({
                    icon: 'info',
                    title: 'Sin resultados',
                    text: 'Agregue proveedores para activar el producto.',
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
                text: 'Hubo un problema al obtener los proveedores.',
            });
        });
}

function agregarProveedorModal() {
    _modeloProveedor.productoId = 0;
    _modeloProveedor.refProveedor.id = 0;
    _modeloProveedor.refProveedor.nombre = "";
    _modeloProveedor.claveProveedor = "";
    _modeloProveedor.costo = 0.0;

    cargarNombreProveedores();
    MostrarModal();
}

function MostrarModal() {
    $("#cboProveedores").val(_modeloProveedor.refProveedor.id == 0 ? $("#cboProveedores option:first").val() : _modeloProveedor.refProveedor.id);
    $("#txtClaveProveedor").val(_modeloProveedor.claveProveedor);
    $("#txtCostoProveedor").val(_modeloProveedor.costo);

    $("#modalProveedores").modal("show");
}

$(document).on("click", ".boton-guardar-cambios-proveedor", function () {
    const id = parseInt($("#productoId").val(), 10);

    const modelo = {
        productoId: id,
        refProveedor: {
            id: $("#cboProveedores").val()
        },
        claveProveedor: $("#txtClaveProveedor").val(),
        costo: $("#txtCostoProveedor").val()
    }

    


    if (_modeloProveedor.productoId == 0) {

        fetch("/Proveedor/Crear", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(modelo)
        })
            .then(response => {
                return response.ok ? response.json() : Promise.reject(response)
            })
            .then(responseJson => {

                if (responseJson.valor) {
                    $("#modalProveedores").modal("hide");
                    Swal.fire("Listo!", "Proveedor fue agrgado", "success");
                    cargarProveedores();
                }
                else
                    Swal.fire("Lo sentimos", "No se puedo crear", "error");
            })

    } else {

        fetch("/Home/editarEmpleado", {
            method: "PUT",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(modelo)
        })
            .then(response => {
                return response.ok ? response.json() : Promise.reject(response)
            })
            .then(responseJson => {

                if (responseJson.valor) {
                    $("#modalEmpleado").modal("hide");
                    Swal.fire("Listo!", "Empleado fue actualizado", "success");
                    MostrarEmpleados();
                }
                else
                    Swal.fire("Lo sentimos", "No se puedo actualizar", "error");
            })

    }


})

