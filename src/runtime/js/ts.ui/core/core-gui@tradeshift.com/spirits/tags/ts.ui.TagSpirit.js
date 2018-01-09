/**
 * Spirit of the tag.
 * @using {gui.Combo.chained} chained
 * @using {gui.Arguments.confirmed} confirmed
 * @using {gui.Type.isFunction} isFunction
 * @using {gui.Array.from} arrayFrom
 * @using {gui.Object.each} objEach
 */
ts.ui.TagSpirit = (function using(chained, confirmed, isFunction, arrayFrom, objEach) {
	/*
	 * We'll make the spirit interface identical to the model interface so
	 * that we can use them interchangeably whenever one makes more sense.
	*/
	var methodnames = ['onclick', 'ondelete'];

	var CLASS_LOCKED = 'ts-tag-locked';
	var CLASS_CLICKABLE = 'ts-tag-clickable';

	function defitemtoarray(defitem, keys, vals) {
		switch (gettagname(defitem)) {
			case 'dt':
				keys.push(defitem.innerHTML);
				break;
			case 'dd':
				vals.push(defitem.innerHTML);
				break;
		}
	}

	function gettagname(elem) {
		if (gui.Type.isElement(elem)) {
			return elem.tagName.toLowerCase();
		}
		return '';
	}

	function rollout(arr) {
		if (arr.length <= 1) {
			return arr[0];
		}
		return arr;
	}

	return ts.ui.Spirit.extend({
		onconstruct: function() {
			this.super.onconstruct();
			this._model = new ts.ui.TagModel();
			this.event.add('click');
		},

		onconfigure: function() {
			this.super.onconfigure();
			if (this.dom.tag() !== 'figure') {
				throw new SyntaxError(
					'The component ts.ui.Tag must be inserted into a <figure /> element.'
				);
			}
		},

		onchange: function(changes) {
			this.super.onchange();
			var spirit = this;
			var model = this._model;
			changes.forEach(function(c) {
				if (c.object === model && c.type === 'update') {
					spirit._update(model);
				}
			});
		},

		_update: function(model) {
			if (model.tabindex !== null) {
				this.att.set('tabindex', model.tabindex);
			} else {
				this.att.del('tabindex');
			}

			if (model._clickable) {
				this.css.add(CLASS_CLICKABLE);
			} else {
				this.css.remove(CLASS_CLICKABLE);
			}

			if (model.locked) {
				this.css.add(CLASS_LOCKED);
			} else {
				this.css.remove(CLASS_LOCKED);
			}
		},

		onevent: function(e) {
			this.super.onevent(e);
			if (e.type === 'click') {
				if (e.target && e.target.localName === 'del') {
					e.stopPropagation();
					this.delete();
				} else {
					this.click();
				}
			}
		},

		ondestruct: function() {
			this.super.ondestruct();
			this._model.removeObserver(this);
			this._model.dispose();
		},

		render: confirmed('object')(
			chained(function(json) {
				this.model(ts.ui.TagModel.from(json));
			})
		),

		/**
		 * Assign or change the model (the API user is not supposed to do this!).
		 * @param {ts.ui.TagModel} model
		 */
		model: function(model) {
			if (model !== this._model) {
				if (this._model) {
					this._model.removeObserver(this);
				}
				objEach(
					model,
					function(key, val) {
						this._model[key] = val;
					},
					this
				);
				this._model.addObserver(this);

				if (!this.script.loaded) {
					this.script.load(ts.ui.TagSpirit.edbml);
				}
				this.script.input(this._model);
			}
		},

		// API .....................................................................

		/**
		 * Type is really the CSS classname.
		 * @type {string}
		 */
		type: {
			getter: function() {
				return this._model.type;
			},
			setter: confirmed('string')(function(classname) {
				this._model.type = classname;
			})
		},

		/**
		 * Tag label.
		 * @type {string}
		 */
		label: {
			getter: function() {
				return this._model.label;
			},
			setter: confirmed('string')(function(text) {
				this._model.label = text;
			})
		},

		/**
		 * Tag icon.
		 * @type {string}
		 */
		icon: {
			getter: function() {
				return this._model.icon;
			},
			setter: confirmed('string')(function(classname) {
				this._model.icon = classname;
			})
		},

		/**
		 * No default keyboard support,
		 * unless it has onclick or ondelete.
		 * @type {number}
		 */
		tabindex: {
			getter: function() {
				return this._model.tabindex;
			},
			setter: confirmed('number')(function(tabindex) {
				this._model.tabindex = tabindex;
			})
		},

		/**
		 * All the key and value sets
		 * @type {Map}
		 */
		data: {
			getter: function() {
				return this._model.data;
			},
			setter: function(data) {
				this._model.data = data;
			}
		},

		/**
		 * Is the tag locked?
		 * @type {boolean}
		 */
		locked: {
			getter: function() {
				return this._model.locked;
			},
			setter: confirmed('boolean')(function(locked) {
				this._model.locked = locked;
			})
		},

		/**
		 * Open for implementation: Called when the user clicks tag.
		 */
		onclick: function() {},

		/**
		 * Open for implementation: Called when the user deletes tag.
		 */
		ondelete: function() {},

		/**
		 * Click that tag.
		 * @returns {ts.ui.TagSpirit}
		 */
		click: chained(function() {
			this._model.click();
		}),

		/**
		 * Delete that tag.
		 * @returns {ts.ui.TagSpirit}
		 */
		delete: chained(function() {
			this._model.delete();
			this.tick.time(function selfdestruct() {
				this.dom.remove();
			});
		}),

		// Private .................................................................

		/**
		 * The model goes here.
		 * @type {ts.ui.TagModel}
		 */
		_model: null,

		/**
		 * @returns {ts.ui.TagModel}
		 */
		_bind: function(opt_json) {
			var spirit = this;
			var model = ts.ui.TagModel.from(opt_json);
			methodnames.forEach(function(method) {
				model[method] = function() {
					if (isFunction(spirit[method])) {
						spirit[method].apply(spirit, arguments);
					}
				};
			});
			return model;
		},

		/**
		 * Generate ts.ui.TagModel from the contents of the DOM.
		 * @param {(object|ts.ui.TagModel)=} opt_json
		 * @returns {ts.ui.TagModel}
		 */
		_domtojson: function(opt_json) {
			var json = opt_json || new ts.ui.TagModel();

			var caption = this.dom.q('figcaption');
			var icon = caption && this.dom.q('figcaption > i');
			var label = caption && !icon && this.dom.q('figcaption').textContent;

			if (icon) {
				json.icon = icon.className;
			} else if (label) {
				json.label = label;
			}

			var tabindex = this.att.get('tabindex');
			if (tabindex !== null) {
				json.tabindex = tabindex;
			}

			json.locked = this.css.contains(CLASS_LOCKED);

			json.clickable = this.css.contains(CLASS_CLICKABLE);

			var deflists = this.dom.qall('dl');
			var hasdata = deflists.length > 0;
			var data = new Map();
			if (hasdata) {
				deflists.forEach(function(deflist) {
					var keys = [];
					var vals = [];
					arrayFrom(deflist.childNodes).forEach(function(defitem) {
						switch (gettagname(defitem)) {
							/**
							 * There might be a `<div />` around the <dt/> & <dd />'s
							 */
							case 'div':
								arrayFrom(defitem.childNodes).forEach(function(inneritem) {
									defitemtoarray(inneritem, keys, vals);
								});
								break;
							default:
								defitemtoarray(defitem, keys, vals);
								break;
						}
					});
					data.set(rollout(keys), rollout(vals));
				});
				json.data = data;
			}

			return json;
		}
	});
})(
	gui.Combo.chained,
	gui.Arguments.confirmed,
	gui.Type.isFunction,
	gui.Array.from,
	gui.Object.each
);
