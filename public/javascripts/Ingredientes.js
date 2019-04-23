
const ingredientes = document.querySelector("#ingredientes")

// function name() {
//   let x = params
//   const pos = document.querySelector("#Pos")
//   pos.value += z
// }

function test(main) {
  document.querySelector("#Pos").value += main
}
// function name() {
  //   axios
  //   .get(
    //     "https://api.edamam.com/api/food-database/parser?ingr=banana&app_id=df38e5e3&app_key=81a458d03459fa77a9b2c4cf5214d760"
    //   )
    //   .then(Response => console.log(Response.data));
    
    // }
    
    function cambio(){
      console.log("hola")
      var ing = document.querySelector("#ingredientes").value
      
      axios
      .get(
        `https://api.edamam.com/api/food-database/parser?ingr=${ing}&app_id=df38e5e3&app_key=81a458d03459fa77a9b2c4cf5214d760`
        )
        .then(Response => {console.log(Response.data)
          let cosas = Response.data.hints
          cosas.forEach(element => {
            console.log(element.food.brand)
            var x = element.food

                        

            let listaItem = document.createElement("li")
            listaItem.innerHTML = `label ${x.label} brand: ${x.brand} <br> <p>Kcals: ${x.nutrients.ENERC_KCAL}</p> <button onclick="test(${x.nutrients.ENERC_KCAL})">mandar datos</button>`
            document.querySelector("#ingredienteslista").appendChild(listaItem)
            

          });
        }
    );
  }

