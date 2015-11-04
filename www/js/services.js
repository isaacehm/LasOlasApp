angular.module('starter.services', ['ionic'])

.factory('API', function($http) {

    var employee = null;
    var categories = [];
    var subcategories = [];
    var products = [];

    return{
        login: function(username, password){
            var req = {
                    method: 'POST',
                    url: 'http://localhost:3000/api/user', 
                    headers: { 
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    transformRequest: function(obj) {
                        var str = [];
                        for(var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data:{
                        username: username,
                        password: password
                    }
                };

            return $http(req).then(function(data) {
                employee = data.data.name;
                return employee;
              
            }, function(data) {
                console.log(data.status+": "+data.data.msg);
                return false;
            });
        },

        initCategories: function(){
            var req = {
                    method: 'GET',
                    url: 'http://localhost:3000/api/categories', 
                    headers: { 
                      'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                return $http(req).then(function(data) {
                    categories = data.data;
                  
                }, function(data) {
                    console.log(data.status+": "+data.data.msg);
                });
        },

        getCategories: function(){
            return categories;
        },

        initSubcategories: function(){
            var req = {
                    method: 'GET',
                    url: 'http://localhost:3000/api/subcategories', 
                    headers: { 
                      'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                return $http(req).then(function(data) {
                    subcategories = data.data;
                  
                }, function(data) {
                    console.log(data.status+": "+data.data.msg);
                });
        },

        getSubcategoriesByCategoryId: function(categoryId){
            var subcategoriesByCategoryId = [];
            for (var i=0; i<subcategories.length; i++)
                if (subcategories[i].categoryId == categoryId)
                    subcategoriesByCategoryId.push(subcategories[i]);

            return subcategoriesByCategoryId;
        },

        initProducts: function(){
            var req = {
                    method: 'GET',
                    url: 'http://localhost:3000/api/products', 
                    headers: { 
                      'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                return $http(req).then(function(data) {
                    products = data.data;
                  
                }, function(data) {
                    console.log(data.status+": "+data.data.msg);
                });
        },

        getProductsBySubcategory: function(subcategoryId){
            var productsBySubcategory = [];

            for (var i=0; i<products.length; i++)
                if (products[i].subcategoryId == subcategoryId)
                    productsBySubcategory.push(products[i]);

            return productsBySubcategory;


        },

        getProductsByCategory: function(categoryId){
            var productsByCategory = [];

            for (var i=0; i<products.length; i++)
                if (products[i].categoryId == categoryId)
                    productsByCategory.push(products[i]);

            return productsByCategory;

        }

    }
});