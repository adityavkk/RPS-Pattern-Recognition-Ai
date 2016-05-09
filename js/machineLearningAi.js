//RPS machine-learning-Ai 

//RPS Axioms
//RPS array of game elements such that i is beaten by i+1 with overflow
var RPS = ['Rock', 'Paper', 'Scissors'];

//defeat returns element of RPS that defeats a particular input
function defeat(input){
	for (var i = RPS.length - 1; i >= 0; i--) {
		if(input == RPS[i])
			if (i == RPS.length - 1)
				return RPS[0];
			else
				return RPS[i+1];
	}
}

//store inputs - player inputs currentInput
var playerInputs = {
	inputHistory : [],
	currentInput: ''		
};

var aiInputs = {
	inputHistory: [],
	currentPrediction: '',
	currentInput: ''
};


//Score object
var score = {
	totalWins : 0,
	totalDraws : 0,
	totalLosses : 0,
	totalGamesPlayed : 0
};

//randomPrediction returns a random prediction from RPS 
function randomPrediction(array){
	var randomNumberFrom0ToArrayLength = Math.floor(Math.random()*array.length);
	return(array[randomNumberFrom0ToArrayLength]);
}

//take userInputMatches and aiInputMatches and return match object for both and only userInputMatches
function matchFinder(userInputMatches, aiInputMatches){
	var bothMatches = 
	{
		two: [],
		three: [],
		four: []
	};

	var userMatches = 
	{
		two: [],
		three: [],
		four: []
	};

	var matches = [bothMatches, userMatches];

	for(var i = userInputMatches.length - 1; i >= 0; i--){
		for(var j = aiInputMatches.length - 1; j >= 0; j--){
			if (userInputMatches[i].arrayLength == aiInputMatches[j].arrayLength && userInputMatches[i].index == aiInputMatches[j].index) {
				if (userInputMatches[i].arrayLength == 4) {
					bothMatches.four.push(userInputMatches[i].nextElement);
				} else if (userInputMatches[i].arrayLength == 3){
					bothMatches.three.push(userInputMatches[i].nextElement);
				} else if (userInputMatches[i].arrayLength == 2){
					bothMatches.two.push(userInputMatches[i].nextElement);
				}
			}
		}
	}

	if(bothMatches.four.length == 0 && bothMatches.three.length == 0){
		for(var k = userInputMatches.length - 1; k >= 0; k--){
			if (userInputMatches[k].arrayLength == 4) {
				userMatches.four.push(userInputMatches[k].nextElement);
			} else if (userInputMatches[k].arrayLength == 3){
				userMatches.three.push(userInputMatches[k].nextElement);
			} else if (userInputMatches[k].arrayLength == 2){
				userMatches.two.push(userInputMatches[k].nextElement);
			}
		}
	}

	return matches;
}
//returns mode of an array

function modeArray(array)
{
    if(array.length == 0)
    	return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
    	var el = array[i];
    	if(modeMap[el] == null)
    		modeMap[el] = 1;
    	else
    		modeMap[el]++;	
    	if(modeMap[el] > maxCount)
    	{
    		maxEl = el;
    		maxCount = modeMap[el];
    	}
    }
    return maxEl;
}

//returns mode object 
function modeFinder(matchesObject){
	var modeElements = 
	{
		two: '',
		three: '',
		four: ''
	};

	modeElements.four = modeArray(matchesObject.four);
	modeElements.three = modeArray(matchesObject.three);
	modeElements.two = modeArray(matchesObject.two);

	return modeElements;
}

//userPatterns returns userInputMatches with all user input patterns, their indices and next element played by user
function userPatterns(userInputHistory){
	var userPatternArray = [];
	var userInputCompareArray = [];
	var userInputMatches = []; //store all the matches in patterns along with the next element played by user and index of element
	loop1:
	for(var j = 4; j >= 2; j--){
		userPatternArray = userInputHistory.slice(userInputHistory.length - j, userInputHistory.length);
		
		loop2:
		for (var i = 0; i < userInputHistory.length-j; i++) {
			userInputCompareArray = userInputHistory.slice(i, j+i);
			if(userInputCompareArray.toString() == userPatternArray.toString()){
				// console.log('in if');
				userInputMatches.push({
					matchArray : userInputCompareArray,
					nextElement : userInputHistory[i+j],
					index: i,
					arrayLength: j
				});
			}
		}
	}
	return userInputMatches;

}

