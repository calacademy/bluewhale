var BlueWhaleTranslate = function (data) {
	var _languages = ['en', 'cn', 'tl', 'es'];
	var _event = Modernizr.touch ? 'touchend' : 'mousedown';
	var _inst = this;
	var _timeout;

	var _stopPropagation = function (e) {
		if (_timeout) {
			clearTimeout(_timeout);
		}

		_timeout = setTimeout(_onTimeout, BLUEWHALE_CONFIG.idleSeconds * 1000);
		e.preventDefault();
		e.stopPropagation();
	}

	var _onTimeout = function () {
		if ($('html').hasClass('attract')) {
			_inst.reset();
		}
	}

	var _onLgSelect = function (e) {
		if ($('html').hasClass('attract')) {
			_stopPropagation(e);
		}

		if (e.type == _event) {
			$('#languages li').removeClass('active');
			$(this).addClass('active');

			$('html').attr('lang', $(this).attr('id'));
			$(document).trigger('languagechange');

			return false;
		}
	}

	var _initInteraction = function () {
		$('#languages li').on('mousedown touchstart touchend', _onLgSelect);
	}

	this.reset = function () {
		$('#languages #en').trigger(_event);
	}

	this.initialize = function () {
		_initInteraction();
	}

	this.initialize();
}
