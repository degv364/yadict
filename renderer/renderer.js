// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { remote } = require('electron')

const BrowserWindow = require('electron').remote.BrowserWindow
const path = require('path')


//hide everything at the beguinning
document.getElementById('nav_menu').style.display= 'none';
document.getElementById('enunciado').style.display= 'none';
document.getElementById('respuestas').style.display= 'none';
document.getElementById('resultado').style.display= 'none';
document.getElementById('search').style.display= 'none';

const startBtn = document.getElementById('startBtn')
const licenceBtn = document.getElementById('licenseBtn')
const codeBtn = document.getElementById('codeBtn')

startBtn.addEventListener('click', function (event) {
    var nav = document.getElementById('nav_menu');
    var top = document.getElementById('top');
    var version = document.getElementById('version');

    version.style.display = 'none';
    top.style.display= 'none';
    nav.style.display= 'block';
    nav.style.animation= "reFadeIn 5s forwards;";
    
    document.getElementById('enunciado').style.display= 'block';
    document.getElementById('enunciado').style.animation = "reFadeIn 2s forwards;";
    document.getElementById('respuestas').style.display= 'block';
    document.getElementById('resultado').style.display= 'block';
    document.getElementById('search').style.display= 'block';
})


licenseBtn.addEventListener('click', function (event) {
    remote.getCurrentWindow().loadURL('https://www.gnu.org/licenses/lgpl-3.0.en.html');
})


codeBtn.addEventListener('click', function (event) {
    remote.getCurrentWindow().loadURL('https://github.com/degv364/yadict');
})
