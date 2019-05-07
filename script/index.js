let $=Zepto;
let loadingData=(function(){
	$loadingBox=$(".loadingBox");
	$progress=$loadingBox.find(".progress");
	$current=$progress.find(".current");
	/*加载所有的图片，也就是把所有图片的地址放入一个数组中,然后循环进行加载*/
	// let appUrl="http://localhost/web/project/resume";
	let appUrl="https://huminggui.github.io/appresume";

	let imagesData=[
		appUrl+"/images/cube1.jpg",
		appUrl+"/images/cube2.jpg",
		appUrl+"/images/cube3.jpg",
		appUrl+"/images/cube4.jpg",
		appUrl+"/images/cube5.jpg",
		appUrl+"/images/cube6.jpg",
		appUrl+"/images/inter.jpg",
		appUrl+"/images/keyboard.png",
		appUrl+"/images/page2.1.jpg",
		appUrl+"/images/page2.2.jpg",
		appUrl+"/images/page2.3.jpg",
		appUrl+"/images/page2.4.jpg",
		appUrl+"/images/page2.5.jpg",
		appUrl+"/images/page2.6.jpg",
		appUrl+"/images/page2.home.jpg",
		appUrl+"/images/page3.home.jpg",
		appUrl+"/images/page4.home.jpg",
		appUrl+"/images/page5.home.jpg",
		appUrl+"/images/page6.home.jpg",
		appUrl+"/images/page6.1.png",
		appUrl+"/images/page6.2.png",
		appUrl+"/images/self.jpg"
	];
	let num=0;
	let len=imagesData.length;
	let timer;
	let deayTimout=null;
	function run(callback){
		let tempImage=null;
		imagesData.forEach(item=>{
			tempImage=new Image();
			tempImage.onload=()=>{
				/*这里并没有给加载进来的图片进行赋值，而是直接设置为null了*/
				tempImage=null;
				num++;
				$current.css("transition","1s");
				$current.css("width",`${num/len*100}%`);
				/*如果num的大小等于数组的长度说明加载完成了*/
				if(num==len){
					/*清除到达指定的时间跳转的定时器，因为这里说明是正常跳转*/
					clearTimeout(deayTimout);
					callback && callback();
				}
			}
			tempImage.src=item;
		});
	}
	let timeDelay=function(callback){
		/*十秒后如果加载图片达到了百分之九十就跳转，否则不跳转了*/
		deayTimout=setTimeout(function(){
			if(num/len>=0.9){
				/*加载到百分之九十的时候，则直接给它显示成100%*/
				$current.css("width","100%");
				callback && callback();
			}else{
				alert("非常抱歉，网络异常，无法进入指定页面");
				window.location.href="http://www.baidu.com";
			}
		},10000*6);
	}
	
	/*这个是加载完成的操作**/
	function done(){
		/*加载成功后停顿一秒再进行页面的跳转*/
		let timerLoading=setTimeout(function(){
			/*这里的页面的跳转是把当前的div给删掉即可*/
			$loadingBox.remove();
			//执行iphone模块的操作
			phoneRander.init();
		}, 1000);
		
	}
	return {
		init:function(){
			$loadingBox.css("display","block");
			run(done);
			/*这个函数和run函数一起执行*/
			timeDelay(done);

		}
	}
})();

/*-------------phone的js代码区域--------------*/

let phoneRander=(function(){
	let timers;
	let phoneAnswer=document.getElementById("phoneAnswer");
	let $answering=$(".answering"),
		$phoneBox=$(".phoneBox"),
		$answerH2=$phoneBox.find(".anSwerH2"),
		$hangH2=$phoneBox.find(".hangH2"),
		$answerBar=$phoneBox.find(".answerBar"),
		$hangBar=$phoneBox.find(".hangBar"),
		$callTime=$phoneBox.find(".callTime");
		$closePhone=$phoneBox.find(".closePhone");

	function answerTouch(){
		/*取消来电提示音,然后移出这个来电时提示的标签，之后不会再用这个标签了*/
		phoneAnswer.pause();
		$(phoneAnswer).remove();//移出audio标签了
		$answerH2.css("display","none");
		$hangH2.css("display","block");
		$answerBar.css("display","none");
		$hangBar.css("transform","translateY(-.5rem)");
		answerTime();
	}
	/*实现事件的运动*/
	function answerTime(){
		let num=0;
		clearInterval(timers);
		timers=setInterval(function(){
			num++;
			let minute=Math.floor(num/60);
			let second=Math.floor(num%60);
			minute=minute<10?"0"+minute:minute;
			second=second<10?"0"+second:second;
			$callTime.html(`${minute}:${second}`);
		},1000);
	}
	
	//挂断电话的方法
	function closePhoneFn(){
		clearInterval(timers);
		$phoneBox.remove();
		//执行键盘的操作
		keyboardRander.init();
		
	}

	return{
		init:function(){
			console.log("haha");
			$phoneBox.css("display","block");
			phoneAnswer.play();
			console.log("播放");
			$answering.on("click",answerTouch);
			$closePhone.on("click",closePhoneFn);
		}
	}
})();

