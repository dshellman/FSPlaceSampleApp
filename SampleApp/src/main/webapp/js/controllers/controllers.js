var		placeControllers = angular.module( 'placeControllers', [] );

placeControllers.controller( 'searchPlacesCtrl', [ '$scope', '$log', 'placeAPIService', function( $scope, $log, placeAPIService ) {
	$scope.placeName = "";
	$scope.placeDate = "";
	$scope.placeJurisdiction = "";
	$scope.placeLocation = "";
	$scope.criteriaURL = "partials/SearchCriteria.html";
	$scope.results = {};
	$scope.placeTypes = [];
	$scope.selectedType = "";
	$scope.placeTypeGroups = [];
	$scope.selectedTypeGroup = "";

	function _allTypesHandler( data ) {
		$scope.placeTypes = data;
	};

	function _allTypeGroupsHandler( data ) {
		$scope.placeTypeGroups = data;
	};

	placeAPIService.registerAllTypesCallback( _allTypesHandler );
	placeAPIService.registerAllTypeGroupsCallback( _allTypeGroupsHandler );

	$scope.searchPlaces = function( theName, theDate, theJurisdiction, theLocation, theType, theGroup ) {
		var		params = {};

		params.name = theName;
		params.date = theDate;
		params.jurisdiction = theJurisdiction;
		params.location = theLocation;
		if ( theType ) {
			params.type = theType.id;
		}
		if ( theGroup ) {
			params.group = theGroup.id;
		}

		$scope.results = placeAPIService.search( params );
	};
}]);

placeControllers.controller( 'searchResultsCtrl', [ '$scope', '$log', 'placeAPIService', function( $scope, $log, placeAPIService ) {
	$scope.searchResults = [ { 'name': '' } ];
	$scope.resultsURL = "partials/SearchResults.html";

	function _searchResultsHandler( data ) {
		//Called when the search service performs a search for places.
		$scope.searchResults = [];
		$scope.searchResults = data;
//		angular.forEach( data.entries, function( value, key ) {
//			$scope.searchResults.push( { 'name': value.content.gedcomx.places[ 0 ].display.fullName,
//										 'type': value.content.gedcomx.places[ 0 ].display.type,
//										 'id': value.id,
//										 'latitude': value.content.gedcomx.places[ 0 ].latitude,
//										 'longitude': value.content.gedcomx.places[ 0 ].longitude,
//										 'date': value.content.gedcomx.places[ 0 ].temporalDescription.formal } );
//		} );
	}

	//Register a callback function so that when a search occurs,
	//this controller is notified by the search service.
	placeAPIService.registerSearchCallback( _searchResultsHandler );
}]);