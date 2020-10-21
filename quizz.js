function startQuiz(){
	var check;
	check = document.querySelectorAll('.radiocontainer');
	if (check.length >0){
		console.log('already started')
		return null;
	}
	const url = "https://wpr-quiz-api.herokuapp.com/attempts";
	const headers = {
		headers: {"content-type": "application/json;charset=UTF-8"},
		method: "POST",
		mode: "cors"
	};
	fetch(url,headers)
	.then(response=> response.json())
	.then(function(data){
		let submit = createNode('input')
			submit.type = 'submit'
			submit.className='btn-green'
			submit.onclick  = function(){
				submitQuiz()
			}
		
		let questions = data.questions;
		let content = document.querySelector('body')
		let form = createNode('form')
		form.className = "quiz-form";
		form.id= data._id
		
		return questions.map(function(question,i){
			let div = createNode('div'),
			questionNo = createNode('h3'),
			questionText = createNode('span'),
			answerDiv = createNode('div')

			div.className= 'question-block';
			div.id = question._id;
			answerDiv.className = 'answer-block';
			questionNo.innerHTML = `Question ${i+1} of ${questions.length}`
			questionText.innerHTML = `${question.text} <br>`

			append(div,questionNo)
			append(div,questionText)

			question.answers.forEach( (ans,x) => {
				ans = ans.replace("<", "&lt;")
				ans = ans.replace(">", "&gt;")
				
				let label = createNode('label'),input = createNode('input'),span = createNode('span');
				input.type = 'radio';
				label.name = question._id;
				input.name = question._id;
				label.id = x;	
				input.id = x;
				input.className = 'questionChoice'
				label.innerHTML = `${ans}`;

				input.onclick= function() {
					clickRadio(this);
				}
				label.className= 'radiocontainer'
				span.className = 'checkmark';
				append(label,input)
				append(label,span)
				append(answerDiv,label)

			})
			append(div,answerDiv)
			append(form,div)

			
			append(content,form)
			append(content, submit)

		} 
			
		)
		
	})
}

function submitQuiz(){
	var attemptId = document.querySelectorAll('.quiz-form')[0];
	var url = "https://wpr-quiz-api.herokuapp.com/attempts/"+attemptId.id+"/submit";
	var payload = {};
	var answers = {};
	var requestBody = new FormData();
	var x = document.querySelectorAll('.questionChoice')
	for (i = 0; i < x.length;i++){
		if (x[i].checked){
			var questionId = x[i].name;
			var questionChoice = x[i].id;
			answers[questionId]=questionChoice;
		}
	}
	payload['answers'] = answers;
	requestBody.append("json", JSON.stringify(payload));
	var request = {
		headers: {"content-type": "application/javascript"},
		method: "POST",
		body: JSON.stringify(payload)
	};
	fetch(url,request)
	.then(response => response.json())
	.then(function(data){
		let 
		correctAnswers  = data.correctAnswers,
		qIds = Object.keys(correctAnswers),
		questionList = document.querySelectorAll('.question-block');
		for(i= 0;i < questionList.length;i++){
			// iterate over questions 

			// get correct answer index for the question 
			correctAnswer = null
			for (j=0; j < qIds.length; j++){
				if (questionList[i].id == qIds[j]){
					correctAnswer = correctAnswers[qIds[j]]
				}
			}

			// get choice list of the question 
			choiceList = questionList[i].getElementsByTagName('div')[0].children;
			for (k = 0; k < choiceList.length; k++){
				choiceList[k].children[0].disabled =  true;
				if (choiceList[k].children[0].checked){
					if (choiceList[k].id == correctAnswer){
						let selectedChoice = createNode('span')
						selectedChoice.className = 'answercomment';
						selectedChoice.innerHTML = "Correct Answer"
						append(choiceList[k],selectedChoice)
						choiceList[k].className = 'radiocontainer correct selected'
						break;
					}
					let selectedChoice = createNode('span')
					selectedChoice.className = 'answercomment';
					selectedChoice.innerHTML = "Your Answer"
					append(choiceList[k],selectedChoice)
					choiceList[k].className = 'radiocontainer wrong'

				}
				if (choiceList[k].id == correctAnswer){
					let selectedChoice = createNode('span')
					selectedChoice.className = 'answercomment';
					selectedChoice.innerHTML = "Correct Answer"
					append(choiceList[k],selectedChoice)
					choiceList[k].className = 'radiocontainer correct'
				}
				
			}
		}
	})
}

function createNode(element) {
  return document.createElement(element); // Create the type of element you pass in the parameters
}

function append(parent, el) {
  return parent.appendChild(el); // Append the second parameter(element) to the first one
}

function clickRadio(element){
	 var n, i, x, q;
      n = element.id;
      q = element.name;
      x = document.querySelectorAll('.radiocontainer')
      for (i = 0; i< x.length;i++){
      	if (x[i].name == q && x[i].id ==n){
      		x[i].className = 'radiocontainer selected'
      		// x[i].style.backgroundColor = '#ddd';
      	}
      	else{
      		x[i].className = 'radiocontainer'
      		// x[i].style.backgroundColor = '#f1f1f1';
      	}
      }
  }
