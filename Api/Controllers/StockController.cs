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
    public class StockController : ApiController
    {
        private readonly IHttpClientProxyHandler restClient;

        public StockController(IHttpClientProxyHandler restClient)
        {
            this.restClient = restClient;
        }

        public HttpResponseMessage Get()
        {
            var restrequest = new RestRequest("stock/getStocks",ContentMediaType.Json);
            var stocks = this.restClient.GetData<ApiResponse<List<Stock>>>(restrequest);
            if (stocks.Item1.Status)
            {
                return Request.CreateResponse(HttpStatusCode.OK, stocks.Item1.DataModel);
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
        }

        public HttpResponseMessage Post([FromBody] Stock stock)
        {            
            var restrequest = new RestRequest("stock/register", ContentMediaType.Json);
            var data = this.restClient.PostData<ApiResponse<string>, Stock>(restrequest, stock);
            if (data.Item1.Status)
            {
                return Request.CreateResponse(HttpStatusCode.Created, "Stock added successfully");
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
        }

        public HttpResponseMessage Put([FromBody] Stock stock)
        {
            var restrequest = new RestRequest("stock/update", ContentMediaType.Json);
            var data = this.restClient.PutData<ApiResponse<string>, Stock>(restrequest, stock);
            if (data.Item1.Status)
            {
                return Request.CreateResponse(HttpStatusCode.OK, "Stock details updated successfully");
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
        }

        public HttpResponseMessage Delete([FromUri] Stock item)
        {
            var restrequest = new RestRequest("stock/delete/" + item.StockId, ContentMediaType.Json);
            var stockItems = this.restClient.DeleteData<ApiResponse<string>>(restrequest);
            if (stockItems.Item1.Status)
            {
                return Request.CreateResponse(HttpStatusCode.OK, "Stock deleted successfully.");
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
        }
    }
}
