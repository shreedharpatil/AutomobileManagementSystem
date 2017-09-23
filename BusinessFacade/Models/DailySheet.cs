using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessFacade.Models
{
    public class DailySheet
    {
        public string Particulars { get; set; }

        public int Quantity { get; set; }

        public double Amount { get; set; }

        public string ExpenditureType { get;set;}

        public DateTime DateOfExpenditure { get; set; }
    }
}
