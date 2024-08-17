namespace AlMaximoTI_RESTful.Models
{
    public class ProductoProveedor
    {
        public int ProductoId { get; set; }
        public Proveedor refProveedor { get; set; }
        public string ClaveProveedor { get; set; }
        public decimal Costo { get; set; }

    }
}