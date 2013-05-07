function Storyboard(path, osuFile) {
	this.path = path;
	this.osu = osuFile;
	this.osb = null;
}

Storyboard.prototype.init = function (ctx, cb) {
	var that = this;

	for (var i = 0; i < this.osu.Events.length; ++i) {
		switch (this.osu.Events[i][0]) {
			case "0":
				var match = that.osu.Events[i][2].match(/^"?(.*?)"?$/);
				Utils.getURLFromPath(that.path + '/' + match[1], function (err, url) {
					jQuery(ctx.canvas).css({
						background: 'url("'+url+'")',
						backgroundPosition: 'center center',
						backgroundSize: 'cover'
					});
				});
				break;
		}
	}

	this._initOsb(cb);
};

Storyboard.prototype._initOsb = function (cb) {
	var that = this;

	Utils.requestFileSystem(0, function (err, fs) {
		if (err) {
			cb(err);
			return;
		}

		fs.root.getDirectory(that.path, function (dirEntry) {
			Utils.readDirectoryEntries(dirEntry, function (err, entries) {
				if (err) {
					cb(err);
					return;
				}

				var found = false;
				for (var i = 0; i < entries.length; ++i) {
					if (entries.name.substring(-4) === '.osb') {
						entries[i].file(function (file) {
							var reader = new FileReader();

							reader.onloadend = function (e) {
								this.osb = new OSUFile(reader.result);

								if (cb) {
									cb(null);
								}
							};

							reader.readAsText(file, 'CP1251');
						}, cb);
						found = true;
						break;
					}
				}

				if (!found) { // no osb found - don't need to load it
					cb(null);
				}
			});
		}, cb);
	});
};

Storyboard.prototype.draw = function (ctx, currentTime) {

};