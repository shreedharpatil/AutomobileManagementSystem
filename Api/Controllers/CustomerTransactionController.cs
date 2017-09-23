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
    public class CustomerTransactionController : ApiController
    {
        private readonly IHttpClientProxyHandler restClient;

        public CustomerTransactionController(IHttpClientProxyHandler restClient)
        {
            this.restClient = restClient;
        }

        public HttpResponseMessage Get([FromUri] CustomerTransaction transaction)
        {
            var restrequest = new RestRequest("customertransaction/getTransactions", ContentMediaType.Json);
            restrequest.AddQueryStringParameters(new QueryStringParameter {  Name = "fromDate", Value = transaction.FromDate.ToString("yyyy-MM-dd")});
            restrequest.AddQueryStringParameters(new QueryStringParameter { Name = "toDate", Value = transaction.ToDate.ToString("yyyy-MM-dd") });
            restrequest.AddQueryStringParameters(new QueryStringParameter { Name = "transactionStatus", Value = transaction.TransactionStatus });
            restrequest.AddQueryStringParameters(new QueryStringParameter { Name = "customerId", Value = transaction.CustomerId.ToString()});

            var trans = this.restClient.GetData<ApiResponse<List<CustomerTransaction>>>(restrequest);
            if (trans.Item1.Status)
            {
                return Request.CreateResponse(HttpStatusCode.OK, trans.Item1.DataModel);
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
        }

        public HttpResponseMessage Post([FromBody] CustomerTransaction transaction)
        {
            var pdf = new GenerateCashBillPdfQuery1();
            var restrequest = new RestRequest("customertransaction/create", ContentMediaType.Json);
            transaction.SeperatedStockItemIds = string.Join(",", transaction.StockItems.Select(p => p.StockItemId.ToString()).ToArray());
            transaction.SeperatedStockItemQuantities = string.Join(",", transaction.StockItems.Select(p => p.Quantity.ToString()).ToArray());
            transaction.SeperatedStockItemPrices = string.Join(",",
                transaction.StockItems.Select(p => p.UnitPrice.ToString()).ToArray());
            var data = this.restClient.PostData<ApiResponse<CustomerTransaction>, CustomerTransaction>(restrequest, transaction);
            string filename = HttpContext.Current.Server.MapPath("~/Reports/Bills/CustomerBill_" + data.Item1.DataModel.TransactionId + ".pdf");
            pdf.ExecuteQueryWith(data.Item1.DataModel,filename);

            var x = string.Format("{0}://{1}:{2}/{3}", Request.RequestUri.Scheme,Request.RequestUri.Host,Request.RequestUri.Port,"Reports/Bills/CustomerBill_" + data.Item1.DataModel.TransactionId + ".pdf");
            
            if (data.Item1.Status)
            {           
                return Request.CreateResponse(HttpStatusCode.Created, new { Message = "Stock selling completed successfully" , FileName = x});
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
        }

        public HttpResponseMessage Put([FromBody] CustomerTransaction transaction)
        {
            var restrequest = new RestRequest("customertransaction/update", ContentMediaType.Json);
            transaction.SeperatedStockItemIds = string.Join(",", transaction.StockItems.Select(p => p.StockItemId.ToString()).ToArray());
            transaction.SeperatedStockItemQuantities = string.Join(",", transaction.StockItems.Select(p => p.Quantity.ToString()).ToArray());
            var data = this.restClient.PutData<ApiResponse<CustomerTransaction>, CustomerTransaction>(restrequest, transaction);
            if (data.Item1.Status)
            {
                return Request.CreateResponse(HttpStatusCode.Created, new { Message = "transaction updated successfully" });
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
        }
    }
}
