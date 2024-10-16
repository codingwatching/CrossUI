xui.Class("xui.UI.RadioBox", "xui.UI.List",{
    Initialize:function(){
        //modify default template for shell
        var t = this.getTemplate();
        t.className='{_className}';
        t.ITEMS.className='{_bordertype}';
        t.$submap={
            items:{
                ITEM:{
                    className:'xui-showfocus {_itemRow} {itemClass} {disabled} {readonly}',
                    style:'{itemStyle};{_itemDisplay};',
                    tabindex: '{_tabindex}',
                    MARK:{
                        $order:0,
                        className:'xuifont',
                        $fonticon:'{_fi_markcls}'
                    },
                    ICON:{
                        $order:1,
                        className:'xuicon {imageClass}  {picClass}',
                        style:'{backgroundImage}{backgroundPosition}{backgroundSize}{backgroundRepeat}{iconFontSize}{imageDisplay}',
                        text:'{iconFontCode}'
                    },
                    CAPTION:{
                        text : '{caption}',
                        $order:2
                    }
                }
            }
        };
        this.setTemplate(t);
    },
    Static:{
        _DIRTYKEY:'MARK',
        _ITEMMARKED:true,
        Appearances:{
            ITEM:{
               display:xui.$inlineBlock,
               border:0,
               padding:'.5em',
               position:'relative',
               zoom:xui.browser.ie?1:null,
               cursor:'pointer',
               overflow:'hidden',
               'vertical-align':'middle'
            },
            // to cover LIST's
            'ITEM-checked':{
                padding:'.5em'
            },
            CAPTION:{
                'vertical-align':xui.browser.ie6?'baseline':'middle',
                'font-size':'1em'
            },
            ITEMS:{
                overflow:'auto',
                'overflow-x': 'hidden',
                position:'relative',
                'line-height':'1.25em'
            },
            MARK:{
               $order:1,
               cursor:'pointer',
               margin: '0 .5em 0 .25em',
               'vertical-align':'middle'
            }
        },
        DataModel:{
            lite: null,
            tagCmds:null,
            borderType:{
                ini:'none'
            },
            checkBox:{
                ini:false,
                action:function(v){
                    this.getSubNode('MARK',true).replaceClass(v ? /(uicmd-radio)|(\s+uicmd-radio)/g : /(^uicmd-check)|(\s+uicmd-check)/g , v ? ' xui-uicmd-check' : ' xui-uicmd-radio');
                }
            }
        },
        Behaviors:{
            HoverEffected:{ITEM:null,MARK:'MARK'},
            ClickEffected:{ITEM:null,MARK:'MARK'}
        },
        EventHandlers:{
            onCmd:null
        },
        _prepareItem:function(profile, item){
            item._fi_markcls = profile.properties.checkBox?'xui-uicmd-check':'xui-uicmd-radio';
            item._itemRow = profile.properties.itemRow?'xui-item-row':'';
        }
    }
});
