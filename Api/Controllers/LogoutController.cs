using BusinessFacade.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using BusinessFacede;
using HttpClientWrapper;

namespace Api.Controllers
{
    public class LogoutController : ApiController
    {
        private readonly IHttpClientProxyHandler restClient;

        public LogoutController(IHttpClientProxyHandler restClient)
        {
            this.restClient = restClient;
        }

       
        public HttpResponseMessage Post()
        {
            var session = HttpContext.Current.Session;
            string path = string.Empty;
            path = (Request.RequestUri.Scheme == null || Request.RequestUri.Scheme == string.Empty) ? "http" : Request.RequestUri.Scheme;
            path = string.Format("{0}{1}{2}:{3}/{4}", path, "://", Request.RequestUri.Host, Request.RequestUri.Port, "Login/Index.html");
            
            session["LoggedUser"] = null;
            TakeDatabaseBackupCommand backupCommand = new TakeDatabaseBackupCommand();
            backupCommand.TakeBackup("abs");
            return Request.CreateResponse(HttpStatusCode.OK, path);
        }
    }
}
