function OSUFile(src) {
	this.data = {};

	this._parse(src);
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
				this.data[category] = [];
			} else {
				this.data[category] = {};
			}
		} else if (category === 'Events' || category === 'TimingPoints' || category === 'HitObjects') {
			if (category === 'Events' && (lines[i][0] === '_' || lines[i][0] === ' ')) {
				this.data[category][this.data[category].length - 1] += ',' + lines[i].substr(1);
			} else {
				this.data[category].push(lines[i].split(','));
			}
		} else {
			var lineMatch = lines[i].match(/^(\S*?)\s*:\s*(.*)$/);
			this.data[category][lineMatch[1]] = lineMatch[2];
		}
	}
};