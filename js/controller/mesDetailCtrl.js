mirun.controller('mesDetailCtrl',['$scope','$state','$ionicScrollDelegate','$timeout','$stateParams','mainService','pop','webSocket',function($scope,$state,$ionicScrollDelegate,$timeout,$stateParams,mainService,pop,webSocket){
	$scope.state = {
		mesTitle:'',
		mesState:'',
		mesSystem:[],
		mesMatchList:'',
	};
	mesLoad();
	function mesLoad(){
		var mesObj = JSON.parse(sessionStorage.getItem('mesList'));
		switch($stateParams.tabs){
			case '1':
				$scope.state.mesSystem = mesObj.salist;
				$scope.state.mesTitle = '系统消息';
				$scope.state.mesState = 1;
				$timeout(function(){
					$ionicScrollDelegate.scrollBottom(true);
				})
			break;
			case '2':
				$scope.state.mesTitle = '赛事消息';
				$scope.state.mesState = 2;
				$scope.state.mesMatchList = mesObj.xtlist;
				$timeout(function(){
					$ionicScrollDelegate.scrollBottom(true);
				})
			break;
		}
	}
}])