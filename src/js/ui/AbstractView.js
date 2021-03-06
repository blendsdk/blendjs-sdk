Blend.defineClass('Blend.ui.AbstractView', {
    extend: 'Blend.mvc.View',
    requires: [
        'Blend.layout.Layout'
    ],
    element: null,
    unselectable: true,
    scroll: false,
    init: function () {
        var me = this;
        me._rendered = false;
        me._layout = true;
        me.callParent.apply(me, arguments);
        me.layout = me.layout || 'base';
        me._layoutTriggers = me.getDefaultLayoutTriggers();
        me.initLayout();
    },
    getDefaultLayoutTriggers: function () {
        return [];
    },
    /**
     * @private initializes the layout object for this view
     * @returns {undefined}
     */
    initLayout: function () {
        var me = this;
        me.layout = Blend.layout.Layout.createLayout(me, me.layout);
    },
    getElement: function (renderCtx) {
        var me = this;
        if (!me._rendered) {
            /**
             * We do this to be able to pass a renderContext without the need
             * to explicitly defining the function parameters
             */
            me.element = me.render.apply(me, arguments);
            me._rendered = true;
        }
        return me.element;
    },
    canLayout: function () {
        var me = this;
        return me._layout;
    },
    suspendLayout: function () {
        var me = this;
        me._layout = false;
    },
    resumeLayout: function () {
        var me = this;
        me._layout = true;
        me.layoutView();
    },
    performLayout: function (force) {
        var me = this;
        if (me.canLayout()) {
            me._layout = false;
            if (me.shouldLayout(force)) {
                me.layoutView.apply(me, arguments);
            }
            me._layout = true;
        }
    },
    layoutView: function (force) {
        var me = this;
        me.layout.performLayout.apply(me.layout, arguments);
    },
    render: function (renderCtx) {
        var me = this,
                el = me.initElement(me.element || {});
        el = Blend.Element.create(Blend.apply(el, renderCtx || {}, false, true), function (oid, element) {
            /**
             * Check if we can find a setter for the oid and if possible assign
             * the element using the setter.
             */
            var setterName = 'set' + Blend.camelCase(oid);
            if (Blend.isFunction(me[setterName])) {
                me[setterName].apply(me, [element]);
            } else {
                me[oid] = element;
            }
        }, me);
        me.element = el;
        me.finalizeRender({});
        return me.element;
    },
    checkSetScrollState: function (el) {
        var me = this, scroll;
        if (me.scroll === false || me.scroll === 'none') {
            scroll = 'none';
        } else if (me.scroll === true) {
            scroll = 'both';
        } else {
            scroll = me.scroll;
        }
        el['data-scroll'] = scroll;
        return el;
    },
    checkSetSelectableState: function (el) {
        var me = this;
        if (me.unselectable) {
            el.unselectable = "on";
        }
        return el;
    },
    initElement: function (el) {
        var me = this;
        el = Blend.apply(el || {}, {
            style: {},
            cls: [],
            items: []
        }, false, true);
        me.checkSetSelectableState(el);
        return el;
    },
    shouldLayout: function (force) {
        var me = this, cur = me.getSizeSig();
        if (force === true) {
            cur = null;
        }
        return (me._sizeSig !== cur) || (me.parent && Blend.isInstanceOf(me.parent, Blend.mvc.Application));
    },
    doneLayout: function () {
        var me = this;
        me._sizeSig = me.getSizeSig();
    },
    /**
     * @internal
     */
    getSizeSig: function () {
        var me = this;
        return [parseInt(me.top), parseInt(me.left), parseInt(me.width || 0), parseInt(me.height || 0)].join('.');
    },
    finalizeRender: function (setterMap) {
        var me = this, setterFn, ival;
        setterMap = setterMap || {};
        me.disableEvents();
        Blend.foreach(setterMap, function (setter, config) {
            ival = me[config];
            me[config] = null;
            me[setter].apply(me, [ival]);
        });
        Blend.foreach(me, function (value, config) {
            setterFn = me['set' + Blend.camelCase(config)];
            if (!Blend.isFunction(value) && Blend.isFunction(setterFn)) {
                me[config] = null;
                if (setterFn.apply(me, [value]) === false) {
                    me[config] = value;
                }
            }
        });
        me._sizeSig = 0;
        me.enableEvents();
    },
    /**
     * @private
     */
    fireEvent: function () {
        var me = this, args = [];
        if (me._eventsEnable) {
            Blend.foreach(arguments, function (arg) {
                args.push(arg);
            });
            var evtFired = me.callParent.apply(me, args);
            if (evtFired && me._layoutTriggers.indexOf(evtFired) !== -1) {
                if (me.parent && me.parent.performLayout) {
                    me.parent.performLayout();
                }
            }
            return evtFired;
        } else {
            return null;
        }
    }
});