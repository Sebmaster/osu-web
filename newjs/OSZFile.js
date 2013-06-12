function OSZFile(file) {
	this.file = file;
}

OSZFile.MimeTypes = {
	'aif': 'audio/x-aiff',
	'aifc': 'audio/x-aiff',
	'aiff': 'audio/x-aiff',
	'asf': 'video/x-ms-asf',
	'asr': 'video/x-ms-asf',
	'asx': 'video/x-ms-asf',
	'avi': 'video/x-msvideo',
	'bmp': 'image/bmp',
	'css': 'text/css',
	'gif': 'image/gif',
	'htm': 'text/html',
	'html': 'text/html',
	'ico': 'image/x-icon',
	'jfif': 'image/pipeg',
	'jpe': 'image/jpeg',
	'jpeg': 'image/jpeg',
	'jpg': 'image/jpeg',
	'js': 'application/x-javascript',
	'm13': 'application/x-msmediaview',
	'm14': 'application/x-msmediaview',
	'm3u': 'audio/x-mpegurl',
	'mid': 'audio/mid',
	'mov': 'video/quicktime',
	'mp2': 'video/mpeg',
	'mp3': 'audio/mpeg',
	'mpa': 'video/mpeg',
	'mpe': 'video/mpeg',
	'mpeg': 'video/mpeg',
	'mpg': 'video/mpeg',
	'mpv2': 'video/mpeg',
	'osu': 'text/x-osu',
	'pbm': 'image/x-portable-bitmap',
	'pdf': 'application/pdf',
	'qt': 'video/quicktime',
	'ra': 'audio/x-pn-realaudio',
	'ram': 'audio/x-pn-realaudio',
	'rmi': 'audio/mid',
	'rtf': 'application/rtf',
	'svg': 'image/svg+xml',
	'swf': 'application/x-shockwave-flash',
	'tif': 'image/tiff',
	'tiff': 'image/tiff',
	'tsv': 'text/tab-separated-values',
	'txt': 'text/plain',
	'wav': 'audio/x-wav',
	'wmf': 'application/x-msmetafile',
	'wrl': 'x-world/x-vrml',
	'wrz': 'x-world/x-vrml',
	'xaf': 'x-world/x-vrml',
	'xbm': 'image/x-xbitmap'
};

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

						var ext = entries[doneEntries].filename.split('.');
						ext = ext[ext.length - 1];

						entries[doneEntries].getData(new zip.BlobWriter(OSZFile.MimeTypes[ext] ? OSZFile.MimeTypes[ext] : 'application/octet-stream'), function (blob) {
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