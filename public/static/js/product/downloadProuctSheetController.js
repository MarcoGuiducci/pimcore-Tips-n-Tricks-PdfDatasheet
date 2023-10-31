pimcore.registerNS("pimcore.plugin.Teco.downloadProuctSheetController");

Ext.define('pimcore.plugin.Teco.downloadProuctSheetController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.download-product-sheet-controller',

    downloadCable: function (object) {

        var form = object.up('form').getForm();
        var language = form.findField('language').getValue();

        var url = "/admin/product/download-product-sheet?objectId=" + object.object.id + "&language=" + language;
        pimcore.helpers.download(url);

        pimcore.layout.refresh();

        var win = Ext.getCmp('download-window');
        win.destroy();
    }
});