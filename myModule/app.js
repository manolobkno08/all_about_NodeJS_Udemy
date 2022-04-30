const Enigma = require('./enigma/index');
const eng = new Enigma('magrathea');

// console.log(eng.hello("Manuel"));

let encodeString = eng.encode("Don't Panic!");
let decodeString = eng.decode(encodeString);
console.log("Encoded: ", encodeString);
console.log("Decoded: ", decodeString);

let qr = eng.qrgen("http://www.google.com", "outImage.png");

qr
	? console.log("QR Code Created!")
	: console.log("QR Code Failed!");

