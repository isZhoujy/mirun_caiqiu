mirun.controller('userInfoCtrl',['$scope','$state','$stateParams','$interval','$ionicTabsDelegate','$ionicSlideBoxDelegate','$ionicScrollDelegate','$location','mainService','pop','webSocket',function($scope,$state,$stateParams,$interval,$ionicTabsDelegate,$ionicSlideBoxDelegate,$ionicScrollDelegate,$location,mainService,pop,webSocket){
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.showBar(false);
	});
	$scope.userInfoData = {};
	webSocket.send({'cmd':10016,'body':{'userid':parseInt($stateParams.id)}});
	$scope.$on('upData-otherUserInfo',function(){
		var res = mainService.otherUserInfo.get();
		if(res.result.result == 1){
			$scope.userInfoData = res.result.body;
			if(!$scope.userInfoData.tx){
				$scope.userInfoData.tx = 'img/userIcon/avatar.png';
			};
		}
	})
}])