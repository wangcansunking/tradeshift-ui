/**
 * Tags API.
 * @param {object|ts.ui.TagListModel} json
 * @return {ts.ui.TagListModel}
 */
ts.ui.Tags = function(json) {
	return ts.ui.TagListModel.from(json);
};

/**
 * Identification.
 * @return {string}
 */
ts.ui.Tags.toString = function() {
	return '[function ts.ui.Tags]';
};
