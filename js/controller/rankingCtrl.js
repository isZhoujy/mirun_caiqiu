mirun.controller('rankingCtrl',['$scope','$state','$timeout','$interval','$ionicTabsDelegate','$ionicSlideBoxDelegate','$ionicScrollDelegate','$location','mainService','pop','webSocket',function($scope,$state,$timeout,$interval,$ionicTabsDelegate,$ionicSlideBoxDelegate,$ionicScrollDelegate,$location,mainService,pop,webSocket){
//	$scope.switchBtnName = ['排行榜','赛果'];
	$scope.switchRankingName = ['金豆','七日盈利','七日盈利率'];
	var pageBean = 0;
	var pageProfit = 0;
	var pageProfitCount = 0;
	$scope.state = {
		btnSwitch:0,//头部按钮点击切换
		rankSwitch:0,//周榜月帮总榜的切换
		rankingNoneCon:false,//下拉加载是否还有数据
		profitNoCon:false,//七日盈利
		profitCountNoCon:false,//七日盈利率
		beanLenth:1,//金豆总页数
		profitLenth:1,//七日总页数
		profitCountLenth:1,//利率总页数
	};
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.showBar(true);
		getuserInfo();
		$timeout(function(){
			if(!$scope.beanList.length&&localStorage.getItem('usertoken')){
				$scope.state.rankingNoneCon = false;
				webSocket.send({'cmd':10012,"body":{"yeshu":0,"leixing":1}});
				pageBean = 1;
			}else if(!$scope.beanList.length&&!localStorage.getItem('usertoken')){
				pageBean = 1;
			}
		})
	});
	var userId = JSON.parse(localStorage.getItem('usertoken'))?JSON.parse(localStorage.getItem('usertoken')).userId:'';
	$scope.userMe = {
		Bean:{'playerId':userId,'value':'-','rank':'榜外','playerImgUrl':''},
		Yl:{'playerId':userId,'value':'-','rank':'榜外','playerImgUrl':''},
		YlL:{'playerId':userId,'value':'-','rank':'榜外','playerImgUrl':''}
	};
	function getuserInfo(){
		if(localStorage.getItem('usertoken')){
			if(mainService.userInfoData.get()){
				var userInfo = mainService.userInfoData.get();
				$scope.userMe.Bean.value = userInfo.selfBean;
				$scope.userMe.Yl.value = userInfo.selfYl;
				$scope.userMe.YlL.value = userInfo.selfYlL;
				$scope.userMe.Bean.playerImgUrl = userInfo.userIcon;
				$scope.userMe.Yl.playerImgUrl = userInfo.userIcon;
				$scope.userMe.YlL.playerImgUrl = userInfo.userIcon;
				$scope.userMe.Bean.playerName = userInfo.name;
				$scope.userMe.Yl.playerName = userInfo.name;
				$scope.userMe.YlL.playerName = userInfo.name;
			}else{
				webSocket.send({'cmd':10016});
				pop.loading();
			}
		}
	};
	$scope.$on('upData-userInfo',function(){
		var res = mainService.userInfo.get();
		pop.loadHide();
		if(res.result.result==1){
			/*var res = mainService.userInfoData.get();*/
			$scope.userMe.Bean.value = res.result.body.jd;
			$scope.userMe.Yl.value = res.result.body.yl||'-';
			$scope.userMe.YlL.value = res.result.body.yll||'-';
			$scope.userMe.Bean.playerImgUrl = res.result.body.tx;
			$scope.userMe.Yl.playerImgUrl = res.result.body.tx;
			$scope.userMe.YlL.playerImgUrl = res.result.body.tx;
			$scope.userMe.Bean.playerName = res.result.body.mc;
			$scope.userMe.Yl.playerName = res.result.body.mc;
			$scope.userMe.YlL.playerName = res.result.body.mc;
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
		};
	});
	$scope.beanList = [];
	$scope.profitList =  [];
	$scope.profitCountList=  [];
	$scope.$on('upData-rankingData',function(){
		var res = mainService.rankingData.get();
		$scope.userMe.Bean.playerId = JSON.parse(localStorage.getItem('usertoken')).userId;
		$scope.userMe.Yl.playerId = JSON.parse(localStorage.getItem('usertoken')).userId;
		$scope.userMe.YlL.playerId = JSON.parse(localStorage.getItem('usertoken')).userId;
		if(res.result.body.lx==1){
			var beanListRes = res.result.body.list;
			$scope.state.beanLenth = res.result.body.zys;
			beanListRes.forEach(function(v){
				v.value = parseInt(v.value);
				if(v.playerId==$scope.userMe.Bean.playerId){
					$scope.userMe.Bean.rank = v.rank;
				}
			});
			if(!$scope.beanList.length){
				$scope.beanList.push($scope.userMe.Bean);
			}
			$scope.beanList = $scope.beanList.concat(res.result.body.list);
			$scope.$broadcast("scroll.infiniteScrollComplete");
		}else if(res.result.body.lx==2){
			var YlListRes = res.result.body.list;
			$scope.state.profitLenth = res.result.body.zys;
			YlListRes.forEach(function(v){
				v.value = parseInt(v.value);
				if(v.playerId==$scope.userMe.Yl.playerId){
					$scope.userMe.Yl.rank = v.rank;
				}
			});
			if(!$scope.profitList.length){
				$scope.profitList.push($scope.userMe.Yl);
			}
			$scope.profitList = $scope.profitList.concat(res.result.body.list);
			$scope.$broadcast("scroll.infiniteScrollComplete");
		}else if(res.result.body.lx==3){
			var YlLListRes = res.result.body.list;
			$scope.state.profitCountLenth = res.result.body.zys;
			YlLListRes.forEach(function(v){
				if(v.playerId==$scope.userMe.YlL.playerId){
					$scope.userMe.YlL.rank = v.rank;
				}
			});
			if(!$scope.profitCountList.length){
				$scope.profitCountList.push($scope.userMe.YlL);
			}
			$scope.profitCountList = $scope.profitCountList.concat(res.result.body.list);
			$scope.$broadcast("scroll.infiniteScrollComplete");
		}
	});
	//切换总榜周榜月榜
	$scope.rankSwitchAction = function(index){
		$scope.state.rankSwitch = index;
		switch(index){
			case 0:
				if(!pageBean){
					$scope.load_more();
				}
			break;
			case 1:
				if(!pageProfit){
					$scope.load_more();
				}
			break;
			case 2:
				if(!pageProfitCount){
					$scope.load_more();
				}
			break;
			
		}
	};
	//上啦加载
	$scope.load_more = function(){
		if($scope.state.rankSwitch==0){
			if(pageBean>=$scope.state.beanLenth){
				$timeout(function(){
					$scope.state.rankingNoneCon = true;
					$scope.$broadcast("scroll.infiniteScrollComplete");
				},1500)
			}else{
				pageBean++;
				webSocket.send({'cmd':10012,"body":{"yeshu":pageBean,"leixing":1}});
			};
		}else if($scope.state.rankSwitch==1){
			if(pageProfit>=$scope.state.profitLenth){
				$timeout(function(){
					$scope.state.profitNoCon = true
					$scope.$broadcast("scroll.infiniteScrollComplete");
				},1500)
			}else{
				pageProfit++;
				webSocket.send({'cmd':10012,"body":{"yeshu":pageProfit,"leixing":2}});
			};
		}else if($scope.state.rankSwitch==2){
			if(pageProfitCount>=$scope.state.profitCountLenth){
				$timeout(function(){
					$scope.state.profitCountNoCon = true
					$scope.$broadcast("scroll.infiniteScrollComplete");
				},1500)
			}else{
				pageProfitCount++;
				webSocket.send({'cmd':10012,"body":{"yeshu":pageProfitCount,"leixing":3}});
			};
			
		}
	};
	//跳转个人信息页
	$scope.goUserInfo = function(id){
		$state.go('tabs.userInfo',{'id':id});
	};
	//跳转赛果详细页面
	$scope.jumpResPage = function(item){
		$state.go('tabs.rankResPage')
	};
	//上啦刷新
	$scope.doRefresh = function(){
		pageBean = 0;
		pageProfit = 0;
		pageProfitCount = 0;
		$scope.state.rankingNoneCon = false,//下拉加载是否还有数据
		$scope.state.profitNoCon=false,//七日盈利
		$scope.state.profitCountNoCon=false,//七日盈利率
		$scope.state.beanLenth=1,//金豆总页数
		$scope.state.profitLenth=1,//七日总页数
		$scope.state.profitCountLenth=1,//利率总页数
		$scope.beanList = [];
		$scope.profitList =  [];
		$scope.profitCountList = [];
		$scope.$broadcast('scroll.refreshComplete');
		$scope.load_more();
	};
	
}])