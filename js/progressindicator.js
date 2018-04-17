var ProgressIndicator = function (container, isCountdown) {
	var _dash;

	this.update = function (per) {
		if (isNaN(per)) {
			per = 0;
		}

		// countdown vs. progress
		if (isCountdown) {
			per = per * -1;	
		}

		$('.progress', container).css({
			'stroke-dashoffset': per * _dash * -1
		});
	}

	this.initialize = function () {
		var svg = $('<svg><circle class="bg"></circle><circle class="progress"></circle></svg>');
		
		container.empty();
		container.html(svg);

		// attributes
		var stroke = parseInt($('.progress', container).css('stroke-width'));
		var dim = parseInt(svg.css('width'));
		var radius = (dim / 2) - (stroke / 2);

		_dash = 2 * Math.PI * radius;

		$('circle', container).attr({
			r: radius,
			cx: dim / 2,
			cy: dim / 2
		});

		// initial CSS values
		$('.progress', container).css({
			'stroke-dasharray': _dash,
			'stroke-dashoffset': _dash
		});

		this.update(0);
	}

	this.initialize();
}
