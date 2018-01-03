/**
 * Tag API.
 * @param {object|ts.ui.TagModel} json
 * @param {String|Element} target
 * @return {ts.ui.TagModel}
 */
ts.ui.Tag = function(json, target) {
	console.log('tag', arguments);
	var model = ts.ui.TagModel.from(json);
	model.addObserver(ts.ui.Tag);

	if (target) {
		console.log('summoning');
		var doc = document;
		var elem;
		if (gui.Type.of(target) === 'string') {
			try {
				elem = doc.querySelector(target) || doc.querySelector('#' + target);
			} catch (badselector) {
				throw new Error(
					'Error looking up target! ts.ui.Tag(' +
						JSON.stringify(json) +
						', ' +
						JSON.stringify(target) +
						')'
				);
			}
		} else if (gui.Type.isElement(target)) {
			elem = target;
		} else {
			throw new TypeError(
				'Invalid target! ts.ui.Tag(' + JSON.stringify(json) + ', ' + JSON.stringify(target) + ')'
			);
		}
		var spirit = ts.ui.TagSpirit.summon(model);
		console.log('spirit', spirit, elem);
		spirit.dom.appendTo(elem);
		setTimeout(function() {
			console.log(elem.innerHTML);
		}, 150);
		model.spirit = spirit;
	}
	return model;
};

/**
 * Identification.
 * @return {string}
 */
ts.ui.Tag.toString = function() {
	return '[function ts.ui.Tag]';
};

// Implementation ..............................................................
// this won't work...
// (function using(extend, confirmed) {
// 	extend(ts.ui.Tag, {
// 		render: confirmed('element')(function(target) {
// 			if (!this.spirit) {
// 				var spirit = ts.ui.TagSpirit.summon();
// 				spirit.dom.appendTo(target);
// 				this.spirit = spirit;
// 			}
// 			return this.spirit;
// 		})
// 	});
// })(gui.Object.extend, gui.Arguments.confirmed);
