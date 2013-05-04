function OSU(playArea, songArea) {
	this.playArea = jQuery(playArea);
}

OSU.prototype.bindEvents = function () {
	var that = this;

	this.playArea.on('dragover dragend', function () {
		return false;
	});

	this.playArea.on('drop paste', function (e) {
		var files = e.originalEvent.dataTransfer.files;
		if (!files || !files.length) return;

		for (var i = 0; i < files.length; ++i) {
			var osz = new OSZFile(files[i]);
			osz.verify(function (err, osu) {
				if (err) {
					console.log(err);
					return;
				}

				osz.copyToLocalStorage(function (err) {
					that.getSavedSongs();
					console.log(err);
					console.log('extraction finished');
				});
				console.log(osu);
			});
		}

		return false;
	});
};

OSU.prototype.getSavedSongs = function (cb) {
	var that = this;

	Utils.requestFileSystem(0, function (err, fs) {
		if (err) {
			cb(err);
			return;
		}

		fs.root.getDirectory('Songs', { create: true }, function (dirEntry) {
			Utils.readDirectoryEntries(dirEntry, function (err, entries) {
				var doneEntries = 0;
				var results = [];

				entries.forEach(function (songDir) {
					Utils.readDirectoryEntries(songDir, function (err, variants) {
						if (err) {
							cb(err);
							return;
						}

						variants = _.filter(variants, function (variant) {
							return variant.name.substr(-4) === '.osu';
						});

						results[results.length] = {
							name: variants[0].name.match(/^(.*)\s+\[.*?\].osu$/)[1],
							variants: _.map(variants, function (variant) {
								return { name: variant.name.match(/\[(.*?)\]/)[1], path: variant.fullPath };
							})
						};

						if (++doneEntries === entries.length) {
							cb(null, results);
						}
					});
				});
			});
		}, cb);
	});
};

OSU.prototype.playSong = function (song, cb) {
	var that = this;

	if (typeof song === 'string') {
		Utils.requestFileSystem(0, function (err, fs) {
			if (err) {
				cb(err);
				return;
			}

			fs.root.getFile(song, { exclusive: true }, function (file) {
				that.playSong(file, cb);
			}, cb);
		});
		return;
	}

	console.log(song);
};