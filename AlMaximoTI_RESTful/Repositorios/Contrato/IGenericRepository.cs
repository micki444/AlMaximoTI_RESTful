namespace AlMaximoTI_RESTful.Repositorios.Contrato
{
    public interface IGenericRepository<T> where T : class
    {
        Task<List<T>> ObtenerTodos();
        Task<T> ObtenerPorId(int id);
        Task<List<T>> ObtenerTodos(int id);
        Task<bool> Agregar(T modelo);
        Task<bool> Editar(T modelo);
        Task<bool> Eliminar(int id);
        Task<bool> Eliminar(int productoId, int proveedorId);
        Task<List<T>> Buscar(string clave, string tipo);

    }
}
