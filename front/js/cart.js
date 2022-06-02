let arrayProduct = JSON.parse(localStorage.getItem("product")) || [];
console.table(arrayProduct);

const emptyCart = document.getElementById("cart__items");
const orderButton = document.getElementById("order");
const form = document.querySelector(".cart__order__form");

/**
 * Description
 * fonction pour récupérer les articles de l'API
 * @returns {promise}
 */
const fetchCanap = () =>
	fetch(`${apiUrl}/api/products`).then((reponse) => reponse.json());

/**
 * Description
 * creation du panier
 * @param {object[]} products
 * @returns {Array.<String>}
 */
function renderBasket(products) {
	// si le panier est vide
	// (n'est pas dans le localstorage ou si c'est un tableau vide)
	if (arrayProduct == 0) {
		const createEmptyCart = `<p>Votre panier est vide</p>`;
		emptyCart.innerHTML = createEmptyCart;
	} else {
		// si le panir est plein
		let cardBasket = "";
		// on parcours chaque éléments présent dans notre panier
		for (i = 0; i < arrayProduct.length; i++) {
			// on recherche ses informations dans les produits de l'API (pour le compléter avec leprice, image, ...)
			const product = products.find(
				(p) => p._id === arrayProduct[i].idProduct,
			);
			// si le produit existe dans l'API on l'affiche
			if (product) {
				// on crée un objet avec les informations saisies par l'utilisateur depuis lelocalstorage
				// et on y ajoute les informations du produit depuis l'API

				const item = Object.assign({}, arrayProduct[i], product);

				cardBasket += `
                    <article class="cart__item" data-id="${item.idProduct}" data-color="${item.colorProduct}">
                            <div class="cart__item__img">
                            <img src="${item.imageUrl}" alt="${item.altTxt}">
                            </div>
                            <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${item.name}</h2>
                                <p>${item.colorProduct}</p>
                                <p>${item.price} €</p>
                            </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity"min="1" max="100" value="${item.quantityProduct}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                            </div>
                        </article>
                    `;
			}
		}
		// om injecte notre panier dans le html
		emptyCart.innerHTML = cardBasket;
	}
}

async function createBasket() {
	// on récupère les informations depuis l'API
	const products = await fetchCanap();

	// on fait le rendu du panier
	renderBasket(products);
	modifQuantity(products);
	deleteProduct();

	totalItem(products);
}

createBasket();

/**
 * Description
 * function pour modifier la quantite
 * @returns {HTMLElements}
 */
function modifQuantity(products) {
	let modif = document.querySelectorAll(".itemQuantity");

	for (let j = 0; j < modif.length; j++) {
		modif[j].addEventListener("change", (el) => {
			el.preventDefault();

			// recuperation de l'élément á changer par rapport á son id et sa couleur
			let quantityModif = arrayProduct[j].quantityProduct;
			let valueQuantityModif = modif[j].valueAsNumber;

			const result = arrayProduct.find(
				(element) => element.valueQuantityModif !== quantityModif,
			);

			result.quantityProduct = valueQuantityModif;
			arrayProduct[j].quantityProduct = result.quantityProduct;

			localStorage.setItem("product", JSON.stringify(arrayProduct));

			totalItem(products);
		});
	}
}

/**
 * Descripti
 * Fonction pour supprimer un produit
 * @returns {array}
 */
function deleteProduct() {
	let deleteP = document.querySelectorAll(".deleteItem");

	for (let k = 0; k < deleteP.length; k++) {
		deleteP[k].addEventListener("click", (e) => {
			e.preventDefault();

			// recuperation de l'element a supprimer selon son id et sa couleur
			let deleteId = arrayProduct[k].idProduct;
			let deleteColor = arrayProduct[k].colorProduct;

			arrayProduct = arrayProduct.filter(
				(el) =>
					el.idProduct != deleteId || el.colorProduct != deleteColor,
			);

			localStorage.setItem("product", JSON.stringify(arrayProduct));

			alert("Votre produit a bien été supprimer du panier !");

			location.reload();
		});
	}
}

/**
 * Description
 * Fonction pour recuperer la quantite total et le prix total
 * @param {object[]} products Produits depuis l'API
 * @returns {any}
 */
function totalItem(products) {
	// recuperation du total de quantity
	let elmentsQuantity = document.getElementsByClassName("itemQuantity");
	let Lengthelments = elmentsQuantity.length;
	totalQuantity = 0;

	for (let l = 0; l < Lengthelments; ++l) {
		totalQuantity += elmentsQuantity[l].valueAsNumber;
	}

	let itemTotalQuantity = document.getElementById("totalQuantity");
	itemTotalQuantity.innerHTML = totalQuantity;

	// recuperation du prix total
	totalPrice = 0;

	for (let m = 0; m < Lengthelments; m++) {
		// on recherche les informations du produit depuis le retour API
		const product = products.find(
			(p) => p._id === arrayProduct[m].idProduct,
		);

		if (product) {
			// on crée un objet avec les informations saisies par l'utilisateur depuis llocalstorage
			// et on y ajoute les informations du produit depuis l'API
			const item = Object.assign({}, arrayProduct[i], product);
			totalPrice += elmentsQuantity[m].valueAsNumber * item.price;
		}
	}

	let totalPriceProduct = document.getElementById("totalPrice");
	totalPriceProduct.innerHTML = totalPrice;
}

