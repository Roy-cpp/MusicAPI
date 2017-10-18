//频道视图
var ChannelView = Backbone.View.extend({
    initialize: function () {
        this.render();
        $.getJSON('http://api.jirengu.com/fm/getChannels.php',function(data){
            this.dataForPage(data.channels)
        }.bind(this))
    },
    render: function () {
        this.$el.html(`
        <div class="container">
        <div class="panel panel-primary">
            <div class="panel-heading">
            <h3 class="panel-title">私人FM</h3>
            </div>
            <div class="panel-body">
                <div id="channelList">

                </div>
            </div>
        </div>
    </div>
        `)
        return this;
    },
    dataForPage:function(data){
        var strHtml='';
        data.forEach(function(item) {
            strHtml+=`
                <div class="col-md-3 col-sm-3 col-xs-6 text-center">
                <div class="thumbnail">
                <h2><a href="#song/${item.channel_id}">${item.name }</a></h2>
                </div>
            </div>
            `
        });
        $('#channelList').html(strHtml)
    }
})
//歌曲视图
var SongView = Backbone.View.extend({
    initialize: function () {
        //渲染基本页面
        this.render();
        //请求歌曲数据
        $.getJSON('http://api.jirengu.com/fm/getSong.php', { 'channel': this.id }, function (data) {
            // console.log(data)
            //解析请求到的数据,然后添加到已经渲染的页面
            this.dataForPage(data.song)
            //获取播放器
            this.audio = this.$el.find('#player')[0]
            // $(this.audio).removeAttr('src');
        }.bind(this));

    },
    events: {
        'click #play': 'playMusic',
        'click #pause': 'pauseMusic',
        'click #next': 'nextMusic'
    },
    playMusic: function () {
        if (!!$(this.audio).attr('src')) {
            this.audio.play();
        } else {
            this.audio.src = this.$el.find('.song').attr('data-url')
            this.audio.play()
        }
    },
    pauseMusic: function () {
        this.audio.pause()
    },
    nextMusic: function () {
        // 点击下一曲，需要重置audio的src，或者直接删除src属性。播放时，根据src的有或者无，来决定是暂停还是第一次播放
        $(this.audio).removeAttr('src');
        // 点击下一曲需要重新刷新歌曲
        $.getJSON('http://api.jirengu.com/fm/getSong.php', { "channel": this.id }, function (data) {
            // console.log(data.song);
            // 解析请求到的数据，然后添加到已经渲染的页面上
            this.dataForPage(data.song);
            // 在歌曲渲染到页面上之后，再开始播放
            this.playMusic();
        }.bind(this));
    },
    render: function () {
        this.$el.html(`
        <div class="container">
        <div class="panel panel-primary">
            <div class="panel-heading">
            <h3 class="panel-title">歌曲</h3>
            </div>
            <div class="panel-body">
            <audio id="player"></audio>
                  <div style="margin:20px 0">
                    <button id="play" class="btn btn-primary">播放</button>
                    <button id="pause" class="btn btn-info">暂停</button>
                 <button id="next" class="btn btn-danger">下一曲</button>
                 </div>
                <div id="songList">
                   
                </div>
            </div>
        </div>
    </div>
        `)
        return this;
    },
    dataForPage: function (data) {
        console.log(data)
        var strHtml = '';
        data.forEach(function (item) {
            strHtml += `
            <div class="col-md-3 col-sm-3 col-xs-6 text-center">
            <div class="thumbnail song" data-url="${item.url}">
                <img src="${item.picture}" class="img-thumbnail img-responsive">
                <h2>${item.title}</h2>
            </div>
        </div>

            `
        });
        $('#songList').html(strHtml)
    }
})

var R=Backbone.Router.extend({
    routes:{
        '':'index',
        'song/:id':'song'
    },
    index:function(){
        var page=new ChannelView();
        $('#app').html(page.el)
    },
    song:function (id) {
        var songView=new SongView({id:id});
        $('#app').html(songView.el)
    }
})
var r=new R();
Backbone.history.start()