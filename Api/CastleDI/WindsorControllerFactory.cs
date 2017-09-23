using Castle.Windsor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.Controllers;
using System.Web.Http.Dispatcher;

namespace Api.CastleDI
{
    /// <summary>
    /// Api controller factory.
    /// </summary>
    class WindsorControllerFactory : IHttpControllerActivator
    {
        /// <summary>
        /// Container.
        /// </summary>
        private readonly IWindsorContainer container;

        public WindsorControllerFactory(IWindsorContainer container)
        {
            this.container = container;
        }

        public IHttpController Create(HttpRequestMessage request, HttpControllerDescriptor controllerDescriptor, Type controllerType)
        {
            if (controllerType == null)
            {
                throw new Exception("No controller found.");
            }

            var controller = (IHttpController)this.container.Resolve(controllerType);
            request.RegisterForDispose(new Release(
                () => this.container.Release(controller)
                ));

            return controller;
        }
    }
}
