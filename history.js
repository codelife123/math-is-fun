const gameList = JSON.parse(localStorage.getItem('GAME_LIST')) || []
$(document).ready(function (){
	
	initialLoad()
	
	$('#time-sub-option button').click(function (event){
		const timeVal = parseInt(event.target.innerText.split(' ')[0])
		const data = gameList.filter(g=>g.gameMode=='timeout' && g.gameSubMode==timeVal).sort((a,b)=>{
			return b.score - a.score
		})
		renderTable(data)
	})
	
	$('#question-sub-option button').click(function (event){
		const questionVal = event.target.innerText
		const data = gameList.filter(g=>g.gameMode=='question' && g.gameSubMode==questionVal).sort((a,b)=>{
			return b.score - a.score
		})
		renderTable(data)
	})
	

})


function initialLoad(){
	const data = gameList.filter(g=>g.gameMode=='timeout' && g.gameSubMode==20).sort((a,b)=>{
		return b.score - a.score
	})
	renderTable(data)
}
function renderTable(data){
	/**
	 * const game = {
	 * 		playerName: selectedPlayer,
	 * 		gameMode: gameMode,
	 * 		gameSubMode:gameSubMode,
	 * 		date: new Date(),
	 * 		score: correctAnswerCount
	 * 	}
	 */
	const tbodyHtml = data.map(d=>{
		return ` <tr>
                <td class="border px-4 py-2">${d.playerName}</td>
                <td class="border px-4 py-2">${convertDate(d.date)}</td>
                <td class="border px-4 py-2">${d.score}</td>
            </tr>`
	}).join('')
	
	$('#highest-score-table tbody').html(tbodyHtml)
}

function convertDate(dString){
	const dParts = dString.split('T')
	return dParts[0]+' '+dParts[1].split('.')[0]
}