using Castle.MicroKernel.Registration;
using Castle.MicroKernel.Resolvers.SpecializedResolvers;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using HttpClientWrapper;
using LoggingManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.Controllers;

namespace Api.CastleDI
{
    public class DependencyInstaller : IWindsorInstaller
    {
        /// <summary>
        /// Installs all required dependencies into container.
        /// </summary>
        /// <param name="container">Container to hold dependencies.</param>
        /// <param name="store"> Configuration store.</param>
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Kernel.Resolver.AddSubResolver(new ListResolver(container.Kernel));

            container.Register(
                Classes.FromAssemblyNamed("Api").BasedOn<IHttpController>().LifestyleTransient(),
                Component.For<IHttpClientProxyHandler>().ImplementedBy<HttpClientProxyHandler>().LifestylePerWebRequest(),
                Component.For<ILogger>().ImplementedBy<Logger>().LifestylePerWebRequest()
                
                );
        }
    }
}
