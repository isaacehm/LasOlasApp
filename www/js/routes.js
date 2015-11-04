angular.module('starter.routes', ['ionic'])

.config(function($stateProvider, $urlRouterProvider){
	$stateProvider

	.state('login', {
		url: "/login",
		templateUrl: "templates/login.html",
		controller: 'LoginCtrl'
	})


	.state('main', {
		url: "/main",
		templateUrl: "templates/main.html",
		controller: 'MainCtrl'
	})

	.state('types', {
		url: "/types",
		templateUrl: "templates/types.html",
		controller: 'TypesCtrl'
	})

	.state('products', {
		url: "/products",
		templateUrl: "templates/products.html",
		controller: 'ProductsCtrl'
	});

	$urlRouterProvider.otherwise('/login');

});