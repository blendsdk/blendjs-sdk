Blend.defineClass('Blend.ui.Component', {
    extend: 'Blend.ui.View',
    statics: {
        createView: function (viewConfig, parent, defaults) {
            var me = this, cfg = Blend.apply({
                mvcContextId: me.getContextId(),
                parent: parent || null
            }, defaults || {});
            if (Blend.isInstanceOf(viewConfig, Blend.ui.View)) {
                return viewConfig;
            } else if (Blend.isString(viewConfig)) {
                return Blend.create(viewConfig, cfg);
            } else if (Blend.isObject(viewConfig)) {
                return Blend.create(Blend.apply(cfg, viewConfig));
            } else {
                throw new Error('Unable to create a view based on: ' + viewConfig);
            }
        }
    }
});