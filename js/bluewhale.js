var BlueWhale = function () {
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

	var _initTranslate = function (data) {
		_translate = new BlueWhaleTranslate(data);
	}

	var _onData = function (e, data) {
		_initTranslate(data);
		$('html').addClass('loaded');

		if (!BLUEWHALE_CONFIG.isDev && !BLUEWHALE_CONFIG.noIdleTimeout) {
			_initIdleTimer();
		}
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
