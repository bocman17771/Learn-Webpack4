import * as $ from 'jquery' // * as $ означает что импортируем абсолютно все  из библиотеки в $ 

// Теперь можем эскпортировать и импортировать
import Post from './Post.js'
import WebpackLogo from './assets/minimo.png'
import './babel'
// import json from './assets/json.json'
// import xml from './assets/data.xml'
// import csv from './assets/data.xml'

import './styles/styles.css'
import './styles/less.less'
const post = new Post('Webpack Post Title', WebpackLogo)

$('pre').html(post.toString())
// console.log('Post to string', post.toString())

// console.log('json', json)
// console.log('xml', xml)
// console.log('csv', csv)