var currentQuestionIndex = 0;
var mathQuestionListLength =0
var correctAnswerCount=0
var gameMode = ''
var gameSubMode = ''
var selectedQuestionCount = 10
var mathQuestionList = []
var selectedPlayer = localStorage.getItem('SELECTED_PLAYER') || 'GUEST'

$(document).ready(function (){
	
	const gameModeSection = document.getElementById('gameModeSection');
	const quizSection = document.getElementById('quizSection');
	const modeSelection = document.getElementById('mode-selection');
	const options = document.getElementById('options');
	const timedOptions = document.getElementById('timed-options');
	const questionCountOptions = document.getElementById('question-count-options');
	
	const timedModeButton = document.getElementById('timed-mode');
	const questionCountModeButton = document.getElementById('question-count-mode');
	
	timedModeButton.addEventListener('click', function() {
		gameMode ='timeout'
		modeSelection.classList.add('hidden');
		options.classList.remove('hidden');
		timedOptions.classList.remove('hidden');
	});
	
	questionCountModeButton.addEventListener('click', function() {
		gameMode ='question'
		modeSelection.classList.add('hidden');
		options.classList.remove('hidden');
		questionCountOptions.classList.remove('hidden');
	});
	
	$('#timed-options button').click(function (event){
		
		var timeoutValue =  parseInt($(this).text().split(' ')[0])
		gameSubMode = timeoutValue
		const originalArray = getRandomQuestionAndAnswer('easy')
		const rand = getRandomElements(originalArray,timeoutValue*2)
		mathQuestionList= rand.map(o=>{
			o.otherOptions = shuffleArray(o.otherOptions)
			return o;
		})
		createQuestionCard(mathQuestionList[currentQuestionIndex])
		updateQuestionCountProgress()
		gameModeSection.classList.add('hidden');
		quizSection.classList.remove('hidden');
		setTimeout(timeoutHandler,timeoutValue*1000)
	})
	
	$('#question-count-options button').click(function (event){
		selectedQuestionCount = parseInt($(this).text().split(' ')[0])
		gameSubMode = selectedQuestionCount
		const originalArray = getRandomQuestionAndAnswer()
		const rand = getRandomElements(originalArray,selectedQuestionCount)
		mathQuestionList= rand.map(o=>{
			o.otherOptions = shuffleArray(o.otherOptions)
			return o;
		})
		mathQuestionListLength = mathQuestionList.length
		
		createQuestionCard(mathQuestionList[currentQuestionIndex])
		updateQuestionCountProgress()
		gameModeSection.classList.add('hidden');
		quizSection.classList.remove('hidden');
	})
	
	$('#nextQuizBtn').click(function (e){
		
		var passSoundClip = document.getElementById("passSoundClip");
		var failSoundClip = document.getElementById("failSoundClip");
		passSoundClip.pause()
		failSoundClip.pause()
		failSoundClip.currentTime = 0
		passSoundClip.currentTime = 0
		if(currentQuestionIndex<mathQuestionList.length-1){
			currentQuestionIndex +=1;
			createQuestionCard(mathQuestionList[currentQuestionIndex])
			updateQuestionCountProgress()
		}
		else {
			$('#quizSection').hide()
			$('#resultHeader').text(`You scored ${correctAnswerCount}/${mathQuestionListLength}`)
			$('#resultMessage').text(getResultMessage(correctAnswerCount))
			$('#resultSection').show()
			celebrate()
		}
	})
	
	$('#questionCard').on('click','button',function (e){
		
		if(e.target.innerText==mathQuestionList[currentQuestionIndex].answer){
			correctAnswerCount++;
			var passSoundClip = document.getElementById("passSoundClip");
			passSoundClip.play();
		}
		else{
			var failSoundClip = document.getElementById("failSoundClip");
			failSoundClip.play();
		}
		[...document.querySelectorAll('#questionCard button')].map(btn=>{
			if(btn.innerText!=mathQuestionList[currentQuestionIndex].answer){
				//mute wrong answers
				btn.classList.add('text-gray-700')
				btn.classList.add('text-opacity-50')
				if(btn.dataset.qindex==e.target.dataset.qindex){
					btn.innerHTML = `${btn.innerText}${getWrongIcon()}`
				}
			}
			else {
				btn.innerHTML = `${btn.innerText}${getCorrectIcon()}`
			}
		})
	})
	
	$('#homeButton').click(function (e){
		window.location.reload()
	})
	
	addUserSwitchEventListener()
})

