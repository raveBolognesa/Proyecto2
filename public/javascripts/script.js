

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
  return `<p>hola</p><p>bounds x ${params.ia.j} ${params.ia.l}</p><p>paramss y: ${params.na.j} ${params.na.l}</p>`
}


function carta(params) {
  var texto = `<div class="card mt-3">
  <div class="card-body">
    <h5 class="card-title">cambiado${params.name}</h5>
    <p class="card-text"><a href="/products/${params._id}">Show details</a><a href="/products/${params._id}/edit">Edit movie</a><br>${params.description}</p>
    <p class="card-text"><small class="text-muted">${params.updated_at}</small></p>

  <form action="/products/${params._id}/delete" method="post">
    <button>Delete movie</button>
  </form> 
  </div>
  <img class="card-img-bottom" src="${params.imgPath}" alt="Card image cap">
</div>`
return texto
}

var check1 = document.getElementById("filtro1")

check1.addEventListener("click", function name(){ console.log("hola")})



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
      document.getElementById("localizacion").value = initialLocation
      map.setCenter(initialLocation);
    });
  }
  
  var bound = map.getBounds()
var counter = 0




axios.get("https://tupperwire.herokuapp.com/products/mapa").then(responses => {
  // console.log(responses.data);
  let jam = responses.data.Product;
  let places = [];
  jam
  .forEach(pig => places.push(pig))
  
  places
  .forEach(place => {
    var infowindow = new google.maps.InfoWindow({
      content: carta(place)
    });
    var marker = new google.maps.Marker({
      position: {
        lat: place.lat,
        lng: place.lng
      },
      map: map,
      title: place.name
    });
    
    google.maps.event.addListener(map, 'idle', function() {
      bound = map.getBounds()
      document.getElementById("onView").innerHTML = ""
      var veganos = [...places];
      check1.addEventListener("click", function filtro(){ 
        veganos = [...places].map((vegan)=>{
          // console.log(veganos)
          // console.log(vegan)
          if(vegan.vegan === true){
            return vegan
          }
          // return vegan.vegan === true
        })
        veganos.forEach(place=>{
          if(place.lng > bound.ia.j && place.lng < bound.ia.l && place.lat > bound.na.j && place.lat < bound.na.l ){
            document.getElementById("onView").innerHTML += carta(place)
          }
        })
        })
        console.log(veganos)
      // veganos.forEach(place=>{
      //   if(place.lng > bound.ia.j && place.lng < bound.ia.l && place.lat > bound.na.j && place.lat < bound.na.l ){
      //     document.getElementById("onView").innerHTML += carta(place)
      //   }
      // })
      counter++
    });


  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });

  
  
  // console.log(place);
});

    // console.log(places);
  });
}



startMap();