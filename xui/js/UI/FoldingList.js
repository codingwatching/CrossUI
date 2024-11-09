xui.Class("xui.UI.FoldingList", ["xui.UI.List"],{
    Instance:{
        fillContent:function(id, obj){
            var profile=this.get(0),t,item;
            if(profile.renderId){
                if(item=profile.getItemByItemId(id)){
                    t=profile.getSubNodeByItemId('BODYI',id).html('');
                    if(obj){
                        item._obj = obj;
                        item._fill=true;
                        if(typeof obj=='string')t.html(obj);
                        else t.append(obj.render(true));
                    }else
                        item._obj=item._fill=null;
                }
            }
            return this;
        },
        toggle:function(id){
            var profile=this.get(0);
            if(profile.renderId){
                var properties = profile.properties,
                    items=properties.items,
                    item = profile.getItemByItemId(id),
                    subId = profile.getSubIdByItemId(id),
                    node = profile.getSubNode('ITEM',subId),
                    toggle = profile.getSubNode('TOGGLE',subId),
                    nodenext = node.next(),t
                    ;
                if(item._show){
                    if(properties.activeLast && items.length)
                        if(items[items.length-1].id==item.id)
                            return false;

                    node.tagClass('-checked',false);
                    toggle.tagClass('-checked',false);
                    if(nodenext)
                        nodenext.tagClass('-prechecked',false);
                }else{
                    node.tagClass('-checked');
                    toggle.tagClass('-checked');
                    if(nodenext)
                        nodenext.tagClass('-prechecked');
                    //fill value
                    if(!item._fill){
                        var callback=function(o){
                            profile.boxing().fillContent(item.id, item._body=o);
                        };
                        if(profile.onGetContent){
                            var r = profile.boxing().onGetContent(profile, item, callback);
                            if(r) callback(r);
                        }else
                            callback(profile.box._buildBody(profile, item));
                    }
                }
                item._show=!item._show
             }
            return this;
        },
        getPaper:function(subId){
            return xui.get(this.get(0), ["_svg_papers",subId]);
        },
        getSVGString:function(subId){
            var paper = xui.get(this.get(0), ["_svg_papers",subId]);
            return paper?paper.toSVG():"";
        }
    },
    Initialize:function(){
        //modify default template fro shell
        var t = this.getTemplate();
         t.ITEMS.className='{_bordertype}';
        t.$submap.items={
            ITEM:{
                tagName : 'div',
                className:'xui-uiborder-flat xui-uiborder-radius {_checked} {_precheked} {itemClass} {disabled} {readonly}',
                style:'{itemStyle}',
                HEAD:{
                    tagName : 'div',
                    className:'xui-uibar',
                    HL:{tagName : 'div'},
                    HR:{tagName : 'div'},
                    TITLE:{
                        tabindex: '{_tabindex}',
                        TLEFT:{
                            $order:0,
                            tagName:'div',
                            TOGGLE:{
                                $order:0,
                                className:'xuifont',
                                $fonticon:'{_fi_tlg}'
                            },
                            LTAGCMDS:{
                                $order:2,
                                tagName:'span',
                                style:'{_rtagDisplay}',
                                text:"{ltagCmds}"
                            },
                            CAP1:{
                                $order:1,
                                className:"xui-title-node",
                                text:'{title}'
                            }
                        },
                        TRIGHT:{
                            $order:1,
                            tagName:'div',
                            style:'{_capDisplay}',
                            CAP2:{
                                $order:0,
                                text:'{caption}'
                            },
                            TAGCMDS:{
                                $order:60,
                                tagName:'span',
                                style:'{_ltagDisplay}',
                                text:"{rtagCmds}"
                            }
                        }/*,
                        TCLEAR:{
                            $order:2,
                            tagName:'div'
                        }*/
                    }
                },
                BODY:{
                    $order:1,
                    tagName : 'div',
                    className:'xui-uibase',
                    BODYI:{
                        $order:0,
                        tagName : 'div',
                        text:'{_body}'
                    }
                },
                TAIL:{
                    $order:4,
                    tagName : 'div',
                    className:'xui-uibar',
                    TL:{tagName : 'div'},
                    TR:{tagName : 'div'}
                }
            }
        }
        this.setTemplate(t);
    },
    Static:{
        Appearances:{
            KEY:{
                padding:'.25em'
            },
            ITEMS:{
                border:0,
                position:'relative',
                zoom:xui.browser.ie?1:null,
                'padding-top':'.75em'//,
                //for ie6 1px bug,  HR/TR(position:absolute;right:0;)
                //'margin-right':xui.browser.ie6?'expression(this.parentNode.offsetWidth?(this.parentNode.offsetWidth-(parseInt(this.parentNode.style.paddingLeft,10)||0)-(parseInt(this.parentNode.style.paddingRight,10)||0) )%2+"px":"auto")':null
            },
            ITEM:{
                //for ie6 bug
                zoom:xui.browser.ie?1:null,
                'margin-top':'-7px',
                padding:0,
                position:'relative',
                overflow:'hidden',
                'border-radius': '6px',
                'box-shadow': '-1px -1px 2px #EDEDED'
            },
            'HEAD, BODY, BODYI, TAIL':{
                position:'relative'
            },
            BODY:{
                display:'none',
                zoom:xui.browser.ie?1:null,
                position:'relative',
                overflow:'auto'
            },
            BODYI:{
                padding:'.25em .75em 0 .75em',
                position:'relative'
            },
            'BODY, BODYI':{
            },
            'ITEM-hover, ITEM-active, ITEM-checked':null,
            'ITEM-checked':{
                $order:2,
                'margin-bottom':'1em'
             },
            'ITEM-checked BODY':{
                $order:2,
                display:'block'
            },
            'HL, HR, TL, TR':{
                position:'absolute',
                width:'.75em'
            },
            'HL, HR':{
                height:'2.5em'
            },
            'ITEM-prechecked HL':{
                $order:1
            },
            'ITEM-prechecked HR':{
                $order:1
            },
            'TL, TR':{
                height:'1.75em'
            },
            HL:{
                $order:1,
                top:0,
                left:0
            },
            HR:{
                $order:1,
                top:0,
                right:0
            },
            TL:{
                $order:1,
                bottom:0,
                left:0
            },
            TR:{
                $order:1,
                bottom:0,
                right:0
            },
            HEAD:{
                position:'relative',
                zoom:xui.browser.ie?1:null,
                overflow:'hidden'
            },
            TITLE:{
                $order:1,
                display:'block',
                position:'relative',
                'white-space':'nowrap',
                overflow:'hidden',
                padding:'.25em .5em'
            },
            TAIL:{
                position:'relative',
                height:'.25em'
            },
            'CAP1, CAP2':{
                padding:'.25em',
                'vertical-align':'middle'
            },
            CAP1:{
                cursor:'pointer',
                'white-space':'nowrap'
            },
            'ITEM-checked CAP1':{
                $order:2,
                'font-weight':'normal'
            },
            TLEFT:{
                //position:xui.browser.ie6?'relative':null,
                //'float':'left',
                position:'relative',
                left:'.5em',

                'white-space':'nowrap',
                overflow:'hidden'
            },
            TRIGHT:{
                //position:xui.browser.ie6?'relative':null,
                //'float':'right',

                position:'absolute',
                right:'.5em',
                top:'.25em',

                'white-space':'nowrap',
                overflow:'hidden'
            }
        },
        Behaviors:{
            HoverEffected:{ITEM:'ITEM',HEAD:'HEAD',OPT:'OPT'},
            ClickEffected:{ITEM:null,HEAD:'HEAD'},
            ITEM:{onClick:null,onKeydown:null},
            HEAD:{
                onClick:function(profile, e, src){
                    profile.boxing().toggle(profile.getItemIdByDom(src));
                    return false;
                }
            },
            OPT:{
                onMousedown:function(){
                    return false;
                },
                onClick:function(profile, e, src){
                    profile.boxing().onShowOptions(profile, profile.getItemByDom(src), e, src);
                    return false;
                }
            }
        },
        DataModel:({
            lite: null,
            value: null,
            borderType: null,
            activeLast: true
        }),
        EventHandlers:{
            onGetContent:function(profile,item,callback){},
            onShowOptions:function(profile,item,e,src){}
        },
        RenderTrigger:function(){
            var self=this, pro=self.properties, items=pro.items, item;
            if(pro.activeLast && items.length>0){
                item=items[items.length-1];
                self.boxing().fillContent(item.id, item._body);
            }
        },
        _prepareItems:function(profile, arr, pid){
            if(arr.length){
                arr[0]._precheked = profile.getClass('ITEM','-prechecked');
                if(profile.properties.activeLast){
                    //for properties.data
                    var item = arr[arr.length-1];
                    item._show = true;
                    item._fill = true;
                    item._body = profile.onGetContent?profile.boxing().onGetContent(profile,item,function(o){
                        profile.boxing().fillContent(item.id, item._body=o);
                    }) : profile.box._buildBody(profile, item);
                }
            }
            return arguments.callee.upper.apply(this, arguments);
        },
        _prepareItem:function(profile, item){
            var p = profile.properties,o,
                dpn = 'display:none';
            item._tabindex = p.tabindex;
            if(!item.caption)
                item._capDisplay=dpn;
            else
                item.caption = item.caption.replace(/</g,"&lt;");
            item._body= item._body || 'Loading...'

            if(item._show){
                item._checked = profile.getClass('ITEM','-checked');
                item._fi_tlg = 'xuifont-checked xui-uicmd-toggle xui-uicmd-toggle-checked';
            }else{
                item._fi_tlg = 'xui-uicmd-toggle';
            }

            this._prepareCmds(profile, item);
        },
        _buildBody:function(profile,item){
            return item.text?'<pre class="xui-node xui-node-div">'+item.text.replace(/</g,"&lt;")+'</pre>':'';
        },
        _onresize:function(){}
    }
});