function timeoutHandler(){
	$('#quizSection').hide()
	$('#resultHeader').text(`You scored ${correctAnswerCount}`)
	$('#resultMessage').text(getResultMessage(correctAnswerCount))
	$('#resultSection').show()
	celebrate()
}

function createQuestionCard(cardData){
	
	const mathsQuestion = cardData.mathsQuestion
	const buttonList = cardData.otherOptions.map((word,index)=>{
		return `<button data-qindex="${index}" class="whitespace-nowrap rounded-md font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:text-accent-foreground px-4 py-2 h-10 w-full justify-start text-base flex items-center transition-colors hover:bg-blue-100">
                    ${word}
                    <span class="text-sm text-gray-500 ml-auto"></span>
                </button>`
	})
	
	const cardContent = `<div class="flex flex-col gap-4 p-6">
            <h1 class="text-3xl font-semibold text-center">${mathsQuestion}</h1>
            <div class="grid grid-cols-1 gap-4" style="min-width: 300px;">
            	${buttonList.join('')}
            </div>
        </div>`
	$('#questionCard').html(cardContent)
}

function getWrongIcon(){
	return `<span class="text-sm text-gray-500 ml-auto"></span>
                    <span class="bg-red-500 rounded-full mr-1 p-1">
					  <svg
							  xmlns="http://www.w3.org/2000/svg"
							  width="16"
							  height="16"
							  viewBox="0 0 24 24"
							  fill="none"
							  stroke="currentColor"
							  stroke-width="2"
							  stroke-linecap="round"
							  stroke-linejoin="round"
							  class="text-white"
					  >
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
        			</span>`
}

function getCorrectIcon(){
	return `<span class="text-sm text-gray-500 ml-auto"></span>
                    <span class="bg-green-500 rounded-full mr-1 p-1">
                    	<svg xmlns="http://www.w3.org/2000/svg" width="16"
							height="16" viewBox="0 0 24 24" fill="none"
							stroke="currentColor" stroke-width="2"
							stroke-linecap="round" stroke-linejoin="round"
							class="text-white">
							<polyline points="20 6 9 17 4 12"></polyline>
						</svg>
					</span>`
}

function shuffleArray(array) {
	// Function to generate a random number between 0 and 1
	function getRandom() {
		return Math.random() - 0.5;
	}
	
	// Use the sort method with a randomizing function
	array.sort(getRandom);
	return array
}

function updateQuestionCountProgress(){
	$('#questionCountProgress').text(`Question: ${currentQuestionIndex+1}/${mathQuestionListLength}`)
}

function celebrate() {
	var soundClip = document.getElementById("tadaSoundClip");
	soundClip.play();
	let duration = 5 * 1000;
	let animationEnd = Date.now() + duration;
	let defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
	
	function randomInRange(min, max) {
		return Math.random() * (max - min) + min;
	}
	
	let interval = setInterval(function() {
		let timeLeft = animationEnd - Date.now();
		
		if (timeLeft <= 0) {
			return clearInterval(interval);
		}
		
		let particleCount = 50 * (timeLeft / duration);
		// since particles fall down, start a bit higher than random
		confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
		confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
	}, 250);
	performPostActions()
}

function getResultMessage(correctAnswerCount){
	const percentage = (correctAnswerCount/mathQuestionListLength)*100
	if(percentage<=25){
		return 'Keep practicing! You\'re on the right track.'
	}
	else if(percentage<=50){
		return 'Good effort! You\'re making progress.'
	}
	else if(percentage<=75){
		return 'Well done! You\'re doing great!'
	}
	else{
		return 'Great job! You\'re a true expert. Keep up the good work.'
	}
	
}

