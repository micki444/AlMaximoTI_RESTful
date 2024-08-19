using AlMaximoTI_RESTful.Models;
using AlMaximoTI_RESTful.Repositorios.Contrato;
using System.Data;
using System.Data.SqlClient;

public class ProveedorRepository : IGenericRepository<Proveedor>
    {

        private readonly string _conexion = "";

        public ProveedorRepository(IConfiguration configuration)
        {
            _conexion = configuration.GetConnectionString("conexion");
        }

    public async Task<List<Proveedor>> ObtenerTodos(int id)
    {
        List<Proveedor> _lista = new List<Proveedor>();

        using (var conexion = new SqlConnection(_conexion))
        {
            await conexion.OpenAsync();
            SqlCommand cmd = new SqlCommand("sp_ObtenerProveedores", conexion)
            {
                CommandType = CommandType.StoredProcedure
            };

            using (var dr = await cmd.ExecuteReaderAsync())
            {
                while (await dr.ReadAsync())
                {
                    var tipo = new Proveedor
                    {
                        Id = Convert.ToInt32(dr["Id"]),
                        Nombre = dr["Nombre"].ToString()
                    };



                    _lista.Add(tipo);
                }
            }
        }

        return _lista;
    }

    public Task<bool> Agregar(Proveedor modelo)
    {
        throw new NotImplementedException();
    }

    public Task<List<Proveedor>> Buscar(string clave, string tipo)
    {
        throw new NotImplementedException();
    }

    public Task<bool> Editar(Proveedor modelo)
    {
        throw new NotImplementedException();
    }

    public Task<bool> Eliminar(int id)
    {
        throw new NotImplementedException();
    }

    public Task<Proveedor> ObtenerPorId(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<List<Proveedor>> ObtenerTodos(){
        List<Proveedor> _lista = new List<Proveedor>();
        using (var conexion = new SqlConnection(_conexion))
        {
            await conexion.OpenAsync();
            SqlCommand cmd = new SqlCommand("sp_ObtenerProveedores", conexion)
            {
                CommandType = CommandType.StoredProcedure
            };

            using (var dr = await cmd.ExecuteReaderAsync())
            {
                while (await dr.ReadAsync())
                {
                    var tipo = new Proveedor
                    {
                        Id = Convert.ToInt32(dr["Id"]),
                        Nombre = dr["Nombre"].ToString()
                    };

                    _lista.Add(tipo);
                }
            }
        }

        return _lista;
    }

    public Task<bool> Eliminar(int productoId, int proveedorId)
    {
        throw new NotImplementedException();
    }
}

