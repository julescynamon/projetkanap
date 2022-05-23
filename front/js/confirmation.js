/**
 * Description
 * Fonction pour recuperer l'id de la commande et l'afficher
 * @returns {any}
 */

function displayOrderId(){

    const orderElement = document.getElementById("orderId");
    const url = new URL(document.location);
    const orderId = url.searchParams.get('orderId');
    orderElement.innerText = orderId;
    localStorage.clear();

}

displayOrderId();
