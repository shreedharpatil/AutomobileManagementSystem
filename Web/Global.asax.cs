using Api;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using Web.App_Start;

namespace Web
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configuration.Filters.Add(new CustomHandleErrorAttribute());
            new BootstrapApplication().ConfigureRoute(GlobalConfiguration.Configuration, RouteTable.Routes);
        }
        protected void Session_Start(object sender, EventArgs e)
        {
            // Code that runs when a new session is started
            string sessionId = Session.SessionID;
        }
    }
}