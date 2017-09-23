using BusinessFacade.Models;
using HttpClientWrapper;
using LoggingManager;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Xml;

namespace Api.App_Start
{
    public class CustomDelegatingHandler : DelegatingHandler
    {
        private ILogger logger;
        private readonly IHttpClientProxyHandler restClient;

        public CustomDelegatingHandler()
        {
            logger = new Logger();
            restClient = new HttpClientProxyHandler(logger);
        }
        protected override Task<HttpResponseMessage> SendAsync(
       HttpRequestMessage request, CancellationToken cancellationToken)
        {
            try
            {
                var restrequest = new RestRequest("AppRenewal/getRenewalDetails", ContentMediaType.Json);
                var data = this.restClient.GetData<ApiResponse<string>>(restrequest);
                if (!data.Item1.Status)
                {
                    string path = string.Empty;
                    var response = new HttpResponseMessage(HttpStatusCode.Found);
                    path = (request.RequestUri.Scheme == null || request.RequestUri.Scheme == string.Empty) ? "http" : request.RequestUri.Scheme;
                    path = string.Format("{0}{1}{2}:{3}/{4}", path, "://", request.RequestUri.Host, request.RequestUri.Port, "Home/Common/ApplicationExpired.html");
                    response.Headers.Add("applicationexpired", new[] { "true" });
                    response.Headers.Add("redirectlocation", new[] { path });

                    return Task<HttpResponseMessage>.Factory.StartNew(() => response);
                }

                var session = HttpContext.Current.Session;
                if (session["LoggedUser"] == null && !request.RequestUri.AbsoluteUri.Contains("Login"))
                {
                    var response = new HttpResponseMessage(HttpStatusCode.Found);
                    string path = string.Empty;
                    path = (request.RequestUri.Scheme == null || request.RequestUri.Scheme == string.Empty) ? "http" : request.RequestUri.Scheme;
                    path = string.Format("{0}{1}{2}:{3}/{4}", path, "://", request.RequestUri.Host, request.RequestUri.Port, "Home/Common/sessionExpiredPage.html");
                    response.Headers.Add("sessionexpired", new[]{"true"});
                    response.Headers.Add("redirectlocation", new[] { path });

                    // response.Headers.Location = new Uri(path);
                    return Task<HttpResponseMessage>.Factory.StartNew(() => response);
                }

                
                StringBuilder requestmessage = new StringBuilder(request.ToString());
                requestmessage.Append("\n Content : ");
                if (request.Content != null)
                {
                    requestmessage.Append(request.Content.ReadAsStringAsync().Result);
                }

                this.logger.LogInformation(requestmessage.ToString());
            }
            catch (Exception e)
            {
                try
                {
                    this.logger.LogException(e);
                }
                catch { }
            }
            return base.SendAsync(request, cancellationToken).ContinueWith(
                (task) =>
                {
                    HttpResponseMessage response = null;
                    try
                    {
                        response = task.Result;
                        StringBuilder responsemessage = new StringBuilder(response.ToString());
                        responsemessage.AppendLine();
                        string json = string.Empty;
                        if (response.Content != null)
                        {
                            json = response.Content.ReadAsStringAsync().Result;
                        }

                        try
                        {
                            XmlDocument doc = new XmlDocument();
                            doc.LoadXml(json);
                            json = JsonConvert.SerializeXmlNode(doc);
                        }
                        catch (Exception ex)
                        {
                        }
                        responsemessage.Append("\nContent : ");
                        responsemessage.Append(json);
                        this.logger.LogInformation(responsemessage.ToString());
                    }
                    catch (Exception e)
                    {
                        try
                        {
                            this.logger.LogException(e);
                        }
                        catch { }
                    }

                    return response;
                }
            );
        }
    }
}