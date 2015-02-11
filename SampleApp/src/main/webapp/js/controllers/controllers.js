var		placeControllers = angular.module( 'placeControllers', [] );

placeControllers.controller( 'searchPlacesCtrl', [ '$scope', '$log', 'placeAPIService', function( $scope, $log, placeAPIService ) {
	$scope.placeName = "";
	$scope.placeDate = "";
	$scope.placeJurisdiction = "";
	$scope.placeLat = "";
    $scope.placeLong = "";
	$scope.criteriaURL = "partials/SearchCriteria.html";
	$scope.results = {};
	$scope.placeTypes = [];
	$scope.selectedType = "";
	$scope.placeTypeGroups = [];
	$scope.selectedTypeGroup = "";
    $scope.searchResults = [ {id:' '} ];
    $scope.predicate = '-relScore';
    $scope.resultsURL = "partials/SearchResults.html";
    $scope.map = { center: { latitude: 51.219053, longitude: 4.404418 }, zoom: 5 };

	function _allTypesHandler( data ) {
		$scope.placeTypes = data;
	};

	function _allTypeGroupsHandler( data ) {
		$scope.placeTypeGroups = data;
	};

	placeAPIService.registerAllTypesCallback( _allTypesHandler );
	placeAPIService.registerAllTypeGroupsCallback( _allTypeGroupsHandler );

	$scope.searchPlaces = function() {
		var		params = {};

		params.name = this.placeName;
		params.date = this.placeDate;
		params.jurisdiction = this.placeJurisdiction;
		params.latitude = this.placeLat;
        params.longitude = this.placeLong;
		if (this.selectedType) {
			params.type = this.selectedType.id;
		}
		if (this.selectedTypeGroup) {
			params.group = this.selectedTypeGroup.id;
		}

		$scope.results = placeAPIService.search( params );
        $scope.searchRequest = placeAPIService.getLastRequest();
    };

	function _searchResultsHandler( data ) {
		//Called when the search service performs a search for places.
		$scope.searchResults = [];
		$scope.searchResults = data;
    };

    //Register a callback function so that when a search occurs,
    //this controller is notified by the search service.
    placeAPIService.registerSearchCallback( _searchResultsHandler );
}]);

placeControllers.controller( 'tabController', [ '$scope', '$log', function( $scope, $log) {
     $scope.tabs = [{
         title: 'Search', url: 'search.tpl.html'
        },{
         title: 'Map', url: 'map.tpl.html'
     }];

     $scope.currentTab = 'search.tpl.html';

     $scope.onClickTab = function (tab) {
         $scope.currentTab = tab.url;
     };

     $scope.isActiveTab = function(tabUrl) {
         return tabUrl == $scope.currentTab;
     };
}]);