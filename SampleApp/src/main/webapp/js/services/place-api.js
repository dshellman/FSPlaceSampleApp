var		placeAPI = angular.module( 'PlaceAPIServices', [] );

placeAPI.service( 'placeAPIService', [ '$http', '$log', function( $http, $log ) {
	var		urls = {};
	var		lastResults;
	var		allTypes = null;
	var		allTypeGroups = null;
	var		searchCallback;
	var		allTypesCallback;
	var		allTypeGroupsCallback;
	var		me = this;

	//Login:  retrieves access token and ws endpoints
	function _login( callbackOnSuccess ) {
		$http.get( 'settings.jsp' ).success( function( data ) {
			me.urls = data;
			$log.info( "Successful login." );
			if ( callbackOnSuccess ) {
				callbackOnSuccess();
			}
		} );
	}

	//TransformSearchData:  Converts search results into a simpler model
	function _transformSearchData( data ) {
		var		newData = [];
		var		row = {};

		if ( !data ) {
			return newData;
		}

		angular.forEach( data.entries, function( value, key ) {
			var		tempDate, parsedDate;

			//Parse the date.
			parsedDate = "";
			tempDate = null;
			if ( value.content.gedcomx.places[ 0 ].temporalDescription ) {
				tempDate = value.content.gedcomx.places[ 0 ].temporalDescription.formal;
			}
			if ( tempDate && tempDate.length > 0 ) {
				var	parts;

				parts = tempDate.split( "/" );
				if ( parts.length == 2 ) {
					//The easy case
					if ( parts[ 0 ].length == 0 ) {
						parsedDate += "UNKNOWN - ";
					}
					else {
						parsedDate += ( parts[ 0 ].replace( /\+|-/, "" ) + " - " );
					}
					if ( parts[ 1 ].length == 0 ) {
						parsedDate += "PRESENT";
					}
					else {
						parsedDate += parts[ 1 ].replace( /\+|-/, "" );
					}
				}
				else if ( parts.length == 1 ) {
					parsedDate = tempDate.replace( /\+|-/, "" );
				}
				else {
					$log.info( "Couldn't parsed date: " + tempDate );
				}
			}
			row = {};
			row.id = value.id;
			row.name = value.content.gedcomx.places[ 0 ].display.fullName;
			row.type = value.content.gedcomx.places[ 0 ].display.type;
			row.latitude = value.content.gedcomx.places[ 0 ].latitude;
			row.longitude = value.content.gedcomx.places[ 0 ].longitude;
			row.date = parsedDate;
			newData.push( row );
		} );

		return newData;
	}

	//TransformAllTypeGroups:  Converts type groups into a usable model
	function _transformAllTypeGroups( groups ) {
		var		transformedGroups = [];

		angular.forEach( groups.elements, function( value, key ) {
			var		tempGroup;

			tempGroup = {};
			tempGroup.id = value.id;
			tempGroup.label = value.labels[ 0 ][ '@value' ];
			tempGroup.description = value.descriptions[ 0 ][ '@value' ];
			transformedGroups.push( tempGroup );
		} );

		return transformedGroups;
	}

	//TransformAllTypes:  Converts types into a usable model
	function _transformAllTypes( types ) {
		var		type;
		var		transformedTypes = [];

		angular.forEach( types.elements, function( value, key ) {
			var		tempLabel;

			tempLabel = value.labels[ 0 ];
			type = {};
			type.id = value.id;
			type.label = tempLabel["@value"];
			transformedTypes.push( type );
		});

		return transformedTypes;
	}

	//Search:  Performs place search
	function _search( params ) {
		var		results;
		var		query = '?q=';
		var		req = {};

		//Note:  "plus sign" is converted to %2B for URL encoding
		if ( params.name ) {
			query += 'name:"' + encodeURIComponent( params.name ) + '" ';
		}
		if ( params.type ) {
			query += '%2BtypeId:' + params.type + ' ';
		}
		if ( params.group ) {
			query += '%2BtypeGroupId:' + params.group + ' ';
		}
		if ( params.location ) {
			query += 'latitude:' + ' ';
		}
		if ( params.jurisdiction ) {
			query += '%2BparentId:' + params.jurisdiction + ' ';
		}
		if ( params.date ) {
			query += '%2Bdate:' + params.date + ' ';
		}
		req.method = "GET";
		req.headers = {
				'Authorization': 'Bearer ' + me.urls.accessToken.token
			};
		req.url = me.urls.placeEndPoints.PLACE_SEARCH + query;

		$log.info( "Search URL: " + req.url );
		$http.get( req.url, req ).success( function( data ) {
			results = _transformSearchData( data );
			if ( me.searchCallback ) {
				me.searchCallback( results );
			}
		} ).error( function( data ) {
			$log.error( "Error searching for places: " + data );
		} );

		me.lastResults = results;
		return results;
	}

	//GetLastResults:  Gets the last search results
	function _getLastResults() {
		return me.lastResults;
	}

	//RegisterSearchCallback:  Registers a function to be called when place search is performed
	function _registerSearchCallback( callback ) {
		me.searchCallback = callback;
	}

	//RegisterAllTypesCallback:  Registers a function to be called when all types are retrieved
	function _registerAllTypesCallback( callback ) {
		me.allTypesCallback = callback;
		//If we've already loaded the place types, then
		//go ahead and notify the callback.
		if ( me.allTypes ) {
			callback( me.allTypes );
		}
	}

	//RegisterAllTypeGroupsCallback:  Registers a function to be called when all type groups are retrieved
	function _registerAllTypeGroupsCallback( callback ) {
		me.allTypeGroupsCallback = callback;
		//If we've already loaded the place type groups, then
		//go ahead and notify the callback.
		if ( me.allTypeGroups ) {
			callback( me.allTypeGroups );
		}
	}

	//GetAllTypes:  Get the list of place types
	function _getAllTypes() {
		var		req = {
			method: 'GET',
			url: me.urls.placeEndPoints.PLACE_TYPE + "",
			headers: {
				'Authorization': 'Bearer ' + me.urls.accessToken.token
			}
		}

		$log.info( "Place Types URL: " + req.url );
		$http.get( req.url, req ).success( function( data ) {
			me.allTypes = _transformAllTypes( data );
			if ( me.allTypesCallback ) {
				me.allTypesCallback( me.allTypes );
			}
		} ).error( function( data ) {
			$log.error( "Error retrieving all place types: " + data );
		} );

		return me.allTypes;
	}

	//GetAllTypeGroups:  Get the list of place types
	function _getAllTypeGroups() {
		var		req = {
			method: 'GET',
			url: me.urls.placeEndPoints.PLACE_TYPE_GROUP + "",
			headers: {
				'Authorization': 'Bearer ' + me.urls.accessToken.token
			}
		}

		$log.info( "Place Type Groups URL: " + req.url );
		$http.get( req.url, req ).success( function( data ) {
			me.allTypeGroups = _transformAllTypeGroups( data );
			if ( me.allTypeGroupsCallback ) {
				me.allTypeGroupsCallback( me.allTypeGroups );
			}
		} ).error( function( data ) {
			$log.error( "Error retrieving all place type groups: " + data );
		} );

		return me.allTypeGroups;
	}

	//LoadData:  Once login is successful, load this data
	function _loadData() {
		_getAllTypes();
		_getAllTypeGroups();
	}

	//Make public functions public
	this.search = _search;
	this.getLastResults = _getLastResults;
	this.registerSearchCallback = _registerSearchCallback;
	this.registerAllTypesCallback = _registerAllTypesCallback;
	this.registerAllTypeGroupsCallback = _registerAllTypeGroupsCallback;
	this.getAllTypes = _getAllTypes;
	this.getAllTypeGroups = _getAllTypeGroups;

	//Login and initialize the list of types.
	_login( _loadData );
} ]);
