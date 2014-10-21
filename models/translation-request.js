var Translation = function (object) {
	// this.startLang = startLang;
	// this.endLang = endLang;
	// this.word = word;
	
	for (var key in object) {
		this[key] = object[key];
	}
};