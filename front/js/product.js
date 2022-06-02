let params = new URL(document.location).searchParams;
let id = params.get("id");

const button = document.getElementById("addToCart");

let productData = [];

/**
 * Description
 * appel des donnees du produits dans l'API et mis en place dans un tableau
 * @returns {promise}
 */
async function fetchProduct () {
    await fetch(`${apiUrl}/api/products/${id}`)
		.then((reponse) => reponse.json())
		.then((promise) => {
			productData = promise;
		})
		// mise en place d'une fonction en cas d'erreur d'affichage
		.catch((error) => {
			let seeItems = document.querySelector(".item");
			seeItems.innerHTML =
				"Impossible d'afficher nos produits, erreur requete API. Veuillez réessayer dans quelques instants <br>Si le problème persiste, contactez-nous.";
			seeItems.style.textAlign = "center";
			seeItems.style.padding = "30vh 0";
		});
};

/**
 * Description
 * Mis en place des donnees du produits choisie dans l'API dans le DOM
 * @returns {string}
 */
async function displayProduct () {
    await fetchProduct();
    // Mise en place de mon produit dans le DOM
    document.querySelector(".item__img").innerHTML = `
            <img src=${productData.imageUrl} alt="${productData.altTxt}">
            `;
    document.getElementById("title").innerHTML = `${productData.name}`;
    document.getElementById("price").innerHTML = `${productData.price}`;
    document.getElementById( "description").innerHTML = `${productData.description}`;

    // Implementation de la selection de couleur

    let select = document.getElementById("colors");

    productData.colors.forEach((color) => {
        let option = document.createElement("option");
        option.innerHTML = `${color}`;
        option.value = `${color}`;

        select.appendChild(option);
    });

    addBasket(productData);
};

displayProduct();

/**
 * Description
 * Fonction ajout au panier et envoie dans le local storage
 * @returns {Array.<String|Object>}
 */
function addBasket () {

    button.addEventListener("click", () => {
    // recuperation de la couleur
    const idcolor = document.getElementById("colors");
    let colorChoice = idcolor.value;

    // recuperation de la quantité
    const idQuantity = document.getElementById("quantity");
    let quantityChoice = idQuantity.valueAsNumber;

    if (quantityChoice > 0 && quantityChoice <= 100 && colorChoice != 0 && colorChoice != '') {
        // Création du produits qui sera mis dans le panier en ne mettant qu'une partie accessible dans le localStorage
        let choiceOfProduct = {
            idProduct: id,
            colorProduct: colorChoice,
            quantityProduct: quantityChoice
        };

        // tableau du local storage
        let arrayProduct = JSON.parse(localStorage.getItem("product"));

        //fenêtre pop-up
        function popupConfirmation () {
            if (
            window.confirm(
                `Votre commande de ${quantityChoice} ${productData.name} ${colorChoice} est ajoutée au panier ! Pour consulter votre panier, cliquez sur OK`
            )
            ) {
            window.location.href = "cart.html";
            }
        };

        /**
     * Description
     * Importation dans le local storage
     * Si le panier comporte déjà au moins 1 article
     * @param {Array.<String|Object>} arrayProduct
     * @returns {Array/}       
    */
        if (arrayProduct) {
            const resultFind = arrayProduct.find( (el) => el.idProduct === id && el.colorProduct === colorChoice );

            //Si le produit commandé est déjà dans le panier
            if (resultFind) { 

                let newQuantite = choiceOfProduct.quantityProduct + resultFind.quantityProduct;
                resultFind.quantityProduct = newQuantite;
                localStorage.setItem("product", JSON.stringify(arrayProduct));
                console.table(arrayProduct);
                popupConfirmation();
                //Si le produit commandé n'est pas dans le panier

            } else {

                arrayProduct.push(choiceOfProduct);
                localStorage.setItem("product", JSON.stringify(arrayProduct));
                console.table(arrayProduct);

                popupConfirmation();

            }

            //Si le panier est vide
        } else {

            arrayProduct = [];
            arrayProduct.push(choiceOfProduct);
            localStorage.setItem("product", JSON.stringify(arrayProduct));
            console.table(arrayProduct);

            popupConfirmation();

        }

    } else{

            alert("Veuillez choisir une couleur et une quantité valide !")
            
        }
    });
};
