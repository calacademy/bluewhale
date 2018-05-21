var Media = function () {
	var _container;
	var _prog;
	var _navSrc;
	var _inst = this;

	var _onVideoEnded = function (e) {
		_inst.destroy();
		$(document).trigger('videoended');
	}

	var _onVideoProgress = function (e) {
		var per = this.currentTime / this.duration;
		if (_prog) _prog.update(per);
	}

	var _initProgressIndicator = function (video) {
		_prog = new ProgressIndicator(video.siblings('.progress-indicator'), true);

		video.off('timeupdate');
		video.on('timeupdate', _onVideoProgress);
	}

	this.getNavSource = function () {
		return _navSrc;
	}

	this.setNavSource = function (src) {
		_navSrc = src;
	}

	this.pause = function () {
		var video = _container.find('video');

		if (video.length == 1) {
			video.get(0).pause();
			$('html').removeClass('video-playing');
		}
	}

	this.play = function () {
		var video = _container.find('video');

		if (video.length == 1) {
			video.get(0).play();
			$('html').addClass('video-playing');
		}
	}

	this.playInlineVideo = function (video, lg) {
		video.off('ended');
		video.on('ended', _onVideoEnded);

		_initProgressIndicator(video);

		video.get(0).play();

		$('html').addClass('video-playing');
	}

	this.playVideo = function (src, lg) {
		var video = $('<video />', {
			muted: '1',
			src: src
		});
		
		video.off('ended');
		video.on('ended', _onVideoEnded);

		var progress = $('<div />');
		progress.addClass('progress-indicator');

		_container.append(progress);
		_container.append(video);
		
		$('html').addClass('video-playing');
		
		_initProgressIndicator(video);
		video.get(0).play();
	}

	this.destroy = function () {
		$('video').off('timeupdate');
		$('video').off('ended');

		$('html').removeClass('video-playing');
		
		_container.empty();
	}

	this.initialize = function () {
		_container = $('#media-overlay');
	}

	this.initialize();
}
