mirun.controller('storeDrawCtrl',['$scope','$state','$timeout','$stateParams','$interval','$ionicTabsDelegate','$ionicSlideBoxDelegate','mainService','pop',function($scope,$state,$timeout,$stateParams,$interval,$ionicTabsDelegate,$ionicSlideBoxDelegate,mainService,pop){
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.$getByHandle('myTabs').showBar(false);
	});
	var storeGoods = JSON.parse(sessionStorage.getItem('storeGoods'))
	$scope.storeDraw = {
		topImg:JSON.parse(sessionStorage.getItem('storeGoods')).tp,//头部图片
		mc:JSON.parse(sessionStorage.getItem('storeGoods')).mc,//商品描述
		jd:JSON.parse(sessionStorage.getItem('storeGoods')).jg,//金豆数量
	}
	//兑换事件
	$scope.drawAction = function(){
		$state.go('tabs.personPrize');
		
	}
}]);