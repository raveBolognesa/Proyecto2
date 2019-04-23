

// let places = [];
document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("IronGenerator JS imported successfully!");
    // places.push("hola")
  },
  false
);


function startMap() {
  const Madrid = {
    lat: 40.4577381,
    lng: -3.689471916
  };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: Madrid
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(initialLocation);
    });
}

  axios.get("https://tupperwire.herokuapp.com/products/mapa").then(responses => {
    console.log(responses.data);
    let jam = responses.data.Product;
    let places = [];
    jam
      .forEach(pig => places.push(pig))

    places
      .forEach(place => {
        var infowindow = new google.maps.InfoWindow({
          content: "contentString"
        });
        console.log(place.Pos)
        var marker = new google.maps.Marker({
          position: {
            lat: place.lat,
            lng: place.lng
          },
          map: map,
          title: place.name
        });


  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });

  

        console.log(place);
      });

    console.log(places);
  });
}



startMap();