using AlMaximoTI_RESTful.Models;
using AlMaximoTI_RESTful.Repositorios.Contrato;
using AlMaximoTI_RESTful.Repositorios.Implementacion;
using Microsoft.AspNetCore.Mvc;

namespace AlMaximoTI_RESTful.Controllers
{
    public class ProveedorController : Controller
    {
        private readonly ILogger<ProveedorController> _logger;
        private readonly IGenericRepository<Producto> _productoRepository;
        private readonly IGenericRepository<Proveedor> _proveedorRepository;
        private readonly IGenericRepository<ProductoProveedor> _productoProveedorRepository;

        public ProveedorController(ILogger<ProveedorController> logger,
           IGenericRepository<Producto> productoRepository,
           IGenericRepository<Proveedor> proveedorRepository,
           IGenericRepository<ProductoProveedor> productoProveedor)
        {
            _logger = logger;
            _productoRepository = productoRepository;
            _proveedorRepository = proveedorRepository; ;
            _productoProveedorRepository = productoProveedor;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerProveedores()
        {
            List<Proveedor> _lista = await _proveedorRepository.ObtenerTodos();
            return StatusCode(StatusCodes.Status200OK, _lista);
        }

        [HttpGet]
        public async Task<IActionResult> CargarProveedores(int id)
        {

            List<ProductoProveedor> _lista = await _productoProveedorRepository.ObtenerTodos(id);
            return Ok(_lista);
        }

        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] ProductoProveedor modelo)
        {
            bool _resultado = await _productoProveedorRepository.Agregar(modelo);

            if (_resultado)
                return StatusCode(StatusCodes.Status200OK, new { valor = _resultado, msg = "ok" });
            else
                return StatusCode(StatusCodes.Status500InternalServerError, new { valor = _resultado, msg = "errror" });
        }

        [HttpPut]
        public async Task<IActionResult> editarEmpleado([FromBody] ProductoProveedor modelo)
        {
            bool _resultado = await _productoProveedorRepository.Editar(modelo);

            if (_resultado)
                return StatusCode(StatusCodes.Status200OK, new { valor = _resultado, msg = "ok" });
            else
                return StatusCode(StatusCodes.Status500InternalServerError, new { valor = _resultado, msg = "errror" });
        }



    }
}
