var BlueWhaleModel = function () {
	var _endpoint = 'https://giants.calacademy.org/rest/';
	var _callbackData = { callback: '_jqjsp' };
	var _timeout = 60000;

	var _data = {
		'slides': 'skull-wall-slides',
		'specimens': 'skull-wall-specimens',
		'misc': 'skull-wall-misc'
	};

	var _onSuccess = function () {
		$(document).trigger('bluewhalemodel.success', [_data]);
	}

	var _onError = function () {
		$(document).trigger('bluewhalemodel.error');
	}

	var _getSlug = function (str) {
		str = $.trim(str).toLowerCase();
		str = str.replace(/[^0-9a-z\s]/gi, '');
		return str.replace(/\s/g, '-');
	}

	var _getSluggifiedData = function (key, data) {
		$.each(data, function (i, obj) {
			if (obj.title_en) {
				obj.slug = _getSlug(obj.title_en);
			} else {
				obj.slug = _getSlug(obj.title);	
			}

			if (obj.buttons) {
				$.each(obj.buttons, function (i, btn) {
					btn.slug = _getSlug(btn.en.safe_value);
				});
			}
		});

		return data;
	}

	var _onData = function (key, data) {
		_data[key] = _getSluggifiedData(key, data);

		var success = true;

		$.each(_data, function (i, val) {
			if (!$.isArray(val)) {
				success = false;
				return false;
			}
		});

		if (success) {
			_onSuccess();	
		}
	}

	var _requestJsonp = function (path, success, error) {
		$.jsonp({
			timeout: _timeout,
			data: _callbackData,
			url: path,
			success: function (data, textStatus) {
				success(data);
			},
			error: _onError
		});
	}

	this.initialize = function () {
		$.each(_data, function (key, val) {
			var url = _endpoint + val + '.jsonp';
			
			if (BLUEWHALE_CONFIG.isDev) {
				url = 'jsonp/' + key + '.jsonp';
			}

			_requestJsonp(url, function (data) {
				_onData(key, data);
			});
		});
	}

	this.initialize();
}
