mirun.service('mainService',['$http','$rootScope',function($http,$rootScope){
	
	var requireIp = 'http://139.129.15.57:7080/caiqiu_web';
	//获取微信config
	this.weixinConfig = function(params,succ,error){
		$http.get('http://139.129.15.57:8080/caiqiu/wx/config?url='+params).success(function(res){
			succ(res)
		}).error(function(e){
			error(e)
		})
	}
	//用户注册
	this.userSignInCheckCode = function(params,succ,error){
		$http.post(requireIp+'/user/fasongyanzhengma',params).success(function(res){
			succ(res)
		}).error(function(e){
			error(e)
		})
	};
	//注册接口
	this.userSignIn = function(params,succ,error){
		$http.post(requireIp+'/user/register',params).success(function(res){
			succ(res)
		}).error(function(e){
			error(e)
		});
	};
	//&&登陆接口
	this.userLogin = function(params,succ,error){
		$http.post(requireIp+'/user/login',params).success(function(res){
			succ(res)
		}).error(function(e){
			error(e)
		});
	};
	//&&修改密码
	this.changePwCheck = function(params,succ,error){
		$http.post(requireIp+'/user/duanxinxiugaimima',params).success(function(res){
			succ(res)
		}).error(function(e){
			error(e)
		});
	};
	//注册或登陆成功后通过uuid再次请求
	this.userRequestUuid = function(params,succ,error){
		$http.post('http://139.129.15.57:8080/caiqiu/user/login',params).success(function(res){
			succ(res)
		}).error(function(e){
			error(e)
		});
	};
	//游客登录获取token
	this.touristToken = function(succ,error){
		$http.get(requireIp+'/user/token').success(function(res){
			succ(res)
		}).error(function(e){
			error(e)
		});
	}
	
	
	this.userInfoData = {
		mes:null,
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
		}
	};
	//获取商品兑换信息是否发货和领用
	var isState = {
		storeState:false,//兑奖信息的是否发货状态
	};
	this.getStoreLotteryData = function(){
		return isState
	};
	this.setStoreLotteryData = function(data){
		isState = data;
	};
	//比赛玩法信息
	this.playMeathod = {//玩法数据10003
		playMeathodList : null,
		get:function(){
			return this.playMeathodList
		},
		set:function(data){
			this.playMeathodList = data;
			$rootScope.$broadcast('upData-playMeathod')
		}
	};
	this.stakeMethod = {//押注玩法10004
		stakeMes:null,
		get:function(){
			return this.stakeMes
		},
		set:function(data){
			this.stakeMes = data;
			$rootScope.$broadcast('upData-stakeMethod')
		}
	};
	this.stakeThen = {//投注之后返回100001
		mes:null,
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-stakeThen');
		}
	};
	this.playMethodNew = {//比赛开始时推送赔率最新信息100002
		mes:null,
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-playMethodNew');
		}
	};
	this.playHotList = {//比赛列表的赛前信息
		mes:null,
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-playHotList');
		}
	};
	this.playMethodhot = {//比赛列表的热门信息
		mes:null,
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-playMethodhot');
		}
	};
	this.homeHotList = {//首页的热门信息
		mes:null,
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-homeHotList');
		}
	};
	this.beanDetail = {//金豆明细列表
		mes:null,
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-beanDetail');
		}
	};
	this.hotLoadMoreState = {//首页进入不自动下啦bug
		set:function(){
			$rootScope.$broadcast('hot-Loadmore');
		}
	};
	this.rankingData = {//排行榜数据
		mes:null,
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-rankingData');
		}
	};
	this.storeData = {//商城数据
		mes:null,
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-storeData');
		}
	};
	this.storeExchange = {//商城物品兑换数据
		mes:null,
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-storeExchange');
		}
	};
	this.exchangeGoods = {//商城物品兑换列表
		mes:null,
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-exchangeGoods');
		}
	};
	this.headRound = {//头部走马灯100005
		mes:null,
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-headRound');
		}
	};
	this.hotCarousel = {//头部走马灯10015
		mes:null,
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-hotCarousel');
		}
	};
	this.caseTypeData = {//caseTypeData100004
		mes:null,
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-caseTypeData');
		}
	};
	this.stateTypeData = {//stateTypeData100003
		mes:null,
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-stateTypeData');
		}
	};
	this.matchResult = {//赛果10013
		mes:null,
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-matchResult');
		}
	};
	this.matchResult = {//赛果10013
		mes:null,
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-matchResult');
		}
	};
	this.allRecord = {//竞猜记录10014
		mes:null,
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-allRecord');
		}
	};
	this.userInfo = {//竞猜记录10014
		mes:null,
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-userInfo');
		}
	};
	this.selfBeanChange = {//金豆改变100007
		mes:null,
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-selfBeanChange');
		}
	};
	this.matchStageIng = {//比赛推送的state/stage
		mes:null,
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-matchStageIng');
		}
	};
	this.guessRecordData = {//赛事详情竞猜记录
		mes:null,
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-guessRecordData');
		}
	};
	this.backBeanData = {//反悔退会金豆
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-backBeanData');
		}
	};
	this.otherUserInfo = {//排行榜的个人信息
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-otherUserInfo');
		}
	};
	this.changeUserInfo = {//修改个人信息
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-changeUserInfo');
		}
	};
	this.payCenter = {//支付
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-payCenter');
		}
	};
	this.exchangeGold = {//金豆兑换金币
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('upData-exchangeGold');
		}
	};
	this.bindTourist = {//游客绑定账号
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('bindTourist');
		}
	};
	this.userMessage = {//获取i个人赛事消息
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('userMessage');
		}
	};
	this.matchNewMessage = {//有新的赛事消息
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('matchNewMessage');
		}
	};
	this.systemNewMessage = {//有新的系统消息
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('systemNewMessage');
		}
	};
	this.goldNumberChange = {//金币监听变化
		get:function(){
			return this.mes
		},
		set:function(data){
			this.mes = data;
			$rootScope.$broadcast('goldNumberChange');
		}
	};
	this.loginKEY = {//公式
		publicKey:'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCRF66/9SjnloAxpR9k3HnfNiH1 Zj5GpmcSDRL2MR25PZ0jg5HULIshw2V0ZQd+KOiMICdYP6Z4dz/XYEnrvP42Nqa7 G+hE00hryLWdsr5vzHsJIk48fWVk9IgUGYZ9e33oMPjEK2Lwuk2nQiKZo31sisva 4ebP4CMkVJooaiVGtQIDAQAB',
		privateKey:'MIICXAIBAAKBgQCRF66/9SjnloAxpR9k3HnfNiH1Zj5GpmcSDRL2MR25PZ0jg5HU LIshw2V0ZQd+KOiMICdYP6Z4dz/XYEnrvP42Nqa7G+hE00hryLWdsr5vzHsJIk48 fWVk9IgUGYZ9e33oMPjEK2Lwuk2nQiKZo31sisva4ebP4CMkVJooaiVGtQIDAQAB AoGAdzkaoyl0fzgwBptEfMCedEgrB1cIfU1nDHIpzpr1ba2vXetS/SHNAeVpjIcn 7Qb4b4xMSDulMv/qObQpicg2qlv9MkHSrjVKLaMProntEej7b8IcZMNCOy9JEL9/ 8aAVX9vjtahkr3ivJt7LQMTOavlrul/fmsFwMUBXMB4fCQECQQDl2JLXqbrhudmq lLP8KRAm7JEkAXsYpp6JCjvJtXEopu5OxB6qzr+64ikm/lElfi/6w2RnfrWXai24 WMmkRBnxAkEAoZo8Rm0zomBUycV7GEjqLkmcki3rGGKsZmnSaheWtxeNNNjkMcnL qO1FywpFyrBOV620bmE061NQoA5oWbAVBQJBAII+bE97JaQdnYN1Cly8pCN6cHCX yjpYyINdYi3V/E6N8YJ+zeX6jFkJKUqoWDFHxUZzDGU9PweTKl9JKNJFqPECQHQb q/jx1upwihrab4HYSaFuNDd3FHXV14ZRu+OMBTaRjlwNBY+cLF6387BZNiHWIMOw Q3YXE32Mw93r3B+ser0CQDnv4hZ8Qaqmqv6HkNmjeRXXqaBI2/N3ik7/BBOBi/yU kCDAPQPRIguPdJTpL/zB1yIhwARLfmuiUkuVS0doZQM='
	};
	
	
	//转化时间格式
	this.dateSwitch = function(utcDate) {
		if(utcDate == undefined || utcDate == null || utcDate == "")
			return;
		else
			var re = /(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(\.\d+)?(Z|([+-])(\d\d):(\d\d))/;
		var d = [];
		d = utcDate.match(re);
		if(!d) {
			throw "Couldn't parse ISO 8601 date string '" + utcDate + "'";
		}
		var a = [1, 2, 3, 4, 5, 6, 10, 11];
		for(var i in a) {
			d[a[i]] = parseInt(d[a[i]], 10);
		}
		d[7] = parseFloat(d[7]);
		var ms = Date.UTC(d[1], d[2] - 1, d[3], d[4], d[5], d[6]);
		if(d[7] > 0) {
			ms += Math.round(d[7] * 1000);
		}
		if(d[8] != "Z" && d[10]) {
			var offset = d[10] * 60 * 60 * 1000;
			if(d[11]) {
				offset += d[11] * 60 * 1000;
			}
			if(d[9] == "+") {
				ms -= offset;
			} else {
				ms += offset;
			}
		}
		return new Date(ms);

	};
	//转化事件格式
	this.dateFormat = function(state,timer){
		var time = new Date(timer/10000);
		var timers = new Date(timer);
		switch(state){
			case 'ymdhms':
				var newTime = time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate()+' '+(time.getHours() > 9 ? time.getHours() : "0" + time.getHours()) + ":" + (time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes());
				return newTime;
			break;
			case 'ymdhms-timerb':
				var newTime = timers.getFullYear()+'-'+(timers.getMonth()+1)+'-'+timers.getDate()
				return newTime;
			break;
			case 'ymdhms-timert':
				var newTime = (timers.getHours() > 9 ? timers.getHours() : "0" + timers.getHours()) + ":" + (timers.getMinutes() > 9 ? timers.getMinutes() : "0" + timers.getMinutes())+":"+(timers.getSeconds()>9?timers.getSeconds():"0"+timers.getSeconds());
				return newTime;
			break;
			case 'ymd':
				var newTime = time.getFullYear()+'-'+((time.getMonth()+1)>9?(time.getMonth()+1):"0"+(time.getMonth()+1))+'-'+(time.getDate()>9?time.getDate():"0"+time.getDate());
				return newTime;
			break;
		}
	}
	
	
}]);
//连接websocket
mirun.service('webSocket',['$websocket','$rootScope',function($websocket,$rootScope){
	var ws;
    this.open = function(token){
    	ws = $websocket('ws://139.129.15.57:8080/caiqiu/websocket/'+token.userId+'/'+token.serverCode);
		ws.onOpen(function(){
			console.log('open');
		});
		
	/*	ws.onError(function(){
	   		console.log('error')
	   	})*/
    };
   	this.send = function(params){
   		ws.send(params);
   	};
   	this.onmessage = function(callBack){
   		ws.onMessage(function (message) {
			callBack(message)
	    });
   	};
   	this.close = function(){
   		ws.close();//关闭socket连接
   	}
   	this.onclose = function(callBack){
   		ws.onClose(function(e){
   			callBack(e)
	   	})
   	}
   	this.onerror = function(callBack){
   		ws.onError(function(evt){
   			console.log('error')
			callBack(evt)
		});
   	}
}]);




