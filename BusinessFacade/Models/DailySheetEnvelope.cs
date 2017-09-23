using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessFacade.Models
{
    public class DailySheetEnvelope
    {
        public double TotalDailySheetAmount {get;set;}

        public double TotalDailyExpenditureSheetAmount { get; set; }


        public IList<DailySheet> DailySheets { get; set; }

        public IList<DailySheet> DailyExpenditureSheets { get; set; }

    }
}
