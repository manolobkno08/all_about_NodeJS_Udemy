'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

let mimes = {
	'.htm': 'text/html',
	'.css': 'text/css',
	'.js': 'text/javascript',
	'.gif': 'text/gif',
	'.jpg': 'image/jpeg',
	'.png': 'image/png'
};


function webserver(req, res) {
	//If the route is '/' load index.html
	// otherwise load requested file
	let baseURI = url.parse(req.url);
	let filepath = __dirname + (baseURI.pathname == '/' ? '/index.htm' : baseURI.pathname);
	console.log(filepath);

	// Check if the file is available or not
	fs.access(filepath, fs.F_OK, error => {
		if (!error) {
			console.log('Serving: ', filepath);
			//Read and serve the file
			fs.readFile(filepath, (error, content) => {
				if (!error) {
					//Resolve content type mimes[.css]
					let contentType = mimes[path.extname(filepath)];
					//Serve the file from buffer
					res.writeHead(200, { 'Content-type': contentType });
					res.end(content, 'utf-8');
				} else {
					res.writeHead(500);
					res.end('The server could not read the request');
				}
			});
		} else {
			//Server 404
			res.writeHead(404);
			res.end('Content not found');
		}
	});
}

http.createServer(webserver).listen(3000, () => {
	console.log('Webserver running on port 3000');
});
