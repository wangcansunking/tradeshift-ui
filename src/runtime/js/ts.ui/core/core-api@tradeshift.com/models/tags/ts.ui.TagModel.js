/**
 * Superb tag model.
 * @extends {ts.ui.Model}
 * @using {gui.Combo#chained} chained
 * @using {gui.Arguments#confirmed} confirmed
 * @using {gui.Type} Type
 */
ts.ui.TagModel = (function using(chained, confirmed, Type) {
	return ts.ui.Model.extend({
		/**
		 * Friendly name.
		 * @type {string}
		 */
		item: 'tag',

		/**
		 * Tag label.
		 * @type {string}
		 */
		label: null,

		/**
		 * Tag icon.
		 * @type {string}
		 */
		icon: null,

		/**
		 * Type is really the CSS classname.
		 * @type {string}
		 */
		type: '',

		/**
		 * Something to execute onclick.
		 * @type {function}
		 */
		onclick: null,

		/**
		 * Something to execute ondelete.
		 * @type {function}
		 */
		ondelete: null,

		/**
		 * No default keyboard support,
		 * unless it has onclick or ondelete.
		 * @type {number}
		 */
		tabindex: -1,

		/**
		 * All the key and value sets
		 * @type {Map}
		 */
		_data: new Map(),

		/**
		 * Data accessor
		 * @type {Map}
		 */
		data: {
			getter: function() {
				console.log('data get');
				return this._data;
			},
			setter: confirmed('string|map')(function(data) {
				console.log('data set', arguments);
				if (typeof d === 'string') {
					data = new Map([[data]]);
				}
				this._data = data;
				console.log('data is set ', this._data);
			})
		},

		// /**
		//  * Data accessor
		//  * @returns {Map|undefined}
		//  */
		// data: confirmed('(string|map)')(function(data) {
		// 	if (data === undefined) {
		// 		return this._data;
		// 	}
		//
		// 	if (typeof data === 'string') {
		// 		data = new Map([
		// 			[data]
		// 		]);
		// 	}
		// 	this._data = data;
		// 	console.log('data is set ', this._data);
		// }),

		/**
		 * Is the tag locked?
		 * @type {boolean}
		 */
		locked: false,

		/**
		 * Click that tag.
		 * @returns {ts.ui.TagModel}
		 */
		click: chained(function() {
			if (Type.isFunction(this.onclick)) {
				setTimeout(
					function unfreeze() {
						this.onclick();
					}.bind(this),
					50
				);
			}
		}),

		/**
		 * Delete that tag.
		 * @returns {ts.ui.TagModel}
		 */
		delete: chained(function() {
			if (Type.isFunction(this.ondelete)) {
				setTimeout(
					function unfreeze() {
						this.ondelete();
					}.bind(this),
					50
				);
			}
		}),

		/**
		 * Bounce model to HTML.
		 * @return {string}
		 */
		render: function() {
			console.log('render');
			return ts.ui.tag.edbml(this._model);
		},

		// Private .................................................................

		/**
		 * The actual contents of the caption,
		 * this will be extra useful once we want to
		 * allow more than just a label or icon in there.
		 * @type {*}
		 */
		_caption: null
	});
})(gui.Combo.chained, gui.Arguments.confirmed, gui.Type);
