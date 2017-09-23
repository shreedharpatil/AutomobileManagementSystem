using Microsoft.Practices.EnterpriseLibrary.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http.Filters;

namespace Web.App_Start
{
    public class CustomHandleErrorAttribute : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext context)
        {
            var logger = new LoggingManager.Logger();
            logger.LogException(context.Exception);           
            context.Response = context.Request.CreateResponse(HttpStatusCode.InternalServerError, "An Error has occurred. please try again later.");
        }
    }
}