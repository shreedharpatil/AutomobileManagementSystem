using BusinessFacade.Models;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utilities;

namespace BusinessFacade.Query
{
    public class GenerateCashBillPdfQuery1
    {
        public void ExecuteQueryWith(CustomerTransaction trans,string filename)
        {
            Document document = new Document(PageSize.A4, 10f, 10f, 125f, 10f);
            PdfWriter.GetInstance(document, new FileStream(filename, FileMode.Create));
            document.Open();
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

            PdfPTable nameSectionTable = new PdfPTable(2);
            var nameSectionTableContentOneFirst = new PdfPCell(new Phrase("No.: " + trans.InvoiceNumber, FontFactory.GetFont("Arial", 12)));
            nameSectionTableContentOneFirst.HorizontalAlignment = 0;
            nameSectionTableContentOneFirst.BorderWidth = 0;
            nameSectionTable.AddCell(nameSectionTableContentOneFirst);

            var nameSectionTableContentOneSecond = new PdfPCell(new Phrase("Date : " + trans.TransactionDate.ToString("dd-MM-yyyy"), FontFactory.GetFont("Arial", 12)));
            nameSectionTableContentOneSecond.HorizontalAlignment = 2;
            nameSectionTableContentOneSecond.BorderWidth = 0;
            nameSectionTable.AddCell(nameSectionTableContentOneSecond);

            var nameSectionTableContentNameField = new PdfPCell(new Phrase(string.Format("Name : {0}{1}{2}", trans.CustomerDetails.CustomerTitle, trans.CustomerDetails.CustomerFirstName, trans.CustomerDetails.CustomerLastName), FontFactory.GetFont("Arial", 12)));
            nameSectionTableContentNameField.HorizontalAlignment = 0;
            nameSectionTableContentNameField.BorderWidth = 0;
            nameSectionTableContentNameField.Colspan = 2;
            nameSectionTable.AddCell(nameSectionTableContentNameField);
                       
            // particaluars section
            PdfPTable fourthRow = new PdfPTable(4);
            float[] width = new float[] { 5f,2f, 2f, 4f };
            fourthRow.SetWidths(width);
            var c1 = new PdfPCell(new Phrase("Particulars", GetFont(12f)));
            var c2 = new PdfPCell(new Phrase("Qty.", GetFont(12f)));
            var c3 = new PdfPCell(new Phrase("Rate", GetFont(12f)));


            PdfPTable headings = new PdfPTable(2);
            var amountHeading = new PdfPCell(new Phrase("Amount", GetFont(12f)));
            amountHeading.Colspan = 2;
            amountHeading.HorizontalAlignment = 1;
            amountHeading.BorderWidth = 0;
            var rupeesHeading = new PdfPCell(new Phrase("Rs", GetFont(12f)));
            rupeesHeading.HorizontalAlignment = 0;
            rupeesHeading.BorderWidth = 0;

            var paiseHeading = new PdfPCell(new Phrase("Ps", GetFont(12f)));
            paiseHeading.HorizontalAlignment = 2;
            paiseHeading.BorderWidth = 0;

            headings.AddCell(amountHeading);
            headings.AddCell(rupeesHeading);
            headings.AddCell(paiseHeading);
            c1.HorizontalAlignment = 1;
            c2.HorizontalAlignment = 1;
            c3.HorizontalAlignment = 1;
            fourthRow.AddCell(c1);
            fourthRow.AddCell(c2);
            fourthRow.AddCell(c3);
            fourthRow.AddCell(headings);
            // end

            header.AddCell(headerContentOne);
            header.AddCell(nameSectionTable);
            PdfPTable fifthRow = new PdfPTable(4);
            fifthRow.SetWidths(width);
            document.Add(header);
            document.Add(fourthRow);
            FillValues(document, fifthRow, trans);

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
            document.Add(footer);

            document.Close();
        }

        private void FillValues(Document document, PdfPTable fifthRow, CustomerTransaction tran)
        {
            PdfPCell c1, c2, c3;
            PdfPTable amount;
            double totalAmount = 0;
            foreach (var item in tran.StockItems)
            {
                c1 = new PdfPCell(new Phrase(item.StockItemName, GetFont(12)));
                c2 = new PdfPCell(new Phrase(item.Quantity.ToString(), GetFont(12)));
                c3 = new PdfPCell(new Phrase(item.UnitPrice.ToString(), GetFont(12)));
                totalAmount += item.TotalAmount;
                amount = new PdfPTable(2);

                var rupeesHeading = new PdfPCell(new Phrase(FormatFee(item.TotalAmount)[0], GetFont(12f)));
                rupeesHeading.HorizontalAlignment = 0;
                rupeesHeading.BorderWidth = 0;

                var paiseHeading = new PdfPCell(new Phrase(FormatFee(item.TotalAmount)[1], GetFont(12f)));
                paiseHeading.HorizontalAlignment = 2;
                paiseHeading.BorderWidth = 0;
                c1.HorizontalAlignment = 0;
                c2.HorizontalAlignment = 1;
                c3.HorizontalAlignment = 1;
                amount.AddCell(rupeesHeading);
                amount.AddCell(paiseHeading);

                fifthRow.AddCell(c1);
                fifthRow.AddCell(c2);
                fifthRow.AddCell(c3);
                fifthRow.AddCell(amount);
            }

            AddColumn("Goods Total", totalAmount.ToDecimalPlaces(2), document, fifthRow);
            var vatAmount = (totalAmount * tran.Vat) / 100;
            AddColumn(string.Format("Vat Amount({0}%)", tran.Vat), vatAmount.ToDecimalPlaces(2), document, fifthRow);
            var discountAmount = ((totalAmount + vatAmount) * tran.Discount) / 100;
            AddColumn(string.Format("Discount Amount({0}%)", tran.Discount), discountAmount.ToDecimalPlaces(2), document, fifthRow);
            AddColumn("Total Amount", tran.TotalAmount.ToDecimalPlaces(2), document, fifthRow);
            AddColumn("Paid Amount", tran.PaidAmount.ToDecimalPlaces(2), document, fifthRow);
            AddColumn("Due Amount", tran.DueAmount.ToDecimalPlaces(2), document, fifthRow);
            document.Add(fifthRow);
        }

        private void AddColumn(string caption, double value, Document document, PdfPTable fifthRow)
        {
            var emptycell = new PdfPCell(new Phrase("", GetFont(12f)));
            var totalcell = new PdfPCell(new Phrase(caption, GetFont(12f)));
            totalcell.HorizontalAlignment = 2;

            totalcell.Colspan = 3;
            var amountrupee = new PdfPCell(new Phrase(FormatFee(value)[0], GetFont(12f)));
            var amountps = new PdfPCell(new Phrase(FormatFee(value)[1], GetFont(12f)));
            amountrupee.BorderWidth = 0;
            amountps.BorderWidth = 0;
            amountps.HorizontalAlignment = 2;
            var amount = new PdfPTable(2);
            amount.AddCell(amountrupee);
            amount.AddCell(amountps);
            fifthRow.AddCell(totalcell);
            fifthRow.AddCell(amount);            
        }

        private string[] FormatFee(double amount)
        {
            if (amount.ToString().Contains("."))
            {
                return amount.ToString().Split('.');
            }

            return new string[] { amount.ToString(), "00" };
        }

        private iTextSharp.text.Font GetFont(float size)
        {
            return FontFactory.GetFont("Arial", size);
        }
    }
}
