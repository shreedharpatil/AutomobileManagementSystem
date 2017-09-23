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
    public class AddBackStockController: ApiController
    {
        private readonly IHttpClientProxyHandler restClient;

        public AddBackStockController(IHttpClientProxyHandler restClient)
        {
            this.restClient = restClient;
        }

        public HttpResponseMessage Put([FromBody] Stock stock)
        {
            var restrequest = new RestRequest("stock/updateStatus", ContentMediaType.Json);
            var data = this.restClient.PutData<ApiResponse<string>, Stock>(restrequest, stock);
            if (data.Item1.Status)
            {
                return Request.CreateResponse(HttpStatusCode.OK, "Stock has been added back successfully.");
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
        }
    }
}

