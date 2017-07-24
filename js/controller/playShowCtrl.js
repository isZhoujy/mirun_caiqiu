mirun.controller('playShowCtrl',['$scope','$state','$timeout','$interval','$ionicTabsDelegate','mainService','pop',function($scope,$state,$timeout,$interval,$ionicTabsDelegate,mainService,pop){
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.showBar(false)
	});
}])