

const { remote } = require('electron')

const BrowserWindow = require('electron').remote.BrowserWindow
const path          = require('path')
const fs            = require('fs');
const url = require('url')


const nextBtn  = document.getElementById('next')
const endQuizBtn = document.getElementById('end-quiz')
const beginQuizBtn = document.getElementById('begin-quiz')
const enunciado = document.getElementById('enunciado')
const options = document.getElementById('options')
const progress_bar = document.getElementById('progress_bar')
const answers = document.getElementById('answers')

const option_ABtn = document.getElementById('option_a');
const option_BBtn = document.getElementById('option_b');
const option_CBtn = document.getElementById('option_c');
const option_DBtn = document.getElementById('option_d');
const option_EBtn = document.getElementById('option_e');

// Hide end quiz button
endQuizBtn.style.display = 'none';
progress_bar.style.display = 'none';
answers.style.display = 'none';

// Global variables for exercises
var global_exercises = false;
var global_exercise_index = -1;
var quiz_initialized = false;
var solved_items_cant = 0;
var global_student_answers = [];
var have_answered = false;

var correct_items = new Set();
var incorrect_items = new Set();

function mod(n, m){
    //n mod m
    // javascript module outputs negative numbers... :(
    var r = n%m;
    if (r<0){
	return m+r;
    }
    return r
}

function replaceAll(s_in, s_rep, s_new){
    while(s_in.includes(s_rep)){
	s_in = s_in.replace(s_rep, s_new);
    }
    return s_in;
}

function parse_dictionaries(){
    var exercises_data = fs.readFileSync('data/exercises.json','utf8', function(err, data){
	if (err) {
	    return console.log(err);
	}
	return data
    });
    
    global_exercises = JSON.parse(exercises_data);
}

function display_enunciado_data(data){
    enunciado.innerHTML = data;
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

function display_excercise(index){
    display_enunciado(index);
    display_options(index);
}

function display_all(index){
    display_excercise(index);
    display_options(index);
}

function display_answers(cant_correct, cant_incorrect){
    data = "Correctas: " + cant_correct.toString()+ ", Incorrectas: "+cant_incorrect.toString();
    for (index = 0; index < global_exercises.length; index++){
	data += "<br><br><br>";
	data += "<b>"+global_exercises[index]["name"]+"</b>  ";
	data += "Estudiante: "+global_student_answers[index]+" Correcta: "+global_exercises[index]["answer"]+"<br><br>"
	data += global_exercises[index]["info"] + "<br><br>"
	data += "A)" + global_exercises[index]["options"]["A"] + "<br>"
	data += "B)" + global_exercises[index]["options"]["B"] + "<br>"
	data += "C)" + global_exercises[index]["options"]["C"] + "<br>"
	data += "D)" + global_exercises[index]["options"]["D"] + "<br>"
	data += "E)" + global_exercises[index]["options"]["E"] + "<br>"
	data += "<br><br> Explicación <br>"
	data += global_exercises[index]["explanation"]
    }

    answers.innerHTML = data;
}

function option_check(input_answer){
    var correct_answer = global_exercises[global_exercise_index]["answer"];
    global_student_answers.push(input_answer)
    if (input_answer === correct_answer){
	correct_items.add(global_exercise_index);
    }
    else{
	incorrect_items.add(global_exercise_index);
    }
    // FIXME: use total excercises for quiz
    var percentage = (solved_items_cant)/global_exercises.length * 100;
    progress_bar.style.width = percentage.toFixed(2).toString()+"%";
    progress_bar.innerHTML = percentage.toFixed(2).toString()+"%";
}

function end_quiz(){
    quiz_initialized
    endQuizBtn.style.display = 'block';
    answers.style.display = 'block';
    var cant_correct_answers = correct_items.size;
    var cant_incorrect_answers = incorrect_items.size;
    display_answers(cant_correct_answers, cant_incorrect_answers);
}

option_ABtn.addEventListener('click', function(event){
    if (quiz_initialized && !have_answered){
	have_answered = true;
	option_check("A");
	option_ABtn.style.background = '#aaaaaa';
    }
})
option_BBtn.addEventListener('click', function(event){
    if (quiz_initialized && !have_answered){
	have_answered = true;
	option_check("B");
	option_BBtn.style.background = '#aaaaaa';
    }
})
option_CBtn.addEventListener('click', function(event){
    if (quiz_initialized && !have_answered){
	have_answered = true;
	option_check("C");
	option_CBtn.style.background = '#aaaaaa';
    }
})
option_DBtn.addEventListener('click', function(event){
    if (quiz_initialized && !have_answered){
	have_answered = true;
	option_check("D");
	option_DBtn.style.background = '#aaaaaa';
    }
})
option_EBtn.addEventListener('click', function(event){
    if (quiz_initialized && !have_answered){
	have_answered = true;
	option_check("E");
	option_EBtn.style.background = '#aaaaaa';
    }
})


nextBtn.addEventListener('click', function(event){
    //FIXME: use random generated sequence instead
    solved_items_cant+=1;
    if (quiz_initialized){
	if (global_exercise_index === global_exercises.length-1){
	    end_quiz();
	}
	else{
	    option_ABtn.style.background= '#2e6bdc';
	    option_BBtn.style.background= '#2e6bdc';
	    option_CBtn.style.background= '#2e6bdc';
	    option_DBtn.style.background= '#2e6bdc';
	    option_EBtn.style.background= '#2e6bdc';
	    have_answered = false;
	    global_exercise_index+=1;
	    display_all(global_exercise_index);
	}
    }
})

endQuizBtn.addEventListener('click', function(event){
    remote.getCurrentWindow().loadURL(url.format({
	pathname: path.join(__dirname, '../sections/index.html'),
	protocol: 'file:',
	slashes: true
    }))
})


beginQuizBtn.addEventListener('click', function(event){
    parse_dictionaries();
    global_exercise_index = 0;
    display_all(global_exercise_index);
    quiz_initialized = true;
    beginQuizBtn.style.display = 'none';
})

/// TIMER--------------------------------------------------------------------------

// Set the date we're counting down to
var countDownDate =(new Date().getTime())+ 5*60*1000; //5 min

// Update the count down every 1 second
var x = setInterval(function() {

  // Get todays date and time
  var now = new Date().getTime();

  // Find the distance between now an the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("CountDown").innerHTML = "Tiempo restante:<br> "
  + minutes + " : " + seconds ;

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
      document.getElementById("CountDown").innerHTML = "EXPIRED";
      end_quiz();
  }
}, 1000);
