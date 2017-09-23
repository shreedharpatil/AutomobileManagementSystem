using System;
using System.ComponentModel;
namespace BusinessFacade.Models
{
    public class Dealer
    {
        public int Id { get; set; }

        public string Title { get; set; }


        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Address { get; set; }

        public string Place { get; set; }

        public string TinNumber { get; set; }

        public string ContactNumber { get; set; }

        public string EmailId { get; set; }

        public string ImageUrl { get; set; }

        public DateTime RegisteredDate { get; set; }
    }
}
