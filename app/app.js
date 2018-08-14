'use strict';

const express	  = require('express');
const path   	  = require('path');
const session	  = require('express-session');
const getCart     = require('./lib/getCart');
const sendMessage = require('./lib/sendMessage');
const bodyParser  = require('body-parser');
const getCatalog = new (require('./lib/getCatalogItems'))(); 
const getItemData = require('./lib/getItemData');
const searchInCatalog = new (require('./lib/searchInCatalog'))();
const router = require('./routes/index');
const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/public'));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  secure: true,
  HttpOnly: true,
  saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(router);

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send('Something broke!');
});

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/goodsDetail', function(req, res){
	res.sendFile(path.join(__dirname + '/public/goodsDetail.html'));
});

app.get('/blog', function(req, res){
  res.sendFile(path.join(__dirname + '/public/blog.html'));
});

app.get('/shop', function(req, res){
  res.sendFile(path.join(__dirname + '/public/shop.html'));
});

app.get('/search', function(req, res){
  	res.sendFile(path.join(__dirname + '/public/search.html'));
});

app.post('/getSearchResults', function(req, res){
	console.log('50: ' + req.body);
	searchInCatalog.full(req.body, res);
});

app.post('/getItemData', function(req, res) {
	getItemData(req, res);
});

app.post('/getCart', function(req, res) {
	getCart(req, res);
});

app.get('/getSpecialMarked', function(req, res){
	console.log('53: ' + req.query.type);
	getCatalog.specialMarked(res, req.query.type);
});

app.post('/sameCart', function(req, res) {
	let data = req.body;
	req.session.booksInCart = data;
	res.send(JSON.stringify(data));
});

app.post('/sendMessage', function(req, res) {
	let message = req.body;
	res.send(sendMessage(message));
});

app.get('/getList', function(req, res){
	getCatalog.byColumn(req.query.column, res);
});

app.listen(3000);
