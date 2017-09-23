using BusinessFacade.Models;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessFacade.Query
{
    public class GenerateCustomerPdfReportQuery
    {
        public MemoryStream ExecuteQueryWith(IList<Report<Customer,IList<CustomerTransaction>>> reports)
        {
            MemoryStream ms = new MemoryStream();

            Document document = new Document(PageSize.A4, 10f, 10f, 125f, 10f);
            PdfWriter.GetInstance(document, ms);//new FileStream("e:\\table.pdf", FileMode.Create));
            document.Open();
            PdfPTable table = new PdfPTable(6);
            int numberOfTrans;
            double totalAmount, paidAmount, dueAmount, finalTotal = 0, finalPaid = 0, finalDue = 0;
            PdfPTable headerContentOne = new PdfPTable(3);
            var headerContentOneText = new PdfPCell(new Phrase("CASH BILL", FontFactory.GetFont("Arial", 10)));
            var headerContentTwoText = new PdfPCell(new Phrase("Sri Banadeshwara Prasanna", FontFactory.GetFont("Arial", 10)));
            var headerContentThreeText = new PdfPCell(new Phrase("TIN : 29740628650", FontFactory.GetFont("Arial", 10)));
            headerContentOneText.BorderWidth = 0; headerContentTwoText.BorderWidth = 0; headerContentThreeText.BorderWidth = 0;
            headerContentOneText.HorizontalAlignment = 0;
            headerContentTwoText.HorizontalAlignment = 1;
            headerContentThreeText.HorizontalAlignment = 2;

            headerContentOne.AddCell(headerContentOneText);
            headerContentOne.AddCell(headerContentTwoText);
            headerContentOne.AddCell(headerContentThreeText);


            var headerContentFourText = new PdfPCell(new Phrase("REDDY Automobile", FontFactory.GetFont("Arial", 15)));
            headerContentFourText.HorizontalAlignment = 1;
            headerContentFourText.BorderWidth = 0;
            headerContentFourText.Colspan = 3;
            headerContentOne.AddCell(headerContentFourText);

            PdfPTable header = new PdfPTable(1);
            PdfPTable headerContentThree = new PdfPTable(1);
            var headerContentFiveText = new PdfPCell(new Phrase("Govt. Hospital Road, GURUMATAKAL - 585 214", FontFactory.GetFont("Arial", 12)));
            headerContentFiveText.HorizontalAlignment = 1;
            headerContentFiveText.BorderWidth = 0;
            headerContentFiveText.Colspan = 3;
            headerContentOne.AddCell(headerContentFiveText);


            PdfPTable headerContentFour = new PdfPTable(1);
            var headerContentSixText = new PdfPCell(new Phrase("Dist: Yadgiri, Cell : 9945750603, 9632148153", FontFactory.GetFont("Arial", 12)));
            headerContentSixText.HorizontalAlignment = 1;
            headerContentSixText.BorderWidth = 0;
            headerContentSixText.Colspan = 3;
            headerContentOne.AddCell(headerContentSixText);

            var idHeadingCell = new PdfPCell(new Phrase("Customer Id", FontFactory.GetFont("Arial", 15)));
            var nameHeadingCell = new PdfPCell(new Phrase("Customer Name", FontFactory.GetFont("Arial", 15)));
            var numberOfTransHeadingCell = new PdfPCell(new Phrase("Number of trans", FontFactory.GetFont("Arial", 15)));
            var totalAmountHeadingCell = new PdfPCell(new Phrase("Total Amount", FontFactory.GetFont("Arial", 15)));
            var paidAmountHeadingCell = new PdfPCell(new Phrase("Paid Amount", FontFactory.GetFont("Arial", 15)));
            var dueAmountHeadingCell = new PdfPCell(new Phrase("Due Amount", FontFactory.GetFont("Arial", 15)));

            table.AddCell(idHeadingCell);
            table.AddCell(nameHeadingCell);
            table.AddCell(numberOfTransHeadingCell);
            table.AddCell(totalAmountHeadingCell);
            table.AddCell(paidAmountHeadingCell);
            table.AddCell(dueAmountHeadingCell);

            foreach(var report in reports)
            {
                // PdfPTable row = new PdfPTable(6);
                numberOfTrans = report.Transactions.Count;
                totalAmount = report.Transactions.Sum(p=>p.TotalAmount);
                paidAmount = report.Transactions.Sum(p => p.PaidAmount);
                dueAmount = report.Transactions.Sum(p => p.DueAmount);
                finalTotal += totalAmount;
                finalPaid += paidAmount;
                finalDue += dueAmount;
                var idCell = new PdfPCell(new Phrase(report.Details.IsGuestUser ? "Guest" : report.Details.CustomerId.ToString(), FontFactory.GetFont("Arial", 12)));
                var nameCell = new PdfPCell(new Phrase(string.Format("{0}{1},{2}", report.Details.CustomerTitle, report.Details.CustomerFirstName, report.Details.CustomerLastName), FontFactory.GetFont("Arial", 12)));
                var numberOfTransCell = new PdfPCell(new Phrase(numberOfTrans.ToString(), FontFactory.GetFont("Arial", 12)));
                var totalAmountCell = new PdfPCell(new Phrase(totalAmount.ToString(), FontFactory.GetFont("Arial", 12)));
                var paidAmountCell = new PdfPCell(new Phrase(paidAmount.ToString(), FontFactory.GetFont("Arial", 12)));
                var dueAmountCell = new PdfPCell(new Phrase(dueAmount.ToString(), FontFactory.GetFont("Arial", 12)));
                table.AddCell(idCell);
                table.AddCell(nameCell);
                table.AddCell(numberOfTransCell);
                table.AddCell(totalAmountCell);
                table.AddCell(paidAmountCell);
                table.AddCell(dueAmountCell);
            }

            var emptycell = new PdfPCell(new Phrase("".ToString(), FontFactory.GetFont("Arial", 12)));
            var totalamount = new PdfPCell(new Phrase(finalTotal.ToString(), FontFactory.GetFont("Arial", 12)));

            emptycell.BorderWidth = 0;
            table.AddCell(emptycell);
            table.AddCell(emptycell);
            table.AddCell(emptycell);
            table.AddCell(totalamount);

            var paidamount = new PdfPCell(new Phrase(finalPaid.ToString(), FontFactory.GetFont("Arial", 12)));
            var dueamount = new PdfPCell(new Phrase(finalDue.ToString(), FontFactory.GetFont("Arial", 12)));
            table.AddCell(paidamount);
            table.AddCell(dueamount);

            var footer = new PdfPTable(2);
            var footercontent1 = new PdfPCell(new Phrase("NOTE : Goods once sold will not be taken back or exchanged", GetFont(12)));
            footercontent1.HorizontalAlignment = 0;
            footercontent1.BorderWidthRight = 0;
            footercontent1.BorderWidthBottom = 0;
            var footercontent2 = new PdfPCell(new Phrase("For : Reddy Automobiles", GetFont(12)));
            footercontent2.HorizontalAlignment = 2;
            footercontent2.BorderWidthLeft = 0;
            footercontent2.BorderWidthBottom = 0;
            var footercontent3 = new PdfPCell(new Phrase("Signature", GetFont(12)));
            footercontent3.Colspan = 2;
            footercontent3.HorizontalAlignment = 2;

            footer.AddCell(footercontent1);
            footer.AddCell(footercontent2);
            footer.AddCell(footercontent3);

            header.AddCell(headerContentOne);
            document.Add(header);
            document.Add(table);
            document.Add(footer);
            document.Close();
            ms.Close();
            return ms;
        }
        private iTextSharp.text.Font GetFont(float size)
        {
            return FontFactory.GetFont("Arial", size);
        }
    }
}
