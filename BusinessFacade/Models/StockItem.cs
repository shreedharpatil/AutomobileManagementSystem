using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessFacade.Models
{
    public class StockItem
    {
        public long StockItemId { get; set; }

        public string StockItemName { get;set;}

        public int Quantity { get; set; }

        public string UnitType { get; set; }

        public long StockId { get; set; }

        public double UnitPrice { get; set; }

        public string StockStatus { get; set; }

        public double TotalAmount {
            get {
                return this.Quantity * this.UnitPrice;
            }
        }
    }
}
