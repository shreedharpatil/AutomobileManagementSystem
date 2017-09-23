using BusinessFacade.Models;
using HttpClientWrapper;
using LoggingManager;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace Api.Controllers
{
    public class DealerController : ApiController
    {
        private readonly IHttpClientProxyHandler restClient;

        public DealerController(IHttpClientProxyHandler restClient)
        {
            this.restClient = restClient;
        }

        public HttpResponseMessage Get()
        {
            var restrequest = new RestRequest("dealer/getDealers",ContentMediaType.Json);
            var dealers = this.restClient.GetData<ApiResponse<List<Dealer>>>(restrequest);
            if (dealers.Item1.Status)
            {
                return Request.CreateResponse(HttpStatusCode.OK, dealers.Item1.DataModel);
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
        }

        public HttpResponseMessage Post([FromBody] Dealer dealer)
        {
            dealer.RegisteredDate = DateTime.Today;
            var restrequest = new RestRequest("dealer/register", ContentMediaType.Json);
            var data = this.restClient.PostData<ApiResponse<string>, Dealer>(restrequest, dealer);
            if (data.Item1.Status)
            {
                return Request.CreateResponse(HttpStatusCode.Created, "Dealer registered successfully");
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
        }

        public HttpResponseMessage Put([FromBody] Dealer dealer)
        {
            var restrequest = new RestRequest("dealer/update", ContentMediaType.Json);
            var data = this.restClient.PutData<ApiResponse<string>, Dealer>(restrequest, dealer);
            if (data.Item1.Status)
            {
                return Request.CreateResponse(HttpStatusCode.OK, "Dealer details updated successfully");
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
        }
    }
}
