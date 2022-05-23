let canapData = [];

/**
 * Description
 * Récupération des articles de l'API
 * @returns {promise}
 */
async function fetchCanap ()  {
        await fetch("http://localhost:3000/api/products")
        .then((reponse) => reponse.json())
        .then((promise) => {
            canapData = promise;
            // console.log(canapData);
        })
        // mise en place d'une fonction en cas d'erreur d'affichage
        .catch((error) => {
            let seeItems = document.querySelector(".items");
            seeItems.innerHTML ="Impossible d'afficher nos produits, erreur requete API. Veuillez réessayer dans quelques instants <br>Si le problème persiste, contactez-nous.";
            seeItems.style.textAlign = "center";
            seeItems.style.padding = "30vh 0";
        });
};


/**
 * Description
 * Affichage des donnees de l'API dans le dom
 * @returns {HTMLElements}
 */
async function canapDisplay () {

    await fetchCanap();
    
    // Insertion des données de l'API dans le DOM
    const products = canapData;

    for (let product in products){

        // Insertion de l'élément "a"
        let productLink = document.createElement("a");
        document.querySelector(".items").appendChild(productLink);
        productLink.href = `product.html?id=${canapData[product]._id}`;

        // Insertion de l'élément "article"
        let productArticle = document.createElement("article");
        productLink.appendChild(productArticle);

        // Insertion de l'image
        let productImg = document.createElement("img");
        productArticle.appendChild(productImg);
        productImg.src = canapData[product].imageUrl;
        productImg.alt = canapData[product].altTxt;

        // Insertion du titre "h3"
        let productName = document.createElement("h3");
        productArticle.appendChild(productName);
        productName.classList.add("productName");
        productName.innerHTML = canapData[product].name;

        // Insertion de la description "p"
        let productDescription = document.createElement("p");
        productArticle.appendChild(productDescription);
        productDescription.classList.add("productName");
        productDescription.innerHTML = canapData[product].description;

    }

};

// Affichage des donnees de l'API sur le navigateur

canapDisplay();