/**-------------keyboardBox的代码区域--------------- */
let keyboardRander=(function(){
	let $keyboardBox=$(".keyboardBox"),
		$wrapper=$keyboardBox.find(".wrapper"),
		$wrapperList=$wrapper.find("li"),
		$keyboard=$keyboardBox.find(".keyboard"),
		$submit=$keyboardBox.find(".submit"),
		$textKeyBoard=$keyboardBox.find(".textKeyBoard");
		step=-1,
		long=$wrapperList.length+1,
		interval=2000,
		timers=null;
		/**实现微信发送信息的设置的 */
		//定时器，添加信息到屏幕用的
		let messageTimer=null;
		let messageLength=0;
		let $wHeight=$(window).height();
		let winHeight=$wHeight*0.8;//没有键盘的高度
		let winHeightKB=$wHeight*0.9*0.5;//有键盘的高度
		let newHeight=winHeight;//当前屏幕高度
		let showKB = false;//键盘是回缩的
		/**用来获取数组的内容的索引 */
		let numberM=-1;		
		/**添加信息时添加的标签 */
		let $tab="";
		let data={};
		
	function makeMessage(){
		numberM++;
		if(numberM==1){
			showKB=true;
		}
		if(numberM>=messageLength){
			clearInterval(messageTimer);
			$keyboardBox.remove();//移出当前模块
			cubeRender.init();
			return;
		}
		/**设置当前屏幕的高度 */
		if(showKB){
			newHeight=winHeightKB;
			clearInterval(messageTimer);
			$keyboard.css("transform","translateY(0)").one("transitionend",function(){
				let textData="好的，马上开始。";
				let textTimer=null;
				$textHtml=$textKeyBoard.html();
				let textNumber=0;
				textTimer=setInterval(function(){
					$textKeyBoard.html($textKeyBoard.html()+textData[textNumber]);
					textNumber++;
					if(textNumber===1){
						$submit.css("display","block");
					}

					/**文字显示结束后的操作 */
					if(textNumber>textData.length-1){
						clearInterval(textTimer);
					}
				
				},100);
				
			});

		}else{
			newHeight=winHeight;
		}



		if(data[numberM].self){
			$tab=$(`
			<li class="self">
			<img src="images/self.jpg" alt="" class="pic">
			<span></span>
			${data[numberM].self}
			</li>
			`);
		}else{
			$tab=$(`
			<li class="inter">
			<img src="images/inter.jpg" alt="" class="pic">
			<span></span>
			${data[numberM].inter}
			</li>
			`);
		}
		$tab.appendTo($wrapper);
		$tab.addClass("active");

		/**内容的高度大于设定的屏幕高度时，则内容区域往上移动 */
		if($wrapper.height()>newHeight){
			let newWrapperHeight=$wrapper.height();
			let moveHeight=newWrapperHeight-newHeight;
			$wrapper.css("transform",`translateY(-${moveHeight}px)`);
		}
	}

	function addMessage(){
		messageTimer=setInterval(makeMessage,2000);
		$submit.on("click",function(){
			$wrapperList=$wrapper.find("li");
			$(
				`<li class="self">
				<img src="images/self.jpg" alt="" class="pic">
				<span></span>
				${$textKeyBoard.html()}
				</li>`
			).insertAfter($wrapperList[1]).addClass("active");
			$textKeyBoard.html("");
			$submit.css("display","none");
			$keyboard.css("transform","translateY(4.3rem)");
			$wrapperList=$wrapper.find("li");
			showKB=false;
			messageTimer=setInterval(makeMessage,2000);
			
		});
		
	}	

	return{
		init:function(){
			$keyboardBox.css("display","block");
			$.getJSON(appUrl+"/static/message.json",function(res){
				data=res;
				messageLength=data.length;
				addMessage();
			});

		}
	}
})();

