
const ingredientes = document.querySelector("#ingredients")

// function name() {
//   let x = params
//   const pos = document.querySelector("#Pos")
//   pos.value += z
// }

function test(main,second) {
  document.querySelector("#listIngredientes").value += `${main},`
  document.querySelector("#kcal").value += `${second},`
  document.querySelector("#ingredienteslista").innerHTML = " "
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
      var ing = document.querySelector("#ingredients").value
      
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
            listaItem.innerHTML = `<p>label ${x.label} brand: ${x.brand} Kcals: ${x.nutrients.ENERC_KCAL}</p>   <button class="col-12 active  text-white rounded p-2" onclick="test('${x.label}',${x.nutrients.ENERC_KCAL})">Save ingredient</button> `
            listaItem.setAttribute("class","list-group-item") 
            document.querySelector("#ingredienteslista").appendChild(listaItem)
            

          });
        }
    );
  }

