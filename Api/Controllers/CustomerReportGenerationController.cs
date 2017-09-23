using BusinessFacade.Models;
using BusinessFacade.Query;
using HttpClientWrapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Api.Controllers
{
    public class CustomerReportGenerationController : ApiController
    {
         private readonly IHttpClientProxyHandler restClient;

         public CustomerReportGenerationController(IHttpClientProxyHandler restClient)
        {
            this.restClient = restClient;
        }

         public HttpResponseMessage Get([FromUri] Report<string,string> report) 
         {
             var pdf = new GenerateCustomerPdfReportQuery();
             var restrequest = new RestRequest("customertransactionreport/getTransactions", ContentMediaType.Json);
             restrequest.AddQueryStringParameters(new QueryStringParameter { Name = "fromDate", Value = report.FromDate.ToString("yyyy-MM-dd") });
             restrequest.AddQueryStringParameters(new QueryStringParameter { Name = "toDate", Value = report.ToDate.ToString("yyyy-MM-dd") });
             restrequest.AddQueryStringParameters(new QueryStringParameter { Name = "filter", Value = report.PdfFilter });

             var trans = this.restClient.GetData<ApiResponse<IList<Report<Customer, IList<CustomerTransaction>>>>>(restrequest);
             var ms = pdf.ExecuteQueryWith(trans.Item1.DataModel);
             HttpResponse Response = HttpContext.Current.Response;
             Response.ContentType = "pdf/application";
             Response.AddHeader("content-disposition", "attachment;filename=CustomerReport.pdf");
             Response.OutputStream.Write(ms.GetBuffer(), 0, ms.GetBuffer().Length);

             return Request.CreateResponse(HttpStatusCode.OK);
         }
    }
}
