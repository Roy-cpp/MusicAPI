require.config({
    paths:{
        jquery:'./libs/jquery-3.2.1.min',
        pace:'https://cdn.bootcss.com/pace/1.0.2/pace.min',
        underscore:'./libs/underscore',
        backbone:'./libs/backbone',
        text:'./libs/text',
        template:'./libs/template-web',
        indexHtml:'./tpl/index.html',
        songHtml:'./tpl/music.html'
    },
    shim:{
        jquery:{
            exports:'$'
        },
        underscore:{
            exports:'_'
        },
        backbone:{
            deps:['jquery','underscore'],
            exports:'B'
        }
    }
})

require(['jquery','pace','backbone','template','text!indexHtml','text!songHtml'],function ($,pace,B,template,index,song) {
    var IndexView = B.View.extend({
        el:$('body'),
        initialize:function () {
            this.render()
        },
        template:template.compile(index),
        render:function () {
            $.getJSON('http://api.jirengu.com/fm/getChannels.php ',function (data) {
                this.$el.html(this.template({channels:data.channels}))
            }.bind(this))
            
        },
    })
    


    // $.getJSON('http://api.jirengu.com/fm/getChannels.php',function (data) {
    //     var strHtml = template.render(index,{channels:data.channels});
    //     $('body').html(strHtml)
    // })
    var SongView = B.View.extend({
        el:$('body'),
        initialize:function () {
            this.render();
            
        },
        template:template.compile(song),
        render:function () {
            $.getJSON('http://api.jirengu.com/fm/getSong.php',this.model.id, function (data) {
                this.$el.html(this.template({music:data.song[0]}))
                console.log(data.song[0]);
                // 获取播放器
                this.audio = $('#player')[0];
                this.playMusic();
            }.bind(this))
            
        },
        events:{
            'click #play':'playMusic',
            'click #next':'nextMusic',
            'click #pause':'pauseMusic',
        },
        playMusic:function () {
            // if (this.audio.pause) {
                
            // }
            console.log('11111111111')
            this.audio.play();
        },
        nextMusic:function () {
           this.initialize();
           this.audio.play();
        },
        pauseMusic:function () {
            this.audio.pause();
        }
    })
    var SongModel = B.Model.extend({});
    
    var Router = B.Router.extend({
        routes:{
            '':'index',
            'show/:id':'show'
        },
        index:function () {
            var indexView = new IndexView();
        },
        show:function (id) {

            var songModel = new SongModel({id:id})
            var songView = new SongView({model:songModel});
        }
    })
    var router = new Router();
    B.history.start();
})