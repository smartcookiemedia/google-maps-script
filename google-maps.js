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



     infowindow = new google.maps.InfoWindow({
         maxWidth: 200
     });
     service = new google.maps.places.PlacesService(map);

     createTogglers();
     startup();

 };


 function addKmlLayer(src, map) {
     var ctaLayer = new google.maps.KmlLayer({
         url: baseurl + src,
         suppressInfoWindows: true,

     });
     ctaLayer.setMap(map);
 }


 // the important function... kml[id].xxxxx refers back to the top 
 function toggleKML(checked, id) {

     if (checked) {

         var layer = new google.maps.KmlLayer(baseurl + kml[id].url, {
             preserveViewport: true,
             suppressInfoWindows: true
         });
         infowindow.close(map);
         // store kml as obj
         kml[id].obj = layer;
         kml[id].obj.setMap(map);

         layer.addListener('click', function(kmlEvent) {

             var request = {
                 location: kmlEvent.latLng,
                 radius: '10',
                 name: kmlEvent.featureData.name
             };
             service.nearbySearch(request, getIDcallback);

         });

         layer.addListener('ontouchend', function() {
             google.maps.event.trigger(this, 'click');
             // alert(0)
         });

     } else {
         kml[id].obj.setMap(null);
         delete kml[id].obj;
     }


 };

 function getIDcallback(results, status) {

     if (status == google.maps.places.PlacesServiceStatus.OK) {
         var place = results[0];
         // console.log(place.place_id);

         var requestplace = {
             placeId: place.place_id
         };

         service.getDetails(requestplace, getPlacesDestailscallback);

     }
 }

 function getPlacesDestailscallback(results, status) {

     if (status == google.maps.places.PlacesServiceStatus.OK) {
         var place = results;
         // console.log(results);


         var address = results.adr_address;
         // var new_address = address.replace('/span/g', '<br/><span');

         var content = '<span style="padding: 0px; text-align:left" align="left"><h6>' + place.name + '</h6>';

         content += address;

         content += ((results.international_phone_number)) ? '<div>' + results.international_phone_number + '</div>' : '';


         content += ((results.website)) ? '<a  target="_blank" href=' + place.website + '>' + place.website + '</a>' : '';

         content += '</span>';
         infowindow.setContent(content);
         infowindow.setPosition(place.geometry.location);
         infowindow.open(map);
     }
 }



 // create the controls dynamically because it's easier, really
 function createTogglers() {

     var html = "<form><ul>";
     html += "<li class='control selected'><a href='#' onclick='removeAll(); addAll();return false;'>" +
         "ALL<\/a><\/li>";
     for (var prop in kml) {

         html += "<li id=\"selector-" + prop + "\"><a id='" + prop + "'" +
             "title='" + kml[prop].name + "' " +
             " href='javascript:void(0)' onClick='removeAll(); highlight(this,\"selector-" + prop + "\"); toggleKML(\"checked\", this.id)\' \/>" +
             kml[prop].icon +
             "<span>" + kml[prop].name + "</span>" +
             "<\/li>";
     }
     html += "<\/ul><\/form>";

     document.getElementById("toggle_box").innerHTML = html;
 };

 // easy way to remove all objects
 function removeAll() {
     for (var prop in kml) {
         if (kml[prop].obj) {
             if (prop != 'home') {
                 kml[prop].obj.setMap(null);
                 delete kml[prop].obj;
             }
         }

     }
 };

 function addAll() {
     for (var prop in kml) {
         toggleKML("checked", prop);
         console.log(prop)
     }

 };


 // Append Class on Select
 function highlight(box, listitem) {
     var selected = 'selected';
     var normal = 'normal';
     $('#toggle_box ul li').removeClass('selected');
     $('#' + listitem).addClass('selected')
 };


 function startup() {
     addAll();

 }


 $(window).on('load', function() {

     setMapHeight(true);
 })

 $(window).on('resize', function() {
     setMapHeight();
 })

 function setMapHeight(isLoaded) {
     /* set height of map based on toggle button container */
     if ($(window).width() < 844) {
         buttonHeight = $('#toggle_box').height();
         $('#map_canvas').css('padding-bottom', buttonHeight);
     }
     if (isLoaded) {
         $('#map_container').addClass('fade-in');
     }


 }
