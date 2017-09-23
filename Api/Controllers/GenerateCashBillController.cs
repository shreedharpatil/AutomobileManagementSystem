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
    public class GenerateCashBillController : ApiController
    {
         private readonly IHttpClientProxyHandler restClient;

         public GenerateCashBillController(IHttpClientProxyHandler restClient)
        {
            this.restClient = restClient;
        }

         public HttpResponseMessage Get([FromUri] CustomerTransaction transaction)
         {
             var pdf = new GenerateCashBillPdfQuery();
             var restrequest = new RestRequest("customertransaction/getTransactions", ContentMediaType.Json);
             restrequest.AddQueryStringParameters(new QueryStringParameter { Name = "fromDate", Value = transaction.FromDate.ToString("yyyy-MM-dd") });
             restrequest.AddQueryStringParameters(new QueryStringParameter { Name = "toDate", Value = transaction.ToDate.ToString("yyyy-MM-dd") });
             restrequest.AddQueryStringParameters(new QueryStringParameter { Name = "transactionStatus", Value = transaction.TransactionStatus });
             restrequest.AddQueryStringParameters(new QueryStringParameter { Name = "customerId", Value = transaction.CustomerId.ToString() });

             var trans = this.restClient.GetData<ApiResponse<List<CustomerTransaction>>>(restrequest);
             restrequest = new RestRequest("customer/getCustomersById", ContentMediaType.Json);
             restrequest.AddQueryStringParameters(new QueryStringParameter { Name = "customerId", Value = transaction.CustomerId.ToString() });
             var customers = this.restClient.GetData<ApiResponse<List<Customer>>>(restrequest);
             var tran = trans.Item1.DataModel.FirstOrDefault(p => p.TransactionId == transaction.TransactionId);
             tran.CustomerDetails = customers.Item1.DataModel.FirstOrDefault();
             var ms = pdf.ExecuteQueryWith(tran);
             HttpResponse Response = HttpContext.Current.Response;
             Response.ContentType = "pdf/application";
             Response.AddHeader("content-disposition", "attachment;filename=CustomerCashBill.pdf");
             Response.OutputStream.Write(ms.GetBuffer(), 0, ms.GetBuffer().Length);

             return Request.CreateResponse(HttpStatusCode.OK);
         }
    }
}
