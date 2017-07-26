// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { remote } = require('electron')

const BrowserWindow = require('electron').remote.BrowserWindow
const path          = require('path')
const fs            = require('fs');

//Constants-----------------------------------------------------------------
const top        = document.getElementById('top')
const version    = document.getElementById('version')

const nav_menu   = document.getElementById('nav_menu');
const enunciado  = document.getElementById('enunciado')
const answers    = document.getElementById('respuestas')
const result     = document.getElementById('resultado')
const search_box = document.getElementById('search')

const startBtn   = document.getElementById('startBtn')
const licenseBtn = document.getElementById('licenseBtn')
const codeBtn    = document.getElementById('codeBtn')

const quitBtn   = document.getElementById('quit')
const backBtn   = document.getElementById('back')
const nextBtn   = document.getElementById('next')

//hide everything at the beguinning
nav_menu.style.display   = 'none';
enunciado.style.display  = 'none';
answers.style.display    = 'none';
result.style.display     = 'none';
search_box.style.display = 'none';


//Functions------------------------------------------------------------------
function display_enunciado(input_id){
    var enunciado = document.getElementById('enunciado');
    enunciado.innerHTML = "Este es el enunciado, hey! "+input_id;  
}

function create_nav_button(input_id){
    var btn = document.createElement("button");
    btn.setAttribute("id", input_id);
    btn.setAttribute("class", "nav-button");
    var t = document.createTextNode(input_id);       
    btn.appendChild(t);
    btn.addEventListener('click', function(event){
	display_enunciado(input_id);
    });
    document.getElementById('exercises_list').appendChild(btn);                    
}

//events-------------------------------------------------------------------
startBtn.addEventListener('click', function (event) {
    version.style.display    = 'none';
    top.style.display        = 'none';
    nav_menu.style.display   = 'block';
    nav_menu.style.animation = "reFadeIn 5s forwards;";
    
    document.getElementById('enunciado').style.display   = 'block';
    document.getElementById('enunciado').style.animation = "reFadeIn 2s forwards;";
    document.getElementById('respuestas').style.display  = 'block';
    document.getElementById('resultado').style.display   = 'block';
    document.getElementById('search').style.display      = 'block';

    var exercises_data = fs.readFileSync('data/exercises.json','utf8', function(err, data){
	if (err) {
	    return console.log(err);
	}
	return data
    });

    var exercises = JSON.parse(exercises_data); 
    console.log(exercises);

    console.log(exercises.length.toString());

    for (i = 0; i < exercises.length; i++) {
	create_nav_button(exercises[i]["name"]);
    }
    
})


licenseBtn.addEventListener('click', function (event) {
    remote.getCurrentWindow().loadURL('https://www.gnu.org/licenses/lgpl-3.0.en.html');
})


codeBtn.addEventListener('click', function (event) {
    remote.getCurrentWindow().loadURL('https://github.com/degv364/yadict');
})

quitBtn.addEventListener('click', function(event) {
    nav_menu.style.display   = 'none';
    enunciado.style.display  = 'none';
    answers.style.display    = 'none';
    result.style.display     = 'none';
    search_box.style.display = 'none';

    version.style.display = 'block';
    top.style.display     = 'block';
})

