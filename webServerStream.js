'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { error } = require('console');

let mimes = {
	'.htm': 'text/html',
	'.css': 'text/css',
	'.js': 'text/javascript',
	'.gif': 'text/gif',
	'.jpg': 'image/jpeg',
	'.png': 'image/png'
};

function fileAccess(filepath) {
	return new Promise((resolve, reject) => {
		// Check if the file is available or not
		fs.access(filepath, fs.F_OK, error => {
			if (!error) {
				resolve(filepath);
			} else {
				reject(error);
			}
		});
	});
}

function streamFile(filepath) {
	return new Promise((resolve, reject) => {
		let fileStream = fs.createReadStream(path);

		fileStream.on('open', () => {
			resolve(fileStream);
		})

		fileStream.on('error', () => {
			reject(error);
		})
	});
}

// function fileReader(filepath) {
// 	return new Promise((resolve, reject) => {
// 		fs.readFile(filepath, (error, content) => {
// 			if (!error) {
// 				resolve(content);
// 			} else {
// 				reject(error);
// 			}
// 		})
// 	});
// }


function webserver(req, res) {
	//If the route is '/' load index.html
	// otherwise load requested file
	let baseURI = url.parse(req.url);
	let filepath = __dirname + (baseURI.pathname == '/' ? '/index.htm' : baseURI.pathname);
	console.log(filepath);
	//Resolve content type mimes[.css]
	let contentType = mimes[path.extname(filepath)];

	fileAccess(filepath)
		.then(streamFile)
		.then(streamFile => {
			res.writeHead(200, { 'Content-type': contentType });
			//res.end(content, 'utf.8');
			fileStream.pipe(res);
		})
		.catch(error => {
			res.writeHead(404);
			res.end(JSON.stringify(error));
		});
}

http.createServer(webserver).listen(3000, () => {
	console.log('Webserver running on port 3000');
});
