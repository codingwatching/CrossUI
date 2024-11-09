xui.Class("xui.UI.ProgressBar", ["xui.UI.Widget","xui.absValue"] ,{
    Instance:{
        _setCtrlValue:function(value){
            return this.each(function(profile){
                var type=profile.properties.type,
                    inn=profile.getSubNode('FILL');
               if(type=="horizontal"){
                    inn.width(value+"%");
                }else{
                    inn.top((100-value)+"%").height(value+"%");
                }
                profile.getSubNode('CAP').text(profile.properties.captionTpl.replace(/\{value\}|\*/g,value));
            });
        }
    },
    Initialize:function(){
        var self=this,
            t = self.getTemplate();
        //modify
        xui.merge(t.FRAME.BORDER,{
            className:"xui-uiborder-flat xui-uiborder-radius xui-uibase",
            FILL:{
                tagName:'div',
                style:'{fillBG}',
                className:'xui-uibar',
                text:'{html}'+xui.UI.$childTag
            },
            INN:{
                $order:2,
                tagName:'div',
                CAP:{
                    tagName:'div'
                }
            }
        },'all');
        //set back
        self.setTemplate(t);

        //get default Appearance
        t = self.getAppearance();
        //modify
        xui.merge(t,{
            BORDER:{
                overflow:'hidden'
            },
            INN:{
                display:'table',
                position:'absolute',
                left:0,
                top:0,
                width:'100%',
                height:'100%'
            },
            CAP:{
                'text-align':'center'
            },
            FILL:{
                border:'none',
                position:'relative',
                width:0,
                height:0,
                left:0,
                top:0
            }
        });
        //set back
        self.setAppearance(t);
    },
    Static:{
        DataModel:{
            value:0,
            isFormField:{
                ini:false
            },
            width:{
                $spaceunit:1,
                ini:'25em'
            },
            height:{
                $spaceunit:1,
                ini:'1.5em'
            },
            captionTpl:{
                ini:'* %',
                action:function(){
                    this.boxing()._setCtrlValue(this.properties.$UIvalue);
                }
            },
            type:{
                listbox:['vertical', 'horizontal'],
                ini:'horizontal',
                action:function(v){
                    var w=this.properties.width,h=this.properties.height;
                    this.properties.height=w;this.properties.width=h;
                    this.boxing().refresh();
                }
            },
            fillBG:{
                ini:'',
                format:'color',
                action:function(v){
                    this.getSubNode('FILL').css('background',v);
                }
            },
            $hborder:1,
            $vborder:1
        },
        LayoutTrigger:function(){
            var v=this.properties,nd=this.getSubNode("BORDER");
            v.$hborder=v.$vborder=nd._borderW('left');
        },
        _prepareData:function(profile){
            var data=arguments.callee.upper.call(this, profile);
            data.fillBG = data.fillBG?'background:'+data.fillBG:'';
            return data;
        },
        _ensureValue:function(profile,value){
            return Math.max(0, Math.min(100, ((/^\s*\=/.test(value||"")) ? xui.ExcelFormula.calculate(value||"") : parseInt(value,10)) || 0));
        },
        _syncResize:true,
        _onresize:function(profile,width,height){
            var size = arguments.callee.upper.apply(this,arguments),v,
                p=profile.properties,
                us = xui.$us(profile),
                adjustunit = function(v,emRate){return profile.$forceu(v, us>0?'em':'px', emRate)},
                root = profile.getRoot(),
                inn = profile.getSubNode('INN'),
                cap = profile.getSubNode('CAP'),
                fill = profile.getSubNode('FILL'),

                fzrate=profile.getEmSize()/root._getEmSize(),
                innfz=inn._getEmSize(fzrate),
                capfz=cap._getEmSize(fzrate),
                fillfz=fill._getEmSize(fzrate);

            // caculate by px
            if(size.width && size.width!='auto')size.width=profile.$px(size.width);
            if(size.height && size.height!='auto')size.height=profile.$px(size.height);

            if(p.type=="horizontal"){
                if(size.height){
                    v=adjustunit(size.height, innfz);
                    inn.css({'line-height':v});

                    v=adjustunit(size.height, fillfz);
                    fill.css({height:v,'line-height':v});

                    v=adjustunit(size.height, capfz);
                    cap.css({height:v,'line-height':v});
                }
            }else{
                if(size.width){
                    //inn.css({width:adjustunit(size.width, innfz)});
                    fill.css({width:adjustunit(size.width, fillfz)});
                    cap.css({width:adjustunit(size.width, capfz)});
                }
                if(size.height){
                    inn.css({'line-height':adjustunit(size.height, innfz)});
                    fill.css({'line-height':adjustunit(size.height, fillfz)});
                    cap.css({'line-height':adjustunit(size.height, capfz)});
                }
            }
        }
    }
});