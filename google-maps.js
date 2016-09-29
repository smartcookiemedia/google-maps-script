 var map;
 var marker;
 var latlng;
 var infowindow;
 var service;
 var baseurl = "http://indigoestates.ca/wp-content/themes/blankslate/js/";
 // var apikey = 'AIzaSyCKYpfT6HfxowECaA0aTqVrf3BX03VV03I';

 var kml = {
     home: {
         name: "Home",
         url: "housing_location.kmz",
         icon: ''
     },
     a: {
         name: "Living",
         url: "living.kmz",
         icon: "<i class='fa fa-star' aria-hidden='true'></i>"

     }, 
     b: {
         name: "Dining",
         url: "dining.kmz",
         icon: "<i class='fa fa-cutlery' aria-hidden='true'></i>"

     },
     c: {
         name: "Shopping",
         url: "shopping.kmz",
         icon: "<i class='fa fa-shopping-bag' aria-hidden='true'></i>"

     },
     d: {
         name: "Art & Entertainment",
         url: "arts_entertainment.kmz",
         icon: "<i class='fa fa-film' aria-hidden='true'></i>"

     },
     e: {
         name: "Sports & Outdoors",
         url: "sports_outdoors.kmz",
         icon: "<i class='fa fa-dribbble' aria-hidden='true'></i>"

     },
     f: {
         name: "Relaxation",
         url: "relaxation.kmz",
         icon: "<i class='fa fa-leaf' aria-hidden='true'></i>"

     }
 };

 styles = [{ "stylers": [{ "weight": 1 }] }, { "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "administrative.locality", "elementType": "labels.text", "stylers": [{ "color": "#222b59" }, { "visibility": "on" }, { "weight": 2.5 }] }, { "featureType": "administrative.locality", "elementType": "labels.text.stroke", "stylers": [{ "color": "#dee7ff" }] }, { "featureType": "administrative.province", "elementType": "labels.text", "stylers": [{ "color": "#4a5ea3" }] }, { "featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{ "color": "#c2d0f4" }] }, { "featureType": "landscape.natural", "elementType": "geometry.fill", "stylers": [{ "color": "#dee7ff" }] }, { "featureType": "poi.attraction", "elementType": "geometry.fill", "stylers": [{ "color": "#c3daa1" }] }, { "featureType": "poi.business", "elementType": "labels.text", "stylers": [{ "color": "#838693" }] }, { "featureType": "poi.business", "elementType": "labels.text.stroke", "stylers": [{ "color": "#dee7ff" }] }, { "featureType": "poi.medical", "elementType": "geometry.fill", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.medical", "elementType": "labels.text", "stylers": [{ "color": "#354478" }] }, { "featureType": "poi.medical", "elementType": "labels.text.stroke", "stylers": [{ "color": "#dee7ff" }] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#c3daa1" }] }, { "featureType": "poi.school", "elementType": "geometry.fill", "stylers": [{ "color": "#fafbff" }, { "visibility": "off" }] }, { "featureType": "poi.school", "elementType": "labels.text", "stylers": [{ "color": "#4a5ea3" }] }, { "featureType": "poi.school", "elementType": "labels.text.stroke", "stylers": [{ "color": "#dee7ff" }] }, { "featureType": "poi.sports_complex", "elementType": "geometry.fill", "stylers": [{ "color": "#c3daa1" }] }, { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [{ "color": "#4a5ea3" }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#fcfcfd" }, { "visibility": "on" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#fcfcfd" }, { "visibility": "on" }] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#4a5ea3" }] }, { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#4a5ea3" }] }, { "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "color": "#94b0fe" }] }];

 function initializeMap() {
     latlng = new google.maps.LatLng(44.48, -80.24976);

     var options = {
         center: latlng,
         zoom: 12,
         mapTypeId: google.maps.MapTypeId.ROADMAP,
         styles: styles
     }
     map = new google.maps.Map(document.getElementById("map_canvas"), options);


     var request = {
         location: latlng,
         radius: '500',
         // keyword: "Michelle Vale"
     };

     /* Marker and window */

     infowindow = new google.maps.InfoWindow();
     marker = new google.maps.Marker({
         map: map
     });

     infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.search(request, callback);

     createTogglers();
     startup();

 };

 function callback(results, status) {
     if (status == google.maps.places.PlacesServiceStatus.OK) {
         for (var i = 0; i < results.length; i++) {
             var place = results[i];
             createMarker(results[i]);
         }
     }
 }

 function createMarker(place) {
     var placeLoc = place.geometry.location;
     var marker = new google.maps.Marker({
         map: map,
         position: place.geometry.location
     });

     google.maps.event.addListener(marker, 'click', function() {
         infowindow.setContent(place.name + place.rating + place.vicinity +
             place.formatted_address + place.website);
         infowindow.open(map, this);
     });
 }

 function openInfoWindow(id) {
     return true;
 }


 function addKmlLayer(src, map) {
     var ctaLayer = new google.maps.KmlLayer({
         url: baseurl + src,
         suppressInfoWindows: false,

     });
     ctaLayer.setMap(map);

     console.log(baseurl + src);
 }


 // the important function... kml[id].xxxxx refers back to the top 
 function toggleKML(checked, id) {

     if (checked) {

         var layer = new google.maps.KmlLayer(baseurl + kml[id].url, {
             preserveViewport: true,
             suppressInfoWindows: false
         });
         // store kml as obj
         kml[id].obj = layer;
         kml[id].obj.setMap(map);

          google.maps.event.addListener(layer, 'click', function(event) {
                var content = event.featureData.infoWindowHtml;
                /* Think I need to get the placeID / detail here */
          
        });
     } else {
         kml[id].obj.setMap(null);
         delete kml[id].obj;
     }


 };

 
 // marker.addListener('click', function() {

 //     marker.setPlace({
 //         placeId: place.place_id,
 //         location: place.geometry.location
 //     });
 //     marker.setVisible(true);

 //     infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
 //         'Place ID: ' + place.place_id + '<br>' +
 //         place.formatted_address);
 //     infowindow.open(map, marker);



 // });





 // infowindow.setContent('<span style="padding: 0px; text-align:left" align="left"><h5>' + place.name + '&nbsp; &nbsp; ' + place.rating + '</h5><p>' + place.formatted_address + '<br />' + place.formatted_phone_number + '<br />' +
 //     '<a  target="_blank" href=' + place.website + '>' + place.website + '</a></p>');


 

 // easy way to remove all objects
 function removeAll() {
     for (var prop in kml) {
         if (kml[prop].obj) {
             if (prop != 'home') {
                 kml[prop].obj.setMap(null);
                 delete kml[prop].obj;
             }

             // console.log(prop)
         }

     }
 };

 function addAll() {
     for (var prop in kml) {
         toggleKML("checked", prop);
         console.log(prop)
     }

     // setHome();
 };


 // Append Class on Select
 function highlight(box, listitem) {
     var selected = 'selected';
     var normal = 'normal';
     $('#toggle_box ul li').removeClass('selected');
     $('#' + listitem).addClass('selected')
 };


 function startup() {
     // for example, this toggles kml b on load and updates the menu selector
     // var checkit = document.getElementById('home');
     // checkit.checked = true;
     addAll();
     // highlight(checkit, 'selector1');

 }



