mirun.controller('tabsCtrl',['$scope','$rootScope','$state','$timeout','$stateParams','$ionicTabsDelegate','$ionicLoading','$ionicViewSwitcher','$location','mainService','pop','webSocket',function($scope,$rootScope,$state,$timeout,$stateParams,$ionicTabsDelegate,$ionicLoading,$ionicViewSwitcher,$location,mainService,pop,webSocket){
	$scope.sign_arr = {
		signInDayNum:1,
		continuityDay:1,
		stateShow:false,
		loginState:$rootScope.getUserInfoState,//判断是否登陆
		signInDayList:[],//签到列表
	};
	mainService.weixinConfig(location.href.split('#')[0],function(options){
		 wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: options.appId, // 必填，公众号的唯一标识
            timestamp: options.timestamp, // 必填，生成签名的时间戳
            nonceStr: options.noncestr, // 必填，生成签名的随机串
            signature: options.signature,// 必填，签名，见附录1
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone',
                'scanQRCode'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
	},function(e){
		console.log(e)
	});
	pop.loading();
	 var setupWeixinShare = function (message) {
        wx.onMenuShareTimeline(message);
        wx.onMenuShareAppMessage(message);
        wx.onMenuShareQQ(message);
        wx.onMenuShareWeibo(message);
        wx.onMenuShareQZone(message);
    };
	wx.ready(function () {
		if($location.path()=='/tab/hot'||$location.path()=='/tab/competition'||$location.path()=='/tab/rankings'||$location.path()=='/tab/store'||$location.path()=='/tab/self'||$location.path().substr(0,15)=='/tab/competitDe'||$location.path().substr(0,11) == '/tab/hotDet'){
			var pathShare = $location.absUrl();
		}else{
			var pathShare = 'http://coolzjy.duapp.com/ionicZuqiu';
		}
        setupWeixinShare({
            title: '人人猜球', // 分享标题
            desc: '请和我一起来人人猜球吧', // 分享描述
            link: pathShare, // 分享链接
            imgUrl: 'http://coolzjy.duapp.com/ionicZuqiu/img/storeLogo.png', // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
    });
    //判断是否为游客登录
    judgeLogin();
    function judgeLogin(){
    	var state = localStorage.getItem('touristToken')?true:false;
    	var serverState = localStorage.getItem('usertoken')?true:false;
    	if(state&&!serverState){//游客登录
    		var params = {
   				yanzhengma:localStorage.getItem('touristToken'),
   				type:2
   			};
    		touristSubLogin(params);
    	}else if(!state&&serverState){//用户登录
		 	userLoginFn();
    	}else if(!state&&!serverState){//游客初次登录
    		touristLogin();
    	}else if(state&&serverState){
    		var token = JSON.parse(localStorage.getItem('usertoken'));
			webSocket.open(token);
			webSocket.send({'cmd':10000});
			messageSocket();
			closeFn();
			onerror();
    	}
    };
    //游客无token登录
    function touristSubLogin(params){
    	mainService.userRequestUuid(params,function(res){
			if(res.result=='ok'){
				var usertoken = {
					serverCode:res.serverCode,
					userId:res.userid
				};
				usertoken = JSON.stringify(usertoken);
				localStorage.setItem('usertoken',usertoken);
				var token = JSON.parse(localStorage.getItem('usertoken'));
				webSocket.open(token);
				webSocket.send({'cmd':10000});
				var path = $location.path();
				if(path.substr(0,15)=='/tab/competitDe'){
					var itemId = path.split('/')[3];
					webSocket.send({'cmd':10003,"body":{"id":itemId}});
					webSocket.send({'cmd':10016});
				}else if(path.substr(0,11) == '/tab/hotDet'){
					var itemId = path.split('/')[3];
					webSocket.send({'cmd':10003,"body":{"id":itemId}});
					webSocket.send({'cmd':10016});
				};
				switch(path){
					case '/tab/hot':
						webSocket.send({'cmd':10007,"body":{"yeshu":0}});
						webSocket.send({'cmd':10015});
					break;
					case '/tab/competition':
						webSocket.send({'cmd':10007,"body":{"yeshu":0}});
					break;
					case '/tab/rankings':
						webSocket.send({'cmd':10016});
						webSocket.send({'cmd':10012,"body":{"yeshu":1,"leixing":1}});
					break;
					case '/tab/store':
						webSocket.send({'cmd':10009});
						webSocket.send({'cmd':10016});
						webSocket.send({'cmd':10015});
					break;
					case '/tab/self':
						webSocket.send({'cmd':10016});
					break;
				};
				messageSocket();
				closeFn();
				onerror();
				/*$timeout(function(){
					var domTabs = document.querySelector("#mainTabs");
					var dom = domTabs.getElementsByClassName('col5');
					if($scope.sign_arr.loginState){
						dom[1].className+=' loginEnd';
					};
				});*/
			}
		},function(e){
			console.log(e)
		})
    }
    //游客登录
    function touristLogin(){
   		mainService.touristToken(function(res){
   			localStorage.setItem('touristToken',res.token);
   			var params = {
   				yanzhengma:res.token,
   				type:2
   			};
   			touristSubLogin(params);
   		},function(e){
   			console.log(e)
   		})
    };
    //用户登录  非游客
    function userLoginFn(){
		var token = JSON.parse(localStorage.getItem('usertoken'));
		webSocket.open(token);
		webSocket.send({'cmd':10000});
		messageSocket();
		closeFn();
		onerror();
		$timeout(function(){
			var domTabs = document.querySelector("#mainTabs");
			var dom = domTabs.getElementsByClassName('col5');
			if($scope.sign_arr.loginState){
				dom[1].className+=' loginEnd';
			};
		});
    };
	//断线重连
	function closeFn(){
		webSocket.onclose(function(e){
			console.log('close');
			var token = JSON.parse(localStorage.getItem('usertoken'));
			webSocket.open(token);
	//			localStorage.clear();
	//			pop.drawWarn('网络问题，请重新登录',1000);
	//			$timeout(function(){
	//				var domTabs = document.querySelector("#mainTabs");
	//				var dom = domTabs.getElementsByClassName('col5');
	//				dom[1].className = 'col5 tab-item';
	//				$rootScope.getUserInfoState = false;
	//				$state.go('login');
	//				$ionicViewSwitcher.nextDirection("forward");
	//			},1000)
		});
	}
	function messageSocket(){
		webSocket.onmessage(function(mes){
		var res = JSON.parse(mes.data);
		if(JSON.parse(mes.data).xxh==10000){
			pop.loadHide();
			var resState = JSON.parse(mes.data).result;
			if(typeof resState.body=='object'){
				switch(resState.body.qd){
					case 0:
						$scope.sign_arr.stateShow = true;
						$scope.sign_arr.signInDayList = resState.body.jllist;
						$scope.sign_arr.continuityDay = resState.body.ts;
						if(resState.body.ts%7==0){
							$scope.sign_arr.signInDayNum = 1;
						}else{
							$scope.sign_arr.signInDayNum = resState.body.ts+1;
						};
					break;
					case 1:
						$scope.sign_arr.stateShow = false;
					break;
				}
			}
		}else if(res.xxh==10003&&typeof res.result.body=='object'){//比赛详情
			mainService.playMeathod.set(res.result.body);
		}else if(res.xxh==10004){
			mainService.stakeMethod.set(res);
		}else if(res.xxh==100001){
			mainService.stakeThen.set(res);
		}else if(res.xxh==100002){
			mainService.playMethodNew.set(res)
		}else if(res.xxh==10002){//赛前数据
			mainService.playHotList.set(res);
		}else if(res.xxh==10007){//热门
			if($location.path()=='/tab/competition'){
				mainService.playMethodhot.set(res);
			}else if($location.path()=='/tab/hot'){
				mainService.hotLoadMoreState.set();
				mainService.homeHotList.set(res); 
			};
		}else if(res.xxh==10008){//金豆,金币明细
			mainService.beanDetail.set(res);
		}else if(res.xxh==10012){//排行榜信息
			mainService.rankingData.set(res);
		}else if(res.xxh==10009){//商城信息
			mainService.storeData.set(res);
		}else if(res.xxh==10010){//商城兑换信息
			mainService.storeExchange.set(res);
		}else if(res.xxh==10011){//商城兑换信息
			mainService.exchangeGoods.set(res);
		}else if(res.xxh==100005){//头部跑马灯信息
			mainService.headRound.set(res);
		}else if(res.xxh==10015){//热门头部轮播
			mainService.hotCarousel.set(res);
		}else if(res.xxh==100004){//casetype数据
			mainService.caseTypeData.set(res);
		}else if(res.xxh==100003){//本场数据
			mainService.stateTypeData.set(res);
		}else if(res.xxh==10013){//比赛列表赛果数据
			mainService.matchResult.set(res);
		}else if(res.xxh==10014){//竞猜记录数据
			mainService.allRecord.set(res);
		}else if(res.xxh==10016){//个人信息
			if($location.path().substr(0,13)=='/tab/userInfo'){
				mainService.otherUserInfo.set(res)
			}else{
				mainService.userInfo.set(res);
			}
		}else if(res.xxh==100007){//金豆改变
			mainService.selfBeanChange.set(res);
		}else if(res.xxh==100008){//比赛推送的state/stage
			mainService.matchStageIng.set(res);
		}else if(res.xxh==10017){//竞猜记录赛事详情内数据
			mainService.guessRecordData.set(res);
		}else if(res.xxh==10005){//反悔体退回金豆
			mainService.backBeanData.set(res);
		}else if(res.xxh==10018){//修改名称头像个人信息
			mainService.changeUserInfo.set(res);
		}else if(res.xxh==10019){//修改名称头像个人信息
			mainService.payCenter.set(res);
		}else if(res.xxh==10020){//兑换金豆
			mainService.exchangeGold.set(res);
		}else if(res.xxh==10021){//绑定游客信息
			mainService.bindTourist.set(res);
		}else if(res.xxh==10022){//获取个人消息
			mainService.userMessage.set(res);
		}else if(res.xxh==100009){//是否有赛事新消息
			mainService.matchNewMessage.set(res);
		}else if(res.xxh==100010){//是否有系统新消息
			mainService.systemNewMessage.set(res);
		}else if(res.xxh==100006){//监听金币变化
			mainService.goldNumberChange.set(res);
		}else if(res.result.result==259){
			pop.drawWarn('服务器无数据!',1500);
		}else if(res.result.result==255){
			localStorage.clear();
			pop.drawWarn('网络问题，请重新登录',1000);
//				webSocket.close();
			$timeout(function(){
				var domTabs = document.querySelector("#mainTabs");
				var dom = domTabs.getElementsByClassName('col5');
				dom[1].className = 'col5 tab-item';
				$rootScope.getUserInfoState = false;
				$state.go('login');
				$ionicViewSwitcher.nextDirection("forward");
			},1000)
		}
	});
	}
    
	$scope.$on('$stateChangeSuccess',function(e,t,tp,f){
		if((f.url=='/login'||f.name=='userSignIn')&&t.name=='tabs.hot'){
			var token = JSON.parse(localStorage.getItem('usertoken'));
			webSocket.open(token);
			webSocket.send({'cmd':10000});
			messageSocket();
		}
	});
	function onerror(){
		webSocket.onerror(function(){
			console.log(e);
			localStorage.clear();
			pop.drawWarn('网络问题，请重新登录',1000);
			$timeout(function(){
				var domTabs = document.querySelector("#mainTabs");
				var dom = domTabs.getElementsByClassName('col5');
				dom[1].className = 'col5 tab-item';
				$rootScope.getUserInfoState = false;
				$state.go('login');
				$ionicViewSwitcher.nextDirection("forward");
			},1000)
		});
	}
	
	//点击签到
	$scope.signInBtn = function(){
		$scope.sign_arr.stateShow = false;
		webSocket.send({'cmd':10001});
		webSocket.onmessage(function(mes){
			if(JSON.parse(mes.data).xxh==10001){
				var mesState = JSON.parse(mes.data);
				mesState = mesState.result.result;
				if(mesState==1){
					pop.signWarn();
					$timeout(function(){
						pop.loadHide()
					},1000)
				}else if(mesState==2){
					pop.drawWarn('已签到过，不用再次签到 !',1000);
				}else if(mesState==255){
					pop.drawWarn('网络问题，请求错误',1000);
				}
			}
			
		})
	};
}]);