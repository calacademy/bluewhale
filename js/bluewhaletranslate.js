var BlueWhaleTranslate = function (data) {
	var _languages = ['en', 'cn', 'tl', 'es'];
	var _event = Modernizr.touch ? 'touchend' : 'click';

	var _onLgSelect = function (e) {
		$('#languages li').removeClass('active');
		$(e.target).addClass('active');

		$('html').attr('lang', $(e.target).attr('id'));
		$(document).trigger('languagechange');

		return false;
	}

	var _initInteraction = function () {
		$('#languages li').on(_event, _onLgSelect);
	}

	this.reset = function () {
		$('#languages #en').trigger(_event);
	}

	this.initialize = function () {
		_initInteraction();
	}

	this.initialize();
}
