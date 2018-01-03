ts.ui.TagSpirit = (function using() {
	return ts.ui.Spirit.extend(
		{
			// Private .................................................................

			_caption: null,

			_isfocusable: function() {
				return this.element.tabIndex >= 0;
			},

			_isclickable: function() {
				return false;
			}
		},
		{
			// Static ..................................................................

			/**
		 * Summon spirit.
		 */
			summon: function(opt_model) {
				// this._model = opt_model || null;
				// var html = ts.ui.tag.edbml(opt_model);
				// return this.possess(document.createElement('figure'));

				var spirit = this.possess(gui.HTMLParser.parse(ts.ui.tag.edbml(opt_model)));
				return spirit;
			}
		}
	);
})();
