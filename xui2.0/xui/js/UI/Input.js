Class("xui.UI.Input", ["xui.UI.Widget","xui.absValue"] ,{
    Instance:{
        _setTB:function(type){
            var profile=this.get(0), p=profile.properties, o, t;
            if(!profile.host|| !p.tipsBinder)return;
            var ot=profile.tips;
            t = profile.tips = profile.tips||p.tips||'';
            o = xui.getObject(p.tipsBinder)|| ((o=profile.host[p.tipsBinder]) &&o.get(0) );
            if(o && (o.key=='xui.UI.Span'||o.key=='xui.UI.Div'||o.key=='xui.UI.SLabel')){
                if(o.renderId){
                    //use innerHTML, not setHtml
                    o.getRootNode().innerHTML =  t.charAt(0)=='$'?xui.wrapRes(t):t;
                    o.getRoot().css('color', type==1?'gray':type==2?'red':'#000');
                }
            }
            if(ot!==profile.tips && xui.Tips && xui.Tips.getTips())xui.Tips.setTips(profile.tips);
        },
        activate:function(select){
            var profile = this.get(0);
            if(profile&&profile.renderId){
                var node=profile.getSubNode('INPUT').get(0);
                if(node){
                    try{
                        node.focus(); 
                        if(select || xui.browser.deviceType!='touchOnly'){
                            try{
                                if(node.tagName.toLowerCase()=="input" || !/[\n\r]/.test(node.value))node.select();
                                else xui(node).caret(0,0);
                            }catch(e){}
                        }
                    }catch(e){}
                    delete profile._justFocus;
                }
            }
            return this;
        },
        _setCtrlValue:function(value){
            if(xui.isNull(value) || !xui.isDefined(value))value='';
            return this.each(function(profile){
                if(profile.$Mask && !value){
                    value=profile.$Mask;
                }
                profile.$_inner=1;
                profile.getSubNode('INPUT').attr('value',value+"");
                delete profile.$_inner;
            });
        },
        _getCtrlValue:function(){
            var node=this.getSubNode('INPUT'),
                v= (node&&!node.isEmpty()) ? this.getSubNode('INPUT').attr('value') : "";
            if(v.indexOf("\r")!=-1)v=v.replace(/(\r\n|\r)/g, "\n");
            if(this.get(0).$Mask && this.get(0).$Mask==v){
                v="";
            }
            return v;
        },
        _setDirtyMark:function(){
            return this.each(function(profile){
                var properties = profile.properties,
                    o=profile.getSubNode('INPUT'),
                    cls=profile.box,
                    box=profile.boxing(),
                    d=xui.UI.$css_tag_dirty,
                    v=xui.UI.$css_tag_invalid,
                    flag=properties.value !== properties.$UIvalue;
                var ot=profile.tips;
                if(profile._inValid==2){
                    //display tips
                    profile.tips = properties.tipsErr || properties.tips;
                }else{
                    if(profile._inValid==1)
                        profile.tips = properties.tips;
                    else{
                        profile.tips = properties.tipsOK || properties.tips;
                    }
                }
                if(ot!==profile.tips && xui.Tips && xui.Tips.getTips())xui.Tips.setTips(profile.tips);
                
                if(profile._dirtyFlag!==flag){
                    if(properties.dirtyMark && properties.showDirtyMark){
                        if(profile.beforeDirtyMark && false===box.beforeDirtyMark(profile,flag)){}
                        else{
                            if(profile._dirtyFlag=flag) o.addClass(d);
                            else o.removeClass(d);
                        }
                    }
                    profile._dirtyFlag=flag
                }
                
                //format statux
                if(profile.beforeFormatMark && false===box.beforeFormatMark(profile, profile._inValid==2)){}
                else{
                    var err = profile.getSubNode('ERROR');
                    if(profile._inValid==2){
                        o.addClass(v);
                        err.css('display','block');
                    }else{
                        o.removeClass(v);
                        err.css('display','none');
                    }
                }
                box._setTB(profile._inValid);
            });
        }
    },
    Initialize:function(){
        //modify default template fro shell
        var t = this.getTemplate();
        xui.merge(t.FRAME.BORDER,{
            style:'',
            LABEL:{
                className:'{_required} xui-ui-ellipsis',
                style:'{labelShow};width:{_labelSize};{labelHAlign}',
                text:'{labelCaption}'
            },
            BOX:{
                className:'xui-ui-input xui-ui-shadow-input xui-uiborder-flat xui-uiborder-radius xui-uibase',
                WRAP:{
                    tagName : 'div',
                    INPUT:{
                        $order:10,
                        tagName : 'input',
                        type : '{_type}',
                        maxlength:'{maxlength}',
                        tabindex:'{tabindex}',
                        placeholder:"{placeholder}",
                        style:'{_css};{hAlign};'
                    }
                }
            }
        },'all');
        t.FRAME.ERROR = {
            className:'xuifont',
            $fonticon:'xui-icon-error'
        };
        this.setTemplate(t)
    },
    Static:{
        _syncResize:true,
        _maskMap:{
            '~':'[+-]',
    		'1':'[0-9]',
    		'a':'[A-Za-z]',
    		'u':'[A-Z]',
    		'l':'[a-z]',
    		'*':'[A-Za-z0-9]'
        },
        _maskSpace:'_',
        Appearances:{
            KEY:{
                position:'relative'
            },
            BORDER:{
            },
            LABEL:{
               'z-index':1,
               top:0,
               left:0,
               position:'absolute',
               'padding-top':'.25em'
            },
            WRAP:{
                left:0,
                //for firefox bug: cursor not show
                position:'absolute',
                overflow:(xui.browser.gek&&xui.browser.ver<3)?'auto':'visible'
            },
            BOX:{
                left:0,
                top:0,
                position:'absolute',
                overflow:'hidden',
                'z-index':10
            },
            INPUT:{
               //don't change it in custom class or style
               'padding-top':'4px',
               'padding-left':'4px',
               'padding-right':'4px',
               'padding-bottom':'4px',

               "background-color":"transparent",
               "background-image":xui.browser.ie687?'url(.)':null,
               border:0,
               margin:0,
               // default
               'text-align':'left',

               'margin-top':xui.browser.ie67?'-1px':null,
               position:'relative',
               //give default size
               width:'8.5em',

               overflow:xui.browser.ie678?'hidden':'auto',
               'overflow-y':xui.browser.ie678?'hidden':'auto',
               'overflow-x':xui.browser.ie678?'hidden':'hidden',
               resize:'none'
            },
            ERROR:{
                position:'absolute',
                right:'.25em',
                top:'.25em',
                display:'none',
                'z-index':20
            }
        },
        Behaviors:{
            HoverEffected:{BOX:['BOX']},
            NavKeys:{INPUT:1},
            LABEL:{
                onClick:function(profile, e, src){
                    if(profile.properties.disabled)return false;
                    if(profile.onLabelClick)
                        profile.boxing().onLabelClick(profile, e, src);
                },
                onDblClick:function(profile, e, src){
                    if(profile.properties.disabled)return false;
                    if(profile.onLabelDblClick)
                        profile.boxing().onLabelDblClick(profile, e, src);
                },
                onMousedown:function(profile, e, src){
                    if(xui.Event.getBtn(e)!='left')return;
                    if(profile.properties.disabled)return false;
                     if(profile.onLabelActive)
                        profile.boxing().onLabelActive(profile, e, src);
                }
            },
            INPUT:{
                onChange:function(profile, e, src){
                    if(profile.$_onedit||profile.$_inner||profile.destroyed||!profile.box)return;
                    var p=profile.properties,b=profile.box,
                        o=profile._inValid,
                        instance=profile.boxing(),
                        value=xui.use(src).get(0).value;
                    
                    if(profile.$Mask && profile.$Mask==value){
                        value="";
                    }

                    // trigger events
                    instance.setUIValue(value,null,null,'onchange');
                    // input/textarea is special, ctrl value will be set before the $UIvalue
                    if(p.$UIvalue!==value)instance._setCtrlValue(p.$UIvalue);
                    if(o!==profile._inValid) if(profile.renderId)instance._setDirtyMark();

                    b._asyCheck(profile);
                },
                //if properties.mask exists, onHotKeyxxx wont be tigger any more
                onKeydown:function(profile, e, src){
                   var p=profile.properties,b=profile.box,
                        m=p.multiLines,
                        evt=xui.Event,
                        k=evt.getKey(e);
                    if(p.disabled || p.readonly)return;

                    //fire onchange first
                    if(k.key=='enter'&& (!m||k.altKey))
                        xui.use(src).onChange();

                    b._asyCheck(profile);

                    if(p.mask){
                        if(k.key.length>1)profile.$ignore=true;
                        else delete profile.$ignore;
                        switch(k.key){
                            case 'backspace':
                                b._changeMask(profile,xui.use(src).get(0),'',false);
                                return false;
                            case 'delete':
                                b._changeMask(profile,xui.use(src).get(0),'');
                                return false;
                        }
                    }
                },
                onKeypress:function(profile, e, src){
                    var p=profile.properties,
                    b=profile.box,
                    cls=profile.box,
                    map=cls._maskMap,
                    k=xui.Event.getKey(e),t,
                    caret=xui.use(src).caret();
                    
                    if(profile.beforeKeypress && false===profile.boxing().beforeKeypress(profile,caret, k,e,src))
                        return false;
                    t=profile.CF.beforeKeypress||profile.$beforeKeypress;
                    if(t && false===t(profile,caret,k,e,src))
                        return false;

                    b._asyCheck(profile);

                    if(p.mask){
                        if(profile.$ignore){
                            delete profile.$ignore;
                            return true;
                        }
                        if(k.ctrlKey||k.altKey)return true;

                        cls._changeMask(profile,xui.use(src).get(0),k.key,true);
                        return false;
                    }
                },
                onKeyup:function(profile, e, src){
                    var p=profile.properties,b=profile.box;
                    // must be key up event
                    if(xui.Event.getKey(e).key=='esc'){
                        profile.boxing()._setCtrlValue(p.$UIvalue);
                        if(profile.onCancel)
                            profile.boxing().onCancel(profile);
                    }

                    if(p.dynCheck){
                        var value=xui.use(src).get(0).value;
                        profile.box._checkValid(profile, value);
                        profile.boxing()._setDirtyMark();
                    }
                    b._asyCheck(profile);
                },
                onMousedown:function(profile, e, src){
                    profile._mousedownmark=1;
                    xui.asyRun(function(){if(profile)delete profile._mousedownmark;});
                },
                onMouseup:function(profile, e, src){
                    if(profile.properties.selectOnFocus && profile._justFocus){
                        var node=xui.use(src).get(0);
                        if(!node.readOnly && node.select){
                            profile.$mouseupDelayFun=xui.asyRun(function(){
                                delete profile.$mouseupDelayFun;
                                if(xui.browser.deviceType!='touchOnly'){
                                    if(node.tagName.toLowerCase()=="input" || !/[\n\r]/.test(node.value))node.select();
                                }
                            })
                        }
                        delete profile._justFocus;
                    }
                    if(profile._activedonmousedown){
                        delete profile._activedonmousedown;
                        var node=xui.use(src).get(0);
                        if(node.tagName.toLowerCase()=="input" || !/[\n\r]/.test(node.value))node.select();
                    }
                },
                onFocus:function(profile, e, src){
                    var p=profile.properties,b=profile.box;
                    if(p.disabled || p.readonly)return false;
                    if(profile.onFocus)profile.boxing().onFocus(profile);
                    profile.getSubNode('BOX').tagClass('-focus');
                    
                    var node=xui.use(src).get(0);
                                        
                    //if no value, add mask
                    if(p.mask){
                        var value=node.value;
                        if(!value){
                            profile.$focusDelayFun=xui.asyRun(function(){
                                // destroyed
                                if(!profile.box)return;
                                delete profile.$focusDelayFun;
                                profile.$_inner=true;
                                node.value=profile.$Mask;
                                delete profile.$_inner;
                                b._setCaret(profile,node);
                            });
                        }
                    }
                    if(p.selectOnFocus && !node.readOnly && node.select){
                        if(xui.browser.kde){
                            profile.$focusDelayFun2=xui.asyRun(function(){
                                delete profile.$focusDelayFun2;
                                if(xui.browser.deviceType!='touchOnly'){
                                    if(node.tagName.toLowerCase()=="input" || !/[\n\r]/.test(node.value))node.select();
                                }
                            });
                        }else{
                            if(xui.browser.deviceType!='touchOnly'){
                                if(node.tagName.toLowerCase()=="input" || !/[\n\r]/.test(node.value))node.select();
                            }
                        }
                        // if focus was triggerred by mousedown, try to stop mouseup's caret
                        if(profile._mousedownmark)profile._justFocus=1;
                    }
                    //show tips color
                    profile.boxing()._setTB(3);

                    b._asyCheck(profile);
                },
                onBlur:function(profile, e, src){
                    xui.resetRun(profile.$xid+":asycheck");
                    if(profile.$focusDelayFun)xui.clearTimeout(profile.$focusDelayFun);
                    if(profile.$focusDelayFun2)xui.clearTimeout(profile.$focusDelayFun2);
                    if(profile.$focusDelayFun2)xui.clearTimeout(profile.$mouseupDelayFun);

                    var p=profile.properties,b=profile.box;
                    if(p.disabled || p.readonly)return false;                    
                    if(profile.onBlur)profile.boxing().onBlur(profile);
                    
                    // allow destory control inonBlur event
                    if (profile.destroyed) return false;
                     
                    profile.getSubNode('BOX').tagClass('-focus',false);
                    var value=xui.use(src).get(0).value;
                    if(profile.$Mask && profile.$Mask==value){
                        value="";
                    }
                    //onblur check it
                    if(p.$UIvalue==value)
                        profile.box._checkValid(profile, value);

                    profile.boxing()._setDirtyMark();
                    b._asyCheck(profile,false);
                }
            }
        },
        DataModel:{
            selectable:true,
            border:false,

            tipsErr:'',
            tipsOK:'',

            dynCheck:false,
            selectOnFocus:true,
            placeholder: {
                ini: '',
                action: function (value) {
                    this.getSubNode('INPUT').attr('placeholder', value);
                }
            },
            // label
            labelSize:{
                $spaceunit:1,
                ini:'0',
                action: function(v){
                    this.getSubNode('LABEL').css({display:v?'':'none'});
                    xui.UI.$doResize(this,this.properties.width,this.properties.height,true);
                }
            },
            labelPos:{
                ini:"left",
                listbox:['left','top', 'right', 'bottom'],
                action: function(v){
                    xui.UI.$doResize(this,this.properties.width,this.properties.height,true);
                }                
            },
            labelGap:{
                $spaceunit:1,
                ini:'4',
                action: function(v){
                    xui.UI.$doResize(this,this.properties.width,this.properties.height,true);
                }
            },
            labelCaption:{
                ini:"",
                action: function(v){
                    v=(xui.isSet(v)?v:"")+"";
                    this.getSubNode('LABEL').html(xui.adjustRes(v,true));
                }
            },
            labelHAlign:{
                ini:'right',
                listbox:['','left','center','right'],
                action: function(v){
                    this.getSubNode('LABEL').css('textAlign',v);
                }
            },

            valueFormat:{
                helpinput:[
                    {caption : 'required', id: "[^.*]"},
                    {caption : 'email',id:"^[\\w\\.=-]+@[\\w\\.-]+\\.[\\w\\.-]{2,4}$"},
                    {caption : 'charOnly',id:"^[a-zA-Z]*$"},
                    {caption : 'words',id:"^[\\w ]*$"},
                    {caption : 'integer',id:"^-?\\d\\d*$"},
                    {caption : 'positiveInteger',id:"^\\d\\d*$"},
                    {caption : 'number',id:"^-?(\\d\\d*\\.\\d*$)|(^-?\\d\\d*$)|(^-?\\.\\d\\d*$)"},
                    {caption : 'filepath',id:"([\\/]?[\\w_]+)+\\.\\w{1,9}$"},
                    {caption : 'URL', id:"^(http|https|ftp)\\:\\/\\/[\\w\\-\\_\\.]+[\\w\\-\\_](:[\\w]*)?\\/?([\\w\\-\\._\\?\\,\\'\\/\\\\\\+&amp;%\\$#\\=~])*$"},
                    {caption : 'color',id:"^\\#[0-9A-Fa-f]{6}$"},
                    {caption : "HH:MM", id:"^\(\([0-1][0-9]\)|\([2][0-3])\)\:\([0-5][0-9]\)$"},
                    {caption : "HH:MM:SS", id:"^\(\([0-1][0-9]\)|\([2][0-3])\)\:\([0-5][0-9]\)\\:\([0-5][0-9]\)$"},
                    {caption : "YYYY-MM-DD",id:"^\([0-9]{4}\)\\-\(\([0][0-9]\)|\([1][0-2]\)\)\\-\([0-3][0-9]\)$"},
                    {caption : "DD/MM/YYYY",id:"^\(\([0-2][0-9]\)|\([3][0-1]\)\)\/\(\([0][0-9]\)|\([1][0-2]\)\)\/\([0-9]{4}\)$"}
                ]
            },
            mask:{
                action:function(value){
                    var ns=this,
                        b=ns.box;
                    if(value){
                        ns.$MaskFormat=function(ns, v){
                            var m=ns._maskMap,a=[],r=/[A-Za-z0-9]/;
                            xui.arr.each(v.split(''),function(o,i){
                                a.push(m[o]||(r.test(o)?"":"\\")+o)
                            });
                            return '^'+a.join('')+'$';
                        }(b, value);
                        ns.$Mask = function(ns, v){
                            var m=ns._maskMap,a=[],s=ns._maskSpace;
                            xui.arr.each(v.split(''),function(o,i){
                                a.push(m[o]?s:o);
                            });
                            return  a.join('');
                        }(b,value);
                        var uiv=ns.properties.$UIvalue;
                        uiv=xui.isSet(uiv)?(uiv+""):"";
                        //visibility mask string
                        ns.boxing()._setCtrlValue(uiv + ns.$Mask.slice(uiv.length));
                   }else{
                        delete ns.$MaskFormat;
                        delete ns.$Mask;
                   }
                }
            },
            value:'',
            width:{
                $spaceunit:1,
                ini:'10em'
            },
            height:{
                $spaceunit:1,
                ini:'auto'
            },
            disabled:{
                ini:false,
                action: function(v){
                    var i=this.getSubNode('INPUT'),
                        cls="xui-ui-disabled";
                    
                    if(v)this.getRoot().addClass(cls);
                    else this.getRoot().removeClass(cls);
                        
                    if((""+i.get(0).type).toLowerCase()!='button'){
                        if(!v && this.properties.readonly)
                            v=true;
                        // use 'readonly'(not 'disabled') for selection
                        i.attr('readonly',v);
                    }
                }
            },
            hAlign:{
                ini:'',
                listbox:['','left','center','right'],
                action: function(v){
                    this.getSubNode("INPUT").css('textAlign',v);
                }
            },
            readonly:{
                ini:false,
                action: function(v){
                    var i=this.getSubNode('INPUT'),
                        cls="xui-ui-readonly";
                    
                    if(v)this.getRoot().addClass(cls);
                    else this.getRoot().removeClass(cls);

                    if((""+i.get(0).type).toLowerCase()!='button'){
                        if(!v && this.properties.disabled)
                            v=true;
                        // use 'readonly'(not 'disabled') for selection
                        i.attr('readonly',v);
                    }
                }
            },
            type:{
                ini:'text',
                listbox:['text','password'],
                set:function(value){
                    var pro=this;
                    pro.properties.type=value;
                    if(pro.renderId)
                        pro.boxing().refresh(true);
                }
            },
            maxlength:{
            	ini:-1,
            	action: function(value){
                  this.getSubNode('INPUT').attr('maxlength',value);
                }
            },
            multiLines:{
                ini:false,
                action: function(value){
                    this.boxing().refresh();
                }
            },
            tipsBinder:{
                ini:'',
                set:function(value){
                    if(value['xui.UIProfile'])
                        value=value.$xid;
                    if(value['xui.UI'] && (value=value.get(0)))
                        value=value.$xid;
                    this.properties.tipsBinder = value +'';
                }
            }
        },
        EventHandlers:{
            onFocus:function(profile){},
            onBlur:function(profile){},
            onCancel:function(profile){},
            beforeFormatCheck:function(profile, value){},
            beforeFormatMark:function(profile, formatErr){},
            beforeKeypress:function(profile,caret,keyboard,e,src){},
            
            onLabelClick:function(profile, e, src){},
            onLabelDblClick:function(profile, e, src){},
            onLabelActive:function(profile, e, src){}
        },
        _prepareData:function(profile){
            var data={},prop=profile.properties,t
            if(prop.height=='auto'){
                data.height  = '1.83em';
            }
            var d=arguments.callee.upper.call(this, profile, data);

            d._type = d.type || '';
            if(d.maxlength<0)d.maxlength="";
            
            if(xui.browser.kde)
                d._css='resize:none;';
            d.hAlign=d.hAlign?("text-align:" + d.hAlign):"";
            
            d.labelHAlign=d.labelHAlign?("text-align:" + d.labelHAlign):"";
            d.labelShow=d.labelSize?"":("display:none");
            d._labelSize=d.labelSize?'':0+profile.$picku();
    
            // adjustRes for labelCaption
            if(d.labelCaption)
                d.labelCaption=xui.adjustRes(d.labelCaption,true);

            return d;
        },
        _dynamicTemplate:function(profile){
            var properties = profile.properties,t,
                hash = profile._exhash = "$" +'multiLines:'+properties.multiLines,
                template = profile.box.getTemplate(hash);

            properties.$UIvalue = properties.value;

            // set template dynamic
            if(!template){
                template = xui.clone(profile.box.getTemplate());
                if(properties.multiLines){
                    t=template.FRAME.BORDER.BOX.WRAP.INPUT;
                    t.tagName='textarea';
                    delete t.type;
                }

                // set template
                profile.box.setTemplate(template, hash);
            }
            profile.template = template;
        },
        _ensureValue:function(profile, value){
            // ensure return string
            return ""+(xui.isSet(value)?value:"");
        },
        RenderTrigger:function(){
            var ns=this,p=ns.properties;
            xui.asyRun(function(){
                if(ns.box)
                    ns.boxing()._setTB(1);
            });
            ns.getSubNode('WRAP').$firfox2();
            if(p.readonly)
                ns.boxing().setReadonly(true,true);
            if(p.tipsBinder)
                ns.boxing().setTipsBinder(p.tipsBinder,true);
            //add event for cut/paste text
            var ie=xui.browser.ie,
                src=ns.getSubNode('INPUT').get(0),
                b=ns.box,
                f=function(o){
                    if(ie && ('propertyName' in o) && o.propertyName!='value')return;
                    b._asyCheck(ns,false);
                };
            if(ie && src.attachEvent){
                src.attachEvent("onpropertychange",f);
                src.attachEvent("ondrop",f);
                ns.$ondestory=function(){
                    var src=this.getSubNode('INPUT').get(0);
                    if(src){
                        src.detachEvent("onpropertychange",f);
                        src.detachEvent("ondrop",f);
                    }
                    src=f=null;
                }
            }else{
                src.addEventListener("input",f,false);
                src.addEventListener("drop",f,false);
                //Firefox earlier than version 3.5
                if(xui.browser.gek)
                    src.addEventListener("dragdrop",f,false);

                ns.$ondestory=function(){
                    var src=this.getSubNode('INPUT').get(0);
                    if(src){
                        src.removeEventListener("input",f,false);
                        src.removeEventListener("drop",f,false);
                        if(xui.browser.gek)
                            src.removeEventListener("dragdrop",f,false);
                    }
                    src=f=null;
                }
            }
            src=null;
        },
        LayoutTrigger:function(){
            var p = this.properties;
            if(p.mask)this.boxing().setMask(p.mask,true);
        },
    //v=value.substr(0,caret);
    //i=v.lastIndexOf(ms);

        _changeMask:function(profile,src,v,dir,resetCaret){
            if(false!==resetCaret){
                var ns=this,
                    p=profile.properties,
                    map=ns._maskMap,
                    ms=ns._maskSpace,
                    maskTxt=p.mask,
                    maskStr = profile.$Mask,
                    input = xui(src),
                    caret = input.caret();
                //for backspace
                if(dir===false && caret[0]==caret[1] && caret[0]>0)
                    input.caret(caret[0]-1,caret[0]);
    
                //for delete
                if(dir===undefined && caret[0]==caret[1])
                    input.caret(caret[0],caret[0]+1);
    
                //for caret is from a fix char, nav to the next 'input allow' char
                if(dir===true){
                    if(maskStr.charAt(caret[0])!=ms){
                        var from = caret[0] + maskStr.substr(caret[0],maskStr.length).indexOf(ms);
                        input.caret(from,Math.max(caret[1],from))
                    }
                }
    
                var caret = input.caret(),
                    value=src.value,
                    cc=p.mask.charAt(caret[0]),
                    reg = ns._maskMap[cc],
                    i,t;
    
                if(reg && v && v.length==1){
                    if(cc=='l')
                        v=v.toLowerCase();
                    else if(cc=='u')
                        v=v.toUpperCase();
                }

                if(reg && new RegExp('^'+reg+'$').test(v) || v==''){
                    t=value;
                    //if select some text
                    if(caret[0]!=caret[1])
                        t=t.substr(0,caret[0]) + maskStr.substr(caret[0],caret[1]-caret[0]) + t.substr(caret[1],t.length-caret[1]);
                    //if any char input
                    if(v)
                        t=t.substr(0,caret[0])+v+t.substr(caret[0]+1,t.length-caret[0]-1);
    
                    //get corret string according to maskTxt
                    var a=[];
                    xui.arr.each(maskTxt.split(''),function(o,i){
                        a.push( (new RegExp('^'+(map[o]?map[o]:'\\'+o)+'$').test(t.charAt(i))) ? t.charAt(i) : maskStr.charAt(i))
                    });
    
                    //if input visible char
                    if(dir===true){
                        v=maskStr.substr(caret[0]+1,value.length-caret[0]-1);
                        i=v.indexOf(ms);
                        i=caret[0] + (i==-1?0:i) + 1;
                    }else
                        i=caret[0];
                    //in opera, delete/backspace cant be stopbubbled
                    //add a dummy maskSpace
                    if(xui.browser.opr){
                        //delete
                        if(dir===undefined)
                            xui.arr.insertAny(a,ms,i);
                        //backspace
                        if(dir===false)
                            xui.arr.insertAny(a,ms,i++);
                    }
                    value=a.join('');
                    src.value=value;
                    // maybe cant fire _setCtrlValue
                    profile.boxing().setUIValue(value==maskStr?"":value,null,null,'mask');
                    ns._setCaret(profile,src,i);
                }
            }else{
                var ns=this,
                    p=profile.properties,
                    map=ns._maskMap,
                    maskTxt=p.mask,
                    maskStr=profile.$Mask,
                    t=src.value,
                    a=[];
                //get corret string according to maskTxt
                xui.arr.each(maskTxt.split(''),function(o,i){
                    a.push( (new RegExp('^'+(map[o]?map[o]:'\\'+o)+'$').test(t.charAt(i))) ? t.charAt(i) : maskStr.charAt(i))
                });
                value=a.join('');
                src.value=value;
                // maybe cant fire _setCtrlValue
                profile.boxing().setUIValue(value==maskStr?"":value,null,null,'mask');
            }

        },
        _setCaret:function(profile, src, pos){
            if(profile.properties.mask){
                if(typeof pos !='number')
                    pos=src.value.indexOf(this._maskSpace);
                xui(src).caret(pos,pos);
            }
        },
        // for checking html <input>
        _checkValid2:function(profile){
            if(!profile.renderId)return true;
            return this._checkValid(profile, profile.getSubNode('INPUT').get(0).value);
        },
        //check valid manually
        _checkValid:function(profile, value){
            var p=profile.properties,
                vf1 = (p.mask&&profile.$MaskFormat) ,
                vf2 = p.valueFormat || profile.$valueFormat;
            if( (profile.beforeFormatCheck && (profile.boxing().beforeFormatCheck(profile, value)===false)) ||
                // if inputs, check mask valid, or don't
                (((value&&value.length) && profile.$Mask!==value) && (vf1 && typeof vf1=='string' && !(new RegExp(vf1)).test((value===0?'0':value)||''))) ||
                (vf2 && typeof vf2=='string' && !(new RegExp(vf2)).test((value===0?'0':value)||''))
            ){
                profile._inValid=2;
                return false;
            }{
                profile._inValid=3;
                return true;
            }
        },
        _asyCheck:function(profile,resetCaret){
            if(profile.destroyed)return;
            if(!profile.properties.dynCheck && !profile.properties.mask)return;

            xui.resetRun(profile.$xid+":asycheck",function(){
                if(!profile.renderId)return;

                var input=profile.getSubNode("INPUT"),
                    src=input.get(0);
                if(!src)return;
                    
                //for mask
                if(profile.properties.mask){
                    if(src.value.length != profile.$Mask.length)
                        profile.box._changeMask(profile,src,'',true,resetCaret);
                }

                //for onchange event
                if(profile.properties.dynCheck){
                    var v=src.value;
                    if(profile.$Mask && profile.$Mask==v){
                        v="";
                    }
                    // dont trigger _setContrlValue
                    profile.boxing().setUIValue(v,false,true,null,'asycheck');
                }
            });
        },
        _onresize:function(profile,width,height){
            var prop = profile.properties,
                // if any node use other font-size which does not equal to xui-node, use 'px' 
                f=function(k){if(!k) return null; k=profile.getSubNode(k); return k;},
                root=f('KEY'),
                v1=f('INPUT'),
                box = f('BOX'),
                label = f('LABEL'),

                useem = xui.$uem(prop),
                adjustunit = function(v,emRate){return profile.$forceu(v, useem?'em':'px', emRate)},
                needfz = useem||profile.$isEm(width)||profile.$isEm(height),
                boxfz=useem?box._getEmSize():null,
                v1fz=useem?v1._getEmSize():null,
                labelfz=needfz||profile.$isEm(labelSize)?label._getEmSize():null,

                $hborder, $vborder,

                clsname='xui-node xui-input-input',
                paddingH=v1._paddingH(),
                paddingW=v1._paddingW(),
                autoH;
            
            $hborder=$vborder=box._borderW() / 2;
            
            // caculate by px
            if(height)height = (autoH=height=='auto') ? profile.$em2px(1.83,null,true) : profile.$isEm(height) ? profile.$em2px(height,null,true) : height;
            if(width)width = profile.$isEm(width) ? profile.$em2px(width,null,true) : width;

            // for auto height
            if(autoH)root.height(adjustunit(height));

            var labelSize=profile.$px(prop.labelSize,labelfz)||0,
                labelGap=profile.$px(prop.labelGap)||0,
                labelPos=prop.labelPos || 'left',
                ww=width,
                hh=height,
                left=Math.max(0, (prop.$b_lw||0)-$hborder),
                top=Math.max(0, (prop.$b_tw||0)-$vborder);
            if(null!==ww){
                ww -= Math.max($hborder*2, (prop.$b_lw||0)+(prop.$b_rw||0));
                /*for ie6 bug*/
                /*for example, if single number, 100% width will add 1*/
                /*for example, if single number, attached shadow will overlap*/
                if(xui.browser.ie6)ww=(Math.round(parseFloat(ww/2)))*2;
            }
            if(null!==hh){
                hh -=Math.max($vborder*2, (prop.$b_lw||0) + (prop.$b_rw||0));

                if(xui.browser.ie6)hh=(Math.round(parseFloat(hh/2)))*2;
                /*for ie6 bug*/
                if(xui.browser.ie6&&null===width)box.ieRemedy();
            }
            var iL=left + (labelPos=='left'?labelSize:0),
                iT=top + (labelPos=='top'?labelSize:0),
                iW=ww===null?null:Math.max(0,ww - ((labelPos=='left'||labelPos=='right')?labelSize:0)),
                iH=hh===null?null:Math.max(0,hh - ((labelPos=='top'||labelPos=='bottom')?labelSize:0)),
                iH2=hh===null?null:Math.max(0,height - ((labelPos=='top'||labelPos=='bottom')?labelSize:0));

            if(null!==iW && iW-paddingW>0)
                v1.width(adjustunit(Math.max(0,iW-paddingW),v1fz));
            if(null!==iH && iH-paddingH>0)
                v1.height(adjustunit(Math.max(0,iH-paddingH),v1fz));

            box.cssRegion({
                left:adjustunit(iL,boxfz),
                top:adjustunit(iT,boxfz),
                width:adjustunit(iW,boxfz),
                height:adjustunit(iH,boxfz)
            });
            
            if(labelSize)
                label.cssRegion({
                    left:adjustunit(ww===null?null:labelPos=='right'?(ww-labelSize+labelGap+$hborder*2):0,labelfz),
                    top: adjustunit(height===null?null:labelPos=='bottom'?(height-labelSize+labelGap):0,labelfz), 
                    width:adjustunit(ww===null?null:Math.max(0,((labelPos=='left'||labelPos=='right')?(labelSize-labelGap):ww)),labelfz),
                    height:adjustunit(height===null?null:Math.max(0,((labelPos=='top'||labelPos=='bottom')?(labelSize-labelGap):height)),labelfz)
                });

            iL += (iW||0) + $hborder*2;

            /*for ie6 bug*/
            if((profile.$resizer) && xui.browser.ie){
                box.ieRemedy();
            }
        }
    }
});