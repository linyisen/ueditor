/**
 * Created with JetBrains PhpStorm.
 * User: 恒
 * Date: 13-4-9
 * Time: 下午2:57
 * To change this template use File | Settings | File Templates.
 */
var GraphicTemplate = {
    tagIndex: 0,
    initPageByData: function () {
        var me = this,
            data = editor["graphictemplate"][frameElement.id];

        me._addPageListener();
        me.setPageData(data);
        me.savePageData();
        moveTemplate("J_drag");
        iframeAutoHeight();
    },
    _addPageListener: function () {
        var me = this;

        domUtils.on(G("J_systemask"), "click", function (e) {
            var tgt = e.target || e.srcElement;
            if (domUtils.hasClass(tgt, "active")) {
                domUtils.removeClasses(tgt, ['active']);
            } else {
                if (domUtils.hasClass(tgt, "way")) {
                    domUtils.addClass(tgt, "active")
                }
            }
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
        });
        domUtils.on(document, "click", function (e) {
            var tgt = e.target || e.srcElement;
            switch (tgt.id) {
                case "J_pc":
                    me._showTab0(true);
                    break;
                case "J_mobile":
                    me._showTab0(false);
                    break;
                case "J_free":
                    me._setBoxEdit(true);
                    break;
                case "J_pay":
                    me._setBoxEdit(false);
                    break;
                default :
                    break;
            }

            //文本框单击交互
            var list = domUtils.getElementsByTagName(document, "input select");
            for (var i = 0, node; node = list[i++];) {
                domUtils.removeClasses(node, ['focus']);
            }
            if (/input|select/ig.test(tgt.tagName)) {
                domUtils.addClass(tgt, "focus")
            }
        });
    },
    _isEmpty: function (value) {
        if (frameElement.getAttribute("hasempty")!="true") {
            var res = !value.length;
            frameElement.setAttribute("hasempty", res.toString());
        }
        return value;
    },

    _showTab0: function (isTab0, cur) {
        var me=this;
        var list = domUtils.getElementsByTagName(document, "div", "tab");
        if (isTab0) {
            domUtils.addClass(list[0], "cur");
            domUtils.removeClasses(list[1], "cur");
            me.tabIndex = 0;
        } else {
            domUtils.addClass(list[1], "cur");
            domUtils.removeClasses(list[0], "cur");
            me.tabIndex = 1;
        }
        cur && (cur.checked = isTab0);
        iframeAutoHeight();
    },
    _setBoxEdit: function (isEdit, cur) {
        var money = G("J_money");
        money.readOnly = isEdit;
        money.style.cursor = isEdit ? "not-allowed" : "default";
        cur && (cur.checked = isEdit);
    },
    _innerTxt: function (node) {
        return   node.innerText || node.textContent || node.nodeValue;
    },
    _setTextBox: function (data, list) {
        for (var i = 0, id; id = list[i++];) {
            G(id).value = data[id];
        }
    },
    _setCheckBox: function (data, containerId) {
        var list = domUtils.getElementsByTagName(G(containerId), "span");
        for (var i = 0, node; node = list[i++];) {
            if (data[node.id]) {
                domUtils.addClass(node, "active");
            }
        }
    },
    _setRadioValue: function (data, list) {
        var me = this;
        for (var i = 0, obj; obj = list[i++];) {
            var cur = G(obj.id1);
            var standardTxt = domUtils.getNextDomNode(cur, function (node) {
                return node.nodeType == 3 && !domUtils.isFillChar(node)
            });
            if (me._innerTxt(standardTxt) == data[obj.id1]) {
                obj.callBack(true, cur);
            } else {
                G(obj.id2).checked = true;
                obj.callBack(false, cur);
            }
        }
    },
    _setDrawdownBox: function (data, list) {
        for (var i = 0, id; id = list[i++];) {
            var cur = G(id);
            for (var j = 0, opt; opt = cur.options[j++];) {
                if (opt.value == data[id]) {
                    cur.selectedIndex = j - 1;
                }
            }
        }
    },
    setPageData: function (data) {
        if (data) {
            var me = this;
            //设置文本框值
            me._setTextBox(data, ["J_name", "J_size", "J_version",
                "J_lang", "J_money", "J_systemNeed", "J_downloadlink"]);
            //设置复选框值
            me._setCheckBox(data, "J_systemask");
            //设置单选框值
            me._setRadioValue(data, [
                {
                    id1: "J_free",
                    id2: "J_pay",
                    callBack: me._setBoxEdit
                },
                {
                    id1: "J_pc",
                    id2: "J_mobile",
                    callBack: me._showTab0
                }
            ]);
            //设置下拉框值
            me._setDrawdownBox(data, ["J_systemtool"]);
        }
    },

    _saveTextBox: function (data, list) {
        var me = this;
        for (var i = 0, tmp; tmp = list[i++];) {
            if (utils.isString(tmp)) {
                data[tmp] = (G(tmp).value);
            } else {
                var id = tmp['id'],
                    index = tmp['tabIndex'];
                if (!index || index == me.tabIndex) {
                    data[id] = me._isEmpty((G(id).value));
                }
            }
        }
    },
    _saveCheckBox: function (data, list) {
        var node, txt;
        for (var i = 0, id; id = list[i++];) {
            node = G(id);
            txt = "";
            if (domUtils.hasClass(node, "active")) {
                txt = node.innerText || node.textContent || node.nodeValue;
            }
            data[id] = txt;
        }
    },
    _saveRadioValue: function (data, list) {
        var me = this;
        var cur, txt;
        for (var i = 0, id; id = list[i++];) {
            cur = G(id);
            txt = "";
            if (cur.checked) {
                var tmp = domUtils.getNextDomNode(cur, function (node) {
                    return node.nodeType == 3 && !domUtils.isFillChar(node)
                });
                txt = me._innerTxt(tmp);
            }
            data[id] = txt;
        }
    },
    savePageData: function () {
        var me = this;
        editor["graphictemplate"][frameElement.id] = {};
        var data = editor["graphictemplate"][frameElement.id];

        //文本框保存值
        me._saveTextBox(data, [
            {id: "J_name", "tabIndex": 0},
            {id: "J_size"},
            {id: "J_version"},
            {id: "J_lang"},
            {id: "J_systemNeed"},
            {id: "J_money", 'tabIndex': 1},
            {id: "J_downloadlink"},
            "J_systemtool"
        ]);

        //复选狂保存值
        me._saveCheckBox(data, ["J_ios", "J_android", "J_winphone"]);

        //保存单选框值
        me._saveRadioValue(data, ["J_pc", "J_mobile", "J_free", "J_pay"]);
    }
};
