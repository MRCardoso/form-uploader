let express = require('express'),
	app = express(),
	uploader = require('uploader-go-bucket'),
	bodyParser = require('body-parser'),
	open = require("open"),
	port = 3000;

/*
| ------------------------------------------------------------------
| Configuration, define engine of home page
| ------------------------------------------------------------------
*/
app.set('view engine', 'ejs');
app.set('views', './public');
app.use('/src', express.static('./dist'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('./public'));

/*
| ------------------------------------------------------------------
| Render home page
| ------------------------------------------------------------------
*/
app.get('/', (req, res) => {
	res.render('index') 
});

/*
| ------------------------------------------------------------------
| Upload request
| ------------------------------------------------------------------
*/
app.post('/api/send', (req, res) => {
	uploader
		.uploader({uploadDir: './public/upload/'}, req)
		.then(file=>{
			res.json({
				message: 'sucesso no upload', 
				path: file.path, 
				file: file,
				data: file
			});
		}, err => {
			res.status(500).send({message: 'erro no upload'});
		});
});

app.post('/api/remove', (req, res) => {
	if( req.body.Keys.length> 0)
	{
		var fs = require('fs');
		req.body.Keys.map(row=>{
			if (fs.existsSync(row)) {
				fs.unlink(row);
			}			
		});
		res.json({message: 'sucesso ao remover arquivo'});
	}
	else{
		res.status(400).send({message: 'Nenhum arquivo para remover'});
	}
});

// open(`http://localhost:${port}`);

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
