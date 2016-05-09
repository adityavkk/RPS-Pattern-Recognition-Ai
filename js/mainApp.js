var mainApp = angular.module('mainApp',[]);

mainApp.controller('bodyController', ['$scope', function($scope){
	$scope.score = score;
	$scope.playerWins = score.totalLosses;
	$scope.playerLosses = score.totalWins;
	$scope.playerInputs = playerInputs;
	$scope.aiInputs = aiInputs;
	$scope.aiPrediction = aiPrediction($scope.playerInputs.inputHistory, $scope.aiInputs.inputHistory, $scope.score.totalGamesPlayed);
	$scope.viewAiPrediction = {};
	$scope.viewAiPrediction.toggle = false;

	$scope.playGame = function(playerInput){
		$scope.aiPrediction = aiPrediction($scope.playerInputs.inputHistory, $scope.aiInputs.inputHistory, $scope.score.totalGamesPlayed);		
		$scope.playerPlay = playerInput;
		mainGameFunction($scope.aiPrediction, playerInput, $scope.score);
		$scope.score = score;
		$scope.playerWins = score.totalLosses;
		$scope.playerLosses = score.totalWins;
		$scope.playerInputs = playerInputs;
		$scope.aiInputs = aiInputs;
		$scope.aiPrediction = aiPrediction($scope.playerInputs.inputHistory, $scope.aiInputs.inputHistory, $scope.score.totalGamesPlayed);
		$scope.aiPlay = aiInputs.currentInput;
		$scope.score.winningPercentage = Math.round((score.totalLosses/score.totalGamesPlayed)*100);
	};
}]);