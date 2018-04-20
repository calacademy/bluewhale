var BlueWhaleMedia = function () {
	var _container;
	var _prog;

	var _onVideoEnded = function (e) {
		$(this).get(0).load();
		$('html').removeClass('video-playing');
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

	this.playInlineVideo = function (video, lg) {
		video.off('ended');
		video.on('ended', _onVideoEnded);

		_initProgressIndicator(video);

		video.get(0).play();

		$('html').addClass('video-playing');
	}

	this.playVideo = function (src, lg) {
		var video = $('<video />');
		
		video.off('ended');
		video.on('ended', _onVideoEnded);

		video.attr('src', src);

		var progress = $('<div />');
		progress.addClass('progress-indicator');

		_container.append(progress);
		_container.append(video);
		
		$('html').addClass('video-playing');
		$('html').addClass('media');
		
		_initProgressIndicator(video);
		video.get(0).play();
	}

	this.destroy = function () {
		$('video').off('timeupdate');
		$('video').off('ended');

		$('html').removeClass('video-playing');
		$('html').removeClass('3d');
		$('html').removeClass('media');
		
		_container.empty();
	}

	this.initialize = function () {
		_container = $('#media-overlay');
	}

	this.initialize();
}
