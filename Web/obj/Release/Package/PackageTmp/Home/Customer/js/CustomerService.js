var module = angular.module('ABS');

module.service('CustomerService', ['$http', '$rootScope', 'WarningMessageService', function (http, rootScope, warningMessageService) {
    return new CustomerServiceViewModel(http, rootScope, warningMessageService);
}]);

var CustomerServiceViewModel = (function () {
    var model = function (http, rootScope ,warningMessageService) {
        var self = this;
        self.ShowLoader = false;
        self.Customers = [];
        self.CustomerProfileTemplate = '';
        self.LoadCustomerList = function () {
            self.ShowLoader = true;
            http({
                url: '/api/Customer?filter=Customer',
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

        self.ShowCustomerProfile = function (customer) {
            rootScope.CurrentCustomerProfile = angular.copy(customer);
            self.CustomerProfileTemplate = '/Home/Customer/html/CustomerProfileTemplate.html';
        };

        self.CreateNewCustomer = function () {
            rootScope.CurrentTemplateView = "newcustomer";
            warningMessageService.OpenPopup({ template: '/Home/Customer/html/NewCustomerModalTemplate.html', controller: 'NewCustomerController', Callback: self.RefreshCustomerList });
        };

        self.RefreshCustomerList = function (data) {
            if (data.QueryData) {
                self.LoadCustomerList();
            }
        };

        self.EditCustomer = function (Customer) {
            rootScope.CurrentTemplateView = "updatecustomer";
            rootScope.customerToBeUpdated = angular.copy(Customer);
            warningMessageService.OpenPopup({ template: '/Home/Customer/html/UpdateCustomerModalTemplate.html', controller: 'UpdateCustomerController', Callback: self.RefreshCustomerList });
        };

        self.DeleteCustomer = function (dealer) {
            http({
                url: '/api/Customer?CustomerId=' + dealer.CustomerId,
                method: 'DELETE'
            })
           .success(function (data) {
               alert(data);
           })
           .error(function (error) {
               alert(error);
           });
        };
    };

    return model;
})();