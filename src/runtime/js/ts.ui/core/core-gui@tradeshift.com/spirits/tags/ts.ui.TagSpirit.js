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
	var CLASS_DELETABLE = 'ts-tag-deletable';

	return ts.ui.Spirit.extend({
		onconstruct: function() {
			this.super.onconstruct();
			this.model();
			this.event.add('click', this.element, this, true);
		},

		onconfigure: function() {
			this.super.onconfigure();
			if (this.dom.tag() !== 'figure') {
				throw new SyntaxError(
					'The component ts.ui.Tag must be inserted into a <figure /> element.'
				);
			}
		},

		onenter: function() {
			this.super.onenter();
		},

		onchange: function(changes) {
			this.super.onchange();
			var spirit = this;
			var model = this._model;
			changes.forEach(function(c) {
				if (c.object === model && c.type === 'update') {
					spirit._update(c);
				}
			});
		},

		_update: function(c) {
			var model = this._model;
			if (model.tabindex !== null) {
				this.att.set('tabindex', model.tabindex);
			} else {
				this.att.del('tabindex');
			}

			var typeArr = (model.type + '').split(' ');
			var clickableType = typeArr.indexOf(CLASS_CLICKABLE) !== -1;
			var lockedType = typeArr.indexOf(CLASS_LOCKED) !== -1;
			var deletableType = typeArr.indexOf(CLASS_DELETABLE) !== -1;

			var oldType, newType;
			if (c.name === 'type') {
				if (c.oldValue) {
					oldType = (c.oldValue + '').split(' ');
					this.css.remove(oldType);
				}
				if (c.newValue) {
					newType = (c.newValue + '').split(' ');
					this.css.add(newType);
				}
			}

			if (deletableType || model.deletable || model._ondelete) {
				this.css.add(CLASS_DELETABLE);
			} else {
				this.css.remove(CLASS_DELETABLE);
			}

			if (clickableType || model.clickable || model._onclick) {
				this.css.add(CLASS_CLICKABLE);
			} else {
				this.css.remove(CLASS_CLICKABLE);
			}

			if (lockedType || model.locked) {
				this.css.add(CLASS_LOCKED);
			} else {
				this.css.remove(CLASS_LOCKED);
			}
		},

		onevent: function(e) {
			this.super.onevent(e);
			if (e.type === 'click') {
				if (e.target && e.target.localName === 'del') {
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
			if (!model) {
				model = new ts.ui.TagModel();
			}
			if (!this._model || model !== this._model) {
				if (this._model) {
					this._model.removeObserver(this);
				} else {
					this._model = new ts.ui.TagModel();
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
		 * Tag icon.
		 * @type {string|ts.ui.UserImageModel}
		 */
		icon: {
			getter: function() {
				return this._model.icon;
			},
			setter: confirmed('string|object')(function(icon) {
				this._model.icon = icon;
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

		deletable: {
			getter: function() {
				return this._model.deletable;
			},
			setter: confirmed('(boolean)')(function(deletable) {
				this._model.deletable = deletable;
			})
		},

		clickable: {
			getter: function() {
				return this._model.clickable;
			},
			setter: confirmed('(boolean)')(function(clickable) {
				this._model.clickable = clickable;
			})
		},

		/**
		 * Open for implementation: Called when the user clicks tag.
		 */
		onclick: {
			getter: function() {
				return this._model.onclick;
			},
			setter: confirmed('(function)')(function(onclick) {
				this._model.onclick = onclick;
			})
		},

		/**
		 * Open for implementation: Called when the user deletes tag.
		 */
		ondelete: {
			getter: function() {
				return this._model.ondelete;
			},
			setter: confirmed('(function)')(function(ondelete) {
				this._model.ondelete = ondelete;
			})
		},

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
		}
	});
})(
	gui.Combo.chained,
	gui.Arguments.confirmed,
	gui.Type.isFunction,
	gui.Array.from,
	gui.Object.each
);
