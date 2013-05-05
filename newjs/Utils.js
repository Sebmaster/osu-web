Utils = {
	fs: null,

	requestFileSystem: function (size, cb) {
		if (window.storageInfo) {
			window.storageInfo.queryUsageAndQuota(window.storageInfo.PERSISTENT, function (usage, free) {
				window.storageInfo.requestQuota(window.storageInfo.PERSISTENT, usage + size, function () {
					window.requestFileSystem(window.PERSISTENT, usage + size, function (fs) {
						cb(null, fs);
					}, cb);
				}, cb);
			}, cb);
		} else {
			if (Utils.fs !== null) {
				cb(null, Utils.fs);
				return;
			}

			window.requestFileSystem(window.TEMPORARY, size, function (fs) {
				Utils.fs = fs;
				cb(null, fs);
			}, cb);
		}
	},

	createFilePath: function (dir, subdirs, cb) {
		if (subdirs[0] == '.' || subdirs[0] == '') {
			subdirs = subdirs.slice(1);
		}
		dir.getDirectory(subdirs[0], { create: true }, function (dirEntry) {
			if (subdirs.length > 1) {
				Utils.createFilePath(dirEntry, subdirs.slice(1), cb);
			} else {
				cb(null, dirEntry);
			}
		}, cb);
	},

	readDirectoryEntries: function (dir, cb) {
		var dirReader = dir.createReader();
		var entries = [];

		function readEntries() {
			dirReader.readEntries(function (results) {
				if (!results.length) {
					cb(null, entries);
				} else {
					entries = entries.concat(Array.prototype.slice.call(results, 0));
					readEntries();
				}
			}, cb);
		}

		readEntries();
	}
};