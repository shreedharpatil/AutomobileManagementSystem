using BusinessFacade.Models;
using BusinessFacade.Query;
using Bytescout.Spreadsheet;
using HttpClientWrapper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Xml;

namespace Api.Controllers
{
    public class DealerReportGenerationController : ApiController
    {
         private readonly IHttpClientProxyHandler restClient;

         public DealerReportGenerationController(IHttpClientProxyHandler restClient)
        {
            this.restClient = restClient;
        }

        public HttpResponseMessage Get([FromUri] Report<Customer,IList<CustomerTransaction>> report)
        {            
            var pdf = new GenerateDealerPdfReportQuery();
            var restrequest = new RestRequest("dealertransactionreport/getTransactions", ContentMediaType.Json);
            restrequest.AddQueryStringParameters(new QueryStringParameter { Name = "fromDate", Value = report.FromDate.ToString("yyyy-MM-dd") });
            restrequest.AddQueryStringParameters(new QueryStringParameter { Name = "toDate", Value = report.ToDate.ToString("yyyy-MM-dd") });

            var trans = this.restClient.GetData<ApiResponse<IList<Report<Dealer, IList<DealerTransaction>>>>>(restrequest);
            var ms = pdf.ExecuteQueryWith(trans.Item1.DataModel);
            HttpResponse Response = HttpContext.Current.Response;
            Response.ContentType = "pdf/application";
            Response.AddHeader("content-disposition", "attachment;filename=DealerReport.pdf");
            Response.OutputStream.Write(ms.GetBuffer(), 0, ms.GetBuffer().Length);

            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}
