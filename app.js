//const { response } = require('express')
const express = require('express')
const { request } = require('http')
const app = express()
const path = require('path')

app.use(express.static(__dirname + '/public'))
app.use(
	'/build/',
	express.static(path.join(__dirname, 'node_modules/three/build'))
)
app.use(
	'/jsm/',
	express.static(path.join(__dirname, 'node_modules/three/examples/jsm'))
)
app.listen(5000, () => console.log('visit http://127.0.0.1:5000'))