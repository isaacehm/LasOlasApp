angular.module('starter.services', ['ionic'])

.factory('API', function($http) {

    var employee = null;
    var categories = [];
    var subcategories = [];
    var products = [];
    var stays = [];
    var uniqueStays = [];
    var myOrders = [];
    var date = new Date();
    var currentDate = date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getYear();

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

        initStays: function(){
            var req = {
                    method: 'GET',
                    url: 'http://localhost:3000/api/stays', 
                    headers: { 
                      'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                return $http(req).then(function(data) {
                    stays = data.data;
                  
                }, function(data) {
                    console.log(data.status+": "+data.data.msg);
                });
        },

        getStaysByName: function(name){
            var staysByName = [];
            for(var i=0; i<stays.length; i++)
                if(stays[i].name == name)
                    staysByName.push(stays[i]);

            return staysByName;
        },

        initUniqueStays: function(){
            var req = {
                    method: 'GET',
                    url: 'http://localhost:3000/api/stay', 
                    headers: { 
                      'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                return $http(req).then(function(data) {
                    for(var i=0; i<data.data.length; i++)
                        uniqueStays.push({"name":data.data[i]});
                  
                }, function(data) {
                    console.log(data.status+": "+data.data.msg);
                });

        },

        getUniqueStays: function(){
            return uniqueStays;

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
            products = [];
            var req = {
                    method: 'GET',
                    url: 'http://localhost:3000/api/products', 
                    headers: { 
                      'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                return $http(req).then(function(data) {
                    for(var i=0; i<data.data.length; i++)
                        products.push({
                            "name" : data.data[i].name,
                            "stock" : data.data[i].stock,
                            "price" : data.data[i].price,
                            "categoryId" : data.data[i].categoryId,
                            "subcategoryId" : data.data[i].subcategoryId,
                            "size" : data.data[i].size,
                            "volume" : data.data[i].volume,
                            "order" : 0,
                            "total" : 0,
                            "note" : ""
                        });
                  
                }, function(data) {
                    console.log(data.status+": "+data.data.msg);
                });
        },

        getProducts: function(){
            return products;
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

        },

        getProductById: function(id){            
            for (var i=0; i<products.length; i++)
                if (products[i]._id == id)
                    return products[i];
        },

        initMyOrders: function(){
            myOrders = [];
            var req = {
                    method: 'GET',
                    url: 'http://localhost:3000/api/orders/'+employee+'/'+currentDate, 
                    headers: { 
                      'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                return $http(req).then(function(data) {
                    for(var i=0; i<data.data.length; i++){
                        //var myDate = data.data[i].date.getDate()+'-'+(data.data[i].date.getMonth()+1)+'-'+data.data[i].date.getYear();
                        myOrders.push({
                            "employee" : data.data[i].employee,
                            "stay" : data.data[i].stay,
                            "stayNumber" : data.data[i].stayNumber,
                            "date" : data.data[i].date,
                            "products" : data.data[i].products,
                            "total" : data.data[i].total,
                            "status" : data.data[i].status,
                            "note" : data.data[i].note
                        });
                    }

                    //console.log(history);
                  
                }, function(data) {
                    console.log(data.status+": "+data.data.msg);
                });
        },

        getMyOrders: function(){
            return myOrders;
        },

        getOrders: function(){
            var orders = [];
            for( var i = 0; i < products.length; i++ )
                if( products[i].order > 0 )
                    orders.push(products[i]);

            return orders;
        },

        sendOrder: function(employee, stay, stayNumber, products){

            var order = "";
            var total = 0;
            for (var i = 0; i < products.length; i++){
                total += parseFloat(products[i].total);
                order += JSON.stringify(products[i])+";";         
            }

            total = total.toString();

            var req = {
                    method: 'POST',
                    url: 'http://localhost:3000/api/orders', 
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
                        employee: employee,
                        stay: stay,
                        stayNumber: stayNumber,
                        products: order,
                        total: total
                    }
                };

                return $http(req).then(function(data) {
                    products = [];
                    return true;
              
                }, function(data) {
                    console.log(data.status+": "+data.data.msg);
                    return false;
                });
            
        }

    }
});