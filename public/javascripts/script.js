
// let places = [];
document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("IronGenerator JS imported successfully!");
    // places.push("hola")
  },
  false
);

function create(params) {
  return `<p>hola</p><p>bounds x ${params.ia.j} ${
    params.ia.l
  }</p><p>paramss y: ${params.na.j} ${params.na.l}</p>`;
}

function carta(params) {
  var texto = `<div class="card mt-3">
  <div class="card-body">
    <h5 class="card-title">cambiado${params.name}</h5>
    <p class="card-text"><a href="/products/${
      params._id
    }">Show details</a><a href="/products/${
    params._id
  }/edit">Edit movie</a><br>${params.description}</p>
    <p class="card-text"><small class="text-muted">${
      params.updated_at
    }</small></p>`

    if (params.currentUserIsAuthor) {
      texto += `<form action="/products/${params._id}/delete" method="post">
        <button>Delete movie</button>
      </form> `
    }

  
    texto += `</div>
  <img class="card-img-bottom" src="${params.imgPath}" alt="Card image cap">
</div>`;
  return texto;
}

var check1 = document.getElementById("filtro1");
var check2 = document.getElementById("filtro2");

check1.addEventListener("click", function name() {
  console.log(check1, check1.checked, " cheker");
});

var markers = [];

function crearMarker(sitio, mapa) {
  var infowindow = new google.maps.InfoWindow({
    content: carta(sitio)
  });
  var marker = new google.maps.Marker({
    position: {
      lat: sitio.lat,
      lng: sitio.lng
    },
    map: mapa,
    title: sitio.name
  });

  marker.addListener("click", function(mapa) {
    infowindow.open(mapa, marker);
  });
  markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

function startMap() {
  const Madrid = {
    lat: 40.4577381,
    lng: -3.689471916
  };
  const map = new google.maps.Map(document.getElementById("mapBig"), {
    zoom: 15,
    center: Madrid,
    styles: [
      {
        featureType: "landscape.natural",
        elementType: "geometry.fill",
        stylers: [
          {
            visibility: "on"
          },
          {
            color: "#e0efef"
          }
        ]
      },
      {
        featureType: "poi",
        elementType: "geometry.fill",
        stylers: [
          {
            visibility: "on"
          },
          {
            hue: "#1900ff"
          },
          {
            color: "#c0e8e8"
          }
        ]
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [
          {
            lightness: 100
          },
          {
            visibility: "simplified"
          }
        ]
      },
      {
        featureType: "road",
        elementType: "labels",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "transit.line",
        elementType: "geometry",
        stylers: [
          {
            visibility: "on"
          },
          {
            lightness: 700
          }
        ]
      },
      {
        featureType: "water",
        elementType: "all",
        stylers: [
          {
            color: "#7dcdcd"
          }
        ]
      }
    ]
  });

  navigator.geolocation.getCurrentPosition(function(position) {
    initialLocation = new google.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    );
    map.setCenter(initialLocation);
  });

  var bound = map.getBounds();
  var counter = 0;
  
  axios
  .get("https://tupperwire.herokuapp.com/products/mapa")
    .then(responses => {
      // console.log(responses.data);
      let jam = responses.data.Product;
      let places = [];
      jam.forEach(pig => places.push(pig));

      places.forEach(place => {
        crearMarker(place, map);
      });
      var filtradoVegano = [...places];

      google.maps.event.addListener(map, "idle", function() {
        bound = map.getBounds();
        document.getElementById("onView").innerHTML = "";
        var veganos = [...places];
        check1.addEventListener("click", function filtro() {
          clearMarkers();
          document.getElementById("onView").innerHTML = "";
          if (check1.checked) {
            filtradoVegano = [];
            veganos.forEach(vegan => {
              // console.log(veganos)
              // console.log(vegan)
              if (vegan.vegan) {
                filtradoVegano.push(vegan);
              }
              // return vegan.vegan === true
            });
          } else {
            filtradoVegano = [...places];
          }

          console.log("hoooola", filtradoVegano);
          filtradoVegano.forEach(place => {
            if (
              place.lng > bound.ia.j &&
              place.lng < bound.ia.l &&
              place.lat > bound.na.j &&
              place.lat < bound.na.l
            ) {
              document.getElementById("onView").innerHTML += carta(place);
              crearMarker(place, map);
            }
          });
        });
        check2.addEventListener("click", function filtro() {
          clearMarkers();
          document.getElementById("onView").innerHTML = "";
          filtradoVegano = [];
          if (check2.checked) {
            veganos.forEach(vegan => {
              // console.log(veganos)
              var partial = vegan.veget;
              if (partial) {
                console.log(partial);
                filtradoVegano.push(vegan);
              }
              // return vegan.vegan === true
            });
          } else {
            filtradoVegano = [...places];
          }

          // console.log("hoooola",filtradoVegano);
          filtradoVegano.forEach(place => {
            if (
              place.lng > bound.ia.j &&
              place.lng < bound.ia.l &&
              place.lat > bound.na.j &&
              place.lat < bound.na.l
            ) {
              document.getElementById("onView").innerHTML += carta(place);
              crearMarker(place, map);
            }
          });
        });
        filtradoVegano.forEach(place => {
          if (
            place.lng > bound.ia.j &&
            place.lng < bound.ia.l &&
            place.lat > bound.na.j &&
            place.lat < bound.na.l
          ) {
            document.getElementById("onView").innerHTML += carta(place);
            crearMarker(place, map);
          }
        });
        counter++;
      });

      // console.log(place);

      // console.log(places);
    });
}

startMap();
