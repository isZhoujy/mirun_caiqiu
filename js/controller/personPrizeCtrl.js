mirun.controller('personPrizeCtrl',['$scope','$state','$timeout','$ionicTabsDelegate','mainService','pop','webSocket',function($scope,$state,$timeout,$ionicTabsDelegate,mainService,pop,webSocket){
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.$getByHandle('myTabs').showBar(false);
		$scope.goodDetail = {
			topImg:JSON.parse(sessionStorage.getItem('storeGoods')).tp,//头部图片
			mc:JSON.parse(sessionStorage.getItem('storeGoods')).mc,//商品名称
			id:JSON.parse(sessionStorage.getItem('storeGoods')).id,//商品id
			ms:JSON.parse(sessionStorage.getItem('storeGoods')).ms,//商品描述
		};
	});
	$scope.personInfo = {
		userName:'',//收件人姓名
		phone:'',//收件人电话
		address:'',//收件人地址
	};
	//确认兑换
	$scope.personSure = function(){
		if($scope.personInfo.userName==''||$scope.personInfo.phone==''||$scope.personInfo.address==''){
			pop.alert_one('提示','<p>收件人、手机号、收货地址均不能为空！</p>','','确定')
		}else{
			var template = '<p>收件人:'+$scope.personInfo.userName+'</p><p>手机号:'+$scope.personInfo.phone+'</p><p>收货地址:'+$scope.personInfo.address+'</p>'
			pop.alertStake('确认',template,'','','',function(){
				personSure()
			})
		}
	};
	$scope.$on('upData-selfBeanChange',function(){//金豆100007
		var res = mainService.selfBeanChange.get();
		if(res.result.result==1){
			var userInfo = mainService.userInfoData.get();
			userInfo.selfBean = res.result.body.sl;
			mainService.userInfoData.set(userInfo);
		}
	})
	//点击兑换
	$scope.$on('upData-storeExchange',function(){
		var res = mainService.storeExchange.get();
		if(res.result.result==1){
			pop.loadAuto('恭喜您，兑换成功！','1500');
			window.history.go(-1);
		}else if(res.result.result==2){
			if(res.result.body==1){
				pop.loadAuto('该物品不存在！','1500');
			}else if(res.result.body==2){
				pop.alert('提示','金豆不足，请充值！','取消','前往充值',function(){},function(){
					$state.go('payCenter');
				});
			}
		}else if(res.result.result==259){
			
		}
	});
	function personSure(){
		var regExp = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/;
		if($scope.personInfo.userName.length>18||$scope.personInfo.userName.length<2){
			var PopupText="收件人姓名长度必须为2-18个字符！";
			pop.loadAuto(PopupText,'1500')
		}else if(!regExp.test($scope.personInfo.phone)){
			var PopupText="请输入正确的手机号码！";
			pop.loadAuto(PopupText,'1500')
		}else if($scope.personInfo.address.length>50||$scope.personInfo.address.length<4){
			var PopupText="收货地址长度必须为3-50个字符！";
			pop.loadAuto(PopupText,'1500')
		}else{
			webSocket.send({'cmd':10010,'body':{'id':$scope.goodDetail.id,'xingming':$scope.personInfo.userName,'dizhi':$scope.personInfo.address,'shouji':$scope.personInfo.phone}});
		}
	};
	
	
	
	
	
	
	
	
	
	
	
}])