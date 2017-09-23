using BusinessFacade.Models;
using HttpClientWrapper;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Api.Controllers
{
    public class LoginController : ApiController
    {
        private readonly IHttpClientProxyHandler restClient;

        public LoginController(IHttpClientProxyHandler restClient)
        {
            this.restClient = restClient;
        }

       
        public HttpResponseMessage Post(Login login)
        {
            try
            {
                var dir = HttpContext.Current.Server.MapPath("~/Reports/Bills");
                string[] filePaths = Directory.GetFiles(dir);
                foreach (string filePath in filePaths)
                    File.Delete(filePath);
            }
            catch (Exception ex) { }

            login.userType = "admin";
            var restrequest = new RestRequest("login", ContentMediaType.Json);
            var result = this.restClient.PostData<ApiResponse<string>, Login>(restrequest, login);

            if (result.Item1.Status)
            {
                var session = HttpContext.Current.Session;
                session.Add("LoggedUser", new {Username = login.userName, UserType = login.userType});
                session.Timeout = 30;
                return Request.CreateResponse(HttpStatusCode.OK, new {Status = result.Item1.Status});
            }

            return Request.CreateResponse(HttpStatusCode.OK, new { Status = result.Item1.Status, Message = result.Item1.Error.ErrorMessage });
        }
    }
}
