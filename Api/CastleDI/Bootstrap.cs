using Castle.Windsor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Dispatcher;

namespace Api.CastleDI
{
    public static class Bootstrap
    {
        public static void Start(IWindsorContainer container)
        {
            GlobalConfiguration.Configuration.Services.Replace(typeof(IHttpControllerActivator), new WindsorControllerFactory(container));
        }
    }
}
