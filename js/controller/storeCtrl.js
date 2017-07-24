mirun.controller('storeCtrl',['$scope','$state','$timeout','$interval','$ionicTabsDelegate','$ionicSlideBoxDelegate','$ionicViewSwitcher','$location','mainService','pop','webSocket',function($scope,$state,$timeout,$interval,$ionicTabsDelegate,$ionicSlideBoxDelegate,$ionicViewSwitcher,$location,mainService,pop,webSocket){
	pop.loadHide();
	var pageStore = 0;
	$scope.state = {
		noneCon:false,//上啦加载无内容
		storeLenth:1,
		selfBean:0,//自己的金豆
		headMesNoteState:false,//头部消息推送
	};
	$scope.productList = [];
	/*$timeout(function(){
		$ionicSlideBoxDelegate.update();
//		$ionicSlideBoxDelegate.loop(true);
	});*/
	selfBean();
	function selfBean(){
		if(localStorage.getItem('usertoken')){
			webSocket.send({'cmd':10009});
			if(mainService.userInfoData.get()){
				var userInfo = mainService.userInfoData.get();
				$scope.state.selfBean = userInfo.selfBean;
			}else{
				webSocket.send({'cmd':10016});
			};
			if(mainService.hotCarousel.get()){
				var res = mainService.hotCarousel.get();
				$scope.picList = res.result.body.list;
				$ionicSlideBoxDelegate.update();
			}else{
				webSocket.send({'cmd':10015});
			}
		}
	};
	//头部轮播
	$scope.$on('upData-hotCarousel',function(){
		var res = mainService.hotCarousel.get();
		if(res.result.result==1){
			$scope.picList = res.result.body.list;
			$ionicSlideBoxDelegate.update();
		}else{
			pop.drawWarn('轮播图获取信息失败',1500)
		}
	});
	//点击头部轮播跳转
	$scope.jumpCompete = function(item){
		if(item.type==1){
			$state.go('tabs.hot');
		}else if(item.type==2){
			$state.go('tabs.store');
		}else if(item.type==3){
			$state.go('activity',{src:item.tz});
			$ionicViewSwitcher.nextDirection("forward");
		}
	};
	//个人信息
	$scope.$on('upData-userInfo',function(){
		var res = mainService.userInfo.get();
		if(res.result.result==1){
			$scope.state.selfBean = res.result.body.jd;
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
		}else if(res.result.result==259){
			pop.drawWarn('个人信息获取失败',1500);
		};;
	});
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.$getByHandle('myTabs').showBar(true);
		if(mainService.headRound.get()){
			var res = mainService.headRound.get();
			headraoundAction(res.result.body.info);
		}
		if(mainService.userInfoData.get()){
			var userInfo = mainService.userInfoData.get();
			$scope.state.selfBean = userInfo.selfBean;
		}
	});
	$scope.$on('$ionicView.beforeLeave', function() {
	});
	$scope.$on('upData-storeData',function(){
		var res = mainService.storeData.get();
		$scope.productList = $scope.productList.concat(res.result.body.list);
		$scope.$broadcast("scroll.infiniteScrollComplete");
	});
	/*//上啦加载
	$scope.load_more = function(){
		if(pageStore>=$scope.state.storeLenth){
			$timeout(function(){
				$scope.state.noneCon = true;
				$scope.$broadcast("scroll.infiniteScrollComplete");
			},1000)
		}else{
			pageStore++;
			webSocket.send({'cmd':10009});
		};
		
	};*/
	
	$scope.jumpDetail = function(item){
		var items = JSON.stringify(item);
		sessionStorage.setItem('storeGoods',items);
		$state.go('tabs.storeDraw');
	}
	
	var MarmainQueeStop;
	//头部走马灯
	$scope.$on('upData-headRound',function(){//头部实时消息推送100005
		var res = mainService.headRound.get();
		if(res.result.result == 1){
			headraoundAction(res.result.body.info);
		}else{
			pop.drawWarn('走马灯获取信息失败',1500)
		}
	});
	function headraoundAction(infodata){
		window.cancelAnimationFrame(MarmainQueeStop)
		$scope.headMesNoteDe = infodata;
		$scope.state.headMesNoteState = true;
		$timeout(function(){
			var oMesNote  = document.querySelector(".store .mes_wrap");
			var oMesNote1 = document.querySelector(".store .mes_note1");
			var oMesNote2 = document.querySelector(".store .mes_note2");
			oMesNote2.innerHTML = oMesNote1.innerHTML;
			function MarmainQuee() {
				if(oMesNote.scrollLeft - oMesNote2.offsetWidth >= 0) {
					oMesNote.scrollLeft -= oMesNote2.offsetWidth;
				} else {
					oMesNote.scrollLeft++;
				}
				MarmainQueeStop = requestAnimationFrame(MarmainQuee)
			}
			MarmainQuee()
		})
	};
	//头部轮询消息
	/*mainService.getHeadMesNote('',function(res){
		$scope.headMesNoteDe = res[0].info;
		$timeout(function(){
			var oMesNote  = document.querySelector(".store .mes_wrap");
			var oMesNote1 = document.querySelector(".store .mes_note1");
			var oMesNote2 = document.querySelector(".store .mes_note2");
			oMesNote2.innerHTML = oMesNote1.innerHTML;
			MarmainQuee = function() {
				if(oMesNote.scrollLeft - oMesNote2.offsetWidth >= 0) {
					oMesNote.scrollLeft -= oMesNote2.offsetWidth;
				} else {
					oMesNote.scrollLeft++;
				}
				MarmainQueeStop = requestAnimationFrame(MarmainQuee)
			}
			MarmainQuee();
		})
	},function(e){
		console.log(e)
	});*/
	
	
}])