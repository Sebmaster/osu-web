function OSZFile(file) {
	this.file = file;
}

OSZFile.prototype.verify = function (cb) {
	if (this.file.name.substr(this.file.name.length - 4) !== '.osz') {
		cb(new Error('Invalid file extension'));
		return;
	}

	zip.createReader(new zip.BlobReader(this.file), function (reader) {
		reader.getEntries(function (entries) {
			var osuFile = _.filter(entries, function (entry) {
				return entry.filename.substr(entry.filename.length - 4) === '.osu';
			});

			if (osuFile.length > 0) {
				osuFile[0].getData(new zip.TextWriter('CP1251'), function (text) {
					reader.close();

					var matches = text.match(/^\s*osu file format v(\d+?)\r?\n/);
					if (matches && parseInt(matches[1], 10) <= 12) {
						cb(null, new OSUFile(text));
					} else {
						cb(new Error('osu file format <= v12 expected!'));
					}
				});
			} else {
				cb(new Error('Can\'t find osu file in the archive!'));
			}
		});
	}, function (err) {
		cb(err);
	});
};

OSZFile.prototype.copyToLocalStorage = function (cb) {
	var that = this;

	zip.createReader(new zip.BlobReader(this.file), function (reader) {
		reader.getEntries(function (entries) {
			var totalSize = 0;
			for (var i = 0; i < entries.length; ++i) {
				if (entries[i].directory) continue;

				totalSize += entries[i].uncompressedSize;
			}

			Utils.requestFileSystem(totalSize, function (err, fs) {
				if (err) {
					cb(err);
					return;
				}

				var doneEntries = -1; //first call to done has not "done" anything

				(function done() {
					if (++doneEntries === entries.length) {
						reader.close();

						cb(null);
					} else {
						if (entries[doneEntries].directory) {
							done();
							return;
						}

						entries[doneEntries].getData(new zip.BlobWriter(), function (blob) {
							var parts = ('Songs/' + that.file.name.substr(0, that.file.name.length - 4) + '/' + entries[doneEntries].filename).split('/');
							var path = parts.slice(0, -1);

							Utils.createFilePath(fs.root, path, function (err, dir) {
								if (err) {
									cb(err);
									return;
								}

								dir.getFile(parts[parts.length - 1], { create: true }, function (fileEntry) {
									fileEntry.createWriter(function (fileWriter) {
										fileWriter.write(blob);
										done();
									}, cb);
								}, cb);
							});
						});
					}
				})();
			});
		});
	});
};