function OSUFile(src) {
	this._parse(src);
	this._normalize();
}

OSUFile.prototype._parse = function (src) {
	src = src.trim();
	var lines = this.lines = src.substr(src.indexOf('\n')).split('\n');
	var category = null;

	for (var i = 0; i < lines.length; ++i) {
		lines[i] = lines[i].trim();
		if (lines[i] === '' || lines[i].indexOf('//') === 0) continue;
		
		var categoryMatch = lines[i].match(/^\[(.*)\]$/);

		if (categoryMatch) {
			category = categoryMatch[1];
			if (category === 'Events' || category === 'TimingPoints' || category === 'HitObjects') {
				this[category] = [];
			} else {
				this[category] = {};
			}
		} else if (category === 'Events' || category === 'TimingPoints' || category === 'HitObjects') {
			if (category === 'Events' && (lines[i][0] === '_' || lines[i][0] === ' ')) {
				this[category][this.data[category].length - 1] += ',' + lines[i].substr(1);
			} else {
				this[category].push(lines[i].split(','));
			}
		} else {
			var lineMatch = lines[i].match(/^(\S*?)\s*:\s*(.*)$/);
			this[category][lineMatch[1]] = lineMatch[2];
		}
	}
};

OSUFile.prototype._normalize = function () {
	this.General.AudioLeadIn = parseInt(this.General.AudioLeadIn, 10) || 0;
};