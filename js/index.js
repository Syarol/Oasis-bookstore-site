/**
 * Oasis bookstore site
 *
 * @Author Oleh Yaroshchuk 
 */

/**
 * Imports
*/

import {getScrolledPercentage, Carousel} from './carousel.js';

/**
 * Global variables
*/

var closeBestsellerModal = document.getElementById('close-bestseller-modal');
var arrivalCarouselMain = document.getElementById('new_arrival_list');
var arrivalsLeft = document.getElementById('arrivals_left');
var arrivalsRight = document.getElementById('arrivals_right');
var contactModal = document.getElementById('about_section_wrapper');
var contactModalLink = document.getElementById('contact');
var closeContactModal = document.getElementById('close-contact-modal');
var arrivalCarousel;

/**
 * Functions
*/

function loadGoogleMap(){
	let script = document.createElement('script');
	script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAEgnNcLXu3TxudcgyN9DnQ7uUwWy1hIpI&callback=loadMaps';
	script.type = 'text/javascript';
	script.id ='googleMap';
	document.getElementsByTagName('body')[0].append(script);
}

if(document.getElementById('googleMap') === null){
	loadGoogleMap();
}

/**
 * Event Listeners
*/

window.loadMaps = () => {
	var map = new google.maps.Map(document.getElementById('map-container'), {
		center: {lat:50.745151, lng:25.322764},
		zoom: 17,
		streetViewControl: false,
		mapTypeControl: false,
		fullscreenControl: false
	});

	var marker = new google.maps.Marker({
		position: {lat:50.745151, lng:25.322764},
		map: map,
		title: 'Oasis bookstore'
	});

	google.maps.event.addDomListener(map, 'idle', function() {
		google.maps.event.trigger(map, 'resize');
	});
};

document.addEventListener('DOMContentLoaded', function(){
	arrivalCarousel = new Carousel(arrivalsRight, arrivalsLeft, arrivalCarouselMain);

	//if long name of book than make font-size smaller
	for (let item of document.querySelectorAll('.arrival-item-inf h3')){
		if (item.textContent.length > 12) item.style.fontSize  = '1em';
	}
});

closeBestsellerModal.addEventListener('click', function(){
	document.getElementById('bestseller_modal_wrapper').style.display = 'none';
});

document.getElementById('open_bestseller_modal').addEventListener('click', function(){
	document.getElementById('bestseller_modal_wrapper').style.display = 'flex';
});

window.onclick = function(e) {
	if (e.target == document.getElementById('bestseller_modal_wrapper')) {
		document.getElementById('bestseller_modal_wrapper').style.display = 'none';
	}

	if (e.target == contactModal) {
		contactModal.style.display = 'none';
	}
}; 


contactModalLink.onclick = function(){
	contactModal.style.display = 'flex';
};

closeContactModal.onclick = function(){
	contactModal.style.display = 'none';
};



/*carousel.onscroll = () => {
    var scrollPercentage = 100 * this.scrollLeft / (this.scrollWidth - this.clientWidth);
    //console.log(scrollPercentage);
};*/