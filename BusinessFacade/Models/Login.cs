using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessFacade.Models
{
    public class Login
    {
        [DisplayName("userName")]
        public string userName { get; set; }

        [DisplayName("password")]
        public string password { get; set; }

        //[JsonIgnoreAttribute]
        //public string Status { get; set; }

        [DisplayName("userType")]
        public string userType { get; set; }
    }
}
