let express = require('express');
let bodyParser = require('body-parser');
let ObjectID = require('mongodb').ObjectID;
//файл подключения к БД
let db = require('./db.connect');
let app = express();

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

app.get('/artists', async (req, res) => {
	try {
		//метод get экспортируется из файла подключния /db.connect к БД для унификации подключения
		const result = await db.get().collection('artists').find().toArray();
		res.send(result);

	} catch (e) {
		res.sendStatus(500);
		console.log(e);
	}
});
app.get('/artists/:id', async (req, res) => {
	try {
		const search = await db.get().collection('artists').findOne({_id : ObjectID(req.params.id)});
		res.send(search);
	} catch (e) {
		res.sendStatus(500);
		console.log(e);
	}
});
app.put('/artists/:id', async (req, res) => {
	try {
		await db.get().collection('artists').updateOne(
			{"_id" : ObjectID(req.params.id)},
			//добавляем модификатор записи $set по новым стандартам
			{$set: {"name" : req.body.name}}
		);
		res.sendStatus(200);
	} catch (e) {
		res.sendStatus(500);
		console.log(e);
	}
});
app.delete('/artists/:id', async (req, res) => {
	try {
		await db.get().collection('artists').deleteOne({_id:ObjectID(req.params.id)});
		res.sendStatus(200);
	} catch(e) {
		res.sendStatus(500);
		console.log(e);
	}
});
app.post('/artists', async (req, res) => {

	 let artist = {
				name: req.body.name
			};
	try {
		await db.get().collection('artists').insertOne(artist);
		res.send(artist)
	} catch (e) {
		res.sendStatus(500);
		console.log(e);
	}

});

db.connect('mongodb://localhost:27017/webapp', async (err) => {
		if(err) {
			console.log(err);
		}
		console.log('database connected');

	    app.listen('3012', async () => {
		console.log('app started muslim bey');
	})
});