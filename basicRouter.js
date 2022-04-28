'use strict';
const http = require('http');
const url = require('url');
const qs = require('querystring');

let routes = {
	'GET': {
		'/': (req, res) => {
			res.writeHead(200, { 'Content-type': 'text/html' });
			res.end('<h1>Hello NodeJS Router!</h1>');
		},
		'/about': (req, res) => {
			res.writeHead(200, { 'Content-type': 'text/html' });
			res.end('<h1>About page!</h1>');
		},
		'/api/getinfo': (req, res) => {
			///api/getinfo?prod=mac&color=black
			res.writeHead(200, { 'Content-type': 'application/json' });
			res.end(JSON.stringify(req.queryParams));
		}
	},
	'POST': {
		'/api/login': (req, res) => {
			let body = '';
			req.on('data', (data) => {
				body += data;
				if (body.length > 2097152) {
					res.writeHead(413, { 'Content-type': 'text/html' });
					res.end('<h3>Error: The file exceeds the limit - 2MB.</h3>', () => req.connection.destroy());
				}
			});

			req.on('end', () => {
				let params = qs.parse(body);
				console.log('Username: ', params['username']);
				console.log('Password: ', params['password']);
				res.end();
			});
		}
	},
	'NA': (req, res) => {
		res.writeHead(404);
		res.end('Content not found!');
	}
}

function router(req, res) {
	let baseURI = url.parse(req.url, true);
	let resolveRoute = routes[req.method][baseURI.pathname];
	//console.log('Request: ', baseURI);
	// console.log('Requested route: ', req.url);
	//console.log('Requested method: ', req.method);
	if (resolveRoute != undefined) {
		req.queryParams = baseURI.query;
		resolveRoute(req, res);
	} else {
		routes['NA'](req, res);
	}
}

http.createServer(router).listen(3000, () => {
	console.log('Server running on port 3000');
});
