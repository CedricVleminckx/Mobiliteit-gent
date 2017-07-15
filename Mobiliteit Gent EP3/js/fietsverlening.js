$(document).ready(function() {

//Get/Set vars
  var $home = $('#home');
  var $fietsverlening = $('#fietsverlening');
  var $parkeerGarage = $('#parkeerGarage');
  var $fietstellingen = $('#fietstellingen');
  var $title = $('#title');
  var map;

//Set StartPage Content
  $title.html('Mobiliteit Gent');

//Load map on StartPage
  window.onload = function() {
    getFietsverlening();
    getParkeergarages();
    initMap();
  };


//change content on menu click
  $home.on('click', function(e) {
    $title.html('Mobiliteit Gent');
    getFietsverlening();
    getParkeergarages();
    initMap();
  });

  $fietsverlening.on('click', function(e) {
    $title.html('Locaties fietsdienstverleningen');
    getFietsverlening();
    initMap();
  });

  $parkeerGarage.on('click', function(e) {
    $title.html('Bezetting parkeergarages');
    getParkeergarages();
    initMap();
  });

  $fietstellingen.on('click', function(e){
    $title.html('Fietstellingen visserij');
    getFietstellingen();
  });

//Initialize google map
  function initMap() {
    var locatieGent = {lat: 51.055114, lng: 3.717253};
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: locatieGent
    });
  }

//Get data for fietsdienstverlening
  function getFietsverlening() {
    var lati;
    var leng;
    var showGeocodeBool = true;
    var url = "https://datatank.stad.gent/4/mobiliteit/fietsdienstverlening";
    $.ajax({
      url: url,
      success: function(data) {
        console.log(data)
        var contentString = '';
        for (var i = 0; i < data.coordinates.length; i++) {
            leng = parseFloat(data.coordinates[i][0]);
            lati = parseFloat(data.coordinates[i][1]);
            locatie = {lat: lati, lng: leng};
            var image = 'img/fiets.png';
            placeMarkers(locatie, showGeocodeBool, contentString, image);
        }
      }
    });
  }

//Get data for parkeergarages
  function getParkeergarages() {
    var lat;
    var lng;
    var showGeocodeBool = false;
    var url = "https://datatank.stad.gent/4/mobiliteit/bezettingparkingsrealtime";
    $.ajax({
      url: url,
      success: function(data) {
        for (var i = 0; i < data.length; i++) {
          var contentString = '';
          locatie = {lat: parseFloat(data[i].latitude), lng: parseFloat(data[i].longitude)};
          contentString += 'Garage: ' + data[i].name + '<br>';
          contentString += 'Adres: ' + data[i].address + '<br>';
          contentString += 'Contact: '+ data[i].contactInfo + '<br>';
          contentString += 'Beschikbare plaatsen: ' + data[i].parkingStatus.availableCapacity + ' van de ' + data[i].parkingStatus.totalCapacity + ' plaatsen' + '<br>';
          if(data[i].parkingStatus.open){
            contentString += 'De garage is open';
          }
          else{
            contentString += 'De garage is gesloten';
          }
          var image = 'img/garage.png';
          placeMarkers(locatie, showGeocodeBool, contentString, image);
        }
      }
    });
  }

//Place markers on the map
  function placeMarkers(locatie, showGeocodeBool, contentString, image){
    var marker = new google.maps.Marker({
      position: locatie,
      map: map,
      icon: image,
      clickable: true
    });
    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;
    google.maps.event.addListener(marker, 'click', function() {
      setMarkerInfo(geocoder, infowindow, locatie, marker, showGeocodeBool, contentString);
    });
  }

//Add content to the markers
  function setMarkerInfo(geocoder, infowindow, locatie, marker, showGeocodeBool, contentString){
    geocoder.geocode({'location': locatie}, function(results, status) {
      if (status === 'OK') {
        if (results[1]) {
          //Does location to be need find by Geacoder?
          if(showGeocodeBool == false){
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
          }
          else{
            contentString = results[1].formatted_address;
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
          }
        }else {
          window.alert('No results found');
        }
      }
    });
  }

  function getFietstellingen(){
    var url = "https://datatank.stad.gent/4/mobiliteit/fietstellingenvisserij";
    var results = [];
    var riGentBrugge;
    var riCentrum;
    var fieldName = "ri Gentbrugge";
    $.ajax({
      url: url,
      success: function(data) {
        data.forEach(function(items) {
            console.log(items["ri Gentbrugge"]);
        });
      }
    });
  }
});
