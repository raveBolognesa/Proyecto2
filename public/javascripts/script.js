

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
    zoom: 1,
    center: Madrid
  });

  axios.get("https://tupperwire.herokuapp.com/products/mapa").then(responses => {
    console.log(responses.data);
    let jam = responses.data.Product;
    let places = [];
    jam
      .forEach(pig => places.push(pig))

    places
      .forEach(place => {
        console.log(place.Pos)
        new google.maps.Marker({
          position: {
            lat: place.lat,
            lng: place.lng
          },
          map: map,
          title: place.name
        });

        console.log(place);
      });

    console.log(places);
  });
}



startMap();