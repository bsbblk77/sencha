Ext.setup({
    icon: 'icon.png',
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    glossOnIcon: false,
    onReady: function() {

        var tabpanel,home,twitter,rss

// Twitter Update
          refresh = function(button,event){
           Ext.util.JSONP.request({
                url: 'http://search.twitter.com/search.json',
                callbackKey: 'callback',
                params: {
                    q: 'แมนยู',
                    rpp: 50,
                    uniqueify: Math.random()
                },
                callback: function(data) {
                    data = data.results;
                    twitter.update(data);
                }
          });
         }

//refresh button
        var butRefresh = {
            iconCls:'refresh',
            iconMask: true,
            handler: refresh
        };
        var refreshbar={
            xtype: 'toolbar',
            dock: 'top',
            title: 'Twitter',
            items: [
             { xtype: 'spacer'},
             butRefresh
            ]
        };
         
//HOME  
        var homebar={
              xtype: 'toolbar',
              dock: 'top',
              title: "Home",
              items:[ 
                { xtype: 'spacer'},
              ]
        };
        home =new Ext.Panel({
          title:"Home",
          iconCls:'home',
          html: "<div align='center' class='tweet'><b>FEMTOCOM</b></div>  <div align='center' class='tweet-content'></br><p align='left'>	Femtocom aims to give the all-around technology services including Hardware, Software and Network Management as well as Database Management.</br> The company has the mission to be the leader of system set up for business firms and consulting for effective use of technology for more than 10 years. Our teams are professional and expert in many systems and platforms including Technical Support and Training.</br> Our services focus on needs of customers and ensure trendy technology with solution for most effective price.</br></br><b> Product Services:</b> Desktops and Laptops, Servers, Storage, Network Switch, Printer and Scanner, Microsoft Software. </br></br><b> IT Services:</b> Network and server system design, IT Planning and implementation, Security services, IT documentation services, Project management, Data Storage, Audit License Service, Programming and Software Development.</br> </br> <b> Partners:</b> HP, Microsoft, IBM, Dell, 3COM, Cisco, Fujitsu, Adobe, Symantec, Rackus, Nokia CheckPoint. </p></div>",
        
          dockedItems: homebar
        });
// Twitter show content
            
            twitter= new Ext.Panel({
              title:"Twitter",
              iconCls:'favorites',
              cls: 'cardt',
              dockedItems: refreshbar,
              tpl: [ 
                
                '<tpl for=".">',
                    '<div class="tweet">',
                           '<div class="avatar"><img src="{profile_image_url}" /></div>',
                            '<div class="x-tweettanchor"></div>',
                            '<div class="tweet-bubble">',
                            '<div class="tweet-content">',
                                '<h2>{from_user}</h2>',
                                '<p>{text}</p>',
                            '</div>',
                            '</div>',
                    '</div>',
                '</tpl>',
              ]
            });
           
        
//Overlay pop up Feed
     
      var overlayTbr = new Ext.Toolbar({
          dock: 'top',
      });

      var overlayBbr = new Ext.Toolbar({
          dock: 'bottom',
          ui:'dark',
          items:[
             new Ext.Spacer(),
             {
                 text:'Close',
                 ui:'action',
                 handler:function(){
                         overlayr.hide();
                 }
             },
             new Ext.Spacer()
         ]
      });

     var overlayr = new Ext.Panel({
         floating: true,
         fullscreen: true,
         styleHtmlContent: true,
         dockedItems: [overlayBbr,overlayTbr],
         scroll: 'vertical',
         tpl:new Ext.XTemplate(
           '<div class="profile-image">',
              '<a href="{link}">{title}</a>',
           '</div>',
           '<div class="post">',
           '<p class="text">{content}</p>',
           '</div>'),
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
// Dataview NewFeed
      var butRss = {
        iconCls:'refresh',
        iconMask: true,
      };
 
      var rssbar={
            xtype: 'toolbar',
            dock: 'top',
            title: 'NewFeed',
            scroll: false,
            items: [
             { xtype: 'spacer'},
             butRss
            ]
        };
     var rssFeed  = new Ext.DataView({
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
            tpl:new Ext.XTemplate(
                '<tpl for=".">',
                  '<div class="List">',
                    '<li>',
                     '<div class="body">',
                       '{title}',
                     '</div>',
                     '</li>',
                  '</div>',
                '</tpl>'
            ),
            listeners:{
                itemtap:function(view,index,el,e){
                    var record = view.getStore().getAt(index);
                    overlayr.setCentered(true);
                    overlayTbr.setTitle('News');
                    console.debug(record.data);
                    overlayr.update(overlayr.tpl.apply(record.data));
                    overlayr.show();
                }
            },
            scroll:false
      });
      var rss = new Ext.Panel({
          title: "News",
          iconCls: 'info',
          cls: 'cardt',
          scroll: false,
          dockedItems: rssbar,
          items:rssFeed
      });

//Contact
      var tpl = Ext.XTemplate.from('guests');

                Ext.regModel('User', {
            fields: [
                { name: 'id',       type: 'string' },
                { name: 'name',     type: 'string' },
                { name: 'email',    type: 'string' },
                { name: 'to',       type: 'string' },
                { name: 'subject',  type: 'string' },
                { name: 'message',  type: 'string' }
            ]
        });
                
           var formBase =  new Ext.form.FormPanel({
            scroll: 'vertical',
            url   : 'server.php',
            standardSubmit : false,
            title: 'Contract',
            items: [{
                xtype: 'fieldset', 

                instructions: 'Please complete the information.',
                defaults: {
                    labelAlign: 'left',
                    labelWidth: '40%'
                }, 
                items: [
                    {
                    xtype: 'textfield',
                    name : 'name',
                    label: 'Name',
		    cls: 'tweet-content',
                    useClearIcon: true,
                    placeHolder:'',
                    autoCapitalize : false
                }, {
                    xtype: 'emailfield',
                    name : 'email',
                    label: 'Email',
		    cls: 'tweet-content',
                    placeHolder: '',
                    useClearIcon: true
                },
                
                 {
                    xtype: 'textfield',
                    name : 'subject',
                    label: 'Subject',
		    cls: 'tweet-content',
                    placeHolder: '',
                    useClearIcon: true
                }, {
                    xtype: 'textareafield',
                    name : 'message',
                    label: 'Message',
		    cls: 'tweet-content',
                    maxLength: 50,
                    maxRows: 50,
                    height: 200
                }]
            }],

             dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                title: 'Contact',
                items: [{
                    xtype: 'spacer'
                }, {
                    text: 'Send',
                    ui: 'confirm',
                    handler: function() {
                        formBase.submit({
                            waitMsg: {
                                message:'Submitting',
                                cls : 'demos-loading'
                            },
                            success: function(e) {
                                showCenteredOverlay();
                                formBase.reset();
                            }
                        });
                    }
                }]
            }]
        });
         var overlayTb = new Ext.Toolbar({
            dock: 'bottom'
        });

        var overlay = new Ext.Panel({
            floating: true,
            modal: true,
            centered: true,
            width: Ext.is.Phone ? 260 : 400,
            height: 60,
            dockedItems: overlayTb
        });

        var showCenteredOverlay = function() {
            overlayTb.setTitle('Email Has Been Sent');
            overlay.show();
        };

        function showRecent() {
            Ext.Ajax.request({
                url: 'server.php?action=get',
                success: function(e) {
                    var obj = Ext.util.JSON.decode(e.responseText);
                    var guests = obj.guests;
                    if (guests) {
                        var html = tpl.applyTemplate(guests);
                        Ext.getCmp('recentTab').update(html);
                    }
                }
            });
        }
 
      var contact= new Ext.Container({
            title: "Contact",
            iconCls: 'user',
            fullscreen: true,
            type: 'dark',
            sortable: true,
            items: formBase 
        });
//Tab bar add Button

         tabpanel = new Ext.TabPanel({
            tabBar: {
                dock: 'bottom',
                layout: {
                    pack: 'center'
                }
            },
            fullscreen: true,
            cardSwitchAnimation: {
                type: 'slide',
                cover: true
            },
            defaults: {
                scroll:'vertical' 
            },
            items: [ home,twitter,rss,contact]
         });
   refresh();

    }
});
