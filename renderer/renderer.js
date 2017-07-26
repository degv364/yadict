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
const options    = document.getElementById('options')
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
options.style.display    = 'none';
result.style.display     = 'none';
search_box.style.display = 'none';

//global state variables
var global_exercises = false;
var global_is_first = true;
var global_exercise_index = false;
var global_correct_option = false;


//Functions------------------------------------------------------------------
function display_enunciado(index){
    global_exercise_index = index;
    var enunciado = document.getElementById('enunciado');
    enunciado.innerHTML = global_exercises[index]["info"];  
}

function display_options(index){
    global_exercise_index = index;
    document.getElementById('option_a').innerHTML = global_exercises[index]["options"]["A"];
    document.getElementById('option_b').innerHTML = global_exercises[index]["options"]["B"];
    document.getElementById('option_c').innerHTML = global_exercises[index]["options"]["C"];
    document.getElementById('option_d').innerHTML = global_exercises[index]["options"]["D"];
    document.getElementById('option_e').innerHTML = global_exercises[index]["options"]["E"];
    global_correct_option = global_exercises[index]["answer"];
}

function display_all(index){
    	display_enunciado(index);
	display_options(index);
}


function create_nav_button(index){
    var input_id = global_exercises[index]["name"];
    var btn = document.createElement("button");
    btn.setAttribute("id", input_id);
    btn.setAttribute("class", "nav-button");
    var t = document.createTextNode(input_id);       
    btn.appendChild(t);
    btn.addEventListener('click', function(event){
	display_all(index);
    });
    document.getElementById('exercises_list').appendChild(btn);                    
}

//events-------------------------------------------------------------------
startBtn.addEventListener('click', function (event) {
    version.style.display    = 'none';
    top.style.display        = 'none';
    nav_menu.style.display   = 'block';
    nav_menu.style.animation = "reFadeIn 5s forwards;";
    
    enunciado.style.display   = 'block';
    enunciado.style.animation = "reFadeIn 2s forwards;";
    options.style.display  = 'block';
    result.style.display   = 'block';
    search_box.style.display      = 'block';

    if (global_is_first){
	global_is_first = false;

	var exercises_data = fs.readFileSync('data/exercises.json','utf8', function(err, data){
	    if (err) {
		return console.log(err);
	    }
	    return data
	});
	
	global_exercises = JSON.parse(exercises_data); 
	
	for (index = 0; index < global_exercises.length; index++) {
	    create_nav_button(index);
	}
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
    options.style.display    = 'none';
    result.style.display     = 'none';
    search_box.style.display = 'none';

    version.style.display = 'block';
    top.style.display     = 'block';
})

