(function($Ang) {

    'use strict';

    $Ang.module('main', ['ang-google-services'])
        .controller('mainCtrl', ['$scope', '$Marker','$Distance', '$Polyline', mainCtrl]);

    function mainCtrl($scope, $Marker, $Distance, $Polyline) {
        
        $scope.map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 3.867,
                lng: 31.195
            },
            zoom: 8
        });
        
        var markers = [
            new google.maps.LatLng(13.7370216, 100.52277219999996),
            new google.maps.LatLng(13.7372187, 100.52478589999998),
            new google.maps.LatLng(13.7344701, 100.5200198)
        ];
        
        $Marker.addMarkers({
            markers: [
                { position: { lat: 13.7370216, lng: 100.52277219999996 } },
                { position: { lat: 13.7372187, lng: 100.52478589999998 } },
                { position: { lat: 13.7344701, lng: 100.5200198 } },
            ],
            map: $scope.map
        });
        
        var $PolylineObj = $Polyline.add({
            coords: markers,
            map: $scope.map
        });
        
        $Distance.getDistance({
            origins: [{lat: 13.7372187, lng: 100.52478589999998}],
            destinations: [{lat: 13.7370216, lng: 100.52277219999996}, { lat: 13.7344701, lng: 100.5200198 }],
            avoidHighways: true,
            avoidTolls: true
        }).then(function($Result) {
            console.log("The results as bellow");
            console.log($Result);
        }, function(error) {
            console.log("There something wrong"); 
        });
        
    }

}(angular));