//-------------------- Mise en place du formulaire -----------------------

// mise en place du bouton d'envoie du formulaire
orderButton.addEventListener("click", (e) => submitForm(e));
/**
 * Description
 * fonction pour envoyer le formulaire dans le local storage au click du boutton
 * @param {HTMLElement} e
 * @returns {response}
 */
function submitForm(e) {
	e.preventDefault();

	if (arrayProduct === null) {
		alert("Veuillez choisir un produit à commander s'il vous plait !");
		return;
	}

	if (invalidInput()) {
		alert("veuillez remplir tous les champs");
		return;
	}

	if (
		checkName(
			"firstName",
			"firstNameErrorMsg",
			"votre prenom n'est pas valide",
		)
	) {
		return;
	}

	if (
		checkName("lastName", "lastNameErrorMsg", "Votre nom n'est pas valide")
	) {
		return;
	}

	if (
		checkAdressCity(
			"address",
			"addressErrorMsg",
			"Votre adresse doit être valide",
		)
	) {
		return;
	}
	if (
		checkAdressCity("city", "cityErrorMsg", "Votre ville doit être valide")
	) {
		return;
	}
	if (checkEmail()) {
		return;
	}

	const body = requestTheBody();

	fetch(`${apiUrl}/api/products/order`, {
		method: "POST",
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/JSON",
		},
	})
		.then((response) => response.json())
		.then((data) => {
			document.location.href = `confirmation.html?orderId=${data.orderId}`;
		})
		.catch((error) => {
			alert("Probleme avec fetch" + error.message);
		});
}

/**
 * Description
 * Fonction pour creer le tableau d'infos clients a envoyer dans le localStorage
 * @returns {Array.<String|Object>}
 */
function requestTheBody() {
	//Récupération des coordonnées du formulaire client
	let Name = document.getElementById("firstName");
	let LastName = document.getElementById("lastName");
	let Adress = document.getElementById("address");
	let City = document.getElementById("city");
	let Mail = document.getElementById("email");

	//Construction d'un array depuis le local storage
	let totalIdProducts = [];

	for (let n = 0; n < arrayProduct.length; n++) {
		totalIdProducts.push(arrayProduct[n].idProduct);
	}

	const body = {
		contact: {
			firstName: Name.value,
			lastName: LastName.value,
			address: Adress.value,
			city: City.value,
			email: Mail.value,
		},
		products: totalIdProducts,
	};

	return body;
}

/**
 * Description
 * Fonction  au cas ou l'utilisateur ne rentre pas tous les champs de saisie
 * @returns {sring}
 */
function invalidInput() {
	const input = Array.from(form.querySelectorAll("input"));

	return input.find((input) => {
		return input.value == "";
	});
}

/**
 * Description
 * Fonction qui vas controler à l'aide des regex si l'entree du prenom et du nom est bonne
 * @param {string} inputSelector
 * @param {string} errorSelector
 * @param {string} message
 * @returns {string}
 */
function checkName(inputSelector, errorSelector, message) {
	const inputValue = document.getElementById(inputSelector).value;
	const regexName = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
	// j'ai chercher ce regex sur internet
	if (regexName.test(inputValue) === false) {
		document.getElementById(errorSelector).innerHTML = message;
		return true;
	}
	return false;
}

/**
 * Description
 * Fonction qui vas controler à l'aide des regex si l'entree de l'adresse et de la ville est bonne
 * @param {string} inputSelectorAdress
 * @param {string} errorAdressSelector
 * @param {string} adressCityMessage
 * @returns {string}
 */
function checkAdressCity(
	inputSelectorAdress,
	errorAdressSelector,
	adressCityMessage,
) {
	const addressOfLife = document.getElementById(inputSelectorAdress).value;
	const regexAddressOfLife = /^[a-zA-Z0-9\s,.'-]{3,}$/;

	if (regexAddressOfLife.test(addressOfLife) === false) {
		document.getElementById(errorAdressSelector).innerHTML =
			adressCityMessage;
		return true;
	}
	return false;
}

/**
 * Description
 * Fonction qui vas controler à l'aide des regex si l'entree de l'email est bonne
 * @returns {string}
 */
function checkEmail() {
	const email = document.getElementById("email").value;
	const regexEmail =
		/^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;

	if (regexEmail.test(email) === false) {
		document.getElementById("emailErrorMsg").innerHTML =
			"Votre email doit être valide";
		return true;
	}
	return false;
}
