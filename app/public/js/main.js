/**
 * Oasis bookstore site
 *
 * Main page
 * 
 * @Author Oleh Yaroshchuk 
 * GitHub : https://github.com/Syarol
 */

/**
 * Imports
*/

import Cart from './cart.js';
import GoogleMap from './googleMap.js';
import ServerInteract from './ServerInteraction.js';
import RenderElements from './RenderElements.js';

/**
 * Global variables
*/

var closeBestsellerModal = document.getElementById('close-bestseller-modal');
var arrivalCarouselSection = document.getElementById('new_arrival_section');
var contactModal = document.getElementById('about_section_wrapper');
var contactModalLink = document.getElementById('contact');
var closeContactModal = document.getElementById('close-contact-modal');
var bestsellerModalWrapper = document.getElementById('bestseller_modal_wrapper');
var goodsInCart = [];
var openCart = document.getElementById('cart_open');
var cart;
var ServerInteraction;

/**
 * Event Listeners
*/

document.addEventListener('DOMContentLoaded', () => {
	ServerInteraction = new ServerInteract();
	ServerInteraction.getCart();

	cart = new Cart(openCart, goodsInCart);

	let Render = new RenderElements(); 

	ServerInteraction.getSpecialMarked('ARRIVALS', arrivalCarouselSection, Render.carouselItems, cart);
	ServerInteraction.getSpecialMarked('BESTSELLER', [document.getElementById('bestseller_preview'), document.getElementById('bestseller_modal')], Render.bestseller, cart);
	ServerInteraction.getSpecialMarked('EXCLUSIVE', document.getElementById('exclusives_container'), Render.exclusiveBooks, cart);

	ServerInteraction.getList('categories', document.getElementById('category-select'), Render.categoriesList);

	new GoogleMap();//connect and load map of shop location
});

closeBestsellerModal.onclick = () => bestsellerModalWrapper.style.display = 'none';

document.onclick = function(e) {
	if (e.target == bestsellerModalWrapper) {
		bestsellerModalWrapper.style.display = 'none';
	}

	if (e.target == contactModal) {
		contactModal.style.display = 'none';
	}
}; 

contactModalLink.onclick = () => contactModal.style.display = 'flex';

closeContactModal.onclick = () => contactModal.style.display = 'none';

document.getElementById('send_message').onclick = () => ServerInteraction.sendMessage(document.getElementById('contact-form'));
