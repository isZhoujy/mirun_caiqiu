mirun.controller('selfUerInfoCtrl',['$scope','$state','$stateParams','$ionicLoading','$ionicViewSwitcher','$ionicActionSheet','$ionicModal','mainService','pop','webSocket',function($scope,$state,$stateParams,$ionicLoading,$ionicViewSwitcher,$ionicActionSheet,$ionicModal,mainService,pop,webSocket){
	pop.loadHide();
	$scope.userInfo = mainService.userInfoData.get();
	$scope.jumpUserIcon = function(){//修改头像
		 $scope.modal.show();
	};
	$ionicModal.fromTemplateUrl('templates/modal.html',{
		scope:$scope,
		animation:'slide-in-up'
	}).then(function(modal){
		$scope.modal = modal;
	})
	  $scope.closeModal = function() {
	    $scope.modal.hide();
	  };
	  // Cleanup the modal when we're done with it!
	  $scope.$on('$destroy', function() {
	    $scope.modal.remove();
	  });
	$scope.userIcon = [
		{iconId:'00137'},
		{iconId:'00102'},
		{iconId:'00243'},
		{iconId:'00270'},
		{iconId:'00239'},
		{iconId:'00240'},
		{iconId:'00089'},
		{iconId:'02231'},
		{iconId:'00103'},
		{iconId:'02232'},
		{iconId:'00245'},
		{iconId:'00272'},
		{iconId:'00091'},
		{iconId:'00271'},
		{iconId:'00090'}
	];
	$scope.checkAction = function(index,id){
		pop.loading();
		$scope.checked_State = index;
		webSocket.send({'cmd':10018,'body':{'type':1,'info':id}});
	};
	$scope.$on('upData-changeUserInfo',function(){
		var res = mainService.changeUserInfo.get();
		pop.loadHide();
		if(res.result.result==1){
			var userInfo = mainService.userInfoData.get();
			userInfo.userIcon = res.result.body.tx;
			$scope.userInfo.gender = res.result.body.xb;
			$scope.userInfo.birthday = res.result.body.sr;
			mainService.userInfoData.set(userInfo);
			$scope.modal.hide();
		}else if(res.result.result==2){
			if(res.result.body==1){
				pop.drawWarn('修改的内容包含屏蔽字!',1500);
			}else if(res.result.body==2){
				pop.drawWarn('更改内容太长!',1500);
			}else if(res.result.body==3){
				pop.drawWarn('更改的性别有误!',1500);
			}
		}else if(res.result.result==259){
			pop.drawWarn('网络错误请重试!',1500);
		}
	});
	/*$scope.enableCrop = false;
    $scope.type='circle';
    $scope.resImgFormat='image/png';
    $scope.resImgQuality=1;
    $scope.selMinSize=200;
    $scope.resImgSize=200;
    $scope.imageDataURI = '';
    $scope.resImageDataURI = '';
    $scope.onChange=function($dataURI) {
//    console.log('onChange fired');
    };
    $scope.onLoadBegin=function() {
//    console.log('onLoadBegin fired');
    };
    $scope.onLoadDone=function(evt) {
//    console.log('onLoadDone fired');
    };
    $scope.onLoadError=function(e) {
      console.log(e);
    };
    var handleFileSelect=function(evt) {
	    var file = evt.currentTarget.files[0];
	    if(file.type.indexOf('image') <= -1) {
			$ionicLoading.show({
				template: '图片格式错误！',
				duration: 2000
			});
			document.getElementById('fileInput').value = "";
			return;
		};
	    pop.loading();
	    //封装图片压缩方法
	    if(ionic.Platform.isIOS()){
	    	lrz(file, {
				width: 800
			})
			.then(function(rst) {
				var img = document.createElement("img");
				img.src = rst.base64;
				img.onload = function() {
					if(img.width>200&&img.height>200){
						$scope.imageDataURI = rst.base64;;
				      	$scope.enableCrop = true;
						document.getElementById('fileInput').value = "";
				      	pop.loadHide();
					}else{
						document.getElementById('fileInput').value = "";
						$ionicLoading.show({
							template: '图片尺寸必须大于200像素',
							duration: 2000
						});
					}
				}
			});
	    }else{
	    	UtilImg.resizeFile(file).then(function(url) {
		    	var img = document.createElement("img");
				img.src = url;
				img.onload = function() {
					if(img.width>200&&img.height>200){
						$scope.imageDataURI = url;
				      	$scope.enableCrop = true;
						document.getElementById('fileInput').value = "";
				      	pop.loadHide();
					}else{
						document.getElementById('fileInput').value = "";
						$ionicLoading.show({
							template: '图片尺寸必须大于200像素',
							duration: 2000
						});
					}
				}
		    });
	    }
	    
	    
    };
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
    //图片取消
    $scope.imgCancel = function(){
    	$scope.resImageDataURI = '';
    	$scope.enableCrop = false;
    	document.getElementById('fileInput').value = "";
    };
    //选中图片
    $scope.imgConfirm = function(){
    	document.getElementById('fileInput').value = "";
    	$scope.userImgSrc = $scope.resImageDataURI;
    	var blod = UtilImg.dataURItoBlob($scope.resImageDataURI);
    	$scope.enableCrop = false;
    }*/
	//切换用户
	$scope.changeUser = function(){
		pop.customAlert('提示','确认并切换用户登录？','取消','确认','','button-balanced',function(){
			console.log('quxiao')
		},function(){
			$state.go('login');
			$ionicViewSwitcher.nextDirection("forward");
		})
	};
	//选择日期
	$scope.inpDateChange = function(e){
		pop.loading();
		var timer = $scope.userInfo.dateData;
		if(timer){
			var nowDate = new Date();
			if(timer.getTime()>nowDate.getTime()){
				pop.loadAuto('生日不能大于当前日期',1500);
				return false;
			};
		};
		$scope.userInfo.birthday = timer.getFullYear()+'-'+((timer.getMonth()+1)>9?(timer.getMonth()+1):'0'+(timer.getMonth()+1))+'-'+(timer.getDate()>9?timer.getDate():'0'+timer.getDate());
		webSocket.send({'cmd':10018,'body':{'type':5,'info':$scope.userInfo.birthday}});
	};
	//跳转用户修改信息
	$scope.jumpModifyName = function(){
		$state.go('tabs.modifyName',{name:$scope.userInfo.name});
		$ionicViewSwitcher.nextDirection("forward");
	};
	//修改个人签名
	$scope.modifyAutoGragh = function(){
		$state.go('tabs.modifyAtuograph',{autoGraph:$scope.userInfo.autoGraph});
		$ionicViewSwitcher.nextDirection("forward");
	};
	//修改密码
	$scope.changePWAction = function(){
		$state.go('modifyPw');
		$ionicViewSwitcher.nextDirection("forward");
	};
	//修改性别
	$scope.sexModify = function(){
		//性别操作表
		var hideSheet = $ionicActionSheet.show({
			buttons: [{
				text: '男'
			}, {
				text: '女'
			}],
			cancelText: '取消',
			cancel: function() {
				// add cancel code..
			},
			buttonClicked: function(index) { //0表示男 1表示女
				$ionicLoading.show({
					template: '正在修改',
					duration: 1000
				});
				if(index){
					$scope.userInfo.gender = '女';
				}else{
					$scope.userInfo.gender = '男';
				};
				webSocket.send({'cmd':10018,'body':{'type':3,'info':$scope.userInfo.gender}});
				$ionicLoading.hide();
				return true;
			}
		});
	}
}])