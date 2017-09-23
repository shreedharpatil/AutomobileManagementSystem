var module = angular.module('ABS');

module.service('ReportsService', ['$http', '$rootScope', function (http, rootScope) {
    return new ReportsServiceViewModel(http, rootScope);
}]);

var ReportsServiceViewModel = (function () {
    var model = function (http, rootScope) {
        var self = this;
        self.ReportViewTemplate = '/Home/Reports/html/DealerListTemplate.html';
        self.ReportDetailsViewTemplate = '/Home/Reports/html/DealerReportsTemplate.html';

        self.Report = { FromDate : new Date(),ToDate : new Date(), Type : 'Dealer'};
        self.Reports = [];
        self.Transactions = [];
        self.ShowStockLoader = false;
        self.ShowLoader = false;
        self.Goods = [];
        self.CustomerReportPdfFilter = 'All';
        self.CustomerReportFilter = 'All';
        self.CustomerTransaction = { TotalAmount: 0, DueAmount: 0, PaidAmount: 0, GrandTotalAmount: 0, Vat: 0, Discount: 0 };
        self.ReportSummary = { NumberOfTransactions : 0, TotalAmount : 0, PaidAmount : 0, DueAmount:0 };

        self.LoadTransaction = function (report,prop) {
            self.ShowLoader = true
            _.each(self.Reports, function (rep) {
                if (rep.Details[prop] == report.Details[prop]) {
                    rep.Details.IsActive = true;
                }
                else {
                    rep.Details.IsActive = false;
                }
            });
            self.Transactions = report.Transactions;
            self.ShowLoader = false;
        };

        self.Toggle = function (trans, view) {
            trans.CurrentView = view;
        };
        self.Generate = function () {
            http({
                method: 'POST',
                url: '/api/ReportGeneration',
                data: self.Reports
            }).success(function (data) {
                alert(data);
            });
        };

        self.LoadReports = function () {
            self.Transactions = [];
            if (self.Report.Type == 'Dealer') {
                self.ReportViewTemplate = '/Home/Reports/html/DealerListTemplate.html';
                self.ReportDetailsViewTemplate = '/Home/Reports/html/DealerReportsTemplate.html';
            }
            else {
                self.ReportViewTemplate = '/Home/Reports/html/CustomerListTemplate.html';
                self.ReportDetailsViewTemplate = '/Home/Reports/html/CustomerReportsTemplate.html';
            }

            self.ShowLoader = true;
            http({
                url: '/api/Report?FromDate=' + self.Report.FromDate.toDateString() + '&ToDate=' + self.Report.ToDate.toDateString() + '&Type=' + self.Report.Type,
                method: 'GET',
            })
            .success(function (data) {
                self.ShowLoader = false;
                self.ReportSummary = { NumberOfTransactions: 0, TotalAmount: 0, PaidAmount: 0, DueAmount: 0 };
                self.Reports = data;
                self.ReportsBackup = angular.copy(data);
                var trans = _.flatten(_.pluck(self.Reports, 'Transactions'));
                self.ReportSummary.NumberOfTransactions = trans.length;
                _.each(trans, function (trans) {
                    self.ReportSummary.TotalAmount += trans.TotalAmount;
                    self.ReportSummary.PaidAmount += trans.PaidAmount;
                    self.ReportSummary.DueAmount += trans.DueAmount;
                });
            })
            .error(function (error) {
                self.Reports = [];
                self.ReportSummary = { NumberOfTransactions: 0, TotalAmount: 0, PaidAmount: 0, DueAmount: 0 };
                self.ShowLoader = false;
                alert(error);
            });
        };

        self.FilterCustomerReports = function () {
            if (self.CustomerReportFilter == 'All') {
                self.Reports = self.ReportsBackup;                
            }
            else if (self.CustomerReportFilter == 'Customer') {
                self.Reports = _.filter(self.ReportsBackup, function (report) {
                    if (!report.Details.IsGuestUser) {
                        return report;
                    }
                });
            }
            else {
                self.Reports = _.filter(self.ReportsBackup, function (report) {
                    if (report.Details.IsGuestUser) {
                        return report;
                    }
                });
            }
            self.Transactions = [];
        };
    };

    return model;
})();