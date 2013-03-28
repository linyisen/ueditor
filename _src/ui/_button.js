///import core
///import uicore
///import ui/stateful.js
(function (){
    var utils = baidu.editor.utils,
        UIBase = baidu.editor.ui.UIBase,
        Stateful = baidu.editor.ui.Stateful,
        Button = baidu.editor.ui.Button = function (options){
            this.initOptions(options);
            this.initButton();
        };
    Button.prototype = {
        uiName: 'button',
        label: '',
        title: '',
        showIcon: true,
        showText: true,
        initButton: function (){
            this.initUIBase();
            this.Stateful_init();
        },
        getHtmlTpl: function (){
            return '<div id="##" class="edui-box %%">' +
                '<div id="##_state" stateful>' +
                '<div class="%%-wrap"><div id="##_body" unselectable="on" ' + (this.title ? 'title="' + this.title + '"' : '') +
                ' class="%%-body" onmousedown="return false;" onclick="return $$._onClick();" onmouseover="return $$._onMouseOver();">' +
                (this.showIcon ? '<div class="edui-box edui-icon"></div>' : '') +
                (this.showText ? '<div class="edui-box edui-label">' + this.label + '</div>' : '') +
                '</div>' +
                '</div>' +
                '</div></div>';
        },
        removeClass:function(classNames){
            domUtils.removeClasses(this.getDom(),classNames)
        },
        addClass:function(className){
            var ui = this.getDom();
            if(!domUtils.hasClass(ui,className))ui.className = ui.className + " " + className;
        },
        postRender: function (){
            this.fireEvent( "renderReady" );
            this.Stateful_postRender();
            this.setDisabled(this.disabled)
        },
        _onClick: function (){
            if (!this.isDisabled()) {
                this.fireEvent('click');
            }
        },
        _onMouseOver:function(){
            if (!this.isDisabled()) {
                this.fireEvent('mouseover');
            }
        }
    };
    utils.inherits(Button, UIBase);
    utils.extend(Button.prototype, Stateful);

})();
