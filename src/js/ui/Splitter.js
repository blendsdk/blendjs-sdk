Blend.defineClass('Blend.ui.Splitter', {
    extend: 'Blend.ui.Component',
    requires: [
        'Blend.Environment',
        'Blend.layout.plugins.Splitter'
    ],
    alias: 'ui.splitter',
    size: 7,
    splitterType: null,
    ghostEl: null,
    flex: false,
    element: {
        unselectable: true,
        listeners: {
            mousedown: function () {
                var me = this, handler = me[me.splitterType];
                if (handler) {
                    handler.apply(me, arguments);
                }
            }
        }
    },
    init: function () {
        var me = this, lt;
        me.callParent.apply(me, arguments);
        if (me.parent && me.parent.layout) {
            lt = me.parent.layout.alias.replace('layout.', '');
            if (lt === 'hbox') {
                me.splitterType = 'vertical';
            } else if (lt === 'vbox') {
                me.splitterType = 'horizontal';
            } else {
                throw new Error('Splitter can only be placed in a container component with a HBox or a VBox layout');
            }
        }
        me.element.cls = Blend.cssPrefix(['splitter', 'splitter-' + me.splitterType]);
        me.width = me.height = me.size;
    },
    /**
     * Mousedown on a vertical splitter
     */
    vertical: function () {
        var me = this;
        var me = this;
        var interactionHandler = function (evt) {
            Blend.Style.set(me.ghostEl, {
                left: me.checkSetVerticalPosition(evt.clientX - (me.correction.left + me.correction.spacing / 2)) - me.halfW,
                top: 0
            });
        };
        var placementHandler = function (evt) {
            me.removeListeners(placementHandler, interactionHandler);
            me.parent.layout.updateLayoutContext({
                left: me.getAComponent(),
                right: me.getBComponent(),
                delta: me.relocateSplitter()
            });
        };
        me.setup(placementHandler, interactionHandler);
    },
    /**
     * Mousedown on a horizontal splitter
     */
    horizontal: function () {
        var me = this;
        var me = this;
        var interactionHandler = function (evt) {
            Blend.Style.set(me.ghostEl, {
                top: me.checkSetHorizontalPosition(evt.clientY - (me.correction.top + me.correction.spacing / 2)) - me.halfH,
                left: 0
            });
        };
        var placementHandler = function (evt) {
            me.removeListeners(placementHandler, interactionHandler);
            me.parent.layout.updateLayoutContext({
                top: me.getAComponent(),
                bottom: me.getBComponent(),
                delta: me.relocateSplitter()
            });
        };
        me.setup(placementHandler, interactionHandler);
    },
    /**
     * Relocated the splitter to its new position and removed the ghost splitter
     */
    relocateSplitter: function () {
        var me = this, delta = {}, ghostPos = Blend.Element.getBounds(me.ghostEl);
        Blend.Style.set(me.ghostEl, {
            display: 'none'
        });
        if (me.splitterType === 'vertical') {
            delete(ghostPos.height);
        } else {
            delete(ghostPos.width);
        }
        Blend.Style.set(me.element, ghostPos);
        Blend.foreach(me.oldPosition, function (v, k) {
            delta[k] = Math.round(ghostPos[k] - v);
        });
        return delta;
    },
    createGhostSplitter: function () {
        var me = this;
        if (!me.ghostEl) {
            me.ghostEl = Blend.Element.clone(me.element);
            me.ghostEl['background-color'] = 'red';
            me.element.parentNode.appendChild(me.ghostEl);
        }
        Blend.Style.set(me.ghostEl, {
            display: ''
        });
        Blend.Style.set(me.ghostEl, me.oldPosition);
        Blend.CSS.set(me.ghostEl, 'b-splitter-active');
    },
    /**
     * Setup and do common processing for both splitter types
     */
    setup: function (placementHandler, interactionHandler) {
        var me = this, parEl = me.parent.getElement();
        me.halfW = (me.width / 2);
        me.halfH = (me.height / 2);
        me.oldPosition = Blend.Element.getBounds(me.element);
        /**
         * Since the mouse movement is positioned on the document element, we need
         * to translate mouse position to the internal location of the container
         * where the splitter is a child of
         */
        me.correction = parEl.getBoundingClientRect();
        me.correction.spacing = (me.parent.bodyPadding * 2);
        me.setupAdjacent('aCompInfo', me.getAComponent());
        me.setupAdjacent('bCompInfo', me.getBComponent());
        me.createGhostSplitter();
        Blend.Environment.addEventListener(Blend.getDocument(), 'mouseup', placementHandler);
        Blend.Environment.addEventListener(Blend.getDocument(), 'mousemove', interactionHandler);
    },
    setupAdjacent: function (name, comp) {
        var me = this, info = Blend.Element.getBounds(comp.getElement());
        info.minWidth = comp.minWidth || null;
        info.minHeight = comp.minHeight || null;
        me[name] = info;
    },
    removeListeners: function (placementHandler, interactionHandler) {
        var me = this;
        //Blend.removeEventListener(me.ghostEl, 'mouseup', placementHandler);
        Blend.Environment.removeEventListener(Blend.getDocument(), 'mouseup', placementHandler);
        Blend.Environment.removeEventListener(Blend.getDocument(), 'mousemove', interactionHandler);
    },
    /**
     * Check if the new horizontal position can actually be used
     */
    checkSetHorizontalPosition: function (pos) {
        var me = this, min, max;
        // check for minHeight of the top component
        if (me.aCompInfo.minHeight) {
            min = me.aCompInfo.top + me.aCompInfo.minHeight;
        } else {
            min = me.aCompInfo.top;
        }

        // check for minHeight of the right component
        if (me.bCompInfo.minHeight) {
            max = me.bCompInfo.top + (me.bCompInfo.height - me.bCompInfo.minHeight);
        } else {
            max = (me.bCompInfo.top + (me.bCompInfo.height - me.height));
        }

        // check for not passing the top component
        if (pos < min) {
            pos = min + me.halfH;
        }

        // check for not passing the right component
        if (pos > max) {
            pos = max + me.halfH;
        }
        return pos;
    },
    /**
     * Check if the new vertical position can actually be used
     */
    checkSetVerticalPosition: function (pos) {
        var me = this, min, max;
        // check for minWidth of the left component
        if (me.aCompInfo.minWidth) {
            min = me.aCompInfo.left + me.aCompInfo.minWidth;
        } else {
            min = me.aCompInfo.left;
        }

        // check for minWidth of the right component
        if (me.bCompInfo.minWidth) {
            max = me.bCompInfo.left + (me.bCompInfo.width - me.bCompInfo.minWidth);
        } else {
            max = (me.bCompInfo.left + (me.bCompInfo.width - me.width));
        }

        // check for not passing the left component
        if (pos < min) {
            pos = min + me.halfW;
        }

        // check for not passing the right component
        if (pos > max) {
            pos = max + me.halfW;
        }

        return pos;
    },
    statics: {
        initialize: function (layout) {
            layout._splitter = Blend.create('Blend.layout.plugins.Splitter', {
                layout: layout
            });
        }
    }
});