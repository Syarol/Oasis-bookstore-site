/**
 * Oasis bookstore site
 *
 * @Author Oleh Yaroshchuk 
 */

/**
 * Imports
*/

import {Cart} from './cart.js';
import {createNewEl} from './createNewElement.js';
import {GoogleMap} from './googleMap.js';

/**
 * Global variables
*/

var closeBookModal = document.getElementById('close_book_modal');
var categoriesList = document.getElementById('categories_list');
var authorsList = document.getElementById('authors_list');
var publishersList = document.getElementById('publishers_list');
var categoriesListTitle = document.getElementById('categories_list_title');
var authorsListTitle = document.getElementById('authors_list_title');
var publishersListTitle = document.getElementById('publishers_list_title');
var contactModalLink = document.getElementById('contact');
var foundedShowMore =  document.getElementById('founded_show_more');
var closeContactModal = document.getElementById('close-contact-modal');
var goodsInCart = [];
var contactModal = document.getElementById('about_section_wrapper');
var countInsideCart = document.getElementById('count_inside_cart');
var openCart = document.getElementById('cart_open');
var at = encodeURIComponent('@');
//var foundedPhotos = document.getElementsByClassName('founded-item-photo');
var cart;

/**
 * Functions
*/

function changePlusMinus(item){
	if (item.className == 'far fa-minus-square') {
		item.className = 'far fa-plus-square';
	} else if(item.className == 'far fa-plus-square'){
		item.className = 'far fa-minus-square';
	}	
}

function updateAllGoodsTotal(){
	let temp = 0;
	for (let item of goodsInCart){
		temp += item.total;
	}

	cartAllGoodsTotal.textContent = '$' + temp.toFixed(2);

	allGoodsCount();   

	function allGoodsCount(){
		let allTotal = 0;
		for (let item of goodsInCart){
			allTotal += item.count;
		}

		if (allTotal == 0) countInsideCart.textContent = '';
		else countInsideCart.textContent = ' (' + allTotal + ')';    
	} 
}

function addToCartArray(goods){
	getCartFromServer();
	cart.updateInCart(goodsInCart);

	if (goodsInCart.length != 0) {
		let found = false;
		for (let item of goodsInCart) {
		    if (item.title == goods.title) {
	    		item.count++; 
	    		item.total = Number(item.price.replace(/\$/, '')) * item.count;
		    	found = true;
				break;
			}
		}
		if (!found) {
			newItemInCart(goods);
		}
	} else {
		newItemInCart(goods);
	}
	updateAllGoodsTotal();	
	syncCartwithServer();

	function newItemInCart(item){
		item.count = 1;
		item.total = Number(item.price.replace(/\$/, ''));
		goodsInCart.push(item);
	}	
}

function syncCartwithServer(){
	var oRq = new XMLHttpRequest(); //Create the object
	let goods = JSON.stringify(goodsInCart);

	oRq.open('post', '/sameCart');
	oRq.setRequestHeader('Content-Type', 'application/json');
	oRq.send(goods);

	oRq.onload = function () {
	  	//console.log(this.responseText);
	   	console.log(JSON.parse(this.responseText));
	   	updateAllGoodsTotal();	
	   	getCartFromServer(); 
	};
}

function getCartFromServer(){
	var oRq = new XMLHttpRequest(); //Create the object
	oRq.open('post', '/getCart');
	oRq.send();

	oRq.onload = function () {
	   	goodsInCart = JSON.parse(this.responseText);
	   	console.log(goodsInCart);
	   	updateAllGoodsTotal();
	};
}

function sendMessageToShop(){
	let message = {};
	message.title = document.querySelector('input[title=title]').value;
	message.email = document.querySelector('input[title=email]').value.replace(/\@/g, at);
	if (message.title != '' && message.email != '') {
		message.subject = document.querySelector('input[title=subject]').value;
		message.message = document.querySelector('textarea[title=message]').value;

		var oRq = new XMLHttpRequest(); //Create the object
		oRq.open('post', '/sendMessage');
		oRq.setRequestHeader('Content-Type', 'application/json');
		oRq.send(JSON.stringify(message));

		oRq.onreadystatechange = function () {
			if (oRq.readyState == 4 && oRq.status == 200) {
			    console.log(this.responseText);

				document.querySelector('input[title=title]').value = '';
				document.querySelector('input[title=email]').value = '';
				document.querySelector('input[title=subject]').value = '';
				document.querySelector('textarea[title=message]').value = '';

				document.getElementById('about_section_wrapper').style.display = 'none';
			}
		};
	}
}

function sidelistOnClick(list, listId){
	for (let item of document.querySelectorAll(listId + ' h3 i.far')){
		changePlusMinus(item);
	}
	if (list.style.maxHeight == '500px') {
		list.style.maxHeight = '30px';
	} else list.style.maxHeight = '500px';
}

function setBookDataToModal(data){
	document.getElementById('book_modal_wrapper').style.display = 'flex';
	document.getElementById('book_title').textContent = data.title;
	document.getElementById('book_photo').setAttribute('src', data.thumbnailUrl);
	document.getElementById('book_author').textContent = data.author;
	document.getElementById('book_categories').textContent = data.categories;
	document.getElementById('book_description').textContent = data.description;
	document.getElementById('book_price').textContent  = data.price;
	document.getElementById('input_book_title').setAttribute('name', data.title);
}

function getFoundedAndRender(query){
	var oRq = new XMLHttpRequest(); //Create the object
	oRq.open('post', '/getSearchResults');
	oRq.setRequestHeader('Content-Type', 'application/json');
	oRq.send(JSON.stringify(query));

	oRq.onload = function () {
	   	let founded = JSON.parse(this.responseText);
	   	for (let item of founded) renderFoundedItem(item);
	};
}

