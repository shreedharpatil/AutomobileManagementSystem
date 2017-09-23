using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessFacade.Models
{
    public class Report<T1,T2> 
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public string Type { get; set; }

        public string PdfFilter { get; set; }

        public T1 Details { get; set; }

        public T2 Transactions { get; set; }
    }
}
