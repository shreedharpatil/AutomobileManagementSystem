var module = angular.module('ABS');

module.service('SellStockService', ['$http', '$rootScope', 'WarningMessageService', 'CaptureImageService', function (http, rootScope, warningMessageService, captureImageService) {
    return new SellStockServiceViewModel(http, rootScope, warningMessageService, captureImageService);
}]);

var SellStockServiceViewModel = (function () {
    var model = function (http, rootScope, warningMessageService, captureImageService) {
        var self = this;
        self.Stock = {};
        self.Customers = [];
        self.ShowStockLoader = false;
        self.ShowLoader = false;
        self.IsGuestUser = false;
        self.Goods = [];
        self.CustomerTransaction = { TotalAmount: 0, DueAmount: 0, PaidAmount: 0, GrandTotalAmount: 0, Vat: 0, Discount: 0 };

        self.LoadCustomerList = function () {
            self.ShowLoader = true;
            http({
                url: '/api/Customer?filter=All',
                method: 'GET',
            })
            .success(function (data) {
                self.ShowLoader = false;
                self.Customers = data;
            })
            .error(function (error) {
                self.ShowLoader = false;
                alert(error);
            });
        };

        self.LoadStockList = function () {
            self.ShowStockLoader = true;
            http({
                url: '/api/Stock',
                method: 'GET',
            })
            .success(function (data) {
                self.Stocks = data;
                self.ShowStockLoader = false;
            })
            .error(function (error) {
                alert(error);
                self.ShowStockLoader = false;
            });
        };

        self.SaveTransaction = function () {
            self.ShowLoader = true;
            self.CustomerTransaction.StockItems = self.Goods;
            self.CustomerTransaction.CustomerDetails = self.Customer;
            self.CustomerTransaction.IsGuestUser = self.IsGuestUser;
            http({
                url: '/api/CustomerTransaction',
                method: 'POST',
                data : self.CustomerTransaction
            })
            .success(function (data) {
                self.ShowLoader = false;
                console.log(data);
                alert(data.Message);
                window.open(data.FileName);
                //var link = document.getElementById('pdfdownload');
                //link.href = data.FileName;
                // link.download = "Dossier_" + new Date() + ".pdf";
                // link.click();
                self.Clear();
                self.LoadStockList();
            })
            .error(function (error) {
                self.ShowLoader = false;
                alert(error);
                self.Clear();
            });
        };

        self.Toggle = function (stock) {
            if (stock.IsShown) {
                stock.IsShown = false;
            }
            else {
                stock.IsShown = true;
            }
        };

        self.LoadStockItemList = function (stock) {
            if (stock.IsCallMade == true) {
                self.Toggle(stock);
                return;
            }
            stock.StockItemLoader = true;
            stock.IsCallMade = true;
            stock.IsShown = true;
            http({
                url: '/api/StockItem?StockId=' + stock.StockId + '&StockStatus=active',
                method: 'GET',
            })
            .success(function (data) {
                stock.StockItems = data;
                stock.StockItemLoader = false;
            })
            .error(function (error) {
                alert(error);
                stock.StockItemLoader = false;
            });
        };
      
        self.AddGood = function (stock, stockitem) {
            if (stockitem.Quantity == 0)
            {
                alert('Sorry!! This stock item has zero quantities. Please update inventory.');
                return;
            }
            var good = _.where(self.Goods, { StockItemId: stockitem.StockItemId })[0];
            if (good) {
                alert('This item already added.')
                return;
            }
            var good = {
                StockId: stock.StockId,
                StockName: stock.StockName,
                StockItemId: stockitem.StockItemId,
                StockItemName: stockitem.StockItemName,
                AvailableQuantity: stockitem.Quantity,
                Quantity : 0,
                UnitPrice: stockitem.UnitPrice,
                TotalAmount : 0
            };
            self.Goods.push(good);
        };

        self.CalculateGoodTotalAmount = function (good) {
            if (good.Quantity > good.AvailableQuantity) {
                alert('Entered quantity is more than available quantity. Please correct.');
                good.Quantity = 0;
                good.TotalAmount = 0;
                self.CalculateTotalTransactionAmount();
                return;
            }

            var unitprice = isNaN(good.UnitPrice) ? 0 : parseFloat(good.UnitPrice);
            var quantity = isNaN(good.Quantity) ? 0 : parseFloat(good.Quantity);
            good.TotalAmount = unitprice.ToDecimalPlaces(2) * quantity;
            good.TotalAmount = good.TotalAmount.ToDecimalPlaces(2);
            self.RefreshCalculation();
        };

        self.RefreshCalculation = function () {
            self.CalculateTotalTransactionAmount();
            self.DeductVatAmount();
            self.DeductDiscountAmount();
            self.CalculateDueAmount();
        };

        self.CalculateTotalTransactionAmount = function () {
            self.CustomerTransaction.TotalAmount = 0;
            _.each(self.Goods, function (good) {
                self.CustomerTransaction.TotalAmount += isNaN(good.TotalAmount) ? 0 : parseFloat(good.TotalAmount).ToDecimalPlaces(2);
            });
            self.CustomerTransaction.TotalAmount = self.CustomerTransaction.TotalAmount.ToDecimalPlaces(2);
        };

        self.DeductVatAmount = function () {
            var totalAmount = isNaN(self.CustomerTransaction.TotalAmount) ? 0 : parseFloat(self.CustomerTransaction.TotalAmount);
            var vatPer = isNaN(self.CustomerTransaction.Vat) ? 0 : parseFloat(self.CustomerTransaction.Vat);
            var vatAmount = (totalAmount) * (vatPer / 100);
            self.CustomerTransaction.GrandTotalAmount = totalAmount.ToDecimalPlaces(2) + vatAmount.ToDecimalPlaces(2);
            self.CustomerTransaction.GrandTotalAmount = self.CustomerTransaction.GrandTotalAmount.ToDecimalPlaces(2);
        };

        self.CalculateDueAmount = function () {
            var grandTotal = isNaN(self.CustomerTransaction.GrandTotalAmount) ? 0 : parseFloat(self.CustomerTransaction.GrandTotalAmount);
            var paid = isNaN(self.CustomerTransaction.PaidAmount) ? 0 : parseFloat(self.CustomerTransaction.PaidAmount);

            if (paid > grandTotal) {
                self.CustomerTransaction.PaidAmount = 0;
                self.CustomerTransaction.DueAmount = 0;
            }
            else {
                self.CustomerTransaction.DueAmount = grandTotal.ToDecimalPlaces(2) - paid.ToDecimalPlaces(2);
                self.CustomerTransaction.DueAmount = self.CustomerTransaction.DueAmount.ToDecimalPlaces(2);
            }
        };

        self.DeductDiscountAmount = function () {
            var totalAmount = isNaN(self.CustomerTransaction.GrandTotalAmount) ? 0 : parseFloat(self.CustomerTransaction.GrandTotalAmount);
            var discountPer = isNaN(self.CustomerTransaction.Discount) ? 0 : parseFloat(self.CustomerTransaction.Discount);
            var discountAmount = (totalAmount) * (discountPer / 100);
            self.CustomerTransaction.GrandTotalAmount = totalAmount.ToDecimalPlaces(2) - discountAmount.ToDecimalPlaces(2);
            self.CustomerTransaction.GrandTotalAmount = self.CustomerTransaction.GrandTotalAmount.ToDecimalPlaces(2);
        };

        self.RemoveGood = function (good) {
            self.ShowLoader = true;
            var good = _.where(self.Goods, { StockItemId: good.StockItemId })[0];
            var index = self.Goods.indexOf(good);
            self.Goods.splice(index, 1);
            self.RefreshCalculation();
            self.ShowLoader = false;
        };

        self.SelectCustomer = function (customer) {
            self.IsGuestUser = false;
            self.Customer = angular.copy(customer);
            self.CustomerTransaction.CustomerId = customer.CustomerId;
            self.Customer.IsGuestUser = self.IsGuestUser;
        };

        self.Clear = function () {
            self.CustomerTransaction = {TotalAmount : 0, DueAmount : 0 ,PaidAmount :0, GrandTotalAmount :0, Vat :0, Discount : 0};
            self.Goods = [];
            self.IsGuestUser = false;
            self.Customer = {Id : ''};
            $('#customerdropdown').html('Filter Customers');
            $('#customerphoto').attr('src', '');
        };

        self.OpenGuestUserDialog = function () {
            warningMessageService.OpenPopup({
                template: '/Home/SellStock/html/NewGuestModalTemplate.html', controller: 'NewGuestController', Callback: function (data) {
                    self.IsGuestUser = data.IsGuestUser;
                    if (data.IsGuestUser) {
                        self.Customer = angular.copy(data.Customer);
                        self.Customer.IsGuestUser = self.IsGuestUser;
                        self.CustomerTransaction.CustomerId = '';
                        $('#customerdropdown').html('Filter Customers');
                        $('#customerphoto').attr('src', '');
                    }
                }
            });
        };
    };

    return model;
})();