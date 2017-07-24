mirun.controller('goodsDetailCtrl',['$scope','$state','$timeout','$interval','$ionicTabsDelegate','$ionicSlideBoxDelegate','$ionicBackdrop','mainService','pop',function($scope,$state,$timeout,$interval,$ionicTabsDelegate,$ionicSlideBoxDelegate,$ionicBackdrop,mainService,pop){
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.$getByHandle('myTabs').showBar(false);
	});
	var storeGoods = JSON.parse(sessionStorage.getItem('storeGoods'))
	$scope.goodDetail = {
		topImg:JSON.parse(sessionStorage.getItem('storeGoods')).tp,//头部图片
		mc:JSON.parse(sessionStorage.getItem('storeGoods')).mc,//商品名称
		jd:JSON.parse(sessionStorage.getItem('storeGoods')).jg,//金豆数量
		ms:JSON.parse(sessionStorage.getItem('storeGoods')).ms,//商品描述
	}
	
}])