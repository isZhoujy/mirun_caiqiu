mirun.controller('shareCodeCtrl',['$scope','$state','$stateParams','$timeout','$ionicLoading','$ionicTabsDelegate','mainService','pop',function($scope,$state,$stateParams,$timeout,$ionicLoading,$ionicTabsDelegate,mainService,pop){
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.$getByHandle('myTabs').showBar(false);
	});
	pop.loading();
	var img = new Image();
	img.src = 'http://api.duoniuapp.com/v1/User/GetUserQRcode?userid=19557';
	img.onload = function(){
		pop.loadHide();
	}
	$scope.tipsHide = function(){
		$scope.tips = !$scope.tips;
	};
	
	
}])