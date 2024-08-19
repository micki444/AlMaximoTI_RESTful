using AlMaximoTI_RESTful.Models;
using AlMaximoTI_RESTful.Repositorios.Contrato;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Diagnostics;

namespace AlMaximoTI_RESTful.Controllers
{
    public class ProductoController : Controller
    {
        private readonly ILogger<ProductoController> _logger;
        private readonly IGenericRepository<Producto> _productoRepository;
        private readonly IGenericRepository<TipoProducto> _tipoProductoRepository;
        private readonly IGenericRepository<ProductoProveedor> _productoProveedorRepository;

        public ProductoController(ILogger<ProductoController> logger,
           IGenericRepository<Producto> productoRepository,
           IGenericRepository<ProductoProveedor> productoProveedorRepository,
           IGenericRepository<TipoProducto> tipoProductoRepository)
        {
            _logger = logger;
            _productoRepository = productoRepository;
            _productoProveedorRepository = productoProveedorRepository;
            _tipoProductoRepository = tipoProductoRepository;
        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Crear()
        {
            ViewBag.TipoProductos = new SelectList(await _tipoProductoRepository.ObtenerTodos(), "Id", "Nombre");
            return View();
        }

        public async Task<IActionResult> Editar(int id)
        {
            var producto = await _productoRepository.ObtenerPorId(id);
            producto.Proveedores = await _productoProveedorRepository.ObtenerTodos(id);
            ViewBag.TipoProductos = new SelectList(await _tipoProductoRepository.ObtenerTodos(), "Id", "Nombre", producto.refTipoProducto.Nombre);


            if (producto == null)
            {
                return NotFound();
            }
            return View(producto);
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerTiposProducto()
        {
            List<TipoProducto> _lista = await _tipoProductoRepository.ObtenerTodos();
            return StatusCode(StatusCodes.Status200OK, _lista);
        }

        [HttpGet]
        public async Task<IActionResult> CargarProductos()
        {
            List<Producto> _lista = await _productoRepository.ObtenerTodos();
            return Ok(_lista);
        }

        [HttpGet]
        public async Task<IActionResult> Buscar(string clave, string tipo)
        {
            List<Producto> _lista = await _productoRepository.Buscar(clave, tipo);
            return StatusCode(StatusCodes.Status200OK, _lista);
        }

        [HttpPost]
        public async Task<IActionResult> Guardar([FromBody] Producto producto)
        {
            bool _resultado = await _productoRepository.Agregar(producto);

            if (_resultado)
                return StatusCode(StatusCodes.Status200OK, new { valor = _resultado, msg = "ok" });
            else
                return StatusCode(StatusCodes.Status500InternalServerError, new { valor = _resultado, msg = "error" });
        }

        [HttpPut]
        public async Task<IActionResult> Actualizar([FromBody] Producto modelo)
        {
            if (modelo == null)
            {
                return BadRequest(new { valor = false, msg = "Modelo inválido" });
            }

            // Verificar el valor de idProducto
            Debug.WriteLine("idProducto recibido en el controlador: " + modelo.Id);

            bool _resultado = await _productoRepository.Editar(modelo);
            if (_resultado)
            {
                return StatusCode(StatusCodes.Status200OK, new { valor = _resultado, msg = "ok" });
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { valor = _resultado, msg = "error" });
            }
        }

        [HttpDelete]
        public async Task<IActionResult> EliminarProducto(int id)
        {
            bool _resultado = await _productoRepository.Eliminar(id);

            if (_resultado) { return StatusCode(StatusCodes.Status200OK, new { valor = _resultado, msg = "ok" }); }

            else { return StatusCode(StatusCodes.Status500InternalServerError, new { valor = _resultado, msg = "errror" }); }
                
        }


        public IActionResult Privacy()
        {
            return View();
        }



        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }


}
