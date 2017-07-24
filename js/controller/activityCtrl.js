mirun.controller('activityCtrl',['$scope','$state','$stateParams','$ionicTabsDelegate','$ionicSlideBoxDelegate','$ionicScrollDelegate','$location','mainService','pop','webSocket',function($scope,$state,$stateParams,$ionicTabsDelegate,$ionicSlideBoxDelegate,$ionicScrollDelegate,$location,mainService,pop,webSocket){
	var oIframe = document.querySelector("#myIframe");
	oIframe.src = $stateParams.src;
	pop.loading();
	oIframe.addEventListener('load',function(){
		pop.loadHide();
	},false)
}])