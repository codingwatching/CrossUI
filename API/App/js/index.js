xui.Class('App', 'xui.Module',{
    Initialize:function(){
        var arr=[];

        arr.push('.ccss-item{text-decoration: line-through;}');

        arr.push('h1{margin:10px 2px 2px 10px; padding-bottom:10px; font: bold 24px "Trebuchet MS","Lucida Grande",Verdana,sans-serif; color: #D00000; border-bottom: 1px dashed #aca899;}');
        arr.push('h2{margin:10px 2px 10px 2px; font: bold 18px "Trebuchet MS","Lucida Grande",Verdana,sans-serif;  color:#134275; border-bottom: 1px dashed #aca899;}');
        arr.push('h2.notice{color:#000}');
        arr.push('h2.inherite{color:#D2691E}');
        arr.push('h3{margin:10px 2px 10px 2px; font: bold 16px Bookman Old Style, Helvetica, sans-serif; color: #4C4B43; border-bottom: 1px dashed #aca899;}');
        arr.push('h4{position:relative;padding-left:20px;font: bold 12px "Trebuchet MS","Lucida Grande",Verdana,sans-serif;background:#F9FFE9;}');
        arr.push('.totop{position:absolute;padding-left:3px;padding-right:3px;left:4px;top:4px;}');

        arr.push('.xui-custom-block{margin:2px 2px 2px 18px;display:none;}');
        arr.push('.xui-custom-icon{margin:2px;width:16px;height:16px;background-image:url(img/img.gif);vertical-align: middle;}');

        arr.push('.inndiv {margin:3px;}');
        arr.push('.inndiv li{padding-left:20px;}');

        arr.push('.required{color:red;}');
        arr.push('.desc{color:red;font-weight:normal;padding-left:22px;}');

        arr.push('.xui-custom-block .p{margin:2px;border: 1px solid #E9D3F4;position:relative;}');
        arr.push('.xui-custom-block .con{display:none;padding:8px; font: 12px "Trebuchet MS","Lucida Grande",Verdana,sans-serif;background:#FFF;border-top: 1px solid #E9D3F4;}');

        arr.push('.xui-custom-list{background:#E5ECF9;border:1px solid #3366CC;margin:2px;padding:5px;}');

        arr.push('.xui-custom-list a{text-decoration: underline;}');

        arr.push('.xui-custom-cmd{cursor:pointer;margin:2px;width:16px;height:16px;line-height:0;font-size:0;background-image:url(img/img.gif)}');

        xui.CSS.addStyleSheet(arr.join(''),'',true);

        //dont want to show original function code
        xui.id.$auto$=1;
    },
    Instance:{
       _deprecatedFuns:{
           //shortcuts
           "xui.UI.TreeGrid.prototype.getHeadergetColumn":"xui.UI.TreeGrid.prototype.",
           "xui.UI.TreeGrid.prototype.updateColumn":"xui.UI.TreeGrid.prototype.updateHeader",
           "xui.UI.TreeGrid.prototype.getColByDom":"xui.UI.TreeGrid.prototype.getHeaderByDom",
           "xui.UI.TreeGrid.prototype.getColByColId":"xui.UI.TreeGrid.prototype.getHeaderByColId",
           "xui.UI.TreeGrid.prototype.getColByCell":"xui.UI.TreeGrid.prototype.getHeaderByCell",
           "xui.query":"xui.Dom.prototype.query",
           "xui.querySelector":"xui.Dom.prototype.querySelector",
           "xui.querySelectorAll":"xui.Dom.prototype.querySelectorAll",
            //deprecated
            "xui.getCom":"xui.getModule",
            "xui.newCom":"xui.newModule",
            "xui.showCom":"xui.showModule",
            "xui.ComFactory.getCom":"xui.ModuleFactory.getCom",
            "xui.ComFactory.newCom":"xui.ModuleFactory.newCom",
            "xui.ComFactory.showCom":"xui.ModuleFactory.showCom",
            "xui.ComFactory.setCom":"xui.ModuleFactory.setModule",
            "xui.ComFactory.getComFromCache":"xui.ModuleFactory.getModuleFromCache",
            "xui.ComFactory.getCom":"xui.ModuleFactory.getModule",
            "xui.ComFactory.newCom":"xui.ModuleFactory.newModule",
            "xui.ComFactory.storeCom":"xui.ModuleFactory.storeModule",
            "xui.ComFactory.prepareComs":"xui.ModuleFactory.prepareModules",

            "xui.ModuleFactory.setCom":"xui.ModuleFactory.setModule",
            "xui.ModuleFactory.getComFromCache":"xui.ModuleFactory.getModuleFromCache",
            "xui.ModuleFactory.getCom":"xui.ModuleFactory.getModule",
            "xui.ModuleFactory.newCom":"xui.ModuleFactory.newModule",
            "xui.ModuleFactory.storeCom":"xui.ModuleFactory.storeModule",
            "xui.ModuleFactory.prepareComs":"xui.ModuleFactory.prepareModules"
        },
        _deprecatedClasses:{
            'xui.Com':'xui.Module',
            'xui.UI.SLabel':'xui.UI.Label',
            'xui.UI.SButton':'xui.UI.Button',
            'xui.UI.SCheckbox':'xui.UI.Checkbox',
            'xui.UI.Pane':'xui.UI.Div',
            'xui.UI.IconList':'xui.UI.Gallery'
        },
        events:{onRender:'_onrender'},

        _onrender:function(){
            SPA=this;
            SPA.btnLang.setCaption(xui.getRes('app.'+xui.getLang()));
            xui.UI.Resizer.$abstract=true;
            xui.History.setCallback(function(str){
                var str2 = str.replace('/','');
                // handle deprecated functions
                str2 = SPA._deprecatedFuns[str2] || str2;
                // handle deprecated classes
                xui.each(SPA._deprecatedClasses,function(o,i){
                    str2 = str2.replace(i, o);
                });

                str=str2;
                if(!str)return;
                var obj, t, id1, id2, id3, id4;

                obj=xui.SC.get(str);
                // try Module
                if(!obj){
                    var str3=str.replace('xui.Module.prototype.','xui.Module.$EventHandlers.')
                        .replace('xui.Com.prototype.','xui.Module.$EventHandlers.');
                    obj=xui.SC.get(str3);
                    // add it manually
                    if(obj)
                        obj.$event$=1;
                }
//input must be a valid object path
                while(!obj && str.indexOf('.')!=-1){
                    t=str.split('.');
                    t.pop();
                    str=t.join('.');
                    obj=xui.SC.get(str);
                }
                //if same
                if(SPA.__vid==str)return;
                //if return to list
                if(SPA.__vid && xui.str.endWith(str2, '._list'))
                    return;

                SPA.__vid=str;

                if(str.indexOf('.prototype.')!=-1){
                    id1=str.split('.prototype.')[0];
                    if(obj){
                        id2= id1 + (obj.$event$?'._event':'._prototype');
                        if(obj.$original$)
                            id3= obj.$original$==xui.SC.get(id1).KEY? null: (id2 + '.' + obj.$original$.replace(/\./g,'_'));
                    }
                    id4=str;
                }else{
                    //show to class layer only
                    if(SPA.$S_CLS[str] || (obj && obj.$xui$)){
                        id1=str;
                        //construcotr or global function
                        id2=id1+'.constructor';
                        id4=id1+'._global';

                        id3=id2+'.'+id1.replace(/\./g,'_');
                    //show to static method
                    }else if(typeof obj=='function'){
                        id1=str.slice(0,str.lastIndexOf('.'));
                        id2=id1+'._staticM';

                        if(obj && obj.$original$)
                            id3=obj.$original$==xui.SC.get(id1).KEY?null:id2+'.'+obj.$original$.replace(/\./g,'_');
                        id4=str;
                    //show to static property
                    }else{
                        id1=str.slice(0,str.lastIndexOf('.'));
                        id2=id1+'._staticP';
                        //properties: no super
                        id3=null;
                        id4=str;
                    }
                }


                if(id1){
                    if(SPA._curId!=id1){
                        SPA._curId=id1;
                        SPA.objTree.openToNode(id1, false).setValue(id1);
                        var node=SPA.divHead.getRoot(),
                            ics=SPA._iconPosMap,
                            f=SPA._clickForToggle,
                            html =SPA._format( SPA._parse(id1) )
                            ;

                        //build html
                        SPA.divHead.setHtml( html, true);
                        node.setSelectable(true);
                        //attach event
                        node.query('h2').css('cursor','pointer').onClick(f,true).first().css('backgroundPosition',ics.close);
                        node.query('h3').css('cursor','pointer').onClick(f,true).first().css('backgroundPosition',ics.close);
                        node.query('h4').css('cursor','pointer').onClick(f,true).first().css('backgroundPosition',ics.close);
                    }
                    //for IE :  getElementById, name property has priority over id property.
                    if(id4)id4+='_';
                    //open
                    xui.arr.each([id2,id3,id4],function(id){
                        var t;
                        if(id && (t=xui.Dom.byId(id)) && xui.get(t,['nextSibling', 'style', 'display'])!='block'){
                            t=xui(id);
                            t.onClick();
                        }
                    });
                    //focus
                    if(id4 && (t=xui.Dom.byId(id4)))
                        xui.asyRun(function(){
                            SPA.divHead.getRoot().scrollTop(xui(id4).offset(null,SPA.divHead.getRoot()).top);
                        });
                }
            });
        },
        showCode:function(e, key){
            var txt = xui.getRes('app.oCodeDesc') +
                      key + ' = ' +
                      xui.SC.get(key).toString();
            txt = xui.Coder.formatAll(txt, 'js', ['plain']);
            var node=xui.create("<div style='visibility:hidden;left:-10000px;width:600px;background:#fff;border:solid 1px #aaa;overflow:auto;'>"+txt+"</div>");
            //add first
            xui('body').append(node.setSelectable(true));
            //adjust height
            if(node.first().height()>400)node.height(400);
            //pop
            node.popToTop(xui.Event.getPos(e));

            node.setBlurTrigger(xui.rand(), function(){
                node.remove();
            });

            return false;
        },
        iniComponents:function(){
            // [[Code created by CrossUI RAD Studio
            var host=this, children=[], append=function(child){children.push(child.get(0));};

            append(
                xui.create("xui.UI.PopMenu")
                .setHost(host,"popLang")
                .setItems([
                    {
                        "id":"en",
                        "caption":"$app.en"
                    },
                    {
                        "id":"cn",
                        "caption":"$app.cn"
                    }
                ])
                .onMenuSelected("_pop_onmenuselected")
            );

            append(
                xui.create("xui.UI.Dialog")
                .setHost(host,"dialog2")
                .setTop("3.3333333333333335em")
                .setWidth("35em")
                .setHeight("30em")
                .setRight("0.08333333333333333em")
                .setZIndex(100)
                .setResizer(false)
                .setCaption("$app.search")
                .setMaxBtn(false)
                .setCloseBtn(false)
                .setOverflow("hidden")
            );

            host.dialog2.append(
                xui.create("xui.UI.Block")
                .setHost(host,"blockQ")
                .setDock("fill")
                .setZIndex(100)
                .setBorderType("inset")
                );

            host.blockQ.append(
                xui.create("xui.UI.Div")
                .setHost(host,"divQ")
                .setWidth("auto")
                .setHeight("auto")
                .setPosition("relative")
                );

            host.blockQ.append(
                xui.create("xui.UI.List")
                .setHost(host,"listQ")
                .setDirtyMark(false)
                .setDock("fill")
                .setDockMargin({
                    "left":4,
                    "top":0,
                    "right":4,
                    "bottom":0
                })
                .setSelMode("none")
                .setValue("")
                .onItemSelected("_listq_onitemselected")
                );

            host.blockQ.append(
                xui.create("xui.UI.Block")
                .setHost(host,"block20")
                .setDock("bottom")
                .setHeight("2.6666666666666665em")
                .setBorderType("none")
                );

            host.block20.append(
                xui.create("xui.UI.PageBar")
                .setHost(host,"pbQ")
                .setLeft("0.4166666666666667em")
                .setTop("0.5833333333333334em")
                .setCaption("")
                .onClick("_pbq_onclick")
                );

            host.blockQ.append(
                xui.create("xui.UI.Block")
                .setHost(host,"block6")
                .setDock("top")
                .setHeight("2.6666666666666665em")
                .setBorderType("none")
                .setOverflow("hidden")
                );

            host.block6.append(
                xui.create("xui.UI.Label")
                .setHost(host,"lQ1")
                .setLeft("0.4166666666666667em")
                .setTop("0.8333333333333334em")
                .setWidth("5.5em")
                .setCaption("$app.lQ1")
                );

            host.block6.append(
                xui.create("xui.UI.Input")
                .setHost(host,"iQ1")
                .setDirtyMark(false)
                .setLeft("6.083333333333333em")
                .setTop("0.5em")
                .setWidth("8.333333333333334em")
                .setDynCheck(true)
                .onChange("_iq1_afteruivalueset")
                );

            host.block6.append(
                xui.create("xui.UI.Label")
                .setHost(host,"lQ2")
                .setLeft("14.666666666666666em")
                .setTop("0.8333333333333334em")
                .setWidth("9.166666666666666em")
                .setCaption("$app.lQ2")
                );

            host.block6.append(
                xui.create("xui.UI.Input")
                .setHost(host,"iQ2")
                .setDirtyMark(false)
                .setLeft("24.083333333333332em")
                .setTop("0.5em")
                .setWidth("9.166666666666666em")
                .setDynCheck(true)
                .onChange("_iq2_afteruivalueset")
                );

            append(
                xui.create("xui.UI.Block")
                .setHost(host,"paneTop")
                .setDock("top")
                .setHeight("3.3333333333333335em")
            );

            host.paneTop.append(
                xui.create("xui.UI.Label")
                .setHost(host,"labelName")
                .setLeft("0.8333333333333334em")
                .setTop("0.8333333333333334em")
                .setWidth("22.5em")
                .setCaption("$app.apititle")
                .setHAlign("left")
                .setFontSize("16px")
                .setFontWeight("bold")
                );

            host.paneTop.append(
                xui.create("xui.UI.Button")
                .setHost(host,"btnLang")
                .setDomId("btnLang")
                .setTop("0.75em")
                .setRight("0.8333333333333334em")
                .setCaption("btnLang")
                .setType("drop")
                .onClick("_butlang_onclickdrop")
                .onClickDrop("_butlang_onclickdrop")
                );

            append(
                xui.create("xui.UI.Layout")
                .setHost(host,"mainLayout")
                .setItems([
                    {
                        "id":"before",
                        "pos":"before",
                        "locked":false,
                        "size":240,
                        "min":100,
                        "max":400,
                        "folded":false,
                        "cmd":true,
                        "hidden":false
                    },
                    {
                        "id":"main",
                        "min":10,
                        "size":80
                    }
                ])
                .setType("horizontal")
            );

            host.mainLayout.append(
                xui.create("xui.UI.Div")
                .setHost(host,"divHead")
                .setDock("fill")
                .setCustomStyle({
                    "KEY":"overflow:auto;"
                })
                , "main");

            host.mainLayout.append(
                xui.create("xui.UI.TreeBar")
                .setHost(host,"objTree")
                .onRender("_objtree_aftercreated")
                .onItemSelected("__itemsel")
                , "before");

            return children;
            // ]]Code created by CrossUI RAD Studio
        },
        _pop_onmenuselected:function (profile, item) {
            if(xui.getLang()==item.id)return;

            xui.setLang(item.id,function(){
                SPA.btnLang.setCaption(xui.getRes('app.'+xui.getLang()));
                if(SPA.__vid){
                    var s=SPA.__vid;
                    delete SPA.__vid;
                    delete SPA._curId;
                    xui.History._callback(s);
                }
            });
        },
        _butlang_onclickdrop:function(profile, e, src) {
            SPA.popLang.refresh();
            SPA.popLang.pop(src);
        },
        _objtree_aftercreated:function (profile) {
            var items=[
                {id:'xui', href:'#!xui', caption:'xui',image:'img/img.gif', imagePos:'left top',iniFold:false, sub:[]}
            ];
            var self=this,
                o=items[0], id=o.id, sub=o.sub,
                getClass=function(o, ref, id){
                    var arr=[],temp,id=id||o.KEY, temp, sub;
                    for(var i in o)
                        if('prototype'!=i && 'constructor' != i&& 'upper' !=i)
                            if(typeof o[i]=='function'&& o[i].$xui$){
                                temp={id:id+'.'+i, href:'#!'+id+'.'+i, caption:id+'.'+i, image:'img/img.gif',imagePos:ref._iconPosMap['cls']};
                                if(typeof xui.getRes('doc.'+id+'.'+i)!='object')
                                    temp.itemClass='ccss-item';
                                sub=arguments.callee(xui.SC.get(id+'.'+i),ref);
                                if(sub.length) temp.sub=sub;
                                arr.push(temp);
                            }
                    arr.sort(function(x,y){
                        return  (x.sub&&!y.sub) ? -1 : (!x.sub&&y.sub)  ? 1 : x.id.toLowerCase()>y.id.toLowerCase() ? 1 : -1;
                    });
                    return arr;
                };
            o=xui.SC.get(id);
            for(var i in o){
                for(var j in o[i]){
                     if('prototype'!=j&&'constructor'!=j&&j.charAt(0)!='_'&&j.charAt(0)!='$'){
                        sub.push({id:id+'.'+i, href:'#!'+id+'.'+i, caption:id+'.'+i, image:'img/img.gif', imagePos:self._iconPosMap[typeof o[i]=='function'?'fun':'hash']});
                        break;
                    }
                }
            }

            o=items[0];
            sub=o.sub;
            id='xui';
            o.sub=getClass(xui, self, id);

            // Add Class to the first one
            items[0].sub.unshift({id:'Namespace', href:'#!xui.Namespace', caption:'Namespace', image:'img/img.gif', imagePos:'left -48px'});
            items[0].sub.unshift({id:'Class', href:'#!xui.Class', caption:'Class', image:'img/img.gif', imagePos:'left -48px'});

            profile.boxing().setItems(items);
        },
        _getFunArgs:function(f,i){
            with (''+(i?f[i]:f)) return (i||'') + ' ( ' + slice(indexOf("(") + 1, indexOf(")")) + ' )';
        },
        _getItem:function(pos, head, key, okey, flag){
            var con = this.getDoc(key),t,
                desc = con ? con[0] : "";
            okey=okey||key;
            //for IE :  getElementById, name property has priority over id property.
            return '<a name="'+okey+'"></a> <div class="p">' +
             (desc?"  <div class=desc>&#10148;&nbsp;&nbsp;" +desc+"</div>  ":"") +
            ' <h4 id="'+okey+'_">' +
                    (con?'<span class="xui-custom-icon" style="background-position:' +pos+';"></span>':'') +
                    head +
                    //for show original code
                    (flag !==false?((t=xui.SC.get(key)) && (t.$event$||t.$xui$||t.$auto$) ?"":'&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:;" onclick="return SPA.showCode(event,\''+key+'\');">['+xui.getRes('app.oCode')+']</a>'):"") +
                    '</h4>' +
                    (con?'<div class="con">'+con[1]+'</div>':"") +
                    (flag!==false?'<a class="totop" href="#!'+okey+'._list"> ^ </a>':'')+
                    '</div>'
                    ;
        },
        _format:function(obj){
            var key=obj.key,
                dot=".",
                pdot='.prototype.',
                ipm=this._iconPosMap;
            var ns=this,arr=[],getItem=function(){return ns._getItem.apply(ns,arguments);}

            arr.push('<h1><img src="img/work.gif" style="vertical-align: bottom;margin-right:4px;">'+obj.key+'</h1>');
            arr.push('<div>')
            if(obj.parent){
                obj.parent.sort();
                arr.push('<h2 id="'+key+'._parent'+'" class="inherite"><span class="xui-custom-cmd"></span>'+xui.getRes('app.supCls')+'</h2>');
                arr.push('<div class="xui-custom-block">')
                xui.arr.each(obj.parent,function(o){
                    arr.push('<div class="p"><a href="#!'+o+'"><div><span class="xui-custom-icon" style="background-position:' +ipm.cls+';"></span>'+ o +'</div></a></div>');
                });
                arr.push('</div>')
            }
            if(obj.children){
                obj.children.sort();
                arr.push('<h2 id="'+key+'._children'+'" class="inherite"><span class="xui-custom-cmd"></span>'+xui.getRes('app.subCls')+'</h2>');
                arr.push('<div class="xui-custom-block">')
                xui.arr.each(obj.children,function(o){
                    arr.push('<div class="p"><a href="#!'+o+'"><div><span class="xui-custom-icon" style="background-position:' +ipm.cls+';"></span>'+ o +'</div></a></div>');
                });
                arr.push('</div>')
            }
            if(this.$CLS_FUN[key]){
                arr.push('<h2 id="'+key+'._global'+'" class="notice"><span class="xui-custom-cmd"></span>'+xui.getRes('app.gFun')+'</h2>');
                arr.push('<div class="xui-custom-block">');
                arr.push(getItem(ipm.fun, obj.key + ' ' + this._getFunArgs(xui.SC.get(obj.key)), obj.key));
                arr.push('</div>')
            }

            if(this.$CLS_STATIC[key]){
                arr.push('<h2 id="'+xui.id()+'" class="notice">&nbsp;&nbsp;&nbsp;&nbsp;'+xui.getRes('app.noCons')+'</h2>');
                arr.push('<div class="xui-custom-block"></div>');
            }

            if(obj.con && !this.$CLS_FUN[key] && !this.$CLS_STATIC[key]){
                arr.push('<h2 id="'+key+'.construcotr'+'" ><span class="xui-custom-cmd"></span>'+xui.getRes('app.constructor')+'</h2>');
                arr.push('<div class="xui-custom-block">');
                arr.push(getItem(ipm.con,obj.key + obj.con, obj.key+'.constructor', null, false));
                arr.push('</div>')
            }
            if(obj.vars){
                obj.vars.sort();
                arr.push('<h2 id="'+key+'._staticP'+'" ><span class="xui-custom-cmd"></span>'+xui.getRes('app.staticProperties')+'</h2>');
                var a1=[],a2=[],tt;
                xui.arr.each(obj.vars,function(o){
                    tt=key + dot + o;
                    a1.push(getItem(ipm.mem,o, tt, tt, false));
                    a2.push("<a id='short-abc' href='#!"+tt+"' >"+o+"</a> &nbsp;&nbsp;&nbsp;");
                });
                arr.push('<div class="xui-custom-block">'+'<div class="xui-custom-list">'+a2.join('')+'</div>'+a1.join('')+'</div>')
            }
            if(obj.funs){
                arr.push('<h2 id="'+key+'._staticM'+'" ><span class="xui-custom-cmd"></span>'+xui.getRes('app.staticMethods')+'</h2>');
                arr.push('<div class="xui-custom-block">');
                if(obj.funs.self){
                    obj.funs.self.sort();
                    var a1=[],a2=[],tt;
                    xui.arr.each(obj.funs.self,function(o){
                        tt=key + dot + o[0];
                        a1.push(getItem(ipm.fun,o[1], tt));
                        a2.push("<a id='short-abc' name='"+tt+"._list' href='#!"+tt+"' >"+o[0]+"</a> &nbsp;&nbsp;&nbsp;");
                    });
                    arr.push('<div class="xui-custom-list">'+a2.join('')+'</div>'+a1.join(''))
                }
                for(var i in obj.funs){
                    if(i!='self'){
                        arr.push('<h3 id="'+key+'._staticM.'+i.replace(/\./g,'_')+'"><span class="xui-custom-cmd"></span>'+xui.getRes('app.inhFrom')+' '+i+'</h3>');
                        obj.funs[i].sort();
                        var a1=[],a2=[],tt;
                        xui.arr.each(obj.funs[i],function(o){
                            tt=i + dot + o[0];
                            a1.push(getItem(ipm.fun,o[1], tt, key+dot+o[0]));
                            tt=key + dot + o[0];
                            a2.push("<a id='short-abc' name='"+tt+"._list' href='#!"+tt+"' >"+o[0]+"</a> &nbsp;&nbsp;&nbsp;");
                        });
                        arr.push('<div class="xui-custom-block">'+'<div class="xui-custom-list">'+a2.join('')+'</div>'+a1.join('')+'</div>')
                    }
                }
                arr.push('</div>');
            }
            if(obj.provars){
                obj.provars.sort();
                arr.push('<h2 id="'+key+'._prototypeP'+'" ><span class="xui-custom-cmd"></span>'+xui.getRes('app.insProperties')+'</h2>');
                var a1=[],a2=[],tt;
                xui.arr.each(obj.provars,function(o){
                    tt=key + pdot + o;
                    a1.push(getItem(ipm.mem,o, tt, tt,false));
                    a2.push("<a id='short-abc' href='#!"+tt+"' >"+o+"</a> &nbsp;&nbsp;&nbsp;");
                });
                arr.push('<div class="xui-custom-block">'+'<div class="xui-custom-list">'+a2.join('')+'</div>'+a1.join('')+'</div>')
            }
            if(obj.profuns){
                arr.push('<h2 id="'+key+'._prototype'+'" ><span class="xui-custom-cmd"></span>'+xui.getRes('app.insMethods')+'</h2>');
                arr.push('<div class="xui-custom-block">');
                if(obj.profuns.self){
                    obj.profuns.self.sort();
                    var a1=[],a2=[],tt;
                    xui.arr.each(obj.profuns.self,function(o){
                        tt=key + pdot + o[0];
                        a1.push(getItem(ipm.fun,o[1], tt));
                        a2.push("<a id='short-abc' name='"+tt+"._list' href='#!"+tt+"' >"+o[0]+"</a> &nbsp;&nbsp;&nbsp;");
                    });
                    arr.push('<div class="xui-custom-list">'+a2.join('')+'</div>'+a1.join(''))
                }
                for(var i in obj.profuns){
                    if(i!='self'){
                        arr.push('<h3 id="'+key+'._prototype.'+i.replace(/\./g,'_')+'" ><span class="xui-custom-cmd"></span>'+xui.getRes('app.inhFrom')+' ' +i+'</h3>');
                        obj.profuns[i].sort();
                        var a1=[],a2=[],tt;
                        xui.arr.each(obj.profuns[i],function(o){
                            tt=i + pdot + o[0];
                            a1.push(getItem(ipm.fun,o[1], tt,key+pdot+o[0]));
                            tt=key + pdot + o[0];
                            a2.push("<a id='short-abc' name='"+tt+"._list' href='#!"+tt+"' >"+o[0]+"</a> &nbsp;&nbsp;&nbsp;");
                        });
                        arr.push('<div class="xui-custom-block">'+'<div class="xui-custom-list">'+a2.join('')+'</div>'+a1.join('')+'</div>')
                    }
                }
                arr.push('</div>')
            }
            if(obj.events){
                arr.push('<h2 id="'+key+'._event'+'" ><span class="xui-custom-cmd"></span>'+xui.getRes('app.events')+'</h2>');
                arr.push('<div class="xui-custom-block">');
                arr.push('<div>'+SPA.getDoc(obj.key=='xui.Dom'?'xui.Dom.Events':'xui.UI.Events')[0] +'</div>');

                if(obj.events.self){
                    obj.events.self.sort();
                    var a1=[],a2=[],tt;
                    xui.arr.each(obj.events.self,function(o){
                        tt=key + pdot + o[0];
                        a1.push(getItem(ipm.event,o[1], tt, tt));
                        a2.push("<a id='short-abc' name='"+tt+"._list' href='#!"+tt+"' >"+o[0]+"</a> &nbsp;&nbsp;&nbsp;");
                    });
                    arr.push('<div class="xui-custom-list">'+a2.join('')+'</div>'+a1.join(''))
                }
                for(var i in obj.events){
                    if(i!='self'){
                        obj.events[i].sort();
                        var a1=[],a2=[],tt;
                        arr.push('<h3 id="'+key+'._event.'+i.replace(/\./g,'_')+'" ><span class="xui-custom-cmd"></span>'+xui.getRes('app.inhFrom')+' ' +i+'</h3>');
                        xui.arr.each(obj.events[i],function(o){
                            tt=i + pdot + o[0];
                            a1.push(getItem(ipm.event,o[1], tt,key+pdot+o[0]));
                            tt=key + pdot + o[0];
                            a2.push("<a id='short-abc' name='"+tt+"._list' href='#!"+tt+"' >"+o[0]+"</a> &nbsp;&nbsp;&nbsp;");
                        });
                        arr.push('<div class="xui-custom-block">'+'<div class="xui-custom-list">'+a2.join('')+'</div>'+a1.join('')+'</div>')
                    }
                }
                arr.push('</div>');
            }
            arr.push('</div>')

            if(obj.$abstract)
              arr.push('<h3 id="'+xui.id()+'"> ==== Abstract Virtual Class or Inner Class ==== </h3>');

            return arr.join('');
        },
        _iconPosMap:{
            cls:'left -16px',
            con:'left -145px',
            fun:'left -48px',
            hash:'left top',
            arr:'left -128px',
            mem:'left -96px',
            event:'left -32px',
            close:'left -160px',
            open: 'left -176px'
        },
        _parse:function(id){
            var o = xui.SC.get(id), cls, key, obj={},
                // deprecated
                deprecated={getCom:1,newCom:1,showCom:1,getComFromCache:1,setCom:1,storeCom:1,prepareComs:1},

            filter=function(s,o){
                var me=arguments.callee,
                    h=me.h||(me.h={upper:1,Constructor:1,Before:1,After:1,prototype:1}),
                    c=s.charAt(0);

                if(deprecated[s])return false;
                if(s=='KEY')return false;
                if(c=='_'||c=="$")return false;
                if(/\./.test(s))return false;
                if(h[s])return false;
                if(o && o.$xui$)return false;
                return true;
            };
            if(!o)return '';

            if(typeof o == 'function' && o.$xui$)cls=true;
            obj.key = id;

            if(cls){
                xui.arr.each(o.$parent,function(o,i){
                    if(!obj.parent)obj.parent=[];
                    obj.parent.push(o.KEY);
                });
                xui.arr.each(o.$children,function(o){
                    if(!obj.children)obj.children=[];
                    obj.children.push(o);
                });
                if(o.$abstract)
                    obj.$abstract=o.$abstract;
                else{

                    obj.con = this._getFunArgs(o);

                    key = o.KEY;
                    for(var i in o){
                        if(filter(i,o[i])){
                            if(typeof o[i]=='function'){
                                if(!obj.funs)obj.funs={};
                                if((!o[i].$original$) || o[i].$original$==key){
                                    if(!obj.funs.self)obj.funs.self=[];
                                    obj.funs.self.push([i, this._getFunArgs(o,i)]);
                                }else{
                                    if(!obj.funs[o[i].$original$])obj.funs[o[i].$original$]=[];
                                    obj.funs[o[i].$original$].push([i,this._getFunArgs(o,i)]);
                                }
                            }else{
                                if(!obj.vars)obj.vars=[];
                                obj.vars.push(i);
                            }
                        }
                    }

                    o=o.prototype;
                    for(var i in o){
                        if(filter(i,o[i])){
                            if(typeof o[i]=='function'){
                                if(o[i].$event$){
                                    if(!obj.events)obj.events={};
                                    if((!o[i].$original$) || o[i].$original$==key){
                                        if(!obj.events.self)obj.events.self=[];
                                        obj.events.self.push([i,this._getFunArgs(o.constructor.$EventHandlers||o,i)]);
                                    }else{
                                        if(!obj.events[o[i].$original$])obj.events[o[i].$original$]=[];
                                        obj.events[o[i].$original$].push([i, this._getFunArgs(o.constructor.$EventHandlers||o,i)]);
                                    }
                                }else{
                                    if(!obj.profuns)obj.profuns={};
                                    if((!o[i].$original$) || o[i].$original$==key){
                                        if(!obj.profuns.self)obj.profuns.self=[];
                                        obj.profuns.self.push([i, this._getFunArgs(o,i)]);
                                    }else{
                                        if(!obj.profuns[o[i].$original$])obj.profuns[o[i].$original$]=[];
                                        obj.profuns[o[i].$original$].push([i, this._getFunArgs(o,i)]);
                                    }
                                }
                            }else{
                                if(!obj.provars)obj.provars=[];
                                obj.provars.push(i);
                            }
                        }
                    }
                    //add xui.Com event
                    if(o.KEY=='xui.Com'||o.KEY=='xui.Module'){
                        if(!obj.events)obj.events={};
                        if(!obj.events.self)obj.events.self=[];
                        var es=xui.Module.$EventHandlers;
                        for(var i in es){
                            o=es[i];
                            obj.events.self.push([i,this._getFunArgs(es,i)]);
                        }
                    }
                }
            }else{
                for(var i in o){
                    if(filter(i,o[i])){
                        if(typeof o[i]=='function'){
                            if(!obj.funs)obj.funs = {self:[]};
                            obj.funs.self.push([i, this._getFunArgs(o,i)]);
                        }else{
                            if(!obj.vars)obj.vars=[];
                            obj.vars.push(i);
                        }
                    }
                }
                if(o.prototype){
                    o=o.prototype;
                    for(var i in o){
                        if(!obj.profuns)obj.profuns = {self:[]};
                        obj.profuns.self.push([i, this._getFunArgs(o,i)]);
                    }
                }
            }
            return  obj ;
        },
        _clickForToggle:function(p,e,s,n){
            var f=SPA._clickForToggle,ff=SPA._clickForLoca, ics=SPA._iconPosMap, ths=xui(s);
            if(xui.Event.getSrc(e).nodeName=='A')return;
            var a=ths.next(),b,ta,t,id;
            if(xui.use(s).get(0).nodeName=='H4'){
                ta=a.query('textarea');
                if(!ta.isEmpty())
                    ta.each(function(o){
                        if(o.id!='code')return;
                        t=xui([o]);
                        o=xui.str.toDom(xui.Coder.formatAll(t.text(), 'js', ['plain','run']));
                        t.replace(o);
                    });
            }
            if(s.nodeName=='H2'){
                if(!s.__set){
                    ths.next().query('h4').css('cursor','pointer').onClick(f).first().css('backgroundPosition',ics.close);
                    ths.next().query('*','id','short-abc').onClick(ff);
                    s.__set=1;
                }
            }
            a.css('display', (b=a.css('display')=='none')?'block':'none' );
            ths.first().css('backgroundPosition', b?ics.open:ics.close);
        },
        _clickForLoca:function(){
            var a=this,
                id = a.href.split(/#[!]?/)[1],
                node = xui([this]).parent(2).query('a','name',id).next().first();
            if(!node.isEmpty()){
                node.animate({opacity:[0,1]}, 0,0, 500).start();
                if(node.next().css('display')=='none')node.onClick();
            }
        },
        _iq1_afteruivalueset:function (profile,ov,v) {
            if(SPA.$v==v)return;
            xui.resetRun('__a__',function(){
                SPA.$v=v;
                SPA.RefreshQ(1,v);
            },500);
        },
        _iq2_afteruivalueset:function (profile,ov,v) {
            if(SPA.$v==v)return;
            xui.resetRun('__a__',function(){
                SPA.$v=v;
                SPA.RefreshQ(2,v);
            },500);
        },

        RefreshQ:function(type1,v,type2){
            var pool;
            if(!(pool=SPA.$api_pool))
                pool=SPA.indexing();

            if(!v){
                if(SPA.iQ1.getUIValue())
                    SPA.iQ1.setValue('',true);
                if(SPA.iQ2.getUIValue())
                    SPA.iQ2.setValue('',true);

                SPA.listQ.setItems([]);

                SPA.pbQ.setValue('1:1:1');
            }else{
                var arr=[],s,hash={};
                if(type1==1){
                    if(SPA.iQ2.getUIValue())SPA.iQ2.setValue('',true);
                }else{
                    if(SPA.iQ1.getUIValue())SPA.iQ1.setValue('',true);
                }
                xui.each(pool,function(o,i){
                    if(i.toLowerCase().indexOf(v.toLowerCase())!=-1){
                        hash[i]=1;
                        s=(o&&o.$desc)||'';
                        if(s.indexOf('<')!=-1) s=s.split('<')[0];
                        if(s.length>50)s=s.slice(0,50)+'...';
                        arr.push({id:i,caption:'<font style="color:#d00000">'+i.replace(/(.*)(\.prototype\.)(.*)/,'$3&nbsp;&nbsp;$1').replace(/^([\w\.]*)/,'<b>$1</b>') +'</font><br />&nbsp;&nbsp;'+s})
                    }
                });

                if(type1==2){
                    // find in $desc
                    xui.each(pool,function(o,i){
                        if(hash[i])return;

                        s=(o&&o.$desc)||'';
                        if(s && s.toLowerCase().indexOf(v.toLowerCase())!=-1){
                            hash[i]=1;

                            if(s.indexOf('<')!=-1) s=s.split('<')[0];
                            if(s.length>50)s=s.slice(0,50)+'...';
                            arr.push({id:i,caption:'<font style="color:#134275">'+i.replace(/(.*)(\.prototype\.)(.*)/,'$3&nbsp;&nbsp;$1').replace(/^([\w\.]*)/,'<b>$1</b>') +'</font><br />&nbsp;&nbsp;'+s})
                        }
                    });
                    // find in $paras
                    xui.each(pool,function(o,i){
                        if(hash[i])return;

                        xui.arr.each(o && o.$paras,function(s){
                            if(s && s.toLowerCase().indexOf(v.toLowerCase())!=-1){
                                s=(o&&o.$desc)||'';
                                if(s.indexOf('<')!=-1) s=s.split('<')[0];
                                if(s.length>50)s=s.slice(0,50)+'...';
                                arr.push({id:i,caption:'<font style="color:#d2691e">'+i.replace(/(.*)(\.prototype\.)(.*)/,'$3&nbsp;&nbsp;$1').replace(/^([\w\.]*)/,'<b>$1</b>') +'</font><br />&nbsp;&nbsp;'+s})
                                return;
                            }
                        });
                    });
                }

                SPA.$Qresult=arr;

                var page=Math.ceil(arr.length / 20);
                SPA.pbQ.setValue('1:1:'+page);
                SPA.listQ.setItems(arr.slice(0,20));
            }
        },
        getDoc:function(key){
            if(!key)return ['',''];

            // handle deprecated functions
            key = SPA._deprecatedFuns[key]||key;
            // handle deprecated classes
            xui.each(SPA._deprecatedClasses,function(o,i){
                key = key.replace(i, o);
            });

            var o = xui.getRes("doc."+key);
            if(typeof o == 'string')
                return [o,o];
            return this.buildDoc(o);
        },
        buildDoc:function(o){
            var arr=[];
            if(o){
                if(o.$rtn)
                    arr.push('<div class="inndiv">' + '<strong>'+xui.getRes('app.retV')+': </strong>' + o.$rtn + '</div>');
                if(o.$paras){
                    arr.push('<div class="inndiv">' + '<div><strong>'+xui.getRes('app.param')+': </strong></div><ul>');
                    xui.arr.each(o.$paras,function(v){
                        v=v.replace(/^([^:\[]*)([^:]*):(.*)$/,"<strong>$1</strong> $2 : $3");
                        arr.push('<li> ' + v + ' </li>');
                    })
                    arr.push("</ul></div>");
                }

                if(o.$snippet){
                    arr.push('<div class="inndiv">' + '<div><strong>'+xui.getRes('app.codesnip')+': </strong></div>');
                    xui.arr.each(o.$snippet,function(v){
                        arr.push('<textarea id="code" class="js plain-run">' + v + '</textarea><p>&nbsp;</p>');
                    })
                    arr.push("</div>");
                }
                if(o.$memo)
                    arr.push('<div class="inndiv">' + '<strong>'+xui.getRes('app.memo')+': </strong>' + o.$memo + '</div>');

                if(o.$links){
                    arr.push('<div class="inndiv">' + '<div><strong>'+xui.getRes('app.seealso')+': </strong></div><ul>');
                    xui.arr.each(o.$links,function(v){
                        arr.push('<li><a target="'+(v[2]||'')+'" href="' +v[1]+ '">' + v[0] + '</a></li>');
                    })
                    arr.push("</ul></div>");
                }
            }
            return [o.$desc, arr.join('')];
        },
        __itemsel:function(profile, item, e, src, type){
            xui.History.setFI("#"+item.href);
        },
        _listq_onitemselected:function (profile, item) {
            xui.History.setFI("#"+item.id);
        },
        _pbq_onclick:function (profile, page) {
            var arr=SPA.$Qresult;
            if(!arr)return;
            SPA.listQ.setItems(arr.slice((page-1)*20, page*20));
            profile.boxing().setPage(page);
            return false;
        },
        indexing:function(){
            var t,
                doc=xui.Locale[xui.getLang()].doc,
                map1={_:1,$:1},
                map2={prototype:1,constructor:1,toString:1,valueOf:1,upper:1,Constructor:1,After:1,Before:1,KEY:1},
                reg=/\./,
                hash={},
                getAPI=function(o,tag){
                    var k=o.KEY;
                    for(var i in o){
                        if(!map1[i.charAt(0)] && !map2[i] && !reg.test(i)){
                            if(typeof o[i]=='function'&& o[i].$xui$)
                                getAPI(o[i],tag+'.'+i);
                            else{
                                if(typeof (t=o[i])!='function' || !(t=t.$original$) || t==k)
                                    hash[tag+'.'+i]=1;
                            }
                        }
                    }
                    o=o.prototype;
                    if(o){
                        for(var i in o)
                            if(!map1[i.charAt(0)])
                                if(typeof (t=o[i])=='function' && (!(t=t.$original$) || t==k))
                                    hash[tag+'.prototype.'+i]=1;
                    }
                };
            xui.arr.each(['xui','xui.fun','xui.str','xui.arr','xui.Class'],function(o,i){
                hash[o]=1;
                getAPI(xui.SC.get(o),o);
            });
            xui.each(hash,function(o,i){
                o=xui.get(doc,(i+'.').split('.'));
                hash[i]=o;
            });

            /*
            var no={},l=0;
            xui.each(hash,function(o,i){
                l++;
                if(!o)no[i]=1;
            });
            */

            return SPA.$api_pool=hash;
        },
        $S_CLS:{'xui':1,'xui.Class':1,'xui.fun':1,'xui.arr':1,'xui.str':1},
        $CLS_FUN:{'xui':1,'xui.Class':1,'xui.fun':1,'xui.Thread':1,'xui.Ajax':1,'xui.SAjax':1,'xui.IAjax':1,'xui.SC':1},
        $CLS_STATIC:{'xui':1,'xui.fun':1,'xui.Thread':1,'xui.Ajax':1,'xui.SAjax':1,'xui.IAjax':1,'xui.SC':1,'xui.Event':1,'xui.DragDrop':1,'xui.CSS':1,'xui.History':1,'xui.Cookies':1,'xui.ModuleFactory':1,'xui.Debugger':1,'xui.Date':1,'xui.Tips':1,'xui.Coder':1,'xui.XML':1}
    }
});