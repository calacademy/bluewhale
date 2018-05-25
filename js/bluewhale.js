// @see
// https://github.com/stevenwanderski/bxslider-4

var BlueWhale = function () {
	var _numSlidesVisible = 5;
	var _slideWidth = 660;
	var _selectEvent = Modernizr.touch ? 'touchend' : 'click';
	var _overEvent = Modernizr.touch ? 'touchstart' : 'mouseover';
	var _outEvent = Modernizr.touch ? 'touchend' : 'mouseout click';
	var _media = new Media();
	var _currentSlide = 0;
	var _lastSection;
	var _translate;
	var _carousel;
	var _data;
	var _animations;

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
		if (_carousel) {
			if (_carousel.isWorking()) return true;	
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
		_onLegendClose();
		$('#cta-spot').addClass('hide');

		$(this).addClass('selected');
		$('#legend').find('#' + $(this).data('target')).addClass('open');

		if ($(this).data('frames')) {
			// reset bus animation to first frame
			$('#bus-frames .container').css('top', '0');

			// add animation
			$('#' + $(this).data('frames')).addClass('active');
		}
	}

	var _onLegendClose = function () {
		$('#points > div').removeClass('highlight');
		$('#points > div').removeClass('selected');
		$('#legend > div').removeClass('open');

		// capture current bus frame
		var val = $('#bus-frames .container').css('top');
		
		// remove animation
		$('.legend-frames').removeClass('active');

		// pause to last bus frame
		$('#bus-frames .container').css('top', val);

		return false;
	}

	var _onPlay = function () {
		_media.setNavSource($(this).closest('section').attr('id'));
		_onNav('media-overlay', $(this).parent().data('src'));

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
				} else {
					$(this).addClass('with-img');
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
			$('#points > div').off();

			if (Modernizr.touch) {
				$('#points > div').on(_overEvent, _onOver);	
			} else {
				_addHighlightInteraction($('#points > div'));
			}

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

		_addHighlightInteraction($('#legend button'));
		$('#legend > div').addClass('processed');
	}

	var _addHighlightInteraction = function (el) {
		el.on(_overEvent, _onOver);
		el.on(_outEvent, _onOut);
	}

	var _toggleCloseButton = function (section) {
		if ($('#' + section).hasClass('no-close')) {
			$('html').removeClass('show-close');
		} else {
			$('html').addClass('show-close');
		}
	}

	var _onButtonNav = function () {
		_onNav($(this).data('target'));
		return false;
	}

	var _onNav = function (section, src) {
		var newSection = $('#' + section);
		var isOverlay = newSection.hasClass('overlay');

		if (isOverlay) {
			// pause any media
			if (section != 'media-overlay') {
				_media.pause();
			}
		} else {
			// close everything
			$('section').removeClass('open');
			_media.destroy();
		}

		newSection.addClass('open');
		$('html').removeClass('attract');
		$('#attract video').get(0).pause();
		
		_toggleCloseButton(section);

		_lastSection = $('html').attr('active-section');
		$('html').attr('active-section', section);

		switch (section) {
			case 'attract':
				if (_translate) {
					_translate.reset();
				}

				_onLegendClose();
				
				$('.cta').removeClass('hide');
				$('html').addClass('attract');

				$('#attract video').get(0).play();
				break;
			case 'slideshow':
				_onLegendClose();
				_initCarousel();
				break;
			case 'media-overlay':
				_media.playVideo(src);
				break;
			case 'whale':
				_initWhaleTouchPoints();
				break;
		}
	}

	var _onOverlayClose = function () {
		var section = $('#' + $('html').attr('active-section'));

		// hide
		section.removeClass('open');
		$('html').attr('active-section', _lastSection);

		_toggleCloseButton(_lastSection);

		if (_lastSection == 'media-overlay') {
			// previously viewing media
			_media.play();
			_lastSection = _media.getNavSource();
		} else {
			_media.destroy();
		}
	}

	var _onClose = function () {
		if (_isSliding()) return false;

		// closing an overlay
		var section = $('#' + $('html').attr('active-section'));

		if (section.hasClass('overlay')) {
			_onOverlayClose();
			return;
		}

		$('section').removeClass('open');		
		_media.destroy();

		_onNav('whale');
		
		return false;
	}

	var _onVideoEnded = function () {
		$(document).idleTimer('reset');
		_onClose();
	}

	var _getMidSlideIndex = function (index) {
		var mid = Math.ceil(_numSlidesVisible / 2);
		return (mid - 1 + index);
	}

	var _removeSlideClasses = function () {
		$('.slides > li').removeClass('mid-slide');
		$('.slides > li').removeClass('slide-prev');
		$('.slides > li').removeClass('slide-prev-prev');
		$('.slides > li').removeClass('slide-next');
		$('.slides > li').removeClass('slide-next-next');
	}

	var _addSlideClasses = function (mid) {
		mid.addClass('mid-slide');
		mid.prev().addClass('slide-prev');
		mid.prev().prev().addClass('slide-prev-prev');
		mid.next().addClass('slide-next');
		mid.next().next().addClass('slide-next-next');
	}

	var _onSlideBefore = function (slide, oldIndex, newIndex) {
		_currentSlide = (typeof(newIndex) == 'undefined') ? 0 : newIndex;

		$('html').removeClass('carousel-edge');

		var mid = $('.mid-slide');
		_removeSlideClasses();

		var total = _carousel.getSlideCount();
		var isPreviousFromFirst = (oldIndex === 0 && newIndex === (total - 1));
		var isNextFromLast = (oldIndex === (total - 1) && newIndex === 0);

		// previous from first slide
		if (isPreviousFromFirst) {
			_addSlideClasses(mid.prev());
			return;
		}

		// next from last slide
		if (isNextFromLast) {
			_addSlideClasses(mid.next());
			return;
		}

		// normal
		if (!slide) {
			slide = $('.slides > li').not('.bx-clone').eq(0);
		}

		var i = _getMidSlideIndex(slide.index());
		var mid = $('.slides > li').eq(i);
		_addSlideClasses(mid);
	}

	var _onSlideAfter = function (slide, oldIndex, newIndex) {
		var total = _carousel.getSlideCount();
		var isPreviousFromFirst = (oldIndex === 0 && newIndex === (total - 1));
		var isNextFromLast = (oldIndex === (total - 1) && newIndex === 0);

		if (isPreviousFromFirst || isNextFromLast) {
			$('html').addClass('carousel-edge');
			_addSlideClasses(slide.next().next());
		}
	}

	var _stopPropagation = function (e) {
		$(document).idleTimer('reset');
		e.preventDefault();
		e.stopPropagation();
	}

	var _onSlideClick = function (e) {
		if ($(this).parent().hasClass('slide-prev')) {
			_stopPropagation(e);
			_carousel.goToPrevSlide();
		}
		if ($(this).parent().hasClass('slide-next')) {
			_stopPropagation(e);
			_carousel.goToNextSlide();
		}
	}

	var _initCarousel = function () {
		// $('html').removeClass('carousel-edge');

		if (_carousel) {
			_carousel.jumpToSlide(_currentSlide);
			return;
		}

		$('.slides > li').each(function () {
			$(this).attr('index', $(this).index());

			var container = $('<div />');
			container.addClass('container');
			container.on(_selectEvent, _onSlideClick);

			$(this).wrapInner(container);
		});

		_carousel = $('.slides').bxSlider({
			speed: 600,
			controls: true,
			keyboardEnabled: true,
			autoStart: false,
			pager: true,
			minSlides: _numSlidesVisible,
			maxSlides: _numSlidesVisible,
			moveSlides: 1,
			onSlideBefore: _onSlideBefore,
			onSlideAfter: _onSlideAfter,
			touchEnabled: Modernizr.touch,
			easing: 'cubic-bezier(.215, .61, .355, 1)',
			slideWidth: _slideWidth
		});

		_addHighlightInteraction($('.bx-controls-direction a'));
		_onSlideBefore();
	}

	var _initTranslate = function () {
		_translate = new BlueWhaleTranslate(_data);
	}

	var _initIdleTimer = function () {
		$(document).idleTimer({
			timeout: BLUEWHALE_CONFIG.idleSeconds * 1000,
			events: 'keydown mousedown touchstart'
		});

		$(document).on('idle.idleTimer', function (event, elem, obj) {
			if ($('html').hasClass('video-playing')) {
				$(document).idleTimer('reset');
				return;
			}
			
			console.log('idle');
			
			_currentSlide = 0;
			_lastSection = null;
			_onNav('attract');
    	});

    	$(document).on('active.idleTimer', function (event, elem, obj, triggerevent) {
    		console.log('active');
    		
    		$('#attract').off();

    		$('#attract').on('transitionend', function () {
    			$(this).off();
    			$(this).removeClass('fade-out');
    			_onNav('whale');
    		});

    		_initWhaleTouchPoints();

    		$('#whale').addClass('open');
    		$('#attract').addClass('fade-out');
    	});
	}

	var _initNav = function () {
		_addHighlightInteraction($('nav span, #close, .nav'));
		$('.with-point').prepend('<div class="point"><div /></div>');

		$('#close').on(_selectEvent, _onClose);
		$('.nav').on(_selectEvent, _onButtonNav);
	}

	var _onError = function () {
		$(document).off('imgerror');
		$(window).off('load');
		$(document).off('bluewhalemodel');

		$('#loading h1').html('This exhibit is being updated.');
	}

	var _onData = function (e, data) {
		_data = data;
		$('html').addClass('data-loaded');

		if ($('html').hasClass('content-loaded')) {
			_start();	
		}
	}

	var _onLoad = function () {
		$('html').addClass('content-loaded');

		if ($('html').hasClass('data-loaded')) {
			_start();	
		}
	}

	var _start = function () {
		if ($('html').hasClass('loaded')) return;
		
		$('html').addClass('loaded');
		$(document).on('videoended', _onVideoEnded);

		_initIdleTimer();
		_initTranslate();
		_initNav();

		// start animations
		$.each(_animations, function (key, val) {
			if (val) {
				val.start();	
			}
		});

		// start attracting
		$(document).idleTimer('toggle');
	}

	this.initialize = function () {
		// listen for load events
		$(document).off('bluewhalemodel');
		$(document).on('bluewhalemodel.error', _onError);
		$(document).on('bluewhalemodel.success', _onData);
		
		$(document).on('imgerror', _onError);
		$(window).on('load', _onLoad);

		// glyphs
		$('.en-sample').first().clone().addClass('medium').appendTo('#preload');
		$('.en-sample').first().clone().addClass('semibold').appendTo('#preload');
		$('.cn-sample').first().clone().addClass('medium').appendTo('#preload');
		$('.cn-sample').first().clone().addClass('semibold').appendTo('#preload');

		$('#languages li, #btn-credits').contents().wrap('<span />');

		// animations
		_animations = {
			water: new FrameAnimation($('#water'), 300, 'images/animations/background/background_v15_'),
			whale: new FrameAnimation($('#whale-frames'), 900, 'images/animations/whale/whale_krill_v15_'),
			bus: new FrameAnimation($('#bus-frames'), 300, 'images/animations/bus/bus_v15_'),
			heart: new FrameAnimation($('#heart-frames'), 900, 'images/animations/heartCar/heartCar_v15_')
		};

		// extra bus image
		var clone = $('#bus-frames .container img').last().clone();
		$('#bus-frames .container').append(clone);

		// data
		var foo = new BlueWhaleModel();
	}

	this.initialize();
}
