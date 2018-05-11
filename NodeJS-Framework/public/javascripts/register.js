// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

var allMapDiv = $("#allmap");
var locationTextArea = $("#location");


function initMap() {

    var startPos;
    var geoOptions = {
        maximumAge: 5 * 60 * 1000,
        timeout: 10 * 1000,
        enableHighAccuracy: true
    };


    var map = new google.maps.Map(document.getElementById('allmap'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 6
    });


    var geoSuccess = function (position) {
        startPos = position;
        geocodeLatLng(startPos.coords.latitude, startPos.coords.longitude, map);

    };


    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geoSuccess, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        }, geoOptions);
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}


function geocodeLatLng(lat, lng, map) {
    allMapDiv.show();
    var location = {lat: parseFloat(lat), lng: parseFloat(lng)};
    // document.getElementById('lat').value = lat;
    // document.getElementById('lng').value = lng;
    var geocoder = new google.maps.Geocoder;
    map.setCenter(location);
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });

    geocoder.geocode({'location': location}, function (results, status) {
        if (status === 'OK') {
            console.log(results);
            if (results[0]) {
                document.getElementById('location').value = results[0].formatted_address;
                var street = "";
                var city = "";
                var state = "";
                var country = "";
                var zipcode = "";
                for (var i = 0; i < results.length; i++) {
                    if (results[i].types[0] === "locality") {
                        city = results[i].address_components[0].long_name;
                        state = results[i].address_components[2].long_name;

                    }
                    if (results[i].types[0] === "postal_code" && zipcode == "") {
                        zipcode = results[i].address_components[0].long_name;

                    }
                    if (results[i].types[0] === "country") {
                        country = results[i].address_components[0].long_name;

                    }
                    if (results[i].types[0] === "route" && street == "") {

                        for (var j = 0; j < 4; j++) {
                            if (j == 0) {
                                street = results[i].address_components[j].long_name;
                            } else {
                                street += ", " + results[i].address_components[j].long_name;
                            }
                        }

                    }
                    if (results[i].types[0] === "street_address") {
                        for (var j = 0; j < 4; j++) {
                            if (j == 0) {
                                street = results[i].address_components[j].long_name;
                            } else {
                                street += ", " + results[i].address_components[j].long_name;
                            }
                        }

                    }
                }
                if (zipcode == "") {
                    if (typeof results[0].address_components[8] !== 'undefined') {
                        zipcode = results[0].address_components[8].long_name;
                    }
                }
                if (country == "") {
                    if (typeof results[0].address_components[7] !== 'undefined') {
                        country = results[0].address_components[7].long_name;
                    }
                }
                if (state == "") {
                    if (typeof results[0].address_components[6] !== 'undefined') {
                        state = results[0].address_components[6].long_name;
                    }
                }
                if (city == "") {
                    if (typeof results[0].address_components[5] !== 'undefined') {
                        city = results[0].address_components[5].long_name;
                    }
                }

                var address = {
                    "street": street,
                    "city": city,
                    "state": state,
                    "country": country,
                    "zipcode": zipcode,
                };
                console.log(address);
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}