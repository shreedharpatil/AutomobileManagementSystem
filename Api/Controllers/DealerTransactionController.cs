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
    public class DealerTransactionController : ApiController
    {
        private readonly IHttpClientProxyHandler restClient;

        public DealerTransactionController(IHttpClientProxyHandler restClient)
        {
            this.restClient = restClient;
        }

        public HttpResponseMessage Get([FromUri] DealerTransaction transaction)
        {            
            var restrequest = new RestRequest("dealertransaction/getTransactions", ContentMediaType.Json);
            restrequest.AddQueryStringParameters(new QueryStringParameter { Name = "fromDate", Value = transaction.FromDate.ToString("yyyy-MM-dd") });
            restrequest.AddQueryStringParameters(new QueryStringParameter { Name = "toDate", Value = transaction.ToDate.ToString("yyyy-MM-dd") });
            restrequest.AddQueryStringParameters(new QueryStringParameter { Name = "transactionStatus", Value = transaction.TransactionStatus });
            restrequest.AddQueryStringParameters(new QueryStringParameter { Name = "dealerId", Value = transaction.DealerId.ToString() });
            var trans = this.restClient.GetData<ApiResponse<List<DealerTransaction>>>(restrequest);
            if (trans.Item1.Status)
            {
                return Request.CreateResponse(HttpStatusCode.OK, trans.Item1.DataModel);
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
        }

        public HttpResponseMessage Post([FromBody] DealerTransaction transaction)
        {
            var restrequest = new RestRequest("dealertransaction/create", ContentMediaType.Json);
            string fileName = GetFileName(transaction);
            transaction.InvoiceUrl = "/Photos/Invoice/" + fileName;
            transaction.SeperatedStockItemIds = string.Join(",",transaction.StockItems.Select(p => p.StockItemId.ToString()).ToArray());
            transaction.SeperatedStockItemQuantities = string.Join(",", transaction.StockItems.Select(p => p.Quantity.ToString()).ToArray());
            transaction.SeperatedStockItemPrices = string.Join(",",
                transaction.StockItems.Select(p => p.UnitPrice.ToString()).ToArray());
            var data = this.restClient.PostData<ApiResponse<DealerTransaction>, DealerTransaction>(restrequest, transaction);
            if (data.Item1.Status)
            {
                return Request.CreateResponse(HttpStatusCode.Created, new { Message = "Stock buying completed successfully", FileName = fileName });
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
        }

        public HttpResponseMessage Put([FromBody] DealerTransaction transaction)
        {
            var restrequest = new RestRequest("dealertransaction/update", ContentMediaType.Json);
            transaction.SeperatedStockItemIds = string.Join(",", transaction.StockItems.Select(p => p.StockItemId.ToString()).ToArray());
            transaction.SeperatedStockItemQuantities = string.Join(",", transaction.StockItems.Select(p => p.Quantity.ToString()).ToArray());
            var data = this.restClient.PutData<ApiResponse<DealerTransaction>, DealerTransaction>(restrequest, transaction);
            if (data.Item1.Status)
            {
                return Request.CreateResponse(HttpStatusCode.Created, new { Message = "transaction updated successfully" });
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
        }

        private string GetFileName(DealerTransaction transaction)
        {
            return transaction.DealerId + DateTime.Now.ToString("ddMMyyyyhhmmss") + ".jpg";
        }
    }
}
