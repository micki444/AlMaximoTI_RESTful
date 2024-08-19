using AlMaximoTI_RESTful.Models;
using AlMaximoTI_RESTful.Repositorios.Contrato;
using System.Data.SqlClient;
using System.Data;

namespace AlMaximoTI_RESTful.Repositorios.Implementacion
{
    public class ProductoProveedorRepository : IGenericRepository<ProductoProveedor>
    {
        private readonly string _conexion = "";

        public ProductoProveedorRepository(IConfiguration configuration)
        {
            _conexion = configuration.GetConnectionString("conexion");
        }

        public async Task<List<ProductoProveedor>> ObtenerTodos(int id)
        {
            List<ProductoProveedor> _lista = new List<ProductoProveedor>();
            using (var conexion = new SqlConnection(_conexion))
            {
                conexion.Open();
                SqlCommand cmd = new SqlCommand("sp_ObtenerProveedoresDelProducto", conexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@ProductoId", id);

                using (var dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        _lista.Add(new ProductoProveedor
                        {
                            ProductoId = Convert.ToInt32(dr["ProductoId"]),
                            refProveedor = new Proveedor
                            {
                                Id = Convert.ToInt32(dr["ProveedorId"]),
                                Nombre = dr["Nombre"].ToString(),
                            },
                            ClaveProveedor = dr["ClaveProveedor"].ToString(),
                            Costo = Convert.ToDecimal(dr["Costo"])

                        });
                    }
                }
            }
            return _lista;

        }

        public async Task<bool> Agregar(ProductoProveedor modelo)
        {
            using (var conexion = new SqlConnection(_conexion))
            {
                await conexion.OpenAsync();
                using (SqlCommand cmd = new SqlCommand("sp_InsertarProductoProveedor", conexion))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ProductoId", modelo.ProductoId);
                    cmd.Parameters.AddWithValue("@ProveedorId", modelo.refProveedor.Id);
                    cmd.Parameters.AddWithValue("@ClaveProveedor", modelo.ClaveProveedor);
                    cmd.Parameters.AddWithValue("@Costo", modelo.Costo);

                    int filas_afectadas = await cmd.ExecuteNonQueryAsync();

                    return filas_afectadas > 0;
                }
            }
        }

        public Task<List<ProductoProveedor>> Buscar(string clave, string tipo)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> Editar(ProductoProveedor modelo)
        {
            using (var conexion = new SqlConnection(_conexion))
            {
                conexion.Open();
                SqlCommand cmd = new SqlCommand("sp_EditarProductoProveedor", conexion);
                cmd.Parameters.AddWithValue("@ProductoId", modelo.ProductoId);
                cmd.Parameters.AddWithValue("@ProveedorId", modelo.refProveedor.Id);
                cmd.Parameters.AddWithValue("@NuevaClaveProveedor", modelo.ClaveProveedor);
                cmd.Parameters.AddWithValue("@NuevoCosto", modelo.Costo);
                cmd.CommandType = CommandType.StoredProcedure;

                int filas_afectadas = await cmd.ExecuteNonQueryAsync();

                return filas_afectadas > 0;
            }
;
        }

        public async Task<bool> Eliminar(int productoId, int proveedorId)
        {
            using (var conexion = new SqlConnection(_conexion))
            {
                conexion.Open();
                SqlCommand cmd = new SqlCommand("sp_EliminarProductoProveedor", conexion);
                cmd.Parameters.AddWithValue("@ProductoId", productoId);
                cmd.Parameters.AddWithValue("@ProveedorId", proveedorId);
                cmd.CommandType = CommandType.StoredProcedure;

                int filas_afectadas = await cmd.ExecuteNonQueryAsync();

                return filas_afectadas > 0;
            }
        }

        public Task<bool> Eliminar(int id)
        {
            throw new NotImplementedException();
        }

        public Task<ProductoProveedor> ObtenerPorId(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<ProductoProveedor>> ObtenerTodos()
        {
            throw new NotImplementedException();
        }

    }
}
