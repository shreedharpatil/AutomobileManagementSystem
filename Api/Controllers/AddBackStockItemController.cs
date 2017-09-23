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
    public class AddBackStockItemController : ApiController
    {
        private readonly IHttpClientProxyHandler restClient;

        public AddBackStockItemController(IHttpClientProxyHandler restClient)
        {
            this.restClient = restClient;
        }

        public HttpResponseMessage Put([FromBody] StockItem stockItem)
        {
            var restrequest = new RestRequest("stockItem/updateStockItemStatus", ContentMediaType.Json);
            var data = this.restClient.PutData<ApiResponse<string>, StockItem>(restrequest, stockItem);
            if (data.Item1.Status)
            {
                return Request.CreateResponse(HttpStatusCode.OK, "Stock item has been added back successfully.");
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
        }
    }
}
