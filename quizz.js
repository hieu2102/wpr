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
				// let selectedChoice = createNode('span')
				// selectedChoice.className = 'answercomment';
				// selectedChoice.innerHTML = "Your Answer"
				
				// append(label,selectedChoice)
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
	const url = "https://wpr-quiz-api.herokuapp.com/attempts/:id/submit";
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
		headers: {"content-type": "application/json;charset=UTF-8"},
		method: "POST",
		mode: "cors",
		body: requestBody
	};
	fetch(url,request)
	.then(response => response.json())
	.then(function(data){
		let correctAnswers  = data.correctAnswers,
		qIds = Object.keys(correctAnswers),
		answerList = data.answers,
		aIds = Object.keys(answerList),
		choiceList = document.querySelectorAll('.radiocontainer');
		
		for(i= 0;i < choiceList.length;i++){
			}
		}
	}
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
      		x[i].className = x[i].className.replace(" checkedlabel", "");
      		x[i].style.backgroundColor = '#ddd';
      	}
      	else{
      		x[i].style.backgroundColor = '#f1f1f1';
      	}
      }
  }
