mirun.controller('beanPayCtrl',['$scope','$state','$stateParams','$timeout','$interval','$ionicTabsDelegate','$ionicViewSwitcher','$ionicViewSwitcher','mainService','pop','webSocket',function($scope,$state,$stateParams,$timeout,$interval,$ionicTabsDelegate,$ionicViewSwitcher,$ionicViewSwitcher,mainService,pop,webSocket){
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.showBar(false)
	});
	pop.loadHide()
	 $scope.beanList=[
	    {"waresId":1,"price":100},
	    {"waresId":2,"price":1000},
	    {"waresId":3,"price":5000},
	    {"waresId":4,"price":10000},
	    {"waresId":5,"price":20000}
	  ];
	$scope.state = {
		btnState:null,//选中的金豆数量
		goldBean:'',//自定义数量
		showPrice:0,//需要支付的金币数量
		showSelfPrice:0,//自己账户余额
	};
	if(mainService.userInfoData.mes){
		$scope.state.showSelfPrice = mainService.userInfoData.get().goldNumber;
	}else{
		$scope.state.showSelfPrice = 0;
	}
	//自定义金豆输入
	$scope.customChange = function(){
		$scope.state.showPrice = $scope.state.goldBean/100;
	};
	$scope.btnAction = function(item){
		$scope.state.btnState = item.waresId;
		$scope.state.showPrice = item.price/100;
	};
	$scope.beanCustom = function(){
		$scope.state.btnState = null
	};
	//兑换金豆按钮
	$scope.exchageAction = function(){
		if($scope.state.showPrice%1!==0){
			pop.drawWarn('请输入100倍数的金豆',1500)
		}else{
			if($scope.state.showPrice>$scope.state.showSelfPrice){
				pop.alert('提示','金币不足，请充值！','取消','充值',function(){},function(){
					$state.go('tabs.payCenter');
				})
			}else{
				webSocket.send({'cmd':10020,"body":{"jinbi":$scope.state.showPrice}});
			}
		};
	};
	$scope.$on('upData-exchangeGold',function(){//兑换金豆
		var res = mainService.exchangeGold.get();
		if(res.result.result==1){
			pop.drawWarn('兑换成功！',1500);
			$scope.state.showSelfPrice = res.result.body.jb;
			var userInfo = {
				name:res.result.body.mc,
				gender:res.result.body.xb,
				autoGraph:res.result.body.qm,
				birthday:res.result.body.sr,
				selfBean:res.result.body.jd,
				goldNumber:res.result.body.jb,
				selfYl:res.result.body.yl,
				selfYlL:res.result.body.yll,
				userIcon:res.result.body.tx
			};
			mainService.userInfoData.set(userInfo);
		}else{
			pop.drawWarn('金币不足',1500);
		}
	})
}])