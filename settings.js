$(document).ready(function (){
	
	renderPlayerTable();
	
	$('#add-player-btn').click(function (e){
		document.querySelector('#user-add-popup').classList.remove('hidden')
	})
	
	$('#player-save-btn').click(function (e){
		
		const playerName = $('#playerName').val();
		if(playerName){
			const playerNameList = JSON.parse(localStorage.getItem('PLAYER_NAME_LIST')) || {}
			if(!playerNameList[playerName]){
				playerNameList[playerName]= {
					playerName:playerName,
					addedDate: new Date(),
					points: 0
				}
			}
			localStorage.setItem('PLAYER_NAME_LIST',JSON.stringify(playerNameList))
			renderPlayerTable()
		}
		
	})
	
	
})

function renderPlayerTable(){
	const tbodyHtml = Object.values((JSON.parse(localStorage.getItem('PLAYER_NAME_LIST')) || {})).map(player=>{
		return `<tr>
                <td class="border px-4 py-2 ">${player.playerName}</td>
                <td class="border px-4 py-2">${convertDate(player.addedDate)}</td>
                <td class="border px-4 py-2">${player.points}</td>
            </tr>`
	}).join('')
	$('#playerListTable tbody').html(tbodyHtml)
}
function convertDate(dString){
	const dParts = dString.split('T')
	return dParts[0]+' '+dParts[1].split('.')[0]
}