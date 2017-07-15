$(document).ready(function() {

//Get/Set vars
  var $home = $('#home');
  var $fietsverlening = $('#fietsverlening');
  var $parkeerGarage = $('#parkeerGarage');
  var $fietstellingen = $('#fietstellingen');
  var $title = $('#title');
  var $htmlMap = $('#map');
  var $ctx = $('#chart');
  var $wrapper =$('#wrapper');
  var ctx = $("#myChart");
  var map;

//Set StartPage Content
  $title.html('Mobiliteit Gent');

//Load map on StartPage
  window.onload = function() {
    getFietsverlening();
    getParkeergarages();
    initMap();

    var marker = new google.maps.Marker({
      position: {lat: 51.047673, lng: 3.738651},
      map: map,
      icon: 'img/chronometer.png'
    });
  };


//change content on menu click
  $home.on('click', function(e) {
    //change page title
    $title.html('Mobiliteit Gent');

    //change the css
    $htmlMap.css({'width': '800px', 'float': '', 'margin-left': '', 'margin':'auto', 'margin-bottom': '50px'});
    $ctx.css({'float':'', 'margin-left': ''});
    $wrapper.css({'overflow':''});

    //Load all data
    getFietsverlening();
    getParkeergarages();
    initMap();

    var marker = new google.maps.Marker({
      position: {lat: 51.047673, lng: 3.738651},
      map: map,
      icon: 'img/chronometer.png',
      clickable: true
    });

    //delete the chart
    myChart.destroy();
  });

  $fietsverlening.on('click', function(e) {
    //Change page title
    $title.html('Locaties fietsdienstverleningen');

    //Change the css
    $htmlMap.css({'width': '800px', 'float': '', 'margin-left': '', 'margin':'auto', 'margin-bottom': '50px'});
    $ctx.css({'float':'', 'margin-left': ''});
    $wrapper.css({'overflow':''});

    //Load fietsverleningen
    getFietsverlening();
    initMap();

    //Delete the chart
    myChart.destroy();
  });

  $parkeerGarage.on('click', function(e) {
    //Change page title
    $title.html('Bezetting parkeergarages');

    //Change the css
    $htmlMap.css({'width': '800px', 'float': '', 'margin-left': '', 'margin':'auto', 'margin-bottom': '50px'});
    $ctx.css({'float':'', 'margin-left': ''});
    $wrapper.css({'overflow':''});

    //Load parkeergarages
    getParkeergarages();
    initMap();

    //Destroy the chart
    myChart.destroy();
  });

  $fietstellingen.on('click', function(e){
    initMap();
    var marker = new google.maps.Marker({
      position: {lat: 51.047673, lng: 3.738651},
      map: map,
      icon: 'img/chronometer.png',
      clickable: true
    });
    //Change page title
    $title.html('Fietstellingen visserij');

    //Add css for the chart
    $htmlMap.css({'width': '600px', 'float': 'left', 'margin-left': '110px', 'margin-bottom': '50px'});
    $ctx.css({'float':'left', 'margin-left': '50px'});
    $wrapper.css({'overflow':'hidden'});

    //Draw the chart
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
        var contentString = '';
        for (var i = 0; i < data.coordinates.length; i++) {
            leng = parseFloat(data.coordinates[i][0]);
            lati = parseFloat(data.coordinates[i][1]);
            locatie = {lat: lati, lng: leng};
            var image = 'img/fietsGroen.png';
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
    var valuesGentbrugge = [];
    var valuesCentrum = [];
    var a = 0; var b = 0; var c = 0; var d = 0; var e = 0; var f = 0; var g = 0;
    var a1 = 0; var b1 = 0; var c1 = 0; var d1 = 0; var e1 = 0; var f1 = 0; var g1 = 0;
    $.ajax({
      url: url,
      success: function(data) {
        data.forEach(function(items) {
          console.log(items.datum.substring(6,10));
          if(items.datum.substring(6,10) === '2011') {
            a = parseInt(a) + parseInt(items["ri Gentbrugge"]);
            a1 = parseInt(a1) + parseInt(items["ri Centrum"]);
          }else if (items.datum.substring(6,10) === '2012') {
            b = parseInt(b) + parseInt(items["ri Gentbrugge"]);
            b1 = parseInt(b1) + parseInt(items["ri Centrum"]);
          }else if (items.datum.substring(6,10) === '2013') {
            c = parseInt(c) + parseInt(items["ri Gentbrugge"]);
            c1 = parseInt(c1) + parseInt(items["ri Centrum"]);
          }else if (items.datum.substring(6,10) === '2014') {
            d = parseInt(d) + parseInt(items["ri Gentbrugge"]);
            d1 = parseInt(d1) + parseInt(items["ri Centrum"]);
          }else if (items.datum.substring(6,10) === '2015') {
            e = parseInt(e) + parseInt(items["ri Gentbrugge"]);
            e1 = parseInt(e1) + parseInt(items["ri Centrum"]);
          }else if (items.datum.substring(6,10) === '2016') {
            f = parseInt(f) + parseInt(items["ri Gentbrugge"]);
            f1 = parseInt(f1) + parseInt(items["ri Centrum"]);
          }else if (items.datum.substring(6,10) === '2017') {
            g = parseInt(g) + parseInt(items["ri Gentbrugge"]);
            g1 = parseInt(g1) + parseInt(items["ri Centrum"]);
          }
        });
        valuesGentbrugge.push(a);valuesGentbrugge.push(b);valuesGentbrugge.push(c);valuesGentbrugge.push(d);valuesGentbrugge.push(e);valuesGentbrugge.push(f);valuesGentbrugge.push(g);
        valuesCentrum.push(a1);valuesCentrum.push(b1);valuesCentrum.push(c1);valuesCentrum.push(d1);valuesCentrum.push(e1);valuesCentrum.push(f1);valuesCentrum.push(g1);
        //console.log(valuesCentrum);
        drawChart(valuesGentbrugge, valuesCentrum);
      }
    });
  }

  function drawChart(valuesGentbrugge, valuesCentrum){
    myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: ["2011", "2012", "2013"],
          datasets: [{
              label: 'Fietstellingen richting Gentbrugge',
              strokeStyle: 'rgba(255, 206, 86, 0.2)',
              data: valuesGentbrugge,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 99, 132, 0.2)',
              ],
              borderWidth: 1
          },{
            label: 'Fietstellingen richting Centrum',
            data: valuesCentrum,
            backgroundColor: [
              'rgba(54, 162, 235, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
                'rgba(54, 162, 235, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(54, 162, 235, 0.2)',
            ],
            borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                    beginAtZero:true
                  }
              }]
          }
      }
  });
  }
});
