var FrameAnimation = function (container, numFrames, prefix) {
	var _getPaddedNum = function (num) {
		if (num < 10) return '0000' + num;
		if (num >= 10 && num < 100) return '000' + num;
		if (num >= 100) return '00' + num;
	}
	
	var _onError = function () {
		$(document).trigger('imgerror');
	}

	this.stop = function () {
		container.removeClass('animate');
	}

	this.start = function () {
		container.addClass('animate');
	}

	this.initialize = function () {
		var div = $('<div />');
		div.addClass('container');

		var i = 0;

		while (i < numFrames) {
			var frame = _getPaddedNum(i);
			var img = $('<img />');
			img.on('error', _onError);

			img.attr('src', prefix + frame + '.png');

			div.append(img);

			i++;
		}

		container.addClass('frame-animation');
		container.append(div);
	}

	this.initialize();
}