function getRandomElements(originalArray, m) {
	let  shuffledArray = originalArray
	for(let i=0;i<3;i++){
		const randomFactor = Math.random()
		shuffledArray = shuffledArray.slice().sort(() => Math.random() - randomFactor);
	}
	
	const selectedWords = shuffledArray.slice(0, m);
	
	const mathQuestionList = []
	selectedWords.map(selectedWord=>{
		
		let otherAnswers = []
		for(let i=1;i<5;i++){
			otherAnswers.push(selectedWord.a+i)
		}
		for(let i=1;i<5;i++){
			if(selectedWord.a-i>=0){
				otherAnswers.push(selectedWord.a-i)
			}
		}
		otherAnswers = otherAnswers.slice().sort(() => Math.random() - Math.random()).slice(0, 3)
		
		const questionObject = {
			mathsQuestion:selectedWord.q,
			otherOptions:[selectedWord.a].concat(otherAnswers),
			answer: selectedWord.a
		}
		mathQuestionList.push(questionObject)
	})
	
	return mathQuestionList
	
}

function getRandomQuestionAndAnswer(mode='easy'){
	
	const newArray = [];
	
	if(mode=='easy'){
		for (let i = 2; i <= 12; i++) {
			for (let j = 1; j <= 12; j++) {
				newArray.push({'q': `${i} * ${j}`, 'a': i * j});
				newArray.push({'q': `${i} + ${j}`, 'a': i + j});
				if(i>j){
					newArray.push({'q': `${i} - ${j}`, 'a': i - j});
				}
				if(i%j==0){
					newArray.push({'q': `${i} / ${j}`, 'a': i / j});
				}
				
			}
		}
	}
	else if(mode=='medium'){
		for (let i = 2; i <= 20; i++) {
			for (let j = 1; j <= 12; j++) {
				newArray.push({'q': `${i} * ${j}`, 'a': i * j});
				newArray.push({'q': `${i} + ${j}`, 'a': i + j});
				if(i>j){
					newArray.push({'q': `${i} - ${j}`, 'a': i - j});
				}
				if(i%j==0){
					newArray.push({'q': `${i} / ${j}`, 'a': i / j});
				}
			}
		}
	}
	
	return  newArray;
}

function addUserSwitchEventListener(){
	const userIcon = document.querySelector('#user-menu-button')
	userIcon.addEventListener('click', function() {
		if(document.querySelector('#user-selection-menu').classList.contains('hidden')){
			document.querySelector('#user-selection-menu').classList.remove('hidden')
		}
		else {
			document.querySelector('#user-selection-menu').classList.add('hidden')
		}
	});
	
	const playerNameList = JSON.parse(localStorage.getItem('PLAYER_NAME_LIST')) ||{}
	const userSelectionHtml = Object.values(playerNameList).map((p,index)=>{
		return `<a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-${index}">${p.playerName}</a>`
	}).join('')
	$('#user-selection-menu').html(userSelectionHtml)
	$('#user-selection-menu').on('click','a',function (event){
		
		selectedPlayer = event.target.innerText
		localStorage.getItem('SELECTED_PLAYER',selectedPlayer)
		document.querySelector('#user-selection-menu').classList.add('hidden')
		document.querySelector('#playerName').innerText = 'Player: '+selectedPlayer
		
	})
	
}

function performPostActions(){
	const game = {
		playerName: selectedPlayer,
		gameMode: gameMode,
		gameSubMode:gameSubMode,
		date: new Date(),
		score: correctAnswerCount
	}
	const gameList = JSON.parse(localStorage.getItem('GAME_LIST')) || []
	gameList.push(game)
	localStorage.setItem('GAME_LIST',JSON.stringify(gameList))
	
	const playerNameList = JSON.parse(localStorage.getItem('PLAYER_NAME_LIST')) || {}
	if(playerNameList[selectedPlayer]){
		playerNameList[selectedPlayer].points += correctAnswerCount
		localStorage.setItem('PLAYER_NAME_LIST',JSON.stringify(playerNameList))
	}
	
}