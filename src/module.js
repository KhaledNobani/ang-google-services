(function($A, $G) {
    
    'use strict';
    
    $A.module('ang-google-services', [])
        .factory('$Geocode', ['$q', function($q) { return Geocode($q); }])
        .factory('$Distance', ['$q', function($q) { return Distance($q); }])
        .factory('$Marker', ['$q', function($q) { return Marker($q); }])
        .factory('$Places', ['$q', function($q) { return Places($q); }])
        .factory('$Polyline', ['$q', function($q) { return Polyline($q); }]);
    
    function Geocode($q) {

        var $Self = this,
            $GeocodeService = new $G.maps.Geocoder;
        
        return {
          
            getCoords: function() {},
            getNames: function(options) {
                return getLocationsName.call($Self, $GeocodeService, options, $q);   
            },
            getGeoCode: function(options) {
                return getGeoCode.call($Self, $GeocodeService, options, $q);  
            }
            
        };

    };
    
    /**
      * The factory of Ditance service.
      *
      * @param Object $q.
      */
    function Distance($q) {
        
        var $Self = this,
            $GeocodeService = new $G.maps.Geocoder,
            $DistanceMatrixService = new $G.maps.DistanceMatrixService;
        
        return {
            
            getDistance: function(options) {
                return getDistance.call($Self, $GeocodeService, $DistanceMatrixService, $q, options);  
            }
            
        };
        
    }
    
    /**
      * The factory of Marker
      */
    function Marker($q) {
        
        var $Self = this;
        
        return {
            
            // Add markers into map
            addMarkers: function(options) {
                return addMarkers.call($Self, options);   
            },
            removeMarker: function(options) {
                return removeMarker.call($Self, options);   
            }
            
        };
        
    }

    /**
      * The factory of Places
      */
    function Places($q) {
        
        var $Self = this;
        
        return {
            
            // Search for places
            search: function(options) {
                return searchPlaces.call($Self, options, $q);
            }

        };
        
    }
    
    /**
      * The factory of Polyline.
      */
    function Polyline($q) {
        
        var $Self = this;
        
        return {
          
            add: function(options) {
                return addPolyline.call($Self, options, $q);
            },
            
            remove: function(options) {
                return removePolyline.call($Self, options, $q);   
            }
            
        };
        
    }
    
    /**
      * Adds the polyline into the map
      *
      * @return Object $PathPolyline Polyline's object.
      */
    function addPolyline(options, $q) {

        var $Options = options || {},
            $Paths = options['coords'] || [],
            $Map = options['map'] || undefined;

        if (!$Map) return new Error("Should pass map object");

        var $PathPolyline = new $G.maps.Polyline({

                path: $Paths,
                geodesic: options['geodesic'] || true,
                strokeColor: options['strokeColor'] || '#4285f4',
                strokeOpacity: options['strokeOpacity'] || 0.4,
                strokeWeight: options['strokeWeight'] || 2,
                map: $Map

        });

        return $PathPolyline;

    }
    
    /**
      * Removes the polyline from the map
      *
      */
    function removePolyline(polylineObj) {
        var $PolylineObj = polylineObj || undefined;
        
        if ($PolylineObj) if (typeof $PolylineObj['setMap'] == 'function') $PolylineObj['setMap'](null);
    }
    
    /**
      * Shapes the request object for places' searching process
      *
      * @param {Object} options
      */
    function shapePlacesRequest(options) {
        
        return {
            location: options['location'] || { lat: null, lng: null },
            radius: parseFloat(options['radius']) || '0',
            types: options['types'] || []
            
        };
        
    }
    
    /**
      * Searches the places from current location.
      *
      * @param {Object} options
      * @return {Object} promise
      */
    function searchPlaces(options, $q) {
        
        var $Deffered = $q.defer();
        
        if (!options['map']) return 0;
        
        var $Map = options['map'],
            $Options = options || {},
            $Req = shapePlacesRequest($Options);
        
        if ('placesservice' in $Map) {

        } else {
            $Map.placesservice = new $G.maps.places.PlacesService($Map);
        }

        console.log($Map.placesservice);

        $Map.placesservice.nearbySearch($Req, function(results, status) {

           if (status == $G.maps.GeocoderStatus.OK) {
               $Deffered.resolve(results);
           } else {
               $Deffered.reject(results);
           }

        });

        return $Deffered.promise;

    }
    
    /**
      * The factory of Marker
      *
      * @param {Object} options
      * @return {Object} Marker instance
      */
    function getMarker(options) {

        if (!options['map']) return undefined;

        return new $G.maps.Marker({
            map: options['map'],
            position: options['position'],
            animate: $G.maps.Animation.DROP,
        });

    }
    
    /**
      * Adds markers into map
      *
      * @param {Object} options { markers: [], map: mapObject }
      */
    function addMarkers(options) {

        var $Options = options || {},
            $Markers = options['markers'] || [],
            $Map = $Options['map'],
            $Bounds = new $G.maps.LatLngBounds() || {};

        if(!$Map) return 0;

        for (var index = 0, length = $Markers.length; index < length; index++) {

            var $M = $Markers[index],
                $Position = ('geometry' in $M) ? $M['geometry']['location'] : $M['position'] || { lat: null, lng: null};

            $Markers[index].$marker = getMarker({
                position: $Position,
                map: $Map
            });

            $Bounds.extend(new google.maps.LatLng($Position['lat'], $Position['lng']));

        }
        
        if(typeof $Map.fitBounds == 'function') $Map.fitBounds($Bounds);

    }
    
    /**
      *
      * Removes the marker from the map.
      *
      * @param Object options.
      */
    function removeMarker(options) {

        var $Options = options || {},
            $Marker = $Options['marker'];
        
        if (!$Marker) return;
        
        if (typeof $Marker.setMap == 'function') $Marker.setMap(null)

    }
    
    /**
      * Gets the names of location from coordinates
      *
      * @param {Object} options
      */
    function getLocationsName($GeocodeService, options, $q) {
        
        var $Defer = $q.defer();
        
        $GeocodeService.geocode({'location' : options['coords'] || {lat: null, lng: null } }, function(results, status) {
            
            if (status == $G.maps.GeocoderStatus.OK) {
                $Defer.resolve(results);
            } else {
                $Defer.reject({error: status, message: 'Failed to get the result ' + status});
            }
            
        });
        
        return $Defer.promise;
        
    }
    
    /**
      * Gets the list of address.
      *
      * @param {Object} options
      */
    function getGeoCode($GeocodeService, options, $q) {
        
        var $Defer = $q.defer();
        
        $GeocodeService.geocode({'address' : options['address'] || '' }, function(results, status) {
            
            if (status == $G.maps.GeocoderStatus.OK) {
                $Defer.resolve(results);
            } else {
                $Defer.reject({
                    error: status,
                    message: "There something wrong due to " + status
                });
            }
            
        });
        
        return $Defer.promise;
        
    }
    
    function formPropObject(objName, $SeperatedField) {
        
        var $SeperatedField = $SeperatedField || [],
            $ObjStr = '';
            
        
        for (var index = 0, length = $SeperatedField.length; index < length; index++) {
        
            $ObjStr += '["' + $SeperatedField[index] + '"]';
        
        }

        return objName + $ObjStr;
        
    }
    
    function mapReduceDistance($Data, $Field, callback) {
        
        var $Data = $Data || [],
            $Field = $Field || '',
            $SeperatedField = $Field.split('.'),
            $Summary = {},
            $Result = {};
        
        for (var index = 0, length = $Data.length; index < length; index++) {
            
            //console.log($Data[index]);
            var $ChunkData = $Data[index],
                $PrevData = (index < 1) ? $Data[index] : $Data[index-1],
                value = eval(formPropObject("$ChunkData", $SeperatedField)),
                prevValue = eval(formPropObject("$PrevData", $SeperatedField));

            $Result = callback(prevValue, value, $Summary) || $Summary;
            
        }
        
        return $Result || undefined;
        
    }
    
    /**
      * Gets the ditance from different origins and destinations.
      *
      * @param Object options { origins: Array, destinations: Array, etc ... }
      * @return Object Promise.
      */
    function getDistance($GeocodeService, $DistanceMatrixService, $q, options) {
        
        var $Defer = $q.defer(),
            options = options || {};
        
        $DistanceMatrixService.getDistanceMatrix ({
            origins: options['origins'] || [],
            destinations: options['destinations'] || [],
            travelMode: options['travelMode'] || google.maps.TravelMode.DRIVING,
            unitSystem: options['travelMode'] || google.maps.UnitSystem.METRIC,
            avoidHighways: options['avoidHighways'] || false,
            avoidTolls: options['avoidTolls'] || false
        }, function(response, status) {
            
            if (status == $G.maps.DistanceMatrixStatus.OK) {
                var $Summary = mapReduceDistance(response.rows[0].elements || undefined, "distance.value", function(prevValue, value, $Summary) {

                    if (prevValue <= value) {
                        $Summary.shortest = prevValue;
                    } else {
                        $Summary.shortest = value;
                    }
                    
                    if (prevValue > value) {
                        $Summary.longest = prevValue;
                    } else {
                        $Summary.longest = value;
                    }
                    
                    
                    return $Summary;

            });
                $Defer.resolve({
                    response: response,
                    $Summary: $Summary
                });
            } else {
                $Defer.reject(undefined);
            }
        });
        
        return $Defer.promise;

    }

}(angular, google));