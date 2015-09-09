(function($A, $G) {
    
    'use strict';
    
    $A.module('ang-google-services', [])
        .factory('$Marker', ['$q', function($q) { return Marker($q); }])
        .factory('$Places', ['$q', function($q) { return Places($q); }]);
    
    /**
      * The factory of Marker
      */
    function Marker($q) {
        
        var $Self = this;
        
        return {
            
            // Add markers into map
            addMarkers: function(options) {
                return addMarkers.call($Self, options);   
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
            
           if (status == 'OK') {
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
      * @param {Object} options
      */
    function addMarkers(options) {
        
        var $Options = options || {},
            $Markers = options['markers'] || [],
            $Map = $Options['map'];
        
        if(!$Map) return 0;
        
        for (var index = 0, length = $Markers.length; index < length; index++) {
            
            var $M = $Markers[index],
                $Position = ('geometry' in $M) ? $M['geometry']['location'] : $M['position'] || { lat: null, lng: null};
            
            $Markers[index].$marker = getMarker({
                position: $Position,
                map: $Map
            });
            
            $Map.panTo($Position);
            
            
        }

    }
    
}(angular, google));