function getList(column, parent){
	var oRq = new XMLHttpRequest(); //Create the object
	oRq.open('get', '/getList?column=' + column);
	oRq.send();
	oRq.onload = function () {
		let categoriesList = JSON.parse(this.responseText);
	   	for (let item of categoriesList){
	   		createNewEl('input', document.getElementById(parent), {
	   			type: 'checkbox',
	   			name: column,
	   			value: item,
	   			callback: {click:{
	   				call: function (){
	   					let hiddenInput = document.querySelector('input[name=' + column + ']');
	   					if (this.checked) {
	   						if (hiddenInput.value == '') hiddenInput.value += this.value;
	   						else hiddenInput.value += ', ' + this.value ;
						} else hiddenInput.value = hiddenInput.value.replace(this.value + ', ', '');
	   				}
	   			}}
	   		});
	   		createNewEl('span', document.getElementById(parent), {
	   			content: item
	   		});
	    }
	};
}

function getSearchQueryFromURL(url){
	let query = {};

	var queryString = url.split('?')[1];
	if (!queryString) {
		document.getElementById('search-text').textContent = 'You need to search first';
	} else {
		var keyValuePairs = queryString.split('&');
		for (let i of keyValuePairs) {
			var keyValuePair = i.split('=');
			var paramName = keyValuePair[0];
			var paramValue = keyValuePair[1] || '';
			query[paramName] = decodeURIComponent(paramValue.replace(/\+/g, ' '));
		}
	}

	return query;
}

function renderFoundedItem(item){
	createNewEl('div', document.getElementById('founded_section'), {
 		class: 'founded-item grid-center-items', 
 		nested: [
 			createNewEl('img', false, {
 				class: 'founded-item-photo',
 				pseudo: item.title,
 				src: item.thumbnailUrl
 			}),
 			createNewEl('h3', false, {
 				content: item.title
 			}),
 			createNewEl('span', false, {
 				content: 'by ' + item.author
 			}),
 			createNewEl('span', false, {
 				content: item.price
 			}),
 			createNewEl('input', false, {
 				type: 'button',
 				name: item.title,
 				class: 'button',
 				value: 'Add to cart',
 				callback: {click:{
 					call: () => addToCartArray(item)
 				}}
 			})
 		]
 	});
}

/**
 * Event Listeners
*/

categoriesListTitle.onclick = () => sidelistOnClick(categoriesList, '#categories_list');

authorsListTitle.onclick = () => sidelistOnClick(authorsList, '#authors_list');

publishersListTitle.onclick = () => sidelistOnClick(publishersList, '#publishers_list');

document.addEventListener('DOMContentLoaded', () => {
	let query = getSearchQueryFromURL(window.location.search);
	getFoundedAndRender(query);

	getCartFromServer();

	if (!cart){
		cart = new Cart(openCart, goodsInCart);
	}

	getList('categories', 'categories_list');
	getList('author', 'authors_list');
	getList('publisher', 'publishers_list');

	let founded = document.getElementsByClassName('founded-item');
	if (founded.length > 12){
		for (let i = 12; i < founded.length; i++) {
			founded[i].style.display = 'none';
			foundedShowMore.style.display = 'block';
		}
	}

	/*for (let photo of foundedPhotos){
		photo.addEventListener('click', function(){
			let title = this.getAttribute('pseudo');	
			let book = {};

			function AJAXget(title) {
				let replaced = title.replace(/\+/g, plus);
			   	replaced = replaced.replace(/\#/g, hashtag);

			    var oReq = new XMLHttpRequest(); //Create the object
			    oReq.open('GET', 'get-data.php?title='+replaced, false);

			    oReq.onreadystatechange = function () {
			        if (oReq.readyState == 4 && oReq.status == 200) {
			            let res = JSON.parse(this.responseText);
			            setBookDataToModal(res);
			        }
			    };

			    oReq.send();
			}

			AJAXget(title);

		});
	}*/

	var locationMap = new GoogleMap();//connect and load map of shop location

}); 

foundedShowMore.onclick = () => {
	let founded = document.getElementsByClassName('founded-item');
	if (founded.length > 12){
		for (let i = 0; i < 12; i++) {
			founded[i].style.display = 'none';
		}
		for (let i = 12; i < founded.length; i++) {
			founded[i].style.display = 'grid';
		}

	}
	foundedShowMore.style.display = 'none';
	document.getElementById('founded_hide_more').style.display = 'block';
};

document.getElementById('founded_hide_more').onclick = () => {
	let founded = document.getElementsByClassName('founded-item');
	if (founded.length > 12){
		for (let i = 0; i < 12; i++) {
			founded[i].style.display = 'grid';
		}

		for (let i = 12; i < founded.length; i++) {
			founded[i].style.display = 'none';
		}
	}
	foundedShowMore.style.display = 'block';
	document.getElementById('founded_hide_more').style.display = 'none';
};

document.onclick = function(e) {
	if (e.target == contactModal) {
		contactModal.style.display = 'none';
	}

	if (e.target == document.getElementById('book_modal_wrapper')) {
		document.getElementById('book_modal_wrapper').style.display = 'none';
	}
};

contactModalLink.onclick = () => contactModal.style.display = 'flex';

closeContactModal.onclick = () => contactModal.style.display = 'none';

document.getElementById('send_message').onclick = () => sendMessageToShop();

closeBookModal.onclick = () => document.getElementById('book_modal_wrapper').style.display = 'none';

/**
 * Export
*/

export {goodsInCart};
