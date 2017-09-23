using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessFacade.Models
{
    public class Customer
    {
        public int CustomerId { get; set; }

        public string CustomerTitle { get; set; }
        
        public string CustomerFirstName { get; set; }

        public string CustomerLastName { get; set; }

        public string CustomerAddress { get; set; }

        public string CustomerPlace { get; set; }

        public string CustomerVehicleNum { get; set; }

        public string CustomerVehicleType { get; set; }

        public string CustomerMobile { get; set; }

        public string CustomerEmailId { get; set; }

        public string CustomerImageUrl { get; set; }

        public DateTime CustomerRegisteredDate { get; set; }
                
        public bool IsImageCaptured { get; set; }

        public bool IsGuestUser { get; set; }
    }
}
