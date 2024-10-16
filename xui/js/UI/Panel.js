xui.Class("xui.UI.Panel", "xui.UI.Div",{
    Instance:{
        activate:function(){
            var profile = this.get(0);
            profile.getSubNode('CAPTION').focus(true);
            return this;
        },
        resetPanelView:function(removeChildren,destroyChildren){
            if(!xui.isSet(removeChildren))removeChildren=true;
            if(!xui.isSet(destroyChildren))destroyChildren=true;
            var ins;
            return this.each(function(profile){
                if(profile.renderId){
                    delete profile.$ini;
                    if(removeChildren){
                        ins=profile.boxing();
                        ins.removeChildren(true,destroyChildren);
                    }
                    if(profile.properties.toggle)
                        ins.setToggle(false);
                }
            });
        },
        iniPanelView:function(){
            return this.each(function(profile){
                if(!profile.$ini){
                    profile.$ini=true;
                    var p=profile.properties;
                    if(profile.onIniPanelView)profile.boxing().onIniPanelView(profile);
                    if(p.iframeAutoLoad||p.ajaxAutoLoad)
                        xui.UI.Div._applyAutoLoad(profile);
                }
            });
        }
    },
    Static:{
        Templates:{
            tagName : 'div',
            style:'{_style}',
            className:'{_className}',
            BORDER:{
                tagName:'div',
                className: 'xui-uiborder-outset xui-uiborder-box xui-uiborder-radius-big',
                TBAR:{
                    tagName:'div',
                    className:'xui-uibar-top',
                    BARTDL:{
                        className:'xui-uibar-tdl xui-uibar xui-uiborder-radius-big-tl',
                        BARTDLT:{
                            className:'xui-uibar-tdlt'
                        }
                    },
                    BARTDM:{
                        $order:1,
                        className:'xui-uibar-tdm xui-uibar',
                        BARTDMT:{
                            className:'xui-uibar-tdmt'
                        }
                    },
                    BARTDR:{
                        $order:2,
                        className:'xui-uibar-tdr xui-uibar xui-uiborder-radius-big-tr',
                        BARTDRT:{
                            className:'xui-uibar-tdrt'
                        }
                    },
                    BARCMDL:{
                        $order:3,
                        tagName: 'div',
                        className:'xui-uibar-cmdl',
                        style:'{_align}',
                        LTAGCMDS:{
                            tagName:'span',
                            className:'xui-ltag-cmds',
                            style:'{_ltagDisplay}',
                            text:"{ltagCmds}"
                        },
                        TOGGLE:{
                            $order:1,
                            className: 'xuifont',
                            $fonticon:'{_fi_toggleCls2}',
                            style:'{toggleDisplay}'
                        },
                        ICON:{
                            $order:2,
                            className:'xuicon {imageClass}  {picClass}',
                            style:'{backgroundImage}{backgroundPosition}{backgroundSize}{backgroundRepeat}{iconFontSize}{imageDisplay}',
                            text:'{iconFontCode}'
                        },
                        CAPTION:{
                            tabindex: '{tabindex}',
                            className:"xui-title-node",
                            text : '{caption}',
                            $order:3
                        }
                    },
                    BARCMDR:{
                        $order:4,
                        tagName: 'div',
                        className:'xui-uibar-cmdr',
                        RTAGCMDS:{
                            $order:0,
                            tagName:'span',
                            className:'xui-rtag-cmds',
                            style:'{_rtagDisplay}',
                            text:"{rtagCmds}"
                        } ,
                        INFO:{
                            className:'xuicon',
                            $fonticon:'xui-uicmd-info',
                            style:'{infoDisplay}',
                            $order:1
                        },
                        OPT:{
                            className:'xuicon',
                            $fonticon:'xui-uicmd-opt',
                            style:'{optDisplay}',
                            $order:2
                        },
                        POP:{
                            className:'xuicon',
                            $fonticon:'xui-uicmd-pop',
                            style:'{popDisplay}',
                            $order:3
                        },
                        REFRESH:{
                            className:'xuicon',
                            $fonticon:'xui-uicmd-refresh',
                            style:'{refreshDisplay}',
                            $order:4
                        },
                        CLOSE:{
                            className:'xuicon',
                            $fonticon:'xui-uicmd-close',
                            style:'{closeDisplay}',
                            $order:5
                        }
                    }
                },
                MAIN:{
                    $order:2,
                    tagName:'div',
                    className:'xui-uicon-main xui-uibar',
                    style:"{_leftp}",
                    MAINI:{
                        tagName:'div',
                        className:'xui-uicon-maini xui-uibar',
                        style:"{_rightp}",
                        PANEL:{
                            tagName:'div',
                            className:'xui-uibase xui-uicontainer {_bordertype}',
                            style:'{panelDisplay};{_panelstyle};{_overflow};',
                            text:'{html}'+xui.UI.$childTag
                        }
                    }
                },
                BBAR:{
                    $order:3,
                    tagName:'div',
                    className:'xui-uibar-bottom-s',
                    style:"{_bbarDisplay}",
                    BBARTDL:{
                        className:'xui-uibar-tdl xui-uibar xui-uiborder-radius-big-bl'
                    },
                    BBARTDM:{
                        $order:1,
                        className:'xui-uibar-tdm xui-uibar'
                    },
                    BBARTDR:{
                        $order:2,
                        className:'xui-uibar-tdr xui-uibar xui-uiborder-radius-big-br'
                    }
                }
            },
            $submap:xui.UI.$getTagCmdsTpl()
        },
        Appearances:{
            KEY:{
                background:'transparent'
            },
            'LTAGCMDS, RTAGCMDS':{
                padding:0,
                margin:0,
                'vertical-align': 'middle'
            },
            'KEY BORDER':{
                zoom:xui.browser.ie6?1:null
            },
            'TBART, BBART':{
                'border-spacing':0,
                'border-collapse':'separate'
            },
            PANEL:{
                position:'relative',
                left:0,
                top:0,
                overflow:'auto',
                'line-height':'normal',
                zoom:xui.browser.ie6?1:null
            },
            CAPTION:{
                display:'inline',
                padding:'.25em',
                'vertical-align':xui.browser.ie6?'baseline':'middle'
            }
        },
        Behaviors:{
            DroppableKeys:['PANEL'],
            PanelKeys:['PANEL'],
            DraggableKeys:['TBAR'],
            NavKeys:{CAPTION:1},
            NoDraggableKeys:['INFO','OPT','CLOSE','POP','REFRESH','TOGGLE','CMD','TOGGLE'],
            HoverEffected:{INFO:'INFO',OPT:'OPT', CLOSE:'CLOSE',POP:'POP', REFRESH:'REFRESH',CMD:'CMD',TOGGLE:'TOGGLE',ICON:'ICON'},
            ClickEffected:{INFO:'INFO',OPT:'OPT', CLOSE:'CLOSE',POP:'POP', REFRESH:'REFRESH',CMD:'CMD',TOGGLE:'TOGGLE'},
            TOGGLE:{
                onClick:function(profile, e, src){
                    if(profile.properties.toggleBtn){
                        profile.box._toggle(profile, !profile.properties.toggle);
                        return false;
                    }
                }
            },
            CAPTION:{
                onClick:function(profile, e, src){
                    if(!profile.onClickBar || false===profile.boxing().onClickBar(profile,src))
                        return xui.Event.getKey(e).shiftKey;
                }
            },
            PANEL:{
                onClick:function(profile, e, src){
                    var p=profile.properties;
                    if(p.disabled)return false;
                    if(profile.onClickPanel)
                        return profile.boxing().onClickPanel(profile, e, src);
                }
            },

            INFO:{
                onClick:function(profile, e, src){
                    profile.boxing().onShowInfo(profile, e, src);
                }
            },
            OPT:{
                onClick:function(profile, e, src){
                    profile.boxing().onShowOptions(profile, e, src);
                }
            },
            REFRESH:{
                onClick:function(profile, e, src){
                    profile.boxing().onRefresh(profile);
                }
            },
            CLOSE:{
                onClick:function(profile, e, src){
                    var properties = profile.properties;
                    if(properties.disabled)return;
                    var instance = profile.boxing();

                    if(false===instance.beforeClose(profile)) return;

                    instance.destroy();
                }
            },
            POP:{
                onClick:function(profile, e, src){
                    var properties=profile.properties;
                    if(properties.disabled)return;
                    var pos = profile.getRoot().offset(), size=profile.getRoot().cssSize(),
                        options={parent:null,host:null,properties:null,events:null,CS:null,CC:null,CB:null,CF:null,init:null};

                    if(profile.beforePop && false==profile.boxing().beforePop(profile,options,e,src))
                        return false;

                    var pro = xui.copy(xui.UI.Dialog.$DataStruct),
                        events={};
                    xui.merge(pro, properties, 'with');
                    xui.merge(pro,{
                        dock:'none',
                        width:Math.max(size.width,200),
                        height:Math.max(size.height,100),
                        left:pos.left,
                        top:pos.top,
                        landBtn:true
                    },'all');
                     if(options.properties)
                        xui.merge(pro, options.properties, 'with');

                    if(options.events)
                        xui.merge(events, options.events, 'all');

                    var dialog = new xui.UI.Dialog(pro,events,options.host||profile.host,options.CS||null,options.CC||null,options.CB||null,options.CF||null);

                    if(xui.isFun(options.init) && false===options.init(dialog,profile,options)){
                    }else{
                        dialog.show(options.parent||xui('body'));
                        var arr=[];
                        xui.arr.each(profile.children,function(o){
                            arr.push(o[0]);
                        });
                        if(arr.length){
                            dialog.append(xui.UI.pack(arr,false));
                        }
                        profile.boxing().removeChildren().destroy(true);
                    }
                }
            },
            CMD:{
                onClick:function(profile,e,src){
                    var prop=profile.properties;
                    if(prop.disabled)return false;
                    if(profile.onCmd)
                        profile.boxing().onCmd(profile,xui.use(src).id().split('_')[1],e,src);
                    return false;
                }
            }
        },
        DataModel:{
            rotate:null,
            selectable:true,
            dock:'fill',
            caption:{
                ini:undefined,
                // ui update function when setCaption
                action: function(v){
                    v=(xui.isSet(v)?v:"")+"";
                    this.getSubNode('CAPTION').html(xui.adjustRes(v,true));
                }
            },
            html:{
                action:function(v,ov,force){
                    this.getSubNode('PANEL').html(xui.adjustRes(v,0,1),null,null,force);
                }
            },
            toggle:{
                ini:true,
                action:function(v){
                    this.box._toggle(this, v);
                }
            },
            image:{
                format:'image',
                action: function(v){
                    xui.UI.$iconAction(this);
                }
            },
            imagePos:{
                action: function(value){
                    this.getSubNode('ICON').css('backgroundPosition', value||'center');
                }
            },
            imageBgSize:{
                action: function(value){
                    this.getSubNode('ICON').css('backgroundSize', value||'');
                }
            },
            imageClass: {
                ini:'',
                action:function(v,ov){
                    xui.UI.$iconAction(this, 'ICON', ov);
                }
            },
            iconFontCode:{
                action:function(v){
                    xui.UI.$iconAction(this);
                }
            },
            borderType:{
                ini:'inset',
                listbox:['none','flat','inset','outset'],
                action:function(v){
                    var ns=this,
                        p=ns.properties,
                        node=ns.getSubNode('PANEL'),
                        reg=/^xui-uiborder-/,
                        pretag='xui-uiborder-',
                        root=ns.getRoot();
                    node.removeClass(reg);
                    node.addClass(pretag+v);

                    //force to resize
                    ns.adjustSize();
                }
            },
            noFrame:{
                ini:false,
                action:function(v){
                    var ns=this,root=ns.getRoot();
                    ns.getSubNode('BBAR').css('display',v?'none':'');
                    ns.getSubNode('MAIN').css('paddingLeft',v?'0':'');
                    ns.getSubNode('MAINI').css('paddingRight',v?'0':'').css('backgroundImage',v?'none':'');
                    //force to resize
                    ns.adjustSize();
                }
            },
            hAlign:{
                ini:'left',
                listbox:['left','center','right'],
                action: function(v){
                    this.getSubNode("BARCMDL").css('textAlign',v);
                }
            },
            toggleIcon:{
                listbox:['xui-uicmd-toggle','xui-uicmd-check'],
                ini:'xui-uicmd-toggle',
                action:function(v,ov){
                    this.getSubNode('TOGGLE').replaceClass(new RegExp("\\b"+ov,'img'), v);
                }
            },

            infoBtn:{
                ini:false,
                action:function(v){
                    this.getSubNode('INFO').css('display',v?'':'none');
                }
            },
            optBtn:{
                ini:false,
                action:function(v){
                    this.getSubNode('OPT').css('display',v?'':'none');
                }
            },
            toggleBtn:{
                ini:false,
                action:function(v){
                    this.getSubNode('TOGGLE').css('display',v?'':'none');
                }
            },
            closeBtn:{
                ini:false,
                action:function(v){
                    this.getSubNode('CLOSE').css('display',v?'':'none');
                }
            },
            refreshBtn:{
                ini:false,
                action:function(v){
                    this.getSubNode('REFRESH').css('display',v?'':'none');
                }
            },
            popBtn:{
                ini:false,
                action:function(v){
                    this.getSubNode('POP').css('display',v?'':'none');
                }
            },
            tagCmds:{
                ini:[],
                action:function(){
                    this.boxing().refresh();
                }
            }
        },
        LayoutTrigger:function(){
            var self=this, t=self.properties;
            if(!t.toggle){
                self.box._toggle(self,false,true);
            }else{
                // for default expand container
                self.boxing().iniPanelView();
            }
        },
        EventHandlers:{
            onIniPanelView:function(profile){},
            beforeFold:function(profile){},
            beforeExpand:function(profile){},
            afterFold:function(profile){},
            afterExpand:function(profile){},
            onClickBar:function(profile, src){},
            onClickPanel:function(profile, e, src){},

            beforePop:function(profile, options,e,src){},
            beforeClose:function(profile){},
            onShowInfo:function(profile, e, src){},
            onShowOptions:function(profile, e, src){},
            onRefresh:function(profile){},
            onCmd:function(profile,cmdkey,e,src){}
        },
        _prepareData:function(profile){
            var data=arguments.callee.upper.call(this, profile),
                  nodisplay='display:none';

            data._bordertype='xui-uiborder-'+data.borderType;
            data._bbarDisplay=data.noFrame?nodisplay:"";
            data._leftp=data.noFrame?"padding-left:0;":"";
            data._rightp=data.noFrame?"padding-right:0;background-image:none;":"";

            data.toggleDisplay = data.toggleBtn?'':nodisplay;
            data.panelDisplay = data.toggleBtn&&!data.toggle?nodisplay:'';
            data._fi_toggleCls2 = data.toggleIcon + (data.toggleBtn&&data.toggle?' xuifont-checked ' + data.toggleIcon + '-checked':'');
            profile._toggle = !!data.toggle;

            data.infoDisplay = data.infoBtn?'':nodisplay;
            data.optDisplay = data.optBtn?'':nodisplay;
            data.closeDisplay = data.closeBtn?'':nodisplay;
            data.popDisplay = data.popBtn?'':nodisplay;
            data.refreshDisplay= data.refreshBtn?'':nodisplay;

            data._align = 'text-align:'+data.hAlign+';';

            if(!xui.isEmpty(data.tagCmds))
                this._prepareCmds(profile, data);

            return data;
        },
        _toggle:function(profile, value, ignoreEvent){
            var p=profile.properties, ins=profile.boxing();

            //event
            if(value){
                ins.iniPanelView();
            }
            if(ignoreEvent || profile._toggle !== !!value){
                //set toggle mark
                profile._toggle = p.toggle = !!value;
                if(!ignoreEvent){
                    if(value){
                        if(ins.beforeExpand && false===ins.beforeExpand(profile))return;
                    }else{
                        if(ins.beforeFold && false===ins.beforeFold(profile))return;
                    }
                }
                //chang toggle button
                if(p.toggleBtn)
                    profile.getSubNode('TOGGLE').tagClass('-checked', !!value);

                // use onresize function
                profile.adjustSize(true);

                if(!ignoreEvent){
                    if(value){
                        if(ins.afterExpand)
                            ins.afterExpand(profile);
                    }else{
                        if(ins.afterFold)
                            ins.afterFold(profile);
                    }
                }
                // try redock
                if(p.dock && p.dock!='none'){
                    ins.adjustDock(true);
                }
            }
        },
        _onresize:function(profile,width,height){
           var prop=profile.properties,
                // compare with px
                us = xui.$us(profile),
                adjustunit = function(v,emRate){return profile.$forceu(v, us>0?'em':'px', emRate)},
                root = profile.getRoot();

            var isize={},
                noFrame=prop.noFrame,
                border=profile.getSubNode('BORDER'),
                v1=profile.getSubNode('TBAR'),
                panel=profile.getSubNode('PANEL'),
                v4=profile.getSubNode('BBAR'),
                v5=profile.getSubNode('MAIN'),
                v6=profile.getSubNode('MAINI'),
                fzrate=profile.getEmSize()/root._getEmSize(),
                panelfz=panel._getEmSize(fzrate),

                cb1 = border.contentBox(),
                h0=border._borderH(),
                cb2 = panel.contentBox(),
                bordersize=profile.properties.borderType!='none'?panel._borderW():0,
                h1,h4,t;

            // caculate by px
            if(width && width!='auto')width=profile.$px(width,null, true);
            if(height && height!='auto')height=profile.$px(height,null, true);

            if(height){
                if(profile._toggle){
                    panel.css('display','');
                }else{
                    panel.css('display','none');
                }
                if(height=='auto'){
                    root.height(isize.height='auto');
                }else{
                    if(profile._toggle){
                        //force to get height
                        h1=v1.offsetHeight(true);
                        h4=noFrame?0:v4.offsetHeight(true);
                        if((t=height-h0-h1-h4)>0)
                            isize.height=adjustunit(t-(cb2?bordersize:0), panelfz);

                        border.height(adjustunit(height-(cb1?h0:0), border));
                        root.height(adjustunit(height));
                    }else{
                        border.height('auto');
                        root.height('auto');
                    }
                }
            }
            if(width){
                isize.width=adjustunit(width
                    -(noFrame?0:(Math.round(parseFloat(v6.css('paddingRight')))||0))
                    -(noFrame?0:(Math.round(parseFloat(v5.css('paddingLeft')))||0))
                    -h0
                    -bordersize
                    -(v5._borderW())
                    -(v6._borderW())
                    , panelfz);
            }

            if(profile._toggle){
                panel.cssSize(isize, true);
                if(width){
                    xui.UI._adjustConW(profile, panel, isize.width);
                }
            }
        }
    }
});