//aiPatterns does the same as userPatterns but for aiInputHistory
function aiPatterns(aiInputHistory){
	var aiPatternArray = [];
	var aiInputCompareArray = [];
	var aiInputMatches = []; //store all the matches in patterns along with the next element played by user and index of element
	loop1:
	for(var j = 4; j >= 2; j--){
		aiPatternArray = aiInputHistory.slice(aiInputHistory.length - j, aiInputHistory.length);
		
		loop2:
		for (var i = 0; i < aiInputHistory.length-j; i++) {
			aiInputCompareArray = aiInputHistory.slice(i, j+i);
			if(aiInputCompareArray.toString() == aiPatternArray.toString()){
				//console.log('in if');
				aiInputMatches.push(										
					{
						matchArray : aiInputCompareArray,
						nextElement : aiInputHistory[i+j],
						index: i,
						arrayLength: j
					}					
					
				);
			}
		}
	}
	return aiInputMatches;
}

//aiPrediction returns a prediction from RPS, pass 2 input arrays - it looks for the same pattern of inputs from user and ai and predicts what user will throw next 
//returns prediction
function aiPrediction(userInputHistory, aiInputHistory, totalNumberOfGames){
	if(totalNumberOfGames < 6){
		return randomPrediction(RPS);
	} 

	var userMatchFound = false;
	var aiMatchFound = false; 
	
	var aiInputMatches = []; //store all the matches in patterns as well as the index of the matches played by ai

	//compare last 4/3/2 elements played by user with all 4/3/2 combinations played by user in history and store them in userPatterns
	var userPatternsArray = userPatterns(userInputHistory);

	//compare last 4/3/2 elements played by ai with all 4/3/2 combinations played by ai in history and store them in aiInputMatches (no need to save next element)
	var aiPatternsArray = aiPatterns(aiInputHistory);
	//compare the index of each userInputMatches with all corresponding indices of aiInputMatches - if any matches then return nextElement of respective userInputMatch - if not then return the nextElement of the last userInputMatch 
	var bothMatches = matchFinder(userPatternsArray, aiPatternsArray)[0];
	var userMatches = matchFinder(userPatternsArray, aiPatternsArray)[1];

	var prediction = '';
	if (modeFinder(bothMatches).four) {
		prediction = modeFinder(bothMatches).four;
	} else if (modeFinder(bothMatches).three){
		prediction = modeFinder(bothMatches).three;
	} else if (modeFinder(userMatches).four){
		prediction = modeFinder(userMatches).four;
	} else if (modeFinder(userMatches).three){
		prediction = modeFinder(userMatches).three;
	} else if (modeFinder(bothMatches).two){
		prediction = modeFinder(bothMatches).two;
	} else if(modeFinder(userMatches).two){
		prediction = modeFinder(userMatches).two;
	} else 
		prediction = randomPrediction(RPS);

	return(prediction);
	
}

//mainGameFunction runs the game, updates the score and stores input into history - change inputs to run subsequent games 
function mainGameFunction(prediction, actual, score){
	score.totalGamesPlayed++;
	playerInputs.inputHistory.push(actual);
	// aiInputs.currentPrediction = prediction;
	aiInputs.inputHistory.push(defeat(prediction));
	aiInputs.currentInput = defeat(prediction);	
	if (prediction == actual){
		score.totalWins++; 
		return 'Win'; 
	}
	else if (actual == defeat(prediction)){
		score.totalDraws++;
		return 'Draw';
	} else {
		score.totalLosses++;
		return 'Loss';
	}
}

console.log(score);




