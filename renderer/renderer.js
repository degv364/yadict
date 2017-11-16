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

const nav_menu   = document.getElementById('nav_menu');
const enunciado  = document.getElementById('enunciado')
const options    = document.getElementById('options')
const result     = document.getElementById('resultado')
const search_box = document.getElementById('search')
const user_box   = document.getElementById('user')
const status     = document.getElementById('status')
const progress_bar = document.getElementById('progress_bar')

const input_name_box = document.getElementById('user_name_text')
const startBtn   = document.getElementById('startBtn')
const licenseBtn = document.getElementById('licenseBtn')
const codeBtn    = document.getElementById('codeBtn')
const quizBtn    = document.getElementById('quizBtn')

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
user_box.style.display   = 'none';
status.style.display     = 'none';

//global state variables, I dont like this solution too much
var global_exercises = false;
var global_is_first = true;
var global_exercise_index = -1;
var global_correct_option = false;
let solved_items = new Set();
var global_user_name = "";
var global_definitions = [];


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

function parse_dictionaries(){
    var exercises_data = fs.readFileSync('data/exercises.json','utf8', function(err, data){
	if (err) {
	    return console.log(err);
	}
	return data
    });
    
    global_exercises = JSON.parse(exercises_data);

    var definitions_data = fs.readFileSync('data/definitions.json','utf8', function(err, data){
	if (err) {
	    return console.log(err);
	}
	return data
    });
    
    global_definitions = JSON.parse(definitions_data);
}

function get_definition(idx){
    replace_dif_word(global_exercise_index, idx);
    //eliminate current buttons
    while (result.firstChild) {
	result.removeChild(result.firstChild);
    }
    var word = global_definitions[idx]["word"];
    var word_def = global_definitions[idx]["definition"];
    var result_header = "<h5>"+word+"</h5>";
    var example_header = "<h4> Ejemplo: </h4>";
    var word_example = global_definitions[idx]["example"];
    var alternatives_header = "<h4> Alternativas: </h4>";

    //create return button
    var btn = document.createElement("button");
    btn.setAttribute("id", "back-def");
    var t = document.createTextNode("Volver");       
    btn.appendChild(t);
    btn.addEventListener('click', function(event){
	display_result(global_exercise_index);
    });
    result.innerHTML = result_header+word_def+example_header+word_example+alternatives_header;
    //create alternatives
    var alt = global_definitions[idx]["alternatives"];
    for (i=0; i<alt.length; i++){
	create_alternative_button(idx, i);
    }
    //result.innerHTML = result.innerHTML+"</br></br>";
    result.appendChild(btn);
    
}

function replace_dif_word(index, idx, new_word){
    var temp_name = global_exercises[index]["name"];
    var temp_data = global_exercises[index]["info"];
    var word = global_definitions[idx]["word"];
    if (typeof new_word == 'undefined'){
	new_word = word;
    }
    //replace new lines
    temp_data = replaceAll(temp_data, '\n', "<br/>");
    //replace dif_words
    temp_data = replaceAll(temp_data, word, "<!-->");//workaround to recursive replacement
    temp_data = replaceAll(temp_data, "<!-->", "<b>"+new_word+"</b>");
    //replace at first word of sentence
    word = word.charAt(0).toUpperCase()+word.substring(1);
    new_word = new_word.charAt(0).toUpperCase()+new_word.substring(1);
    temp_data = replaceAll(temp_data, word, "<!-->");//workaround to recursive replacement
    temp_data = replaceAll(temp_data, "<!-->", "<b>"+new_word+"</b>");
    
    //Add name tag
    temp_data = "<h5> "+temp_name+"</h5> <br/><br/>"+temp_data
    display_enunciado_data(temp_data);
}

function display_enunciado_data(data){
    enunciado.innerHTML = data;
}

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
    progress_bar.style.width = percentage.toFixed(2).toString()+"%";
    progress_bar.innerHTML = percentage.toFixed(2).toString()+"%";
}

function display_enunciado(index){
    global_exercise_index = index;
    var temp_name = global_exercises[index]["name"];
    var temp_data = global_exercises[index]["info"];
    //repalce new lines
    temp_data = replaceAll(temp_data, '\n', "<br/>");
    //Add name tag
    temp_data = "<h5> "+temp_name+"</h5> <br/><br/>"+temp_data;
    display_enunciado_data(temp_data);  
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

function display_name(index){
    var text = "";
    if (index >= 0){
	text = global_exercises[index]["name"]+" --  "
    }
    text+=global_user_name;
    user_box.innerHTML = text;
    var temp = user_box.innerHTML;
}

function display_result(index){
    global_exercise_index = index;
    //eliminate current buttons
    while (result.firstChild) {
	result.removeChild(result.firstChild);
    }
    result.innerHTML = "<h5>Palabras complejas</h5>";
    //add new buttons
    var idx_max = global_definitions.length; 
    for (idx = 0; idx<idx_max; idx++){
	var word = global_definitions[idx]["word"];
	var question = global_exercises[index]["info"];
	if (question.includes(word)){
	    create_def_button(idx);
	}
	//also first word of sentence
	word = word.charAt(0).toUpperCase()+word.substring(1);
	if (question.includes(word)){
	    create_def_button(idx);
	}
    }  
}

function display_all(index){
    display_enunciado(index);
    display_options(index);
    display_name(index);
    display_result(index);
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

function create_def_button(idx){
    var input_id = global_definitions[idx]["word"];
    var btn = document.createElement("button");
    btn.setAttribute("id", input_id);
    btn.setAttribute("class", "nav-button");
    var t = document.createTextNode(input_id);       
    btn.appendChild(t);
    btn.addEventListener('click', function(event){
	get_definition(idx);
    });
    result.appendChild(btn);
}

function create_alternative_button(idx, i){
    var btn = document.createElement("button");
    btn.setAttribute("id", global_definitions[idx]["alternatives"][i]);
    btn.setAttribute("class", "nav-button");
    var t = document.createTextNode(global_definitions[idx]["alternatives"][i]);
    btn.appendChild(t);
    btn.addEventListener('click', function(event){
	var alt_word = global_definitions[idx]["alternatives"][i];
	replace_dif_word(global_exercise_index, idx, alt_word);
    });
    result.appendChild(btn);
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
    version.style.display    = 'none';
    top.style.display        = 'none';
    nav_menu.style.display   = 'block';
    nav_menu.style.animation = "reFadeIn 5s forwards;";
    
    enunciado.style.display   = 'block';
    enunciado.style.animation = "reFadeIn 2s forwards;";
    options.style.display     = 'block';
    result.style.display      = 'block';
    search_box.style.display  = 'block';
    user_box.style.display    = 'block';
    status.style.display      = 'block';
    
    progress_bar.style.width = '0%';

    if (global_is_first){
	global_is_first = false;

	parse_dictionaries();
	
	//create nav buttons
	for (index = 0; index < global_exercises.length; index++) {
	    create_nav_button(index);
	}
    }
    get_user_name();
    
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

backBtn.addEventListener('click', function(event){
    global_exercise_index = mod((global_exercise_index-1),(global_exercises.length));
    display_all(global_exercise_index);
})

nextBtn.addEventListener('click', function(event){
    global_exercise_index = mod((global_exercise_index+1),(global_exercises.length));
    display_all(global_exercise_index);
})
