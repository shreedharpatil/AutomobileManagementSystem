var module = angular.module('ABS');

module.service('BuyStockService', ['$http', '$rootScope', 'WarningMessageService', 'CaptureImageService', function (http, rootScope, warningMessageService, captureImageService) {
    return new BuyStockServiceViewModel(http, rootScope, warningMessageService, captureImageService);
}]);

var BuyStockServiceViewModel = (function () {
    var model = function (http, rootScope, warningMessageService, captureImageService) {
        var self = this;
        self.Stock = {};
        self.Dealer = {Id : ''};
        self.Dealers = [];
        self.ShowStockLoader = false;
        self.ShowLoader = false;
        self.Goods = [];
        self.DealerTransaction = { TotalAmount: 0, PaidAmount:0,DueAmount:0,InvoiceNumber : '' };
        
        self.LoadDealerList = function () {
            self.ShowLoader = true;
            http({
                url: '/api/Dealer',
                method: 'GET',
            })
            .success(function (data) {
                self.ShowLoader = false;
                self.Dealers = data;
            })
            .error(function (error) {
                self.ShowLoader = false;
                alert(error);
            });
        };

        self.LoadStockList = function () {
            self.ShowStockLoader = true;
            http({
                url: '/api/Stock?StockStatus=active',
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
            self.DealerTransaction.StockItems = self.Goods;
            http({
                url: '/api/DealerTransaction',
                method: 'POST',
                data : self.DealerTransaction
            })
            .success(function (data) {
                self.UploadPhoto(data);
                // alert(data);
            })
            .error(function (error) {
                self.ShowLoader = false;
                alert(error);
            });
        };

        self.Toggle = function (stock) {
            if (stock.IsShown) {
                stock.IsShown = false;
            }
            else {
                stock.IsShown = true;
            }

            self.apply();
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

        var dataURItoBlob = function (dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString = atob(dataURI.split(',')[1]);
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            var bb = new Blob([ab], { "type": mimeString });
            return bb;
        }

        self.UploadPhoto = function (data) {
            // var data = {FileName : 'invoice.jpg'};
            var self = this;
            var formData = new FormData();
            formData.append('CustomerPhoto', dataURItoBlob(captureImageService.Image), data.FileName);
            http.post('/api/UploadPhoto', formData, {
                headers: {
                    'Content-Type': undefined,
                    'foldername': 'Invoice'
                },

                transformRequest: angular.identity
            }).success(function (result) {
                self.ShowLoader = false;
                alert("Stock buying completed successfully");
                captureImageService.Image = null;
                self.Image = null;
                self.Clear();
            }).error(function (error) {
                self.ShowLoader = false;
                captureImageService.Image = null;
                self.Image = null;
                self.Clear();                
            });
        };

        self.AddGood = function (stock, stockitem) {
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
                Quantity: 0,
                UnitPrice: stockitem.UnitPrice,
                TotalAmount : 0
            };
            self.Goods.push(good);
        };

        self.RefreshCalculation = function() {
            self.CalculateTotalTransactionAmount();
            self.DeductVatAmount();
            self.DeductDiscountAmount();
            self.CalculateDueAmount();
        };

        self.CalculateGoodTotalAmount = function (good) {
            var unitprice = isNaN(good.UnitPrice) ? 0 : parseFloat(good.UnitPrice);
            var quantity = isNaN(good.Quantity) ? 0 : parseFloat(good.Quantity);
            good.TotalAmount = unitprice.ToDecimalPlaces(2) * quantity;
            self.RefreshCalculation();
        };

        self.CalculateTotalTransactionAmount = function () {
            self.DealerTransaction.TotalAmount = 0;
            _.each(self.Goods, function (good) {
                self.DealerTransaction.TotalAmount += isNaN(good.TotalAmount) ? 0 : parseFloat(good.TotalAmount).ToDecimalPlaces(2);
            });
            self.DealerTransaction.TotalAmount = self.DealerTransaction.TotalAmount.ToDecimalPlaces(2);
        };
                
        self.DeductPaidAmount = function () {
            var paid = isNaN(self.DealerTransaction.PaidAmount) ? 0 : parseFloat(self.DealerTransaction.PaidAmount);
            var total = isNaN(self.DealerTransaction.GrandTotalAmount) ? 0 : parseFloat(self.DealerTransaction.GrandTotalAmount);
            self.DealerTransaction.DueAmount = total.ToDecimalPlaces(2) - paid.ToDecimalPlaces(2);
            self.DealerTransaction.DueAmount = self.DealerTransaction.DueAmount.ToDecimalPlaces(2);
        };

        self.DeductVatAmount = function () {
            var totalAmount = isNaN(self.DealerTransaction.TotalAmount) ? 0 : parseFloat(self.DealerTransaction.TotalAmount);
            var vatPer = isNaN(self.DealerTransaction.Vat) ? 0 : parseFloat(self.DealerTransaction.Vat);
            var vatAmount = (totalAmount) * (vatPer / 100);
            self.DealerTransaction.GrandTotalAmount = totalAmount.ToDecimalPlaces(2) + vatAmount.ToDecimalPlaces(2);
            self.DealerTransaction.GrandTotalAmount = self.DealerTransaction.GrandTotalAmount.ToDecimalPlaces(2);
        };

        self.DeductDiscountAmount = function () {
            var totalAmount = isNaN(self.DealerTransaction.GrandTotalAmount) ? 0 : parseFloat(self.DealerTransaction.GrandTotalAmount);
            var discountPer = isNaN(self.DealerTransaction.Discount) ? 0 : parseFloat(self.DealerTransaction.Discount);
            var discountAmount = (totalAmount) * (discountPer / 100);
            self.DealerTransaction.GrandTotalAmount = totalAmount.ToDecimalPlaces(2) - discountAmount.ToDecimalPlaces(2);
            self.DealerTransaction.GrandTotalAmount = self.DealerTransaction.GrandTotalAmount.ToDecimalPlaces(2);
        };

        self.CalculateDueAmount = function () {
            var grandTotal = isNaN(self.DealerTransaction.GrandTotalAmount) ? 0 : parseFloat(self.DealerTransaction.GrandTotalAmount);
            var paid = isNaN(self.DealerTransaction.PaidAmount) ? 0 : parseFloat(self.DealerTransaction.PaidAmount);
            
            if (paid > grandTotal) {
                self.DealerTransaction.PaidAmount = 0;
                self.DealerTransaction.DueAmount = 0;
            }
            else {
                self.DealerTransaction.DueAmount = grandTotal.ToDecimalPlaces(2) - paid.ToDecimalPlaces(2);
                self.DealerTransaction.DueAmount = self.DealerTransaction.DueAmount.ToDecimalPlaces(2);
            }
        };

        self.RemoveGood = function (good) {
            self.ShowLoader = true;
            var good = _.where(self.Goods, { StockItemId: good.StockItemId })[0];
            var index = self.Goods.indexOf(good);
            self.Goods.splice(index, 1);
            self.RefreshCalculation();
            self.ShowLoader = false;
        };

        self.SelectDealer = function (dealer) {
            self.Dealer = dealer;
            self.DealerTransaction.DealerId = dealer.Id;
        };

        self.CaptureInvoice = function () {
            warningMessageService.OpenPopup({ template: '/Home/BuyStock/html/CaptureImageModalTemplate.html', controller: 'CaptureImageController', Callback: self.DrawImage });
        };

        self.DrawImage = function () {
            self.Image = captureImageService.Image;
        };


        self.Clear = function () {
            self.DealerTransaction = { TotalAmount: 0, PaidAmount: 0, DueAmount: 0, InvoiceNumber: '' };
            self.Goods = [];
            self.Image = null;
            self.Dealer = {Id : ''};
            $('#dealerdropdown').html('Filter Dealers');
            $('#invoicecopy').attr('src', '');
        };        
    };

    return model;
})();