// @see
// https://github.com/stevenwanderski/bxslider-4

var BlueWhale = function () {
	var _numSlidesVisible = 5;
	var _slideWidth = 660;
	var _selectEvent = Modernizr.touch ? 'touchend' : 'click';
	var _overEvent = Modernizr.touch ? 'touchstart' : 'mouseover';
	var _outEvent = Modernizr.touch ? 'touchend' : 'mouseout click';
	var _media = new BlueWhaleMedia();

	var _configPositions = function (els) {
		els.show();
		els.draggable();
		
		$(document).on('keyup', function (e) {
			if (e.keyCode != 32) return false;

			var obj = {};

			els.each(function () {
				var id = $(this).data('target');

				if (!id) {
					id = $(this).attr('id');
				}

				obj[id] = {
					'left': $(this).css('left'),
					'top': $(this).css('top')
				};
			});

			console.log(JSON.stringify(obj));

			return false;
		});
	}

	var _isSliding = function () {
		var slider = $('.slides').data('bxSlider');

		if (slider) {
			if (slider.isWorking()) return true;	
		}

		return false;	
	}

	var _onOver = function () {
		$(this).addClass('highlight');
	}
	var _onOut = function () {
		$(this).removeClass('highlight');
	}

	var _onPoint = function () {
		$('#points > div').removeClass('selected');
		$('#legend > div').removeClass('open');

		$(this).addClass('selected');
		$('#legend').find('#' + $(this).data('target')).addClass('open');
	}

	var _onLegendClose = function () {
		$(this).parent().removeClass('open');
		$('#points > div').removeClass('selected');
		return false;
	}

	var _onPlay = function () {
		var p = $(this).parent();
		p.data('target', 'media-overlay');
		
		_onNav.call(p);

		return false;
	}

	var _initWhaleTouchPoints = function () {
		if ($('#points div div').length == 0) {
			// add center mark to points
			$('#points > div').append('<div />');

			// add no-img class
			$('#legend > div').each(function () {
				if ($(this).find('img').length == 0) {
					$(this).addClass('no-img');
				}
			});

			// legend arrows
			var arrow = $('<div />');
			arrow.addClass('arrow');
			$('#legend > div').append(arrow);

			// position points and legend
			$('#points > div, #legend > div').each(function () {
				var id = $(this).data('target');

				if (!id) {
					id = $(this).attr('id');
				}

				var pos = BLUEWHALE_CONFIG.points[id];

				if ($(this).parent().attr('id') == 'legend') {
					pos = BLUEWHALE_CONFIG.legend[id];
				}

				$(this).css({
					'left': pos.left,
					'top': pos.top
				});
			});	
		}

		if (window.location.hash == '#drag') {
			_configPositions($('#points > div'));
		} else if (window.location.hash == '#draglegend') {
			_configPositions($('#legend > div'));
		} else {
			$('#points > div').off(_selectEvent);
			$('#points > div').on(_selectEvent, _onPoint);
		}

		if ($('#legend > div').hasClass('processed')) return;

		// close buttons
		var close = $('<button />');
		close.addClass('btn-close');
		close.on(_selectEvent, _onLegendClose);
		$('#legend > div').prepend(close);

		// video buttons
		var play = $('<button />');
		play.addClass('btn-play');
		play.on(_selectEvent, _onPlay);
		$('#legend > .video').prepend(play);

		_addHighlightInteraction($('#legend button, .nav'));
		$('#legend > div').addClass('processed');
	}

	var _addHighlightInteraction = function (el) {
		el.on(_overEvent, _onOver);
		el.on(_outEvent, _onOut);
	}

	var _onNav = function () {
		$('section').removeClass('open');
		
		if ($(this).data('target')) {
			$('html').addClass('show-close');
			$('#' + $(this).data('target')).addClass('open');
		} else {
			$('#whale').addClass('open');
		}

		switch ($(this).data('target')) {
			case 'slideshow':
				_initCarousel();
				break;
			case 'media-overlay':
				_media.playVideo($(this).data('src'));
				break;
			default:
				_initWhaleTouchPoints();
		}
	}

	var _onClose = function () {
		if (_isSliding()) return false;

		$('html').removeClass('show-close');
		$('section').removeClass('open');
		_media.destroy();

		_onNav();
		
		return false;
	}

	var _getMidSlideIndex = function (index) {
		var mid = Math.ceil(_numSlidesVisible / 2);
		return (mid - 1 + index);
	}

	var _onSlideBefore = function (slide, oldIndex, newIndex) {
		$('.slides > li').removeClass('mid-slide');
		$('.slides > li').removeClass('slide-prev');
		$('.slides > li').removeClass('slide-prev-prev');
		$('.slides > li').removeClass('slide-next');
		$('.slides > li').removeClass('slide-next-next');

		if (!slide) {
			slide = $('.slides > li').not('.bx-clone').eq(0);
		}

		var i = _getMidSlideIndex(slide.index());
		var midSlide = $('.slides > li').eq(i); 
		midSlide.addClass('mid-slide');

		midSlide.prev().addClass('slide-prev');
		midSlide.prev().prev().addClass('slide-prev-prev');
		midSlide.next().addClass('slide-next');
		midSlide.next().next().addClass('slide-next-next');
	}

	var _initCarousel = function () {
		var isPreviousInit = typeof($('.slides').data('bxSlider')) != 'undefined';
		if (isPreviousInit) return;

		if ($('.slides > li > .container').length == 0) {
			var container = $('<div />');
			container.addClass('container');
			$('.slides > li').wrapInner(container);
		}

		$('.slides').bxSlider({
			speed: 600,
			controls: true,
			keyboardEnabled: true,
			autoStart: false,
			pager: true,
			minSlides: _numSlidesVisible,
			maxSlides: _numSlidesVisible,
			moveSlides: 1,
			onSlideBefore: _onSlideBefore,
			touchEnabled: Modernizr.touch,
			easing: 'cubic-bezier(.215, .61, .355, 1)',
			slideWidth: _slideWidth
		});

		_addHighlightInteraction($('.bx-controls-direction a'));
		_onSlideBefore();
	}

	var _initTranslate = function (data) {
		_translate = new BlueWhaleTranslate(data);
	}

	var _initIdleTimer = function () {
		$(document).idleTimer({
			timeout: BLUEWHALE_CONFIG.idleSeconds * 1000
		});

		$(document).on('idle.idleTimer', function (event, elem, obj) {
			console.log('idle.idleTimer');

			if (_translate) {
				_translate.reset();
			}

			$('html').addClass('attract');
    	});

    	$(document).on('active.idleTimer', function (event, elem, obj, triggerevent) {
    		console.log('active.idleTimer');
    		$('html').removeClass('attract');
    	});
	}

	var _initNav = function () {
		_addHighlightInteraction($('#close'));
		$('#close').on(_selectEvent, _onClose);
		
		$('.nav').prepend('<div class="point"><div /></div>');
		$('.nav').on(_selectEvent, _onNav);

		_onNav();
	}

	var _onData = function (e, data) {
		$('html').addClass('loaded');

		if (!BLUEWHALE_CONFIG.isDev && !BLUEWHALE_CONFIG.noIdleTimeout) {
			_initIdleTimer();
		}

		$(document).on('videoended', _onClose);
		_initTranslate(data);
		_initNav();
	}

	var _onDataError = function () {
		$(document).off('bluewhalemodel');
		$('#loading h1').html('This exhibit is being updated.');
	}

	this.initialize = function () {
		$(document).off('bluewhalemodel');
		$(document).on('bluewhalemodel.error', _onDataError);
		$(document).on('bluewhalemodel.success', _onData);

		$('.cn-sample').first().clone().addClass('medium').appendTo('#preload');
		$('.cn-sample').first().clone().addClass('semibold').appendTo('#preload');

		// var foo = new BlueWhaleModel();
		$(document).trigger('bluewhalemodel.success');
	}

	this.initialize();
}
