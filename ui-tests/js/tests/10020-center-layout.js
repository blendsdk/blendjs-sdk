BlendTest.defineTest('center-layout', 'center default', function (t) {

    var cname = t.newName();
    var aname = t.newName();

    Blend.defineClass(cname, {
        extend: 'Blend.mvc.Controller',
        application: {
            ready: function (app) {
                var me = this;
                t.delay(function () {
                    var r1 = Blend.Element.getBounds(me.getRect1().getElement());
                    t.equal(r1.top, 150, 'component top ok');
                    t.equal(r1.left, 150, 'component left ok');
                    t.done();
                });
            }
        }
    });

    Blend.defineClass(aname, {
        extend: 'Blend.mvc.Application',
        controllers: [cname],
        mainView: {
            type: 'ui.container',
            items: [
                {
                    reference: 'rect0',
                    type: 'ui.container',
                    layout: 'center',
                    ui: 'graybg',
                    width: 400,
                    height: 400,
                    items: [
                        {
                            type: 'ui.rect',
                            reference: 'rect1',
                            width: 100,
                            height: 100
                        }
                    ]
                }
            ]
        }
    });

    Blend.Environment.runApplication(aname);
});


BlendTest.defineTest('center-layout', 'center with padding', function (t) {

    var cname = t.newName();
    var aname = t.newName();

    Blend.defineClass(cname, {
        extend: 'Blend.mvc.Controller',
        application: {
            ready: function (app) {
                var me = this;
                t.delay(function () {
                    var r1 = Blend.Element.getBounds(me.getRect1().getElement());
                    t.equal(r1.top, 140, 'component top ok');
                    t.equal(r1.left, 140, 'component left ok');
                    t.done();
                });
            }
        }
    });

    Blend.defineClass(aname, {
        extend: 'Blend.mvc.Application',
        controllers: [cname],
        mainView: {
            type: 'ui.container',
            items: [
                {
                    reference: 'rect0',
                    type: 'ui.container',
                    layout: 'center',
                    ui: 'graybg',
                    width: 400,
                    height: 400,
                    bodyPadding: 10,
                    items: [
                        {
                            type: 'ui.rect',
                            reference: 'rect1',
                            width: 100,
                            height: 100
                        }
                    ]
                }
            ]
        }
    });

    Blend.Environment.runApplication(aname);
});


BlendTest.defineTest('center-layout', 'center with border and padding', function (t) {

    var cname = t.newName();
    var aname = t.newName();

    Blend.defineClass(cname, {
        extend: 'Blend.mvc.Controller',
        application: {
            ready: function (app) {
                var me = this;
                t.delay(function () {
                    var r1 = Blend.Element.getBounds(me.getRect1().getElement());
                    t.almost(r1.top, 135, 'component top ok', 2);
                    t.almost(r1.left, 135, 'component left ok', 2);
                    t.done();
                });
            }
        }
    });

    Blend.defineClass(aname, {
        extend: 'Blend.mvc.Application',
        controllers: [cname],
        mainView: {
            type: 'ui.container',
            items: [
                {
                    reference: 'rect0',
                    type: 'ui.container',
                    layout: 'center',
                    ui: 'with_border',
                    bodyPadding: 10,
                    width: 400,
                    height: 400,
                    items: [
                        {
                            type: 'ui.rect',
                            reference: 'rect1',
                            width: 100,
                            height: 100
                        }
                    ]
                }
            ]
        }
    });

    Blend.Environment.runApplication(aname);
});
 