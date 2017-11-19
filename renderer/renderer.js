// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { remote } = require('electron')

const BrowserWindow = require('electron').remote.BrowserWindow
const path          = require('path')
const fs            = require('fs');
const url = require('url')

//Constants-----------------------------------------------------------------
const top        = document.getElementById('top')
const version    = document.getElementById('version')

const input_name_box = document.getElementById('user_name_text')
const startBtn   = document.getElementById('startBtn')
const licenseBtn = document.getElementById('licenseBtn')
const codeBtn    = document.getElementById('codeBtn')
const quizBtn    = document.getElementById('quizBtn')

var global_user_name = "";



//Functions------------------------------------------------------------------
function replaceAll(s_in, s_rep, s_new){
    while(s_in.includes(s_rep)){
	s_in = s_in.replace(s_rep, s_new);
    }
    return s_in;
}

function mod(n, m){
    //n mod m
    // javascript module outputs negative numbers... :(
    var r = n%m;
    if (r<0){
	return m+r;
    }
    return r
}

function get_user_name(){
    var temp_user_name = input_name_box.value;
    if (temp_user_name != "Digita tu nombre"){
	global_user_name = temp_user_name.replace(/\W/g, '');
	display_name(-1)
    }
}

//events-------------------------------------------------------------------
startBtn.addEventListener('click', function (event) {
    remote.getCurrentWindow().loadURL(url.format({
	pathname: path.join(__dirname, '../sections/zen.html'),
	protocol: 'file:',
	slashes: true
    }))    
})


licenseBtn.addEventListener('click', function (event) {
    remote.getCurrentWindow().loadURL('https://www.gnu.org/licenses/lgpl-3.0.en.html');
})


quizBtn.addEventListener('click', function (event) {
    remote.getCurrentWindow().loadURL(url.format({
	pathname: path.resolve(__dirname, '../sections/quiz.html'),
	protocol: 'file:',
	slashes: true
    }))
})

codeBtn.addEventListener('click', function (event) {
    remote.getCurrentWindow().loadURL('https://github.com/degv364/yadict');
})
