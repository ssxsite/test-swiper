<template>
    <div>
        <swiper :list='videoList' :autoPlay="0" :type="'slide'" :paginationVisible="false" :vertical="true"
                :height="swiper_height" :loop="loop" :initPage="video_current"  @change="pageChange" v-if="showPlayer">
            <div  v-for="(item,index) in videoList" :key="index"  class="mui-swiper-slide">
                <div class="video_container">
                    <!--                        style="position: relative;"-->
                    <!--video属性videoList
                         webkit-playsinline ios 小窗播放，使视频不脱离文本流，安卓则无效
                         微信内置x5内核，
                         x5-video-player-type="h5-page" 启用H5播放器,是wechat安卓版特性，添加此属性，微信浏览器会自动将视频置为全屏
                         x5-video-player-fullscreen="true" 全屏设置，设置为 true 是防止横屏
                         x5-video-orientation 控制横竖屏 landscape 横屏，portrain竖屏； 默认portrain
                         poster：封面
                         src：播放地址
                         -->
                    <video class="video_box"
                           webkit-playsinline="true"
                           playsinline="true"
                           x-webkit-airplay="allow"
                           x5-video-player-type="h5-page"
                           preload="auto"
                           :poster="item.cover"
                           :playOrPause="playOrPause"
                           @click="pauseVideo" @ended="onPlayerEnded($event)"
                           :src="item.url"
                    >
                        您的浏览器不支持播放该视频！
                    </video>

                    <!-- 封面 -->
                    <img v-show="isVideoShow" class="play" @click="playvideo" :src="item.cover"/>
                    <!-- 播放暂停按钮 -->
                    <img v-show="iconPlayShow" id="icon_play" class="icon_play" @click="playvideo"
                         src="http://npjy.oss-cn-beijing.aliyuncs.com/images/file-1575340653940esdHR.png"/>
                </div>
            </div>
        </swiper>
        <!--底部操作栏-->
        <div class="container_bottom">
            <div class="time" v-show="show_time">
                <span class="current">00:00</span> / <span class="totle">00:30</span>
            </div>
            <div class="progress">
                <div class="border_progress" :style="'width:'+videoProcess+'px'"></div>
            </div>
        </div>
    </div>
</template>

<script>
    const w_h = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
    let videoProcessInterval;
    import swiper from '../components/swiper.vue'
    export default {
        name: "videoPage",
        components:{swiper},
        data() {
            return {
                videoList:[],
                swiper_height:w_h,
                playOrPause: true,
                isVideoShow: true,
                iconPlayShow: true,
                showPlayer:false,
                video_current:0,
                videoProcess: 0,//视频播放进度
                show_time: false,
                loop:true
            };
        },
        created() {
            this.getVideoData();
        },
        methods:{
            getVideoData() {
                setTimeout(() => {
                    this.videoList = [
                        {
                            url: "https://rcs.fenqile.com/assets/img/newSafety/video5.mp4",//视频源
                            cover: "https://rcs.fenqile.com/assets/img/newSafety/video5.jpg",//封面
                        }, {
                            url: "https://rcs.fenqile.com/assets/img/newSafety/video02.mp4",
                            cover: "https://rcs.fenqile.com/assets/img/newSafety/video2.jpg",
                        }, {
                            url: "https://rcs.fenqile.com/assets/img/newSafety/video4.mp4",
                            cover: "https://rcs.fenqile.com/assets/img/newSafety/video4.jpg",
                        }, {
                            url: "https://rcs.fenqile.com/assets/img/newSafety/video01.mp4",
                            cover: "https://rcs.fenqile.com/assets/img/newSafety/video1.jpg",
                        }];
                    this.showPlayer = true;
                }, 100);
            },
            pageChange(index) {
                //改变的时候 暂停当前播放的视频
                clearInterval(videoProcessInterval);
                this.videoProcess = 0;
                let video = null;
                if(this.loop){
                    video = document.querySelectorAll("video")[this.video_current+1];
                }else {
                    video = document.querySelectorAll("video")[this.video_current];
                }
                video.currentTime = 0;
                video.pause();
                this.playOrPause = false;
                this.video_current = index;
                this.playOrPause = true;
                this.iconPlayShow = true;
                this.isVideoShow = true;
                this.show_time = false;
                this.$emit('scrollVideo',this.video_current);
            },
            pauseVideo() { //暂停\播放
                try {
                    let video = null;
                    if(this.loop){
                        video = document.querySelectorAll("video")[this.video_current+1];
                    }else {
                        video = document.querySelectorAll("video")[this.video_current];
                    }
                    if (this.playOrPause) {
                        video.pause();
                        this.iconPlayShow = true;
                        clearInterval(videoProcessInterval);
                    } else {
                        video.play();
                        video.pause();
                        setTimeout(() => {
                            video.play();
                            this.iconPlayShow = false;
                            videoProcessInterval = setInterval(() => {
                                this.changeProcess(video);
                            }, 100);
                        }, 100);
                    }
                    this.playOrPause = !this.playOrPause;
                } catch (e) {
                    alert(e);
                }
            },
            onPlayerEnded(player) { //视频结束
                this.isVideoShow = true;
                this.iconPlayShow = true;
            },
            playvideo(event) {
                let video = null;
                if(this.loop){
                    video = document.querySelectorAll("video")[this.video_current+1];
                }else {
                    video = document.querySelectorAll("video")[this.video_current];
                }
                this.isVideoShow = false;
                this.iconPlayShow = false;
                video.play();
                window.onresize = function () {
                    video.style.width = window.innerWidth + "px";
                    video.style.height = window.innerHeight + "px";
                };
                videoProcessInterval = setInterval(() => {
                    this.changeProcess(video);
                }, 100);
            },
            //记录播放进度
            changeProcess(video) {
                let progress = document.querySelector('.progress');
                let currentTime = video.currentTime.toFixed(1);
                let duration = video.duration.toFixed(1);
                this.videoProcess = (currentTime / duration) * progress.offsetWidth;
            },
        },
        mounted(){
        }
    }
</script>

<style lang="scss" scoped>
    .video_container {
        .video_box {
            object-fit: fill !important;
            z-index: 999;
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            overflow: hidden;
        }
        video {
            object-position: 0 0;
        }
        .play {
            position: absolute;
            margin: auto;
            top: 0;
            left: 0;
            z-index: 1001;
            width: 100%;
            height: 100%;
        }
        .icon_play {
            position: absolute;
            top: 50%;
            right: 0;
            left: 0;
            bottom: auto;
            margin: -30px auto 0;
            z-index: 1002;
            height: 60px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
        }
    }
    .container_bottom {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: .58rem;
        max-width: 550px;
        z-index: 1003;

        .time {
            position: absolute;
            height: .4rem;
            width: 2rem;
            text-align: right;
            padding-right: 10px;
            top: -.4rem;
            right: 0;
            color: #ffffff;
            font-size: .28rem;
        }

        .progress {
            position: relative;
            background-color: #979797;
            height: 2px;

            .border_progress {
                width: 0;
                height: 2px;
                background: #FFFFFF;
                position: absolute;
                top: 0px;
                transition: .1s all;
            }

            .duration-icon {
                width: 12px;
                height: 12px;
                background-color: #FFFFFF;
                border-radius: 50%;
                position: absolute;
                left: 0;
                top: -5px;
            }
        }
    }
</style>
