angular.module('starter.controllers', ['ionic'])

.controller('InitCtrl', function($scope, $state){

	//$state.go('login');

})


.controller('LoginCtrl', function($scope, $ionicPopup, $state, API) {
    $scope.data = {};

    $scope.login = function(){
    	API.login($scope.data.username, $scope.data.password).then(function(data){
    		if(data){
    			API.initCategories().then(function(){
    				API.initSubcategories().then(function(){
    					API.initProducts().then(function(){
    						$state.go('main');
    					});    					
    				});    				
    			});    			
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

.controller('MainCtrl', function($scope, $ionicPopup, $state, API, $rootScope) {

	$scope.categories = API.getCategories();

	$scope.selectType = function(categoryId){

		$rootScope.subcategories = API.getSubcategoriesByCategoryId(categoryId);

		if ($rootScope.subcategories.length > 0) {
			$rootScope.categoryId = null;
			$state.go('types');
		}else{
			$rootScope.categoryId = categoryId;
			$state.go('products');
		}
	};
})

.controller('TypesCtrl', function($scope, $ionicPopup, $state, API, $rootScope) {
	$scope.BackToMain = function(){		
		$state.go('main');
	};

	$scope.selectProducts = function(subcategoryId){

		$rootScope.products = API.getProductsBySubcategory(subcategoryId);
		$state.go('products');

	};

})

.controller('ProductsCtrl', function($scope, $ionicPopup, $state, API, $rootScope) {

	if($rootScope.categoryId != null)
		$scope.products = API.getProductsByCategory($rootScope.categoryId);

	$scope.BackToMain = function(){
		if($rootScope.categoryId != null){
			$state.go('main');
		}else{
			$state.go('types');
		}
	};
})
