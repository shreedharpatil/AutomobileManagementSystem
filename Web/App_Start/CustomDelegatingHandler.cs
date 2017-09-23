using LoggingManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace Web.App_Start
{
    public class CustomDelegatingHandler : DelegatingHandler
    {
        private ILogger logger;
        public CustomDelegatingHandler()
        {
            logger = new Logger();
        }
        protected override Task<HttpResponseMessage> SendAsync(
       HttpRequestMessage request, CancellationToken cancellationToken)
        {
            this.logger.LogInformation(request.ToString());
            return base.SendAsync(request, cancellationToken).ContinueWith(
                (task) =>
                {
                    HttpResponseMessage response = task.Result;
                    this.logger.LogInformation(response.ToString());
                    return response;
                }
            );
        }
    }
}