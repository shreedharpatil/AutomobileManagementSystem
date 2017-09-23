using System;
using System.Collections.Generic;
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
    public class UploadPhotoController : ApiController
    {
        public async Task<HttpResponseMessage> Post()
        {
            // Check if the request contains multipart/form-data.
            if (Request.Content.IsMimeMultipartContent())
            {
                var folderName = Request.Headers.GetValues("foldername").FirstOrDefault();
                var streamProvider = new MultipartMemoryStreamProvider();
                streamProvider = await Request.Content.ReadAsMultipartAsync(streamProvider);

                foreach (var item in streamProvider.Contents)//.Where(c => !string.IsNullOrEmpty(c.Headers.ContentDisposition.FileName)))
                {
                    MemoryStream ms = new MemoryStream(await item.ReadAsByteArrayAsync());
                    string path = HttpContext.Current.Server.MapPath("~/Photos/" + folderName);
                    var fileName = item.Headers.ContentDisposition.FileName.Replace("\"", string.Empty).Trim();

                    FileStream file = new FileStream(path + "\\" + fileName, FileMode.Create, FileAccess.Write);
                    ms.WriteTo(file);
                    file.Close();
                    ms.Close();
                }
            }
            return Request.CreateResponse(HttpStatusCode.OK, new { Message = "Customer registration successful." });
        }
    }
}
