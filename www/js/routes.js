angular.module('starter.routes', ['ionic'])

.config(function($stateProvider, $urlRouterProvider){
	$stateProvider

	// setup an abstract state for the tabs directive
	.state('tab', {
		url: "/tab",
		abstract: true,
		templateUrl: "templates/tabs.html"
	})

	// Each tab has its own nav history stack:	

	.state('tab.menu', {
		url: '/menu',
		views: {
			'tab-menu': {
				templateUrl: 'templates/tab-menu.html',
				controller: 'MenuCtrl'
			}
		}
	})

	.state('tab.types', {
		url: '/types',
		views: {
			'tab-menu': {
				templateUrl: 'templates/tab-types.html',
				controller: 'TypesCtrl'
			}
		}
	})

	.state('tab.products', {
		url: '/products',
		views: {
			'tab-menu': {
				templateUrl: 'templates/tab-products.html',
				controller: 'ProductsCtrl',
				resolve: {
					products: function(API, $rootScope){
						if($rootScope.categoryId != null)
							$rootScope.products = API.getProductsByCategory($rootScope.categoryId);
					}
				}
			}
		}
	})

	.state('tab.order', {
		url: '/order',
		views: {
			'tab-order': {
				templateUrl: 'templates/tab-order.html',
				controller: 'OrdersCtrl',
				resolve: {
					hasOrder: function(API, $rootScope){
						$rootScope.orders = API.getOrders();
						if ($rootScope.orders.length > 0) {
							$rootScope.hasOrder = true;
							return false;
						}else{
							$rootScope.hasOrder = false;
							return false;
						}
					}
				}
			}
		}
	})

	.state('tab.history', {
		url: '/history',
		views: {
			'tab-history': {
				templateUrl: 'templates/tab-history.html',
				controller: 'HistoryCtrl',
				resolve: {
					Orders: function(API, $rootScope){
						API.initMyOrders();
						$rootScope.myOrders = API.getMyOrders();
						return false;				
					}
				}
			}
		}
	})

	.state('login', {
		url: "/login",
		templateUrl: "templates/login.html",
		controller: 'LoginCtrl'
	})

	.state('stays', {
		url: "/stays",
		templateUrl: "templates/stays.html",
		controller: 'StaysCtrl'
	})

	.state('menu', {
		url: "/menu",
		templateUrl: "templates/menu.html",
		controller: 'MenuCtrl'
	})

	.state('types', {
		url: "/types",
		templateUrl: "templates/types.html",
		controller: 'TypesCtrl'
	})

	.state('products', {
		url: "/products",
		templateUrl: "templates/products.html",
		controller: 'ProductsCtrl',
		resolve: {
			products: function(API, $rootScope){
				if($rootScope.categoryId != null)
					$rootScope.products = API.getProductsByCategory($rootScope.categoryId);
			}
		}
	})

	.state('history', {
		url: "/history",
		templateUrl: "templates/history.html",
		controller: 'HistoryCtrl',
		resolve: {
			Orders: function(API, $rootScope){
				API.initMyOrders();
				$rootScope.myOrders = API.getMyOrders();
				return false;				
			}
		}
	});

	$urlRouterProvider.otherwise('/login');

});