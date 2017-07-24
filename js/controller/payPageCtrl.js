mirun.controller('payPageCtrl',['$scope','$state','$stateParams','$ionicTabsDelegate','$ionicSlideBoxDelegate','$ionicScrollDelegate','$location','mainService','pop','webSocket',function($scope,$state,$stateParams,$ionicTabsDelegate,$ionicSlideBoxDelegate,$ionicScrollDelegate,$location,mainService,pop,webSocket){
	var oIframe = document.querySelector("#myIframe");
	oIframe.src = $stateParams.src;
	var type = $stateParams.type;
	pop.loading();
	var ua = navigator.userAgent.toLowerCase();
	var isweixin = ua.match(/MicroMessenger/i) == "micromessenger";
	$scope.state = {
		zhifubaoShow : false
	};
	if(isweixin&&type==2){
		$scope.state.zhifubaoShow = true;
	}
	oIframe.addEventListener('load',function(){
		pop.loadHide();
	},false)
}])