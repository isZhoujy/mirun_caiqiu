mirun.controller('payCenterCtrl',['$scope','$state','$stateParams','$ionicTabsDelegate','$ionicViewSwitcher','mainService','pop','webSocket',function($scope,$state,$stateParams,$ionicTabsDelegate,$ionicViewSwitcher,mainService,pop,webSocket){
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.showBar(false)
	});
	$scope.state= {
		selectBean:null,//选中其中之一
		pageHide:false,
		money:'',
		zhifubaoShow:false,
		stateZhifu:1,
	};
	$scope.beanPayList = [{"GiftCoinNum":0,"FirstCoinNum":0,"Money":100,"PayItemID":1,"ProductID":"dncq.jb.1","GiftNote":"","FirstNote":"","ImgUrl":"3f344378-a729-4899-87f5-434cbc4fa9d6.png","Title":"1金币"},{"GiftCoinNum":0,"FirstCoinNum":0,"Money":1200,"PayItemID":12,"ProductID":"dncq.jb.12","GiftNote":"","FirstNote":"","ImgUrl":"79552c14-be34-4ec2-88d6-8850fb0686ce.png","Title":"12金币"},{"GiftCoinNum":0,"FirstCoinNum":0,"Money":3000,"PayItemID":30,"ProductID":"dncq.jb.30","GiftNote":"","FirstNote":"","ImgUrl":"b48e282c-0b88-4225-a1e7-c780b4ced457.png","Title":"30金币"},{"GiftCoinNum":0,"FirstCoinNum":0,"Money":9800,"PayItemID":98,"ProductID":"dncq.jb.98","GiftNote":"","FirstNote":"","ImgUrl":"965d5181-9fb3-4eaa-a2c4-2d8a34added9.png","Title":"98金币"},{"GiftCoinNum":0,"FirstCoinNum":0,"Money":30800,"PayItemID":308,"ProductID":"dncq.jb.308","GiftNote":"0","FirstNote":"","ImgUrl":"1ba8cf29-d653-4d97-8480-744823d1dca4.png","Title":"308金币"},{"GiftCoinNum":0,"FirstCoinNum":0,"Money":51800,"PayItemID":518,"ProductID":"dncq.jb.518","GiftNote":"0","FirstNote":"","ImgUrl":"05be9cfd-5347-43ce-9d45-3fbc306702ae.png","Title":"518金币"},{"GiftCoinNum":0,"FirstCoinNum":0,"Money":119800,"PayItemID":1198,"ProductID":"dncq.jb.1198","GiftNote":"0","FirstNote":"","ImgUrl":"3332094e-1092-41f7-8b14-457f91be761b.png","Title":"1198金币"},{"GiftCoinNum":0,"FirstCoinNum":0,"Money":259800,"PayItemID":2598,"ProductID":"dncq.jb.2598","GiftNote":"0","FirstNote":"","ImgUrl":"a5123475-1b25-4a5d-9e95-6230d8b801e6.png","Title":"2598金币"},{"GiftCoinNum":0,"FirstCoinNum":0,"Money":499800,"PayItemID":4998,"ProductID":"dncq.jb.4998","GiftNote":"0","FirstNote":"","ImgUrl":"31623cfd-c6fa-4846-8ca2-616a52269705.png","Title":"4998金币"}];
	$scope.selectBean = function(item,index){
		$scope.state.selectBean = index;
		$scope.state.pageHide = true;
		$scope.state.money = item.PayItemID;
	};
	$scope.closePop = function(){
		$scope.state.pageHide = false;
	};
	$scope.zhifuPay = function(state){
		$scope.state.stateZhifu = state;
		if(state==1){
			webSocket.send({"cmd":10019,"body":{"type":state,"rmb":$scope.state.money}});
		}else if(state==2){
			webSocket.send({"cmd":10019,"body":{"type":state,"rmb":$scope.state.money}});
		}
	};
	$scope.$on('upData-payCenter',function(){
		var res = mainService.payCenter.get();
		if(res.result.result==1){
			if($scope.state.stateZhifu == 1){
				var url = JSON.parse(res.result.body.url).payurl;
				window.location.href=url;
			}else if($scope.state.stateZhifu == 2){
				var url = res.result.body.url;
				$state.go('payPage',{src:url,type:$scope.state.stateZhifu});
				$ionicViewSwitcher.nextDirection("forward");
			};
		}
	})
}])