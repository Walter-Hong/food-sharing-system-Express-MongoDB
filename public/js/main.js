
// the width of the screen
var clientWidth = $(window).width();
var sideOffsetTop = '';
var $sideFloat = {};

$(window).resize(function () {
	clientWidth = $(window).width();
	$sideFloat.css({position: 'static',top: '60px'});
	sideOffsetTop = $sideFloat.offset().top - 60;
});


$(window).ready(function () {
	var $header    = $('#header');
	var $logoBar   = $('.band');
	var $page      = $('.page');
	var $toTop     = $('.to-top');
	var $toBottom  = $('.to-bottom');
	var pageOffsetTop = 0;
	$sideFloat = $('.side-float');
	sideOffsetTop = $sideFloat.offset().top - 60; // the length of the side without the length of the header


	//  display and hide of the header
	function head () {
		
		if (clientWidth < 800) {

			if ($(this).scrollTop() > 100) 
				$logoBar.css('display', 'none');
			else
				$logoBar.css('display', 'block');

		} else {

			$logoBar.css('display', 'block');
		}
	}

	// side floating
	function side() {
		var scrollTop = $(window).scrollTop();
		if (scrollTop > sideOffsetTop) {
			$sideFloat.css({
				position: 'fixed',
				top: '60px'
			});
		} 
		if (scrollTop < sideOffsetTop){
			$sideFloat.css({
				position: 'static',
				top: '60px'
			});
		}

		if (scrollTop + 60 > pageOffsetTop) {
			$sideFloat.css({
				position: 'absolute',
				top: pageOffsetTop + 'px'
			});
		}
	}

	$toTop.on('click', function () {
		$('html,body').animate({
			scrollTop: 0
		}, 300);
	});

	$toBottom.on('click', function () {
		$('html,body').animate({
			scrollTop: $(document).height()
		}, 300);
	});

	$('#skip-bn').on('click', function () {
		$skipTo = $('#skip-to');
		if ($skipTo.val() === '') {
			hint('you must enter the number of page.');
			return;
		}
		window.location.href = $skipTo.attr('paging-link') + $skipTo.val();
	});

	$(window).scroll(function () {

		pageOffsetTop = $page.offset().top + $page.height() - $sideFloat.height(); 
		head();
		side();
	});

	$('.share-bn').on('click', function () {
		if (clientWidth < 800) {
			hint('click on the options bar of the browser then you can share it with your friends!!');
		}
	});
});
