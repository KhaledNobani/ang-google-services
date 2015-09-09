(function($Ang) {

    'use strict';

    $Ang.module('main', ['ang-google-services'])
        .controller('mainCtrl', ['$scope', '$Places', '$Marker', mainCtrl]);

    function mainCtrl($scope, $Places, $Marker) {
        
        $scope.map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: -33.867,
                lng: 151.195
            },
            zoom: 18
        });
        
        $Places.search({
            
            location: {lat: -33.867, lng: 151.195},
            radius: 500,
            map: $scope.map,
            types: ['store']
            
        }).then(function(res) {
            
            console.log(res);
            $Marker.addMarkers({
                map: $scope.map,
                markers: res
            });
            
            
        }, function(err) {
             console.error(err);
        });

    }

}(angular));