/**-------------cube是魔方的实现-------------------------*/
let cubeRender=(function(){
	let $cubeBox=$(".cubeBox"),
		$cubeContainer=$cubeBox.find(".cubeContainer"),
		$cubeContainerList=$cubeContainer.find("li");


	let start=function(ev){
		this.rotateX=-35;
		this.rotateY=35;
		let point=ev.changedTouches[0];
		this.startX=point.clientX;
		this.startY=point.clientY;
		this.changeX=0;
		this.changeY=0;
	}
	let move=function(ev){
		let point=ev.changedTouches[0];
		this.changeX=point.clientX-this.startX;
		this.changeY=point.clientY-this.startY;
	}
	let end=function(ev){
		let point=ev.changedTouches[0];
		//设置两个变量，要给是rotateX 和 rotateY
		let rotateX=0;
		let rotateY=0;
		let isMove=false;
		//这里是设置一个误差，如果手机在屏幕移动的距离大于10，则表示是在移动了，否则是点击时不小心移动的。
		
		Math.abs(this.changeX)>10 || Math.abs(this.changeY)>10 ? isMove=true:null;
		//只有当移动了，才会执行这个里边的函数
		/**x轴滚动的距离和y的运动成反比，x轴转动的方向。y轴转动的角度和点击移动的值是成正比的。 */
		if(isMove){
			rotateX=this.rotateX-this.changeY/2;
			rotateY=this.rotateY+this.changeX/2;
			$cubeContainer.css("transform",`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
		}

	}


	return{
		init:function(){
			$cubeBox.css("display","block");
			$cubeContainer.on("touchstart",start).on("touchmove",move).on("touchend",end);
			$cubeContainerList.on("click",function(){
				$cubeBox.remove();
				let index=$(this).index();
				console.log(index);
				detailRender.init(index);
			});
		}
	}

})();

/**--------------detail详细页面的实现------------------- */
let detailRender=(function(){
	let $detailBox=$(".detailBox"),
	detailSwiper=null,
	$page1=jQuery(".page1");
	//初始化swiper的插件
 	function swiperInit(){
		detailSwiper = new Swiper('.swiper-container', {
			effect:"coverflow",
			on:{
				init:function(){
					$page1.makisu({
						selector: 'dd',
						overlap: 0.2,
						speed: 0.5
					});
					$page1.makisu("open");
				},
				transitionEnd:function(){
					let slidesArray=detailSwiper.slides;
					if(detailSwiper.activeIndex===0){
						$page1.makisu({
							selector: 'dd',
							overlap: 0.2,
							speed: 0.5
						});
						$page1.makisu("open");
					}else{
						$page1.makisu({
							selector: 'dd',
							speed: 0
						});
						$page1.makisu("close");
					}
					//循环数组，只添加当前的页面的id为page？的操作
					let activeIndex=detailSwiper.activeIndex;
					for(let i=0;i<slidesArray.length;i++){
					let activeIndex=detailSwiper.activeIndex;
						if(i===activeIndex){
							slidesArray[activeIndex].id=`page${activeIndex+1}`;
							
						}else{
							slidesArray[i].id=null;
						}

					}

				}


			}
		})
	}
	return {
		init:function(index=0){
			$detailBox.css("display","block");
			// 当swiper不存在的时候
			if(!detailSwiper){
				swiperInit();
			}
			detailSwiper.slideTo(index,0);
			
		}
	}

})();



//阻止移动端的默认事件
$(document).on("touchstart touchmove touchend",function(ev){
	// return false;
});






// 通过输入的hash值不同而显示不同的页面
let hrefs=window.location.href;
let index=hrefs.indexOf("#");
let hash_="";
if(index){
	hash_=hrefs.substr(index+1);
}
switch(hash_){
	case "loading":
		loadingData.init();
		break;
	case "phone":
		phoneRander.init();
		break;
	case "keyboard":
		keyboardRander.init();
		break;
	case "cube":
		cubeRender.init();
		break;
	case "detail" :
		detailRender.init();
		break;
	default :
		loadingData.init();
};
