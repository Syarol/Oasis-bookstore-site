/**
 * Oasis bookstore site
 *
 * Registration page
 * 
 * @Author Oleh Yaroshchuk 
 */

/**
 * Imports
*/

import ServerInteract from './ServerInteraction.js';

/**
 * Global variables
*/

var form = document.getElementsByClassName('register-form')[0];
var formConfirmBtn = form.getElementsByClassName('register-btn')[0];
var nameField = form.getElementsByClassName('bb-ic-name')[0];
var surnameField = form.getElementsByClassName('bb-ic-surname')[0];
var emailField = form.getElementsByClassName('bb-ic-email')[0];
var passwordField = form.getElementsByClassName('bb-ic-password')[0];
var passwordRepeatField = form.getElementsByClassName('bb-ic-password-repeat')[0];
var errorMessage = form.getElementsByClassName('error-message')[0];

/**
 * Functions
**/

function showError(error){
	form.classList.add('form-error');
	form.classList.remove('form-no-error');
	errorMessage.textContent = error;
}

function hideError(){
	form.classList.remove('form-error');
	form.classList.add('form-no-error');	
	errorMessage.textContent = '';
}

/**
 * Event Listeners
*/

formConfirmBtn.onclick = () => {
	if (!passwordField.value && !passwordRepeatField.value && !passwordField.value && !nameField.value && !surnameField.value) {
		showError('Please, fill the fields above!');
	} else if (!nameField.value || !surnameField.value){
		showError('Please, enter your name!');
	} else if (!passwordField.value || !passwordRepeatField.value){
		showError('Please, write a password!');
	} else if (passwordField.value.lenght < 6) {
		showError('Your password too short!');
	} else if (passwordField.value !== passwordRepeatField.value){
		showError('Passwords not matches!');
	} else{
		ServerInteract.registerNewUser({
			firstName: nameField.value,
			lastName: surnameField.value,
			email: emailField.value,
			password: passwordField.value
		})
			.then(() => history.back());
	}
};

emailField.oninput = () => {
	ServerInteract.isUniqueUsed({email: emailField.value})
		.then(data => {
			console.log(data);
			if (data.isUsed){
				showError('Ooops! Email already used!');
			} else {
				hideError();
			}
		});
};