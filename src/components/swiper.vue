<template>
    <div class="mui-swipe">
        <!-- 只有一张的时候，只显示，不做任何操作 -->
        <div v-if="list.length===1">
            <div v-for="(li,index) in list" :style="{'width':listWidth+'%'}" :key="index">
                <p style="height: 150px;line-height:150px;background-color: dodgerblue;text-align: center;">{{index+1}}</p>
            </div>
        </div>
        <!-- 左右滑动-->
        <div class="mui-swipe__track" :style="[{width:ulWidth},{'transform':'translateX(-'+(listWidth*(nowIndex+1))+'%)'}]"
             v-if="list.length >1"
             @touchstart="touchStar" @touchend="touchEnd"
             :class="{'mui-swipe--tran':noLast}">
            <!--最后一张-->
            <div :style="{'width':listWidth+'%'}">
                <p style="height: 150px;line-height:150px;background-color: dodgerblue;text-align: center;">{{list.length}}</p>
            </div>
            <div v-for="(li,index) in list" :style="{'width':listWidth+'%'}" :key="index" >
                <p style="height: 150px;line-height:150px;background-color: dodgerblue;text-align: center;">{{index+1}}</p>
            </div>
            <!--第一张-->
            <div :style="{'width':listWidth+'%'}">
                <p style="height: 150px;line-height:150px;background-color: dodgerblue;text-align: center;">{{1}}</p>
            </div>
        </div>
        <!--如果需要显示对应的点-->
        <div class="mui-swipe__indicators" v-if="option && list.length >1">
            <i class="mui-swipe__indicator mui-swipe__indicator--active" v-if="nowIndex===list.length"></i>
            <i v-for="(li,index) in list" :key="index" :class="{'mui-swipe__indicator':true,'mui-swipe__indicator--active':index===nowIndex}" :style="index===nowIndex ? indicatorStyle : null"></i>
            <i class="mui-swipe__indicator mui-swipe__indicator--active" v-if="nowIndex===-1"></i>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'RFullScreenVideo',
        props: {
            'list': {
                type: Array,
                default: () => {
                    return []
                }
            },
            'autoplay': {
                type: Boolean,
                default: true,
            },
            'type': {
                type: String,
                default: 'slide',
            },
            'time': {
                type: Number,
                default: 4000,
            },
            'option': {
                type: Boolean,
                default: true,
            },
            'vertical': {
                type: Boolean,
                default: false,
            },
            'indicatorColor': {
                type: String,
                default: '#fff',
            },
        },
        data() {
            return {
                nowIndex: 0,
                timer: null,
                noLast: true,
                startX:0,
                startY:0,
                test:true
            };
        },
        computed: {
            //ul宽度
            ulWidth: function () {
                return (this.list.length + 2) + "00%";
            },
            //li宽度
            listWidth:function () {
                return 100/(this.list.length+2)
            },
            indicatorStyle() {
                return {
                    backgroundColor: this.indicatorColor,
                };
            },
        },
        mounted() {
            //是否自动播放
            if (this.autoplay) {
                this.autoSwitch();
            }

        },
        methods: {
            //滑动操作
            switchDo(reduce){
                clearInterval(this.timer);
                //根据reduce判断this.nowIndex的增加或者减少！
                if(reduce==='reduce'){
                    if(this.nowIndex===0){
                        //如果是滑动切换
                        if(this.type==='slide'){
                            this.nowIndex--;
                            //执行完了这次动画之后，去除过渡效果
                            setTimeout(() => {
                                this.nowIndex = this.list.length-1;
                                this.noLast = false;
                            }, 400)
                        }
                        else{
                            this.nowIndex = this.list.length-1;
                        }
                    }
                    else{
                        this.nowIndex--;
                    }
                }
                else{
                    this.nowIndex++;
                }
                if (this.nowIndex === this.list.length) {
                    if(this.type==='slide') {
                        //执行完了这次动画之后，去除过渡效果
                        setTimeout(() => {
                            this.nowIndex = 0;
                            this.noLast = false;
                        }, 400)
                    }
                    else{
                        this.nowIndex = 0;
                    }
                    // this.nowIndex = 0;
                }

                //是否显示图片，只针对透明度切换的情况！
                setTimeout(()=>{
                    this.nowIndexShow=this.nowIndex;
                },1)
                //如果需要自动播放
                if (this.autoplay) {
                    this.autoSwitch();
                }
                //如果是滑动切换，设置this.noLast，增加过渡效果
                if(this.type==='slide') {
                    this.noLast = true;
                }

            },
            //自动播放函数
            autoSwitch(){
                let time = this.time || 4000;
                this.timer = setInterval(() => {
                    this.switchDo();
                }, time);
            },
            //开始滑动
            touchStar(e){
                // e.preventDefault();
                this.startX=e.changedTouches[0].clientX;
                this.startY=e.changedTouches[0].clientY;
            },
            //滑动结束
            touchEnd(e){
                //e.preventDefault();
                if(this.vertical){
                    if(e.changedTouches[0].clientY-this.startY>50){
                        this.switchDo('reduce')
                    }
                    else if(e.changedTouches[0].clientY-this.startY<-50){
                        this.switchDo()
                    }
                }
                else{
                    if(e.changedTouches[0].clientX-this.startX>50){
                        this.switchDo('reduce')
                    }
                    else if(e.changedTouches[0].clientX-this.startX<-50){
                        this.switchDo()
                    }
                }
            },
        }
    };
</script>
<style lang="css">
    .mui-swipe{
        width: 100%;
        height: 100%;
        margin-left: auto;
        margin-right: auto;
        position: relative;
        overflow: hidden;
        cursor: grab;
        user-select: none;
        list-style: none;
        padding: 0;
        z-index: 1;
    }
    .mui-swipe__track{
        display: flex;
        height: 100%;
    }
    .mui-swipe--tran{
        transition: all .4s;
    }
    .mui-swipe__indicators{
        position: absolute;
        bottom: 24px;
        left: 50%;
        z-index: 5;
        display: flex;
        transform: translateX(-50%);
    }
    .mui-swipe__indicator {
        width: 6px;
        height: 6px;
        background-color: #ff3327;
        border-radius: 100%;
        opacity: 1;
        transition: opacity 0.2s;
    }
    .mui-swipe__indicator:not(:last-child) {
        margin-right: 6px;
    }
    .mui-swipe__indicator--active {
        background-color: #fff;
        opacity: 1;
    }

</style>


