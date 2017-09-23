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
    public class DailySheetController : ApiController
    {
        private readonly IHttpClientProxyHandler restClient;

        public DailySheetController(IHttpClientProxyHandler restClient)
        {
            this.restClient = restClient;
        }

        public HttpResponseMessage Get([FromUri] DailySheet sheet)
        {
            var restrequest = new RestRequest("dailySheet/getTransactions", ContentMediaType.Json);
            restrequest.AddQueryStringParameters(new QueryStringParameter { Name = "Date" , Value = sheet.DateOfExpenditure.ToString("yyyy-MM-dd")});
            var data = this.restClient.GetData<ApiResponse<IList<DailySheet>>>(restrequest);

            if (data.Item1.Status)
            {
                var output = new DailySheetEnvelope();
                output.DailySheets = data.Item1.DataModel.Where(p => p.ExpenditureType.Equals("DailySheet",StringComparison.CurrentCultureIgnoreCase)).ToList();
                output.DailyExpenditureSheets = data.Item1.DataModel.Where(p => p.ExpenditureType.Equals("DailyExpenditureSheet", StringComparison.CurrentCultureIgnoreCase)).ToList();
                output.TotalDailySheetAmount = output.DailySheets.Sum(p => p.Amount);
                output.TotalDailyExpenditureSheetAmount = output.DailyExpenditureSheets.Sum(p => p.Amount);
                return Request.CreateResponse(HttpStatusCode.OK, output);
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
        }

        public HttpResponseMessage Post([FromBody] IList<DailySheet> sheets)
        {
            var restrequest = new RestRequest("dailySheet/register", ContentMediaType.Json);
            var data = this.restClient.PostData<ApiResponse<string>, IList<DailySheet>>(restrequest, sheets);
            if (data.Item1.Status)
            {
                return Request.CreateResponse(HttpStatusCode.OK, "Records saved successfully.");
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
        }
    }
}
