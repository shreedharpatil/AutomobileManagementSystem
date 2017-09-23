using Api.App_Start;
using Api.CastleDI;
using Castle.Windsor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace Api
{
    public class BootstrapApplication
    {
        private readonly IWindsorContainer container;

        public BootstrapApplication()
        {
            container = new WindsorContainer().Install(new DependencyInstaller());
        }

        public void ConfigureRoute(HttpConfiguration config, RouteCollection routes)
        {         
            AreaRegistration.RegisterAllAreas();
            Bootstrap.Start(container);
            // config.Routes.MapHttpRoute("DefaultApi", "api/{controller}/{id}", new { id = RouteParameter.Optional });
            var route = routes.MapHttpRoute("DefaultApi", "api/{controller}/{id}", new { id = RouteParameter.Optional });
            route.RouteHandler = new MyHttpControllerRouteHandler();
            GlobalConfiguration.Configuration.MessageHandlers.Add(new CustomDelegatingHandler());
            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}
