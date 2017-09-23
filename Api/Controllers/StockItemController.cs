using BusinessFacade.Models;
using HttpClientWrapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace Api.Controllers
{
    public class StockItemController : ApiController
    {
        private readonly IHttpClientProxyHandler restClient;

        public StockItemController(IHttpClientProxyHandler restClient)
        {
            this.restClient = restClient;
        }

        public HttpResponseMessage Get([FromUri] StockItem item)
        {
            var restrequest = new RestRequest("stockItem/getStockItems/" + item.StockId, ContentMediaType.Json);
            restrequest.AddQueryStringParameters(new QueryStringParameter { Name = "filter", Value = item.StockStatus});
            var stockItems = this.restClient.GetData<ApiResponse<List<StockItem>>>(restrequest);
            if (stockItems.Item1.Status)
            {
                return Request.CreateResponse(HttpStatusCode.OK, stockItems.Item1.DataModel);
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
        }

        public HttpResponseMessage Post([FromBody] StockItem stockItem)
        {
            var restrequest = new RestRequest("stockItem/register", ContentMediaType.Json);
            var data = this.restClient.PostData<ApiResponse<string>, StockItem>(restrequest, stockItem);
            if (data.Item1.Status)
            {
                return Request.CreateResponse(HttpStatusCode.Created, "Stock Item added successfully");
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
        }

        public HttpResponseMessage Put([FromBody] StockItem stockItem)
        {
            var restrequest = new RestRequest("stockItem/update", ContentMediaType.Json);
            var data = this.restClient.PutData<ApiResponse<string>, StockItem>(restrequest, stockItem);
            if (data.Item1.Status)
            {
                return Request.CreateResponse(HttpStatusCode.OK, "Stock Item details updated successfully");
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
        }

        public HttpResponseMessage Delete([FromUri] StockItem item)
        {
            var restrequest = new RestRequest("stockItem/delete/" + item.StockItemId, ContentMediaType.Json);
            var stockItems = this.restClient.DeleteData<ApiResponse<string>>(restrequest);
            if (stockItems.Item1.Status)
            {
                return Request.CreateResponse(HttpStatusCode.OK, "Stock item deleted successfully.");
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
        }
    }
}

