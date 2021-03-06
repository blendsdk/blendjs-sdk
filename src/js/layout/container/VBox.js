Blend.defineClass('Blend.layout.container.VBox', {
    extend: 'Blend.layout.container.Box',
    alias: 'layout.vbox',
    cssPrefix: 'vbox',
    flexed: 'height',
    handler: function () {
        var util = Blend.layout.utils.Box;
        return util.vflex.apply(util, arguments);
    }
});