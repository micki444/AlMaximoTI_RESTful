﻿const _modeloProveedor = {
    productoId: 0,
    refProveedor: {
        id: 0,
        nombre: ""
    },
    claveProveedor: "",
    costo: 0.0
};


$(document).on("click", ".boton-editar-proveedor", function () {
    const id = parseInt($("#productoId").val(), 10);
    const _proveedor = $(this).data("proveedor");
    $("#cboProveedores").prop("disabled", true);

    _modeloProveedor.productoId = id;
    _modeloProveedor.nombre = _proveedor.refProveedor.nombre;
    _modeloProveedor.refProveedor.id = _proveedor.refProveedor.id;
    _modeloProveedor.claveProveedor = _proveedor.claveProveedor;
    _modeloProveedor.costo = _proveedor.costo;

    cargarNombreProveedores(MostrarModal); // Pasar MostrarModal como callback
});

$(document).on("click", ".boton-guardar-cambios-proveedor", function () {
    const id = parseInt($("#productoId").val(), 10);
    const _flag = document.getElementById("cboProveedores");

    const modelo = {
        productoId: id,
        refProveedor: {
            id: $("#cboProveedores").val()
        },
        claveProveedor: $("#txtClaveProveedor").val(),
        costo: $("#txtCostoProveedor").val()
    }



    if (!_flag.disabled) {

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
                    cargarProveedores(id);

                }
                else
                    Swal.fire("Lo sentimos", "No se puedo crear", "error");
            })

    } else {

        fetch("/Proveedor/Actualizar", {
            method: "PUT",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(modelo)
        })
            .then(response => {
                return response.ok ? response.json() : Promise.reject(response)
            })
            .then(responseJson => {

                if (responseJson.valor) {
                    $("#modalProveedores").modal("hide");
                    Swal.fire("Listo!", "Proveedor fue actualizado", "success");
                    cargarProveedores(id);
                }
                else
                    Swal.fire("Lo sentimos", "No se puedo actualizar", "error");
            })

    }


})

$(document).on("click", ".boton-eliminar-proveedor", function () {
    const id = parseInt($("#productoId").val(), 10);
    const _proveedor = $(this).data("proveedor");

    Swal.fire({
        title: "Esta seguro?",
        text: `Eliminar Proveedor "${_proveedor.refProveedor.nombre}"`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar",
        cancelButtonText: "No, volver"
    }).then((result) => {

        if (result.isConfirmed) {

            fetch(`/Proveedor/Eliminar?productoId=${id}&proveedorId=${_proveedor.refProveedor.id}`, {
                method: "DELETE"
            })
                .then(response => {
                    return response.ok ? response.json() : Promise.reject(response)
                })
                .then(responseJson => {

                    if (responseJson.valor) {
                        Swal.fire("Listo!", "Proveedor fue elminado", "success");
                        cargarProveedores(id);
                    }
                    else
                        Swal.fire("Lo sentimos", "No se puedo eliminar", "error");
                })

        }



    })



})


function cargarNombreProveedores(callback) {
    const cboProveedores = $("#cboProveedores");
    cboProveedores.empty(); // Limpiar las opciones existentes

    // Agregar la opción "Seleccione el proveedor" desactivada
    cboProveedores.append(
        $("<option>").val("").text("Seleccione el proveedor").prop("disabled", true).prop("selected", true)
    );

    fetch("/Proveedor/ObtenerProveedores")
        .then(response => {
            return response.ok ? response.json() : Promise.reject(response);
        })
        .then(responseJson => {
            if (responseJson.length > 0) {
                responseJson.forEach((item) => {
                    cboProveedores.append(
                        $("<option>").val(item.id).text(item.nombre)
                    );
                });
            }
            if (callback) callback(); // Ejecutar el callback si está definido
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
function agregarProveedorModal() {
    _modeloProveedor.productoId = 0;
    _modeloProveedor.refProveedor.id = 0;
    _modeloProveedor.refProveedor.nombre = "";
    _modeloProveedor.claveProveedor = "";
    _modeloProveedor.costo = 0.0;
    $("#cboProveedores").prop("disabled", false);

    cargarNombreProveedores(MostrarModal); // Pasar MostrarModal como callback
}
function cargarProveedores(id) {

    fetch(`/Proveedor/CargarProveedores?id=${id}`)
        .then(response => {
            return response.ok ? response.json() : Promise.reject(response);
        })
        .then(responseJson => {
            console.log(responseJson); // Verifica los datos en la consola
            const tbody = document.querySelector("#tablaProductoProveedor tbody");
            tbody.innerHTML = ""; // Limpiar el contenido existente

            if (responseJson.length > 0) {
                responseJson.forEach(productoproveedor => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${productoproveedor.refProveedor.nombre}</td>
                        <td>${productoproveedor.claveProveedor}</td>
                        <td>${productoproveedor.costo}</td>
                        <td>
                            <button class="btn btn-primary btn-sm boton-editar-proveedor" data-proveedor='${JSON.stringify(productoproveedor)}'>Editar</button>
                            <button class="btn btn-danger btn-sm ms-2 boton-eliminar-proveedor" data-proveedor='${JSON.stringify(productoproveedor)}'>Eliminar</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });

                // Mostrar notificación de éxito con el número de productos encontrados
                
            } else {
                tbody.innerHTML = "<tr><td colspan='4'>No se encontraron proveedores.</td></tr>";
                // Mostrar notificación de que no se encontraron productos
              
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
function MostrarModal() {
    $("#cboProveedores").val(_modeloProveedor.refProveedor.id == 0 ? $("#cboProveedores option:first").val() : _modeloProveedor.refProveedor.id);
    $("#txtClaveProveedor").val(_modeloProveedor.claveProveedor);
    $("#txtCostoProveedor").val(_modeloProveedor.costo);

    $("#modalProveedores").modal("show");
}


