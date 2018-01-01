const express = require('express');
const bodyParser = require('body-parser');
//файл подключения к БД
const db = require('./db.connect');
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Artist = require('./controllers/artists');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
// // parse application/json
app.use(bodyParser.json());

app.get('/', async (req, res, next) => {
	try {
		res.send('hello api');
	} catch(e) {
		next(e);
	}
});

app.post('/artists', Artist.setAr);
app.get('/artists', Artist.getAll);
app.get('/artists/:id', Artist.showOne);
app.put('/artists/:id/update', Artist.actionUpdate);
app.delete('/artists/:id/delete', Artist.actionDelete);

db.connect('mongodb://localhost:27017/webapp', async (err) => {
		if(err) {
			console.log(err);
		}
		console.log('database connected');

	    app.listen('3012', async () => {
		console.log('app started muslim bey');
	})
});