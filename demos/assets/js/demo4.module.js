(function($Ang) {

    'use strict';

    $Ang.module('main', ['ang-google-maps', 'ang-google-services'])
        .controller('mainCtrl', ['$scope', '$Marker','$Distance', '$Polyline', 'Direction', mainCtrl]);

    function mainCtrl($scope, $Marker, $Distance, $Polyline, Direction) {

        console.log(Direction);

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
        ],
            origing,
            destination,
            dropOffs = [];
        
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
        
        var optionBtn = document.querySelectorAll('.option.btn') || [];
        
        for (var index = 0, length = optionBtn.length; index < length; index++) {
            optionBtn[index].onclick = function($Event) {
                
                var optionValue = this.getAttribute('option');
                
                destination = (optionValue == 1) ? new google.maps.LatLng(13.7370216, 100.52277219999996) : new google.maps.LatLng(13.7344701, 100.5200198) ;
                dropOffs = (optionValue == 1) ? [{location: new google.maps.LatLng(13.7344701, 100.5200198)}] : [{location: new google.maps.LatLng(13.7370216, 100.52277219999996) }] ;
                
            Direction.setRoute({
                map: $scope.map,
                current: new google.maps.LatLng(13.7372187, 100.52478589999998),
                destination: destination,
                dropOffs: dropOffs,
                avoidHighways: true,
                avoidTolls: true
            });
                
            };
        }
                
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