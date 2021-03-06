Blend.defineClass('Blend.layout.container.Center', {
    extend: 'Blend.layout.container.Layout',
    requires: [
        'Blend.layout.utils.Center'
    ],
    alias: 'layout.center',
    cssPrefix: 'center',
    centerX: true,
    centerY: true,
    getVisibleItemIndex: function () {
        return 0;
    },
    performLayout: function (force) {
        var me = this;
        Blend.foreach(me.view.getVisibleChildren(), function (view, idx) {
            if (idx === me.getVisibleItemIndex()) {
                view.show();
                Blend.layout.utils.Center.center(me.containerEl, view.getElement(), me.centerY, me.centerX);
                view.performLayout(force);
            } else {
                view.hide();
            }
        });
        me.callParent.apply(me, arguments);
    }
});
