function OSU(playArea, songArea) {
	this.playArea = jQuery(playArea);
	this.context = this.playArea[0].getContext('2d');
}

OSU.prototype.bindEvents = function (newSong) {
	var that = this;

	jQuery('body').on('dragover dragend', function () {
		return false;
	}).on('drop paste', function (e) {
		var files = e.originalEvent.dataTransfer.files;
		if (!files || !files.length) return;

		for (var i = 0; i < files.length; ++i) {
			var osz = new OSZFile(files[i]);
			osz.verify(function (err, osu) {
				if (err) {
					newSong(err);
					return;
				}

				osz.copyToLocalStorage(function (err) {
					newSong(err);
				});
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
				if (cb) {
					cb(err);
				}
				return;
			}

			fs.root.getFile(song, { exclusive: true }, function (file) {
				that.playSong(file, cb);
			}, cb);
		});
		return;
	}

	song.file(function (file) {
		var reader = new FileReader();

		reader.onloadend = function (e) {
			var path = song.fullPath.substring(0, song.fullPath.lastIndexOf('/') + 1);
			var bm = new Beatmap(that.context, new OSUFile(reader.result), path);
			bm.init(function (err) {
				if (err) {
					cb(err);
					return;
				}

				bm.start();

				if (cb) {
					cb(null);
				}
			});
		};

		reader.readAsText(file);
	}, cb);
};