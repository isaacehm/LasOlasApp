angular.module('starter.controllers', ['ionic'])

.controller('InitCtrl', function($scope, $state, $rootScope){

	//$state.go('login');
	$rootScope.hasOrder = false;

})


.controller('LoginCtrl', function($scope, $ionicPopup, $state, API, $rootScope) {
    $scope.data = {};
    $scope.login = function(){
    	API.login($scope.data.username, $scope.data.password).then(function(data){
    		if(data){
    			$rootScope.employee = data;
    			API.initStays().then(function(){
	    			API.initCategories().then(function(){
	    				API.initSubcategories().then(function(){
	    					API.initProducts().then(function(){
	    						$state.go('stays');
	    						//$state.go('tab.stays');
	    					});    					
	    				});    				
	    			});
    			})    			
    		}else{
    			$state.go('login');
    			var alertPopup = $ionicPopup.alert({
	                title: 'Inicio de sesión fallido.',
	                template: 'Por favor, intente nuevamente.'
	            });
    		}
    	});
    }
})

.controller('StaysCtrl', function($scope, $ionicPopup, $state, API, $rootScope) {

	API.initUniqueStays();

	$scope.stays = API.getUniqueStays();

	$scope.selectStayNumber = function(name){
		$rootScope.stay = name;

		$scope.data = {};

		if (name == "Sombrilla"){
			var temp = '<input type="number" min="1" max="300" ng-model="data.stayNumber">';
		}else if(name == "Carpa" || name == "Mesa"){
			var temp = '<input type="number" min="1" max="50" ng-model="data.stayNumber">';
		}


		// An elaborate, custom popup
	   var stayNumber = $ionicPopup.show({
	     template: temp,
	     title: 'Numero de '+name,
	     subTitle: 'Por favor, ingrese el numero de la '+name,
	     scope: $scope,
	     buttons: [
	       { text: 'Cancelar' },
	       {
	         text: '<b>Continuar</b>',
	         type: 'button-positive',
	         onTap: function(e) {
	           if (!$scope.data.stayNumber) {
	             //don't allow the user to close unless he enters stay number
	             e.preventDefault();
	           } else {
	             return $scope.data.stayNumber;
	           }
	         }
	       },
	     ]
	   });

		stayNumber.then(function(res) {
			if(res != undefined){
				$rootScope.stayNumber = res;
				$state.go('tab.menu');
			}
		});

	}

})


.controller('TypesCtrl', function($scope, $ionicPopup, $state, API, $rootScope) {
	$scope.BackToMain = function(){		
		$state.go('main');
	};

	$scope.selectProducts = function(subcategoryId, name){

		$rootScope.products = API.getProductsBySubcategory(subcategoryId);
		$rootScope.subcategory = name;

		$state.go('tab.products');
	};

	$scope.selectProductsOut = function(subcategoryId, name){

		$rootScope.products = API.getProductsBySubcategory(subcategoryId);
		$rootScope.subcategory = name;

		$state.go('products');
	};

})

.controller('ProductsCtrl', function($scope, $ionicPopup, $state, API, $rootScope) {

	$scope.addOrder = function(product){
		product.order++;
		product.total += parseFloat(product.price);
	}

	$scope.removeOrder = function(product){
		if(product.order > 0){
			product.order--;
			product.total -= parseFloat(product.price);
		}
	}

	$scope.BackToMain = function(){
		if($rootScope.categoryId != null){
			$state.go('main');
		}else{
			$state.go('types');
		}
	};

	/*
	* if given group is the selected group, deselect it
	* else, select the given group
	*/
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
		  $scope.shownGroup = null;
		} else {
		  $scope.shownGroup = group;
		}
	};
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};

})

.controller('OrdersCtrl', function($scope, $ionicPopup, $state, API, $rootScope, $timeout) {

	var total = 0;
	if ($rootScope.orders != undefined)
		for (var i = 0; i<$rootScope.orders.length; i++)
			total += parseFloat($rootScope.orders[i].total);
	//$rootScope.total = total.toString();
	$rootScope.total = total;

	$scope.sendOrder = function(){

		API.sendOrder($rootScope.employee, $rootScope.stay, $rootScope.stayNumber, $rootScope.orders).then(function(data){
			if (data) {
				API.initProducts();
				$rootScope.products = undefined;
				$rootScope.subcategory = undefined;
				$rootScope.category = undefined;
				$rootScope.categoryId = undefined;
				$rootScope.stay = undefined;
				$rootScope.stayNumber = undefined;
				$rootScope.orders = undefined;
				$state.go('stays');
				var alertPopup = $ionicPopup.alert({
	                title: 'Pedido enviado.',
	                template: 'El pedido ha sido enviado exitosamente. ¡Gracias!'
	            });
				$timeout(function() {
					alertPopup.close(); //close the popup after 3 seconds for some reason
				}, 3000);

			}else{
				var alertPopup = $ionicPopup.alert({
	                title: 'Ocurrio un problema.',
	                template: 'Lo sentimos, no pudimos procesar el pedido. Por favor, reintente en unos segundos o consulte al administrador.'
	            });
			}
		});
		
	};

	$scope.removeOrder = function(){

		// A confirm dialog
		var confirmPopup = $ionicPopup.confirm({
			title: 'Borrar pedido',
			template: '¿Desea borrar completamente el pedido actual?',
			cancelText: 'No',
			okText: 'Sí'
		});
		confirmPopup.then(function(res) {
			if(res) {
				API.initProducts();
				$rootScope.products = undefined;
				$rootScope.subcategory = undefined;
				$rootScope.category = undefined;
				$rootScope.categoryId = undefined;
				$rootScope.stay = undefined;
				$rootScope.stayNumber = undefined;
				$rootScope.orders = undefined;
				$state.go('stays');
			}
		});		
	}

	$scope.removeProduct = function(product){

				$rootScope.total -= product.total;
				if($rootScope.total == 0)
					$rootScope.hasOrder = false;

				product.order = 0;
				product.total = 0;

	}

})

.controller('MenuCtrl', function($scope, $ionicPopup, $state, API, $rootScope) {

	$scope.categories = API.getCategories();

	$scope.selectType = function(categoryId, name){

		$rootScope.subcategories = API.getSubcategoriesByCategoryId(categoryId);
		$rootScope.category = name;
		$rootScope.subcategory = undefined;

		if ($rootScope.subcategories.length > 0) {
			$rootScope.categoryId = null;
			$state.go('tab.types');
		}else{
			$rootScope.categoryId = categoryId;
			$state.go('tab.products');
		}
	};

	$scope.BackToStays = function(){
		$state.go('stays');
	}

	$scope.goToMenu = function(){
		$state.go('menu');
	}

	$scope.selectTypeOut = function(categoryId, name){

		$rootScope.subcategories = API.getSubcategoriesByCategoryId(categoryId);
		$rootScope.category = name;
		$rootScope.subcategory = undefined;

		if ($rootScope.subcategories.length > 0) {
			$rootScope.categoryId = null;
			$state.go('types');
		}else{
			$rootScope.categoryId = categoryId;
			$state.go('products');
		}
	};


})

.controller('HistoryCtrl', function($scope, $ionicPopup, $state, API, $rootScope) {

	$scope.goToHistory = function(){
		$state.go('history');
	}

	/*
	* if given group is the selected group, deselect it
	* else, select the given group
	*/
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
		  $scope.shownGroup = null;
		} else {
		  $scope.shownGroup = group;
		}
	};
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};

	$scope.isPending = function(status) {
		return status === 'Pending';
	};

})