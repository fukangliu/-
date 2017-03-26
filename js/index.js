

$(function(){
	
		var curPage = 1;
		var perPageCount = 10;		
		var colSumHeight = [];
		var nodeWidth = $('.item').outerWidth(true);
		var colnum = parseInt($('#pic-ct').width()/nodeWidth);

		for (var i = 0; i <colnum; i++) {
			colSumHeight[i] = 0;
		};

		getnews();

		$(window).on('scroll',function(){
			if (isVisible($('#load'))) {
				getnews();
			};
		})

		function getnews(){

			$.ajax({
				url:'http://platform.sina.com.cn/slide/album_tech',
				dataType:'jsonp',
				jsonp:"jsoncallback",
				data:{
					app_key:'1271687855',
					num:perPageCount,
					page:curPage
				}
			}).done(function(ret){
				if (ret && ret.status && ret.status.code === '0') {
					var newlist = ret.data;						
					tonode(newlist);
					curPage ++;
				}else{
					console.log('get error data');
				};
			})
		};


		function tonode(data){
			$.each(data,function(index,ele){

				var tpl = '';
				tpl += '<li class="item">'
				tpl += '<a href="'+ele.url+'" class="link"><img src="'+ele.img_url+'" alt=""/></a>'
				tpl += '<h4 class="header">'+ele.short_name+'</h4>'
				tpl += '<p class="desp">'+ele.short_intro+'</p>'
				tpl += '</li>'

				var $node = $(tpl);				
				$node.find('img').load(function(){
					$('#pic-ct').append($node);	
					waterFallPlace($node);
				})
			})
		}

		function waterFallPlace($node){

			var idx = 0;
			var minSumHeight = colSumHeight[0];

			for (var i =0; i <colSumHeight.length; i++) {
				if (colSumHeight[i]<minSumHeight) {
					minSumHeight = colSumHeight[i];
					idx = i;
				};
			};
			
			$node.css({
				left:idx*nodeWidth,
				top:minSumHeight,
				opacity:1
			})

			colSumHeight[idx] = $node.outerHeight(true)+colSumHeight[idx];
			$('#pic-ct').height(Math.max.apply(null,colSumHeight));

		}


		function isVisible(obj){
			var top = obj.offset().top;
			var scrolltop = $(window).scrollTop();
			var wheight = $(window).height();
			if (top<scrolltop+wheight) {
					return true;
			}else{
					return false;
			};
		};

})


