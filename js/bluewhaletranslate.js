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

	var _setLanguage = function (lg) {
		$('#languages li').removeClass('active');
		$('#' + lg).addClass('active');

		$('html').attr('lang', lg);
		$(document).trigger('languagechange');
	}

	var _onLgSelect = function (e) {
		if ($('html').hasClass('attract')) {
			_stopPropagation(e);
		} else {
			$(document).idleTimer('reset');
		}

		if (e.type == _event) {
			_setLanguage($(this).attr('id'));
		}

		return false;
	}

	var _initInteraction = function () {
		$('#languages li').on('mousedown touchstart touchend', _onLgSelect);
	}

	var _populateMisc = function () {
		$.each(data.misc[0].labels, function (i, obj) {
			var id = obj.machine_id.safe_value;

			$('*[machine_id="' + id + '"]').each(function () {
				var el = $(this);

				$.each(_languages, function (j, lg) {
					var lgField = $('<div />');
					lgField.addClass(lg);
					lgField.html(obj[lg].value);

					el.append(lgField);
				});
			});
		});
	}

	var _populateHotspots = function () {
		$.each(data.hotspots[0].hotspots, function (i, obj) {
			var slug = _getSlug(obj.header_en.safe_value);
			var legend = $('#legend #' + slug);

			// thumbnail
			if (obj.thumbnail) {
				var img = $('<img />');
				img.attr('src', _getSrc(obj.thumbnail));
				legend.append(img);
			}

			// title
			var h2 = $('<h2 />');
			legend.append(h2);
			_populateField(h2, obj, 'header_');
			
			// body
			var copy = $('<div />');
			copy.addClass('copy');
			legend.append(copy);
			_populateField(copy, obj);
		});
	}
	
	var _populateCarousel = function () {
		// transpose last two slides to the beginning
		var arr = data.carousel[0].slides;
		var offset = 2;

		var end = arr.slice(offset * -1);
		var portion = arr.slice(0, arr.length - offset);
		
		// create slides
		$.each(end.concat(portion), function (i, obj) {
			var slide = $('<li />');

			// img
			var img = $('<img />');
			img.attr('src', _getSrc(obj.photo));
			slide.append(img);

			// copy
			var div = $('<div />');
			slide.append(div);
			_populateField(div, obj);
			
			$('#slideshow .slides').append(slide);
		});
	}

	var _populateCredits = function () {
		var numFirstColumn = Math.ceil(data.credits[0].credits.length / 2);
		var firstCol = $('<ul />');
		var secondCol = $('<ul />');

		$('#credits .container').append(firstCol);
		$('#credits .container').append(secondCol);

		$.each(data.credits[0].credits, function (i, obj) {
			var li = $('<li />');
			var h2 = $('<h2 />');
			var div = $('<div />');
			li.append(h2);
			li.append(div);

			_populateField(h2, obj, 'header_');
			_populateField(div, obj);

			if (i < numFirstColumn) {
				firstCol.append(li);
			} else {
				secondCol.append(li);
			}
		});
	}

	var _populateField = function (container, obj, field) {
		if (!field) field = '';

		$.each(_languages, function (i, lg) {
			var lgField = $('<div />');
			lgField.addClass(lg);
			lgField.html(obj[field + lg].safe_value);

			container.append(lgField);
		});
	}

	var _getSrc = function (obj) {
		var file_path = data.hotspots[0].file_path;
		return obj.uri.replace('public://', file_path);
	}

	var _getSlug = function (str) {
		str = $.trim(str).toLowerCase();
		str = str.replace(/[^0-9a-z\s]/gi, '');
		return str.replace(/\s/g, '-');
	}

	this.reset = function () {
		_setLanguage('en');
	}

	this.initialize = function () {
		console.log(data);
		
		_populateMisc();
		_populateHotspots();
		_populateCarousel();
		_populateCredits();

		// unwrap any links
		$.each(_languages, function (i, lg) {
			$('.' + lg + ' a').contents().unwrap();
		});

		_initInteraction();
	}

	this.initialize();
}