mirun.service('pop',['$ionicLoading','$ionicPopup','$timeout',function($ionicLoading,$ionicPopup,$timeout){
	//加载等待
	this.loading = function() {
		$ionicLoading.show({
			template: '<ion-spinner icon="crescent" class="spinner-royal""></ion-spinner>' 
		});
		var time = $timeout(function() {
			$ionicLoading.hide();
		}, 10000)
	};
	//封装等待
	this.Autoloading = function(text) {
		$ionicLoading.show({
			template: '<ion-spinner icon="crescent" class="spinner-royal""></ion-spinner><br/>'+text
		});
	};
	this.loadHide = function() {
		$ionicLoading.hide();
	};
	//签到提示
	this.signWarn = function(){
		$ionicLoading.show({
			template: '<span style="color:white;font:500 16px \'微软雅黑\' ; line-height:30px">签到成功!</span>' 
		});
	};
	//封装提示
	this.drawWarn = function(tem,duration){
		$ionicLoading.show({
			template:  tem
		});
		$timeout(function() {
			$ionicLoading.hide();
		}, duration)
	};
	//居中提示
	this.loadAuto = function(template, duration) {
		if(duration == null || duration == '' || duration == undefined) {
			var time = 1000;
		} else {
			var time = duration;
		}
		$ionicLoading.show({
			template: template,
			duration: time,
		});
	};
	//弹出框
	this.alert = function(title, template, button1, button2,callBackCancel,callBackSure) {
		if(button1 == null || button1 == undefined || button1 == "") {
			var button1 = '取消'
		} else {
			var button1 = button1;
		}
		if(button2 == null || button2 == undefined || button2 == "") {
			var button2 = '确定'
		} else {
			var button2 = button2;
		}
		var alert = $ionicPopup.show({
			title: title,
			template: template,
			buttons: [{
				text: button1,
				type: 'button-calm stakeBtn',
				onTap:function(){
					if(angular.isFunction(callBackCancel)) {
						callBackCancel()
					}
				}
			}, {
				text: button2,
				type: 'button-energized',
				onTap: function(e) {
					if(angular.isFunction(callBackSure)) {
						callBackSure(e)
					}
				}
			}]
		})
	};
	//自定义弹出框
	this.customAlert = function(title, template, button1, button2,btntype1,btntype2,callBackCancel,callBackSure) {
		if(button1 == null || button1 == undefined || button1 == "") {
			var button1 = '取消'
		} else {
			var button1 = button1;
		}
		if(button2 == null || button2 == undefined || button2 == "") {
			var button2 = '确定'
		} else {
			var button2 = button2;
		}
		if(btntype1 == null || btntype1 == undefined || btntype1 == "") {
			var btntype1 = 'button-calm';
		} else {
			var btntype1 = btntype1;
		}
		if(btntype2 == null || btntype2 == undefined || btntype2 == "") {
			var btntype2 = 'button-energized';
		} else {
			var btntype2 = btntype2;
		}
		var alert = $ionicPopup.show({
			title: title,
			template: template,
			buttons: [{
				text: button1,
				type: btntype1,
				onTap:function(){
					if(angular.isFunction(callBackCancel)) {
						callBackCancel()
					}
				}
			}, {
				text: button2,
				type: btntype2,
				onTap: function(e) {
					if(angular.isFunction(callBackSure)) {
						callBackSure(e)
					}
				}
			}]
		})
	};
	this.alertStake = function(title, template, button1, button2,callBackCancel,callBackSure) {
		if(button1 == null || button1 == undefined || button1 == "") {
			var button1 = '取消'
		} else {
			var button1 = button1;
		}
		if(button2 == null || button2 == undefined || button2 == "") {
			var button2 = '确定'
		} else {
			var button2 = button2;
		}
		var alert = $ionicPopup.show({
			title: title,
			template: template,
			buttons: [{
				text: button1,
				type: 'button-dark',
				onTap:function(){
					if(angular.isFunction(callBackCancel)) {
						callBackCancel()
					}
				}
			}, {
				text: button2,
				type: 'button-positive',
				onTap: function(e) {
					if(angular.isFunction(callBackSure)) {
						callBackSure(e)
					}
				}
			}]
		})
	};
	//确认弹框
	this.alert_one = function(title, template, callBack, button1) {
		if(button1 == null || button1 == undefined || button1 == "") {
			var button1 = '确定'
		} else {
			var button1 = button1;
		}
		var alert = $ionicPopup.show({
			title: title,
			template: template,
			buttons: [{
				text: button1,
				type: 'button-balanced alertBtn',
				onTap: function(e) {
					if(angular.isFunction(callBack)) {
						callBack()
					}
				}
			}]
		})
	}
}]);
//压缩图片封装
mirun.service('UtilImg', function($q) {
   var dataURItoBlob = function(dataURI) {
        // 转化为二进制
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);
 
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
 
        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
 
        return new Blob([ia], {
            type: mimeString
        });
    };
	 function compress(img) {
	        var initSize = img.src.length;
	        var width = img.width;
	        var height = img.height;
			var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var tCanvas = document.createElement("canvas");
 			var tctx = tCanvas.getContext("2d");
	        //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
	        var ratio;
	        if ((ratio = width * height / 4000000)>1) {
	            ratio = Math.sqrt(ratio);
	            width /= ratio;
	            height /= ratio;
	        }else {
	            ratio = 1;
	        }
			
	        canvas.width = width;
	        canvas.height = height;
	//        铺底色
	        ctx.fillStyle = "#fff";
	        ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	        //如果图片像素大于100万则使用瓦片绘制
	        var count;
	        if ((count = width * height / 1000000) > 1) {
	            count = ~~(Math.sqrt(count)+1); //计算要分成多少块瓦片
	//            计算每块瓦片的宽和高
	            var nw = ~~(width / count);
	            var nh = ~~(height / count);
				
	            tCanvas.width = nw;
	            tCanvas.height = nh;
			
	            for (var i = 0; i < count; i++) {
	                for (var j = 0; j < count; j++) {
	                    tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
	
	                    ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
	                }
	            }
	        } else {
	            ctx.drawImage(img, 0, 0, width, height);
	        }
			
	        //进行最小压缩
	        var ndata = canvas.toDataURL('image/jpeg', 0.1);
	
	        console.log('压缩前：' + initSize);
	        console.log('压缩后：' + ndata.length);
	        console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
	
	        tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
	        return ndata;
	    };
    var resizeFile = function(file) {
        var deferred = $q.defer();
        var img = document.createElement('img');
        try {
            var reader = new FileReader();
            reader.onload = function(e) {
            	img.src = e.target.result;
                //resize the image using canvas
               /* var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                var MAX_WIDTH = 800;
                var MAX_HEIGHT = 800;
                var width = img.width;
                var height = img.height;
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
 
                //change the dataUrl to blob data for uploading to server
                var dataURL = canvas.toDataURL('image/jpeg');
                var blob = dataURItoBlob(dataURL);*/
                img.onload = function(){
	               	deferred.resolve(compress(img));
            	}
            };
            reader.readAsDataURL(file);
        } catch (e) {
            deferred.resolve(e);
        }
        return deferred.promise;
    };
    return {
        resizeFile: resizeFile,
        dataURItoBlob : dataURItoBlob
    };
 
});
