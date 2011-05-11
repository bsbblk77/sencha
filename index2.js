Ext.setup({
    onReady: function() {
        var overlayTb = new Ext.Toolbar({
            dock: 'top'
        });

        var overlayBb = new Ext.Toolbar({
            dock: 'bottom',
            items:[
                new Ext.Spacer(),
                {
                  text:'Close',
                  ui:'action',
                  handler:function(){
                    overlay.hide();
                  }
                },
                new Ext.Spacer()
            ]
        });

        var overlay = new Ext.Panel({
          floating: true,
          modal: true,
          closable:true,
          centered: false,
          width: Ext.is.Phone ? 260 : 400,
          height: Ext.is.Phone ? 220 : 400,
          styleHtmlContent: true,
          dockedItems: [overlayBb],
          scroll: 'vertical',
          cls: 'twit',
          tpl:new Ext.XTemplate('<div class="profile-image"><a href="{link}">{title}</a></div><div class="post"><p class="text">{content}</p></div>')
        });


      
        Ext.regModel('Tweet', {
            fields: [{
                name: 'title',
                type: 'string'
            }, {
                name: 'link',
                type: 'string'
            }, {
                name: 'content',
                type: 'string'
            }]
        });
      
      
        //Tweet Model
        var dataView = new Ext.DataView({
            store: new Ext.data.Store({
                autoLoad: true,
                model: "Tweet",
                proxy: {
                    type: 'scripttag',
                    url: 'http://ajax.googleapis.com/ajax/services/feed/load',
                    extraParams: {
                        q: 'http://news.google.com/news?hl=th&ned=us&ie=UTF-8&oe=UTF-8&output=atom&topic=h',
                        v: '1.0',
                        num: '100',
                        hl: 'th',
                        output: 'json-in-script'
                    },
                    reader: {
                        type: 'json',
                        root: 'responseData.feed.entries'
                    }
                }
            }),
            itemSelector:'div.List',
            tpl:[
                '<tpl for=".">',
                  '<tpl if="values.index % 6 == 1">',
                    '<br/>',
                    '<div style="clear:both"></div>',
                  '</tpl>',
                  '<div class="List">',
                    '<div class="body">',
                       '{title}',
                    '</div>',
                  '</div>',
                '</tpl>'
            ],
            listeners:{
                itemtap:function(view,index,el,e){
                    var record = view.getStore().getAt(index);
                    overlay.setCentered(true);
                    overlayTb.setTitle('Attached Overlay');
                    console.debug(record.data);
                    overlay.update(overlay.tpl.apply(record.data));
                    overlay.show('pop');
                }
            }
        });


        var tabpanel  = new Ext.TabPanel({
            tabBar:{
               dock: 'bottom',
               layout:{
                      pack: 'center'
                }
             },
            
            fullscreen: true,
            defaults:{
               scroll: 'vertical'
            },
            items:dataView
        });

        
    }
});
