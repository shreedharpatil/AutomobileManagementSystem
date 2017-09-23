namespace BusinessFacade.Models
{
    public class ApiResponse<T>
    {
        public bool Status { get; set; }

        public ApiError Error { get; set; }

        public T DataModel { get; set; }
    }
}
