let _modeloProducto = {
    id: 0,
    clave: "",
    nombre: "",
    refTipoProducto: {
        id: 0,
        nombre: ""
    },
    esActivo: false,
    precio: 0.0
};

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

$(document).on("click", ".boton-nuevo-producto", function () {
    try {
        //seteamos los valores de nuestra variable global
        // Restablece el modelo a sus valores iniciales
        _modeloProducto = {
            id: 0,
            clave: "",
            nombre: "",
            refTipoProducto: {
                id: 0,
                nombre: ""
            },
            esActivo: false,
            precio: 0.0
        };
        // Redirige a la página de creación del producto
        window.location.assign("/Producto/Crear");
    } catch (error) {
        console.error("Error al redirigir a la página de creación del producto:", error);
        alert("Hubo un error al intentar redirigir a la página de creación del producto. Por favor, inténtalo de nuevo.");
    }
});

$(document).on("click", ".boton-editar-producto", function () {
    try {
        const _producto = $(this).data("producto");
        if (!_producto) {
            throw new Error("El objeto _producto es null o undefined");
        }

        _modeloProducto = {
            id: _producto.id, // Cambiado de idProducto a id
            clave: _producto.clave,
            nombre: _producto.nombre,
            refTipoProducto: {
                id: _producto.refTipoProducto.id,
                nombre: _producto.refTipoProducto.nombre
            },
            esActivo: _producto.esActivo,
            precio: _producto.precio
        };

       
        window.location.assign(`/Producto/Editar/${_producto.id}`);
    } catch (error) {
        console.error("Error al redirigir a la página de edición del producto:", error);
        alert("Hubo un error al intentar redirigir a la página de edición del producto. Por favor, inténtalo de nuevo.");
    }
});

$(document).on("click", ".boton-guardar-cambios-producto", function (e) {
    e.preventDefault();

    const idProducto = parseInt($("#productoId").val(), 10);
    console.log("id desde el formulario:", idProducto);

    const _modelo = {
        id: idProducto, 
        clave: $("#txtClave").val(),
        nombre: $("#txtNombre").val(),
        refTipoProducto: {
            id: $("#tipo").val()
        },
        esActivo: $("#esActivo").is(":checked"),
        precio: $("#txtPrecio").val()
    };

    console.log("Modelo antes de enviar:", _modelo);

    const url = idProducto === 0 ? "/Producto/Guardar" : "/Producto/Actualizar";
    const method = idProducto === 0 ? "POST" : "PUT";

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(_modelo)
    })
        .then(response => {
            return response.ok ? response.json() : Promise.reject(response);
        })
        .then(responseJson => {
            console.log("Respuesta del servidor:", responseJson);
            if (responseJson.valor) {
                Swal.fire({
                    icon: 'success',
                    title: 'Listo!',
                    text: `Producto fue ${idProducto === 0 ? "creado" : "actualizado"}`,
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = "/Producto/Index";
                });
            } else {
                Swal.fire("Lo sentimos", `No se pudo ${idProducto === 0 ? "crear" : "actualizar"}`, "error");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire("Error", "Ocurrió un error al procesar la solicitud", "error");
        });
});
