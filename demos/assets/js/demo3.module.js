(function($Ang) {

    'use strict';

    $Ang.module('main', ['ang-google-services'])
        .controller('mainCtrl', ['$scope', '$Geocode', mainCtrl]);

    function mainCtrl($scope, $Geocode) {
        
        $scope.map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 3.867,
                lng: 31.195
            },
            zoom: 8
        });
        
        $Geocode.getGeoCode({
            address: 'Ukrain'
        }).then(function(results) {
            
            var $Ele = document.getElementById('places');
            $Ele.innerHTML = JSON.stringify(results);
            
        }, function(error) {
           
            console.log(error);

        });

    }

}(angular));