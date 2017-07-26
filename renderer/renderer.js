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
const user       = document.getElementById('user')
const status     = document.getElementById('status')
const progress_bar = document.getElementById('progress_bar')

const startBtn   = document.getElementById('startBtn')
const licenseBtn = document.getElementById('licenseBtn')
const codeBtn    = document.getElementById('codeBtn')

const quitBtn   = document.getElementById('quit')
const backBtn   = document.getElementById('back')
const nextBtn   = document.getElementById('next')

const option_ABtn = document.getElementById('option_a');
const option_BBtn = document.getElementById('option_b');
const option_CBtn = document.getElementById('option_c');
const option_DBtn = document.getElementById('option_d');
const option_EBtn = document.getElementById('option_e');

//hide everything at the beguinning
nav_menu.style.display   = 'none';
enunciado.style.display  = 'none';
options.style.display    = 'none';
result.style.display     = 'none';
search_box.style.display = 'none';
user.style.display       = 'none';
status.style.display     = 'none';

//global state variables
var global_exercises = false;
var global_is_first = true;
var global_exercise_index = false;
var global_correct_option = false;
let solved_items = new Set();


//Functions------------------------------------------------------------------
function option_check(input_answer){
    var correct_answer = global_exercises[global_exercise_index]["answer"];
    if (input_answer === correct_answer){
	solved_items.add(global_exercise_index);
	progress_bar.style.background = "#2db34a";
    }
    else{
	progress_bar.style.background = "#d34a17";
    }
    var percentage = solved_items.size/global_exercises.length * 100;
    progress_bar.style.width = percentage.toString()+"%";
    progress_bar.innerHTML = percentage.toString()+"%";
}

function display_enunciado(index){
    global_exercise_index = index;
    var enunciado = document.getElementById('enunciado');
    enunciado.innerHTML = global_exercises[index]["info"];  
}

function display_options(index){
    global_exercise_index = index;
    option_ABtn.innerHTML = global_exercises[index]["options"]["A"];
    option_BBtn.innerHTML = global_exercises[index]["options"]["B"];
    option_CBtn.innerHTML = global_exercises[index]["options"]["C"];
    option_DBtn.innerHTML = global_exercises[index]["options"]["D"];
    option_EBtn.innerHTML = global_exercises[index]["options"]["E"];
    
    global_correct_option = global_exercises[index]["answer"];
    progress_bar.style.backgound = '#2e6bdc';
}

function display_exercise_name(index){
    var temp = user.innerHTML;
    //FIXME: disabled temporarily
    //user.innerHTML = global_exercises[index]["name"]+temp;
}

function display_all(index){
    display_enunciado(index);
    display_options(index);
    display_exercise_name(index);
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
    options.style.display     = 'block';
    result.style.display      = 'block';
    search_box.style.display  = 'block';
    user.style.display        = 'block';
    status.style.display      = 'block';

    //FIXME: visit this in the future
    progress_bar.style.width = '0%';

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
    user.style.display       = 'none';
    status.style.display     = 'none';

    version.style.display = 'block';
    top.style.display     = 'block';
})

option_ABtn.addEventListener('click', function(event){
    option_check("A");
})
option_BBtn.addEventListener('click', function(event){
    option_check("B");
})
option_CBtn.addEventListener('click', function(event){
    option_check("C");
})
option_DBtn.addEventListener('click', function(event){
    option_check("D");
})
option_EBtn.addEventListener('click', function(event){
    option_check("E");
})
