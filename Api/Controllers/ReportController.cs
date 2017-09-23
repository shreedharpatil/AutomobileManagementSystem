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
    public class ReportController : ApiController
    {
         private readonly IHttpClientProxyHandler restClient;

         public ReportController(IHttpClientProxyHandler restClient)
        {
            this.restClient = restClient;
        }

         public HttpResponseMessage Get([FromUri] Report<string,string> report) 
         {
             string url = string.Empty;
             if (report.Type.Equals("Dealer", StringComparison.CurrentCultureIgnoreCase))
             {
                 url = "dealertransactionreport/getTransactions";
                 var restrequest = PrepareRequest(url, report);
                 var trans = this.restClient.GetData<ApiResponse<IList<Report<Dealer,IList<DealerTransaction>>>>>(restrequest);
                 if (trans.Item1.Status)
                 {
                     return Request.CreateResponse(HttpStatusCode.OK, trans.Item1.DataModel);
                 }

                 return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
             }
             else {
                 url = "customertransactionreport/getTransactions";
                 var restrequest = PrepareRequest(url, report);
                 var trans = this.restClient.GetData<ApiResponse<IList<Report<Customer, IList<CustomerTransaction>>>>>(restrequest);
                 if (trans.Item1.Status)
                 {
                     return Request.CreateResponse(HttpStatusCode.OK, trans.Item1.DataModel);
                 }

                 return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
             }

             return null;
         }

         private RestRequest PrepareRequest(string url, Report<string, string> report)
         {
             var restrequest = new RestRequest(url, ContentMediaType.Json);
             restrequest.AddQueryStringParameters(new QueryStringParameter { Name = "fromDate", Value = report.FromDate.ToString("yyyy-MM-dd") });
             restrequest.AddQueryStringParameters(new QueryStringParameter { Name = "toDate", Value = report.ToDate.ToString("yyyy-MM-dd") });
             return restrequest;
         }
    }
}
