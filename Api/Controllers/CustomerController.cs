using BusinessFacade.Models;
using HttpClientWrapper;
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
    public class CustomerController : ApiController
    {
        private readonly IHttpClientProxyHandler restClient;

        public CustomerController(IHttpClientProxyHandler restClient)
        {
            this.restClient = restClient;
        }

        public HttpResponseMessage Get(string filter)
        {
            var restrequest = new RestRequest("customer/getCustomers",ContentMediaType.Json);
            restrequest.AddQueryStringParameters(new QueryStringParameter { Name = "filter" ,Value = filter ?? "All" });
            var customers = this.restClient.GetData<ApiResponse<List<Customer>>>(restrequest);
            if (customers.Item1.Status)
            {
                return Request.CreateResponse(HttpStatusCode.OK, customers.Item1.DataModel);
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError,"We are experience some technical error. Please try again later.");
        }

        public HttpResponseMessage Post([FromBody] Customer customer)
        {
            string fileName  = string.Empty;
            if (customer.IsImageCaptured)
            {
                fileName = GetFileName(customer);
                customer.CustomerImageUrl = "/Photos/Customer/" + fileName;
            }
            else 
            {
                customer.CustomerImageUrl = "/Photos/default.png";
            }
            customer.CustomerRegisteredDate = DateTime.Today;
            var restrequest = new RestRequest("customer/register", ContentMediaType.Json);
            var data = this.restClient.PostData<ApiResponse<string>, Customer>(restrequest, customer);
            if (data.Item1.Status)
            {
                return Request.CreateResponse(HttpStatusCode.Created, new { Message = "Customer registered successfully", FileName = fileName });
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
        }

        public HttpResponseMessage Put([FromBody] Customer customer)
        {
            var restrequest = new RestRequest("customer/update", ContentMediaType.Json);
            var data = this.restClient.PutData<ApiResponse<string>, Customer>(restrequest, customer);
            if (data.Item1.Status)
            {
                return Request.CreateResponse(HttpStatusCode.OK, "Customer details updated successfully");
            }

            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We are experience some technical error. Please try again later.");
        }

        private string GetFileName(Customer customer)
        {
            StringBuilder fileName = new StringBuilder(customer.CustomerFirstName);
            DateTime now = DateTime.Now;
            fileName.Append("_");
            fileName.Append(customer.CustomerLastName);
            fileName.Append("_");
            fileName.Append(now.ToString("ddMMyyyyhhmmss"));
            fileName.Append(".jpg");
            return fileName.ToString();
        }
    }
}
