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
		 * Type is really the CSS classname.
		 * @type {string}
		 */
		type: '',

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
		 * No default keyboard support,
		 * unless it has onclick or ondelete.
		 * @type {number}
		 */
		tabindex: -1,

		/**
		 * Something to execute onclick.
		 * @type {function}
		 */
		onclick: {
			getter: function() {
				return this._onclick;
			},
			setter: confirmed('(function)')(function(onclick) {
				this._onclick = onclick;
				this._clickable = !!onclick;
				console.log('clickable', this._clickable);
				this.$dirty();
			})
		},

		/**
		 * Something to execute ondelete.
		 * @type {function}
		 */
		ondelete: {
			getter: function() {
				return this._ondelete;
			},
			setter: confirmed('(function)')(function(ondelete) {
				this._ondelete = ondelete;
				this._deletable = !!ondelete;
				console.log('deletable', this._deletable);
				this.$dirty();
			})
		},

		/**
		 * Data accessor
		 * @see this._data
		 * @type {Map}
		 */
		data: {
			getter: function() {
				if (!this._data) {
					this._data = new Map();
				} else if (typeof this._data === 'string') {
					this._data = new Map([[this._data]]);
				}
				return this._data;
			},
			setter: confirmed('string|map')(function(data) {
				this._data = data;
				this.$dirty();
			})
		},

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

		// Private .................................................................

		/**
		 * All the key and value sets
		 * @type {Map}
		 */
		_data: null,

		/**
		 * Is the tag clickable?
		 * @type {boolean}
		 */
		_clickable: false,

		/**
		 * Is the tag deletable?
		 * @type {boolean}
		 */
		_deletable: false,

		_onclick: null,
		_ondelete: null
	});
})(gui.Combo.chained, gui.Arguments.confirmed, gui.Type);
