pimcore.registerNS("pimcore.plugin.CustomMenu");

pimcore.plugin.CustomMenu = Class.create({
    initialize: function () {
        document.addEventListener(pimcore.events.postOpenObject, this.postOpenObject.bind(this));    
    },

    postOpenObject: function (e) {
        var object = e.detail.object;

        if (object.data.general.type == 'object' && object.data.general.className === "Product") {
            var self = this;

            var win_download = Ext.getCmp('download-window');

            object.tab.unmask();
            object.toolbar.add(new Ext.Button({
                text: t('Download'),
                iconCls: 'pimcore_icon_pdf',
                scale: 'medium',
                handler: function (obj) {
                    self.selectDownloadOptions(object);
                }.bind(self, object)
            }));

            if (win_download) {
                win_download.close();
            }

            pimcore.layout.refresh();
        }
    },

    selectDownloadOptions: function (object) {
        var win = Ext.getCmp('download-window');

        if (win !== undefined) {
            win.destroy();
        }

        win = new Ext.Window({
            modal: true,
            title: t("Download"),
            id: 'download-window',
            layout: 'fit',
            width: "30%",
            height: "30%",
            closeAction: 'close',
            buttonAlign: 'center',
            overflowY: 'auto',
            autoscroll: true,
            minimizable: false,
            animShow: function () {
                this.el.slideIn('t', {
                    duration: 1, callback: function () {
                        this.afterShow(true);
                    }, scope: this
                });
            },
            listeners: {
                minimize: function (win, obj) {
                    if (win.collapsed === false) {
                        win.collapse();
                    } else {
                        win.expand();
                    }
                }
            },
            items: [
                {
                    xtype: 'form',
                    controller: 'download-product-sheet-controller',
                    bodyPadding: 5,
                    flex: 1,
                    items: [
                        {
                            xtype: 'combobox',
                            fieldLabel: "Seleziona la lingua",
                            name: "language",
                            id: "language",
                            store: pimcore.settings.websiteLanguages,
                            value: 'en'
                        }
                    ],
                    buttons: [
                        {
                            xtype: 'button',
                            text: 'Download',
                            id: 'object',
                            name: "downloadBtn",
                            handler: 'downloadCable',
                            object: object,
                        }
                    ]
                }
            ]
        });
        win.show(Ext.getBody());
    },
});

var CustomMenuPlugin = new pimcore.plugin.CustomMenu();