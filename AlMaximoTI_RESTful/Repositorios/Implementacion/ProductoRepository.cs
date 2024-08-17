using AlMaximoTI_RESTful.Models;
using AlMaximoTI_RESTful.Repositorios.Contrato;
using System.Data;
using System.Data.SqlClient;

namespace AlMaximoTI_RESTful.Repositorios.Implementacion
{
    public class ProductoRepository : IGenericRepository<Producto>
    {
        private readonly string _conexion = "";

        public ProductoRepository(IConfiguration configuration)
        {
            _conexion = configuration.GetConnectionString("conexion");
        }
        public async Task<List<Producto>> ObtenerTodos()
        {
            List<Producto> _lista = new List<Producto>();

            using (var conexion = new SqlConnection(_conexion))
            {
                await conexion.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_TodosLosProductos", conexion)
                {
                    CommandType = CommandType.StoredProcedure
                };

                using (var dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        var producto = new Producto
                        {
                            Id = Convert.ToInt32(dr["Id"]),
                            Clave = dr["Clave"].ToString(),
                            Nombre = dr["Nombre"].ToString(),
                            refTipoProducto = new TipoProducto
                            {
                                Id = Convert.ToInt32(dr["TipoId"]),
                                Nombre = dr["TipoNombre"].ToString(),
                            },
                            EsActivo = Convert.ToBoolean(dr["EsActivo"]),
                            Precio = Convert.ToDecimal(dr["Precio"]),
                            Proveedores = new List<ProductoProveedor>()
                        };

                        _lista.Add(producto);
                    }
                }
            }

            return _lista;
        }

        public async Task<List<Producto>> Buscar(string clave, string tipo)
        {
            List<Producto> _lista = new List<Producto>();

            using (var conexion = new SqlConnection(_conexion))
            {
                await conexion.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_BuscarProductos", conexion)
                {
                    CommandType = CommandType.StoredProcedure
                };

                // Agregar parámetros
                cmd.Parameters.AddWithValue("@Clave", (object)clave ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@NombreTipo", (object)tipo ?? DBNull.Value);

                using (var dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        var producto = new Producto
                        {
                            Id = Convert.ToInt32(dr["Id"]),
                            Clave = dr["Clave"].ToString(),
                            Nombre = dr["Nombre"].ToString(),
                            refTipoProducto = new TipoProducto
                            {
                                Id = Convert.ToInt32(dr["TipoId"]),
                                Nombre = dr["TipoNombre"].ToString(),
                            },
                            EsActivo = dr["EsActivo"] != DBNull.Value && Convert.ToBoolean(dr["EsActivo"]),
                            Precio = Convert.ToDecimal(dr["Precio"]),
                            Proveedores = new List<ProductoProveedor>()
                        };

                        
                       
                        _lista.Add(producto);
                    }
                }
            }

            return _lista;
        }

        public async Task<bool> Agregar(Producto modelo)
        {
            using (var conexion = new SqlConnection(_conexion))
            {
                await conexion.OpenAsync();
                using (SqlCommand cmd = new SqlCommand("sp_CrearProducto", conexion))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Clave", modelo.Clave);
                    cmd.Parameters.AddWithValue("@Nombre", modelo.Nombre);
                    cmd.Parameters.AddWithValue("@TipoProductoId", modelo.refTipoProducto.Id);
                    cmd.Parameters.AddWithValue("@EsActivo", modelo.EsActivo);
                    cmd.Parameters.AddWithValue("@Precio", modelo.Precio);

                    int filas_afectadas = await cmd.ExecuteNonQueryAsync();

                    return filas_afectadas > 0;
                }
            }
        }

        public async Task<bool> Editar(Producto modelo)
        {
            using (var conexion = new SqlConnection(_conexion))
            {
                conexion.Open();
                SqlCommand cmd = new SqlCommand("sp_ActualizarProducto", conexion);
                cmd.Parameters.AddWithValue("@Id", modelo.Id);
                cmd.Parameters.AddWithValue("@Clave", modelo.Clave);
                cmd.Parameters.AddWithValue("@Nombre", modelo.Nombre);
                cmd.Parameters.AddWithValue("@TipoProductoId", modelo.refTipoProducto.Id);
                cmd.Parameters.AddWithValue("@EsActivo", modelo.EsActivo);
                cmd.Parameters.AddWithValue("@Precio", modelo.Precio);
                cmd.CommandType = CommandType.StoredProcedure;

                int filas_afectadas = await cmd.ExecuteNonQueryAsync();

                return filas_afectadas > 0;
            }
;
        }

        public async Task<bool> Eliminar(int id)
        {
            using (var conexion = new SqlConnection(_conexion))
            {
                conexion.Open();
                SqlCommand cmd = new SqlCommand("sp_EliminarProducto", conexion);
                cmd.Parameters.AddWithValue("@ProductoId", id);
                cmd.CommandType = CommandType.StoredProcedure;

                int filas_afectadas = await cmd.ExecuteNonQueryAsync();

                return true;
            }
        }

        public async Task<Producto> ObtenerPorId(int id)
        {
            Producto producto = null;

            using (var conexion = new SqlConnection(_conexion))
            {
                await conexion.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_ObtenerProductoPorId", conexion)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@Id", id);

                using (var dr = await cmd.ExecuteReaderAsync())
                {
                    if (await dr.ReadAsync())
                    {
                        producto = new Producto
                        {
                            Id = Convert.ToInt32(dr["Id"]),
                            Clave = dr["Clave"].ToString(),
                            Nombre = dr["Nombre"].ToString(),
                            refTipoProducto = new Models.TipoProducto
                            {
                                Id = Convert.ToInt32(dr["TipoId"]),
                                Nombre = dr["TipoNombre"].ToString(),
                            },
                            EsActivo = Convert.ToBoolean(dr["EsActivo"]),
                            Precio = Convert.ToDecimal(dr["Precio"]),
                            Proveedores = new List<ProductoProveedor>()
                        };
                    }
                }
            }

            return producto;
        }

        public Task<List<Producto>> ObtenerTodos(int id)
        {
            throw new NotImplementedException();
        }
    }
}
