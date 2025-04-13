//singleton
xui.Class("xui.Tips", null,{
    Constructor:function(){return null},
    Initialize:function(){
        if(xui.ini.disableTips)return;
        var dd=xui.DragDrop, tips=this;
        if(dd){
            dd.$reset=function(){
                tips.hide();
            };
        }
        if(xui.browser.fakeTouch){
            tips.HTMLTips=false;
        }
        if(!tips.HTMLTips){
            tips.MOVABLE=false;
        }else{
            //for: span(display:-moz-inline-box) cant wrap in firefox
            xui.CSS.addStyleSheet(
                ".xui-tips{position:absolute;overflow:visible;visibility:hidden;left:-10000px;border-radius:1px;} "+
                ".xui-tips-i{overflow:hidden;position:relative;}"+
                ".xui-tips-i span{display:inline;}"+
                ".xui-tips-c{padding:.125em .25em .25em .25em;}"+
                ".xui-tips-c *{line-height:1.22em;}"+
                ".xui-tips .xui-tips-c{border-radius:1px;}"
            , this.KEY);
        }

        xui.doc
        .afterMousedown(function(){
            tips._cancel();
        },'$Tips',-1)
        .afterMousemove(function(obj, e){
            if(dd._profile.isWorking)return;
            var event=xui.Event,p,n,_from;

            if((p=xui.resetRun.$cache) && p['$Tips']){
                tips._pos=event.getPos(e);
            }

            //it's first show
            if(tips._from){
                if(!tips._from["xui.Template"]){
                    tips._pos=event.getPos(e);
                    tips._showF();
                    xui.resetRun('$Tips3');
                }
            //after show, before hide
            }else if(tips.MOVABLE && tips._showed){
                if(tips._Node){
                    p=event.getPos(e);
                    n=tips._Node.style;
                    n.contentVisibility="hidden";
                    n.left = Math.min(tips._tpl._ww-tips._tpl._w, Math.max(0, Math.round((parseFloat(n.left)||0) + (p.left-tips._pos.left), 10))) + 'px';
                    n.top = Math.min(tips._tpl._hh-tips._tpl._h, Math.max(0, Math.round((parseFloat(n.top)||0) + (p.top-tips._pos.top), 10))) + 'px';
                    n.contentVisibility="";
                    tips._pos=p;
                }
            }
        },'$Tips',-1)
        .afterMouseover(function(obj, e){
            var event=xui.Event,
                rt=event.$FALSE,
                node=event.getSrc(e),
                id,
                _from,
                tempid,evid,
                index=0,
                pass,
                rtn=function(rt){
                    if(tips._markId)tips._cancel()
                    return rt;
                };
            if(!node)
                return rtn(rt);
            try{
                //for inner renderer
                while(node && (!node.id || node.id==xui.$localeDomId) && node.parentNode!==document && index++<10)
                    node=node.parentNode;
                if(node && !(id=(typeof node.id=="string"?node.id:null))){
                    node=null;
                    return rtn(rt);
                }
            }catch(e){}

            //check id
            _from=event._getProfile(id)
            // not for xui.Template
            if(_from){
                if(!_from["xui.Template"]){
                    var isuip = _from.box && _from.KEY=='xui.UIProfile';
                    if(isuip){
                        if(_from.properties.disableTips || _from.behavior.disableTips){
                            node=null;
                            return rtn(false);
                        }

                        var nt=_from.behavior.NoTips;
                        if(nt){
                            for(var i=0,l=nt.length;i<l;i++){
                                if(id.indexOf(_from.keys[nt[i]])===0)
                                    return rtn(false);
                            }
                        }
                        nt=_from.behavior.PanelKeys;
                        if(nt){
                            for(var i=0,l=nt.length;i<l;i++){
                                if(id.indexOf(_from.keys[nt[i]])===0)
                                    return rtn(false);
                            }
                        }
                        nt=_from.behavior.HoverEffected;
                        //if onShowTips exists, use seprated id, or use item scope id
                        tempid=_from.onShowTips?id:id.replace(tips._reg,
                        //if HoverEffected exists, use seprated id
                        function(a,b){
                            return nt&&(b in nt)?a:':';
                        });
                    }

                    if(tips._markId && tempid==tips._markId)
                        return rt;

                    //set mark id
                    tips._markId = tempid;
                    tips._pos=event.getPos(e);
                    tips._activeNode=node;
                    tips._activePrf=_from;

                    if(tips._showed){
                        tips._from=_from;
                        tips._enode=id;
                        tips._showF();
                    }else{
                        if(!tips.HTMLTips){
                                tips._from=_from;
                                tips._enode=id;
                                if(tips._from)
                                    tips._showF();
                        }else{
                            xui.resetRun('$Tips', function(){
                                tips._from=_from;
                                tips._enode=id;
                                // if mouse stop move
                                xui.resetRun('$Tips3', function(){
                                    if(tips._from)
                                        tips._showF();
                                });
                            }, tips.DELAYTIME);
                        }
                    }
                }
            }else{
                tips._cancel();
            }
            node=null;
            return rt;
        },'$Tips',-1)
        .afterMouseout(function(obj, e){
            if(tips._markId){
                var event=xui.Event,
                    id,
                    clear,
                    index=0,
                    node = e.toElement||e.relatedTarget;

                if(!node)
                    clear=1;
                else{
                    //for firefox wearing anynomous div in input/textarea
                    try{
                        //for inner renderer
                        while(node && (!node.id || node.id==xui.$localeDomId) && node.parentNode!==document && index++<10)
                            node=node.parentNode;
                        if(node && !(id=(typeof node.id=="string"?node.id:null))){
                            node=null;
                            clear=1;
                        }
                    }catch(e){clear=1}
                }
                if(clear)
                    tips._cancel();
                return event.$FALSE;
            }
        },'$Tips',-1)
        .afterMouseup(function(obj, e){
            tips._cancel();
        },'$Tips',-1);

        this._Types = {
            'default' : new function(){
                this.show=function(item, pos, key){
                    if(xui.DragDrop._profile.isWorking)return;
                    //if trigger onmouseover before onmousemove, pos will be undefined
                    if(!pos)return;
                    var s = typeof item=='object'? xui.Tips._getTipsTxt(item) :item,t ;
                    if(typeof s=='function')
                        s=s();
                    if(!xui.Tips.HTMLTips){
                        s+='';
                        s=xui.adjustRes(s);
                        xui.Tips._curTips=s;
                        s=s.replace(/<[^>]*>/g,'');
                        if(t=xui.Tips._activePrf){
                            if(t.box&&t.box['xui.svg']) t.boxing().setAttr('KEY',{title:s},false);
                            else xui(xui.Tips._activeNode).attr('title', s);
                        }
                    }else{
                        var self=this,node,_ruler,w,h;
                        if(!(node=self.node) || !node.get(0)){
                            node = self.node = xui.create('<div class="xui-node xui-node-div xui-tips  xui-ui-shadow xui-custom"><div class="xui-node xui-wrapper xui-node-div xui-tips-i xui-custom"></div></div>');
                            _ruler = self._ruler = xui.create('<div class="xui-node xui-wrapper xui-node-div xui-tips  xui-ui-shadow xui-custom"><div class="xui-node xui-node-div xui-tips-i xui-custom"></div></div>');
                            self.n = node.first();
                            self._n = _ruler.first();
                            xui('body').append(_ruler);
                        }
                        _ruler = self._ruler;
                        //ensure zindex is the top
                        if(document.body.lastChild!=node.get(0))
                            xui('body').append(node,false,true);
                        if(s+=""){
                            var html=/^\s*\</.test(s);
                            //get string
                            s=xui.adjustRes(s);
                            xui.Tips._curTips=s;
                            if(!item.transTips || !html)
                                s='<div class="xui-ui-ctrl xui-node xui-node-div  xui-uiborder-flat xui-uicell-alt xui-node-tips xui-tips-c /*xif(t=xui.Tips._activePrf){ui-cls-wordwrap */xui-custom">'+s+'</div>';
                            //set to this one
                            self._n.get(0).innerHTML=s;

                            self._ww=xui.frame.width();
                            self._hh=xui.frame.height();

                            //get width
                            w=Math.min(html?self._ww:tips.MAXWIDTH, _ruler.get(0).offsetWidth + 2);

                            //set content, AND dimension
                            var style=node.get(0).style, t1=self.n.get(0),styleI=t1.style;
                            style.contentVisibility="hidden";
                            //hide first
                            style.visibility='hidden';
                            //set content
                            t1.innerHTML=s;
                            //set dimension
                            if(xui.browser.ie){
                                style.width=styleI.width=(self._w=Math.round(w+(w%2)))+'px';
                                h=t1.offsetParent?t1.offsetHeight:0;
                                style.height=(self._h=Math.round(h-(h%2)))+'px';
                            }else{
                                styleI.width=(self._w=Math.round(w))+'px';
                                self._h=self.n.height();
                            }

                            node.removeClass('xui-ui-hidden');
                            style.contentVisibility="";
                            if(pos===true){
                                style.visibility='visible';
                            }else{
                                //pop(visible too)
                                node.popToTop(((pos instanceof window.Event) || pos['xui.UI'] || pos['xui.UIProfile'] || pos['xui.Dom'] || pos.nodeType==1 || typeof pos=='string')?pos:{left:pos.left,top:pos.top,region:{
                                    left:pos.left,
                                    top:pos.top-12,
                                    width:24,
                                    height:32
                                }},1);
                            }
                            style=styleI=t1=null;
                        }else
                            node.css('zIndex',0).hide();
                    }
                };
                this.hide = function(){
                    if(!xui.Tips.HTMLTips){
                        var t=xui.Tips._activePrf;
                        if(t){
                            if(t.box['xui.svg']) t.boxing().setAttr('KEY',{title:null},false);
                            else  xui(xui.Tips._activeNode).attr('title', null);
                        }
                    }else{
                        this.node && this.node.css('zIndex',0).hide();
                    }
                };
            }
        };
    },
    Static:{
        _reg:/-([\w]+):/,
        MAXWIDTH:600,
        HTMLTips:true,
        MOVABLE:true,
        DELAYTIME:400,
        AUTOHIDETIME:5000,
        _getTipsTxt:function(h){
            return h.desc || h.tips || h.caption || xui.getNodeData(xui.Tips._activeNode, "tips");
        },
        _showF:function(){
            if(xui.ini.disableTips)return;
            var self=this,
                _from=self._from,
                node=xui.Dom.byId(self._enode),
                pos=self._pos,
                t,id,
                o=_from.box,
                b=true;

            self._from=self._enode=null;

            if(!node || !_from || !pos)return;

            //1.CF.showTips
            b=false!==((t=_from.CF) && (t=t.showTips) && t(_from, node, pos));
            //2._showTips / onShowTips
            //check if showTips works
            if(b!==false && o)b=false!==(_from._showTips && _from._showTips(_from, node, pos));
            //check if showTips works
            if(b!==false && o)b=false!==(o._showTips && o._showTips(_from, node, pos));

            //default tips var(profile.tips > profile.properties.tips)
            if(b!==false){
                if(((t=_from) && t.tips)||(t && (t=t.properties) && t.tips)){
                    self.show(pos, t);
                    b=false;
                }
                else if((t=_from) && (t=t.properties) && t.autoTips && ('caption' in t)
                    // if tips is default value, try to show caption
                    // you can settips to null or undefined to stop it
                    && t.tips===''
                    ){
                    if(t.caption||t.labelCaption){
                        self.show(pos, {tips:t.caption||t.labelCaption});
                        b=false;
                    }
                }
                else{
                    var t=xui.Tips._activeNode;
                    if(t){
                        t = xui.getNodeData(t, "tips");
                        if(t){
                            self.show(pos, {tips:t});
                            b=false;
                        }
                    }
                }
            }

            //no work hide it
            if(b!==false){
                self.hide();
            }else {
                if(self.HTMLTips && !self.MOVABLE)
                    xui.resetRun('$Tips2', self.hide,self.AUTOHIDETIME,null,self);
            }
            node=pos=_from=null;
        },
        getTips:function(){
            return this._curTips;
        },
        setTips:function(s){
            if(this._curTips && this._tpl){
                this._tpl.show(s, true);
            }
        },
        setPos:function(left,top){
            var n=this;
            if(n.HTMLTips && (n=n._Node) && (n=n.style)){
                if(left||left===0)n.left=Math.round(parseFloat(left))+'px';
                if(top||top===0)n.top=Math.round(parseFloat(top))+'px';
            }
        },
        show:function(pos, item, key){
            var self=this,t;
            //for mousemove
            self._pos=pos;
            //same item, return
            if(self._item === item)return;

            //hide first
            //if(self._tpl)self._tpl.hide();

            //base check
            if(typeof item =='string' || (item && xui.Tips._getTipsTxt(item))){
                //get template
                t = self._tpl = self._Types[item.tipsTemplate] || self._Types['default'];
                t.show(item,pos,key);
                self._Node=t.node&&t.node.get(0);
                self._item=item;
                self._showed = true;
            }else
                self._cancel();
        },
        hide:function(){
            var self=this;
            if(self._showed){
                if(self._tpl)self._tpl.hide();
                self._clear();
            }
        },
        _cancel:function(){
            var self=this;
            if(self._markId){
                if(self._showed){
                    self.hide();
                }else{
                    xui.resetRun('$Tips');
                    xui.resetRun('$Tips3');
                    self._clear();
                }
            }
        },
        _clear:function(){
            var self=this;
            self._Node=self._curTips=self._markId = self._activeNode = self._activePrf = self._from=self._tpl = self._item = self._showed = null;
        }
    }
});