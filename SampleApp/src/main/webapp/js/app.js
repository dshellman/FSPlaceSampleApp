var		placeApp = angular.module( 'placeApp', [ 'ngRoute', 'placeControllers', 'PlaceAPIServices' ] );

/*
placeApp.config( [ '$routeProvider',
	function( $routeProvider ) {
		$routeProvider.
			when( '/home', {
				templateUrl: 'partials/SearchCriteria.html',
				controller: 'searchPlacesCtrl'
			}).
			otherwise( {
				redirectTo: '/home'
			});
	}
] );
*/