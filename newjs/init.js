(function () {
	var lastTime = 0;
	var vendors = ['webkit', 'moz'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame =
          window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function (callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function () { callback(currTime + timeToCall); },
              timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function (id) {
			clearTimeout(id);
		};
}());

window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
window.storageInfo = window.storageInfo || window.webkitStorageInfo;
zip.workerScriptsPath = "vendor/zip.js/";

jQuery(function () {
	function refreshSongs(entries) {
		osu.getSavedSongs(function (err, entries) {
			if (err) {
				console.log(err);
				return;
			}

			jQuery('#songs').empty();

			for (var i = 0; i < entries.length; ++i) {
				var entry = entries[i];

				var listItem = jQuery('<li>').text(entry.name).appendTo('#songs');
				for (var j = 0; j < entry.variants.length; ++j) {
					jQuery('<a>')
						.text(entry.variants[j].name)
						.data('osuPath', entry.variants[j].path)
						.click(function () {
							jQuery('#songs').hide();
							jQuery('#osu').show();
							osu.playSong(jQuery(this).data('osuPath'));
						})
						.appendTo(listItem);
				}
			}
		});
	}

	jQuery(window).on('resize', function () {
		var canvas = jQuery('#osu');
		var cvWidth = canvas.width();
		var cvHeight = canvas.height();

		canvas.prop({ width: cvWidth, height: cvHeight });
	});

	jQuery(window).trigger('resize');
	var osu = new OSU('#osu');
	osu.bindEvents(function () {
		refreshSongs();
	});

	refreshSongs();
});