(function($Ang) {

    'use strict';

    $Ang.module('main', ['ang-google-services'])
        .controller('mainCtrl', ['$scope', '$Geocode', mainCtrl]);

    function mainCtrl($scope, $Geocode) {
        
        $scope.map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: -33.867,
                lng: 151.195
            },
            zoom: 18
        });
        
        $Geocode.getNames({
            coords: {
                lat: -33.867,
                lng: 151.195
            }
        }).then(function(results) {
            
            var $Ele = document.getElementById('places-name');
            $Ele.innerHTML = JSON.stringify(results);
            
        }, function(error) {
           
            console.log(error);
            
        });

    }

}(angular));