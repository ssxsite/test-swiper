<template>
    <div class="mui-swipe" :class="[vertical ? 'vertical':'horizontal']" :style="[{'height': height+'px'}]">
        <!-- 左右滑动-->
        <template v-if="!vertical">
            <div class="mui-swipe-wrap"
                 :style="{'transform':'translate3d('+translateX+'px,'+translateY+'px,0)'}"
                 v-if="list.length >1 && !vertical"
                 @touchstart="touchStar" @touchend="touchEnd"
                 :class="{'mui-swipe--tran':noLast}">
                <slot></slot>
            </div>
            <!--如果需要显示对应的点-->
            <div class="mui-swipe__indicators" v-if="option && list.length >1 && !vertical">
                <i v-for="(li,index) in list" :key="index"
                   :class="{'mui-swipe__indicator':true,'mui-swipe__indicator--active':index===nowIndex}"
                   :style="index===nowIndex ? indicatorStyle : null"></i>
            </div>
        </template>

        <!-- 上下滑动-->
        <template v-else>
            <div :style="[{'height':boxHeight},{'transform':'translateY(-'+(listWidth*(nowIndex+1))+'%)'}]"
                 v-if="list.length >1 && vertical"
                 @touchstart="touchStar" @touchend="touchEnd"
                 :class="{'mui-swipe--tran':noLast}">
                <!--最后一张-->
                <div :style="{'height':height+'px'}">
                    <p style="height:100%;background-color: dodgerblue;text-align: center;">
                        {{list.length}}</p>
                </div>
                <div v-for="(li,index) in list" :style="{'height':height+'px'}" :key="index">
                    <p style="height:100%;background-color: dodgerblue;text-align: center;">
                        {{index+1}}</p>
                </div>
                <!--第一张-->
                <div :style="{'height':height+'px'}">
                    <p style="height:100%;background-color: dodgerblue;text-align: center;">{{1}}</p>
                </div>
            </div>
        </template>
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
            'height': {
                type: Number,
                default: 0,
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
            loop:{
                type:Boolean,
                default:false
            },
            initPage:{
                type:Number,
                default:1
            },
        },
        data() {
            return {
                nowIndex: 0,
                timer: null,
                noLast: true,
                startX: 0,
                startY: 0,
                test: true,
                isLoop:this.loop,
                domTimer:null,//渲染延迟查找
                swiperWrap:null,
                oneSlideTranslate:0,//一个slide的大小
                translateOffset:0,//当前偏移初始位置距离
                currentPage:this.initPage,
                translateX:0,
                translateY:0,
            };
        },
        computed: {
            //ul宽度
            ulWidth: function () {
                return (this.list.length + 2) + "00%";
            },
            boxHeight: function () {
                return this.height * (this.list.length + 2) + "px";
            },
            //li宽度
            // listWidth: function () {
            //     return 100 / (this.list.length + 2)
            // },
            indicatorStyle() {
                return {
                    backgroundColor: this.indicatorColor,
                };
            },
        },
        mounted() {
            this.initSwiper();
            //是否自动播放
            if (this.autoplay) {
                this.autoSwitch();
            }

        },
        methods: {
            initSwiper(){
                this.$nextTick(()=>{
                    this.domTimer = setTimeout(()=>{
                        this.swiperWrap = this.$el.querySelector('.mui-swipe-wrap');
                        this.slideEls = [...this.swiperWrap.children];
                        if(this.slideEls.length === 0) return;
                        this._getSlideDistance((this.slideEls)[0]);
                        // if(this.autoplay){
                        //     this.isLoop = true;
                        //     this._createAutoPlay();
                        // }
                        this.isLoop && this._createLoop();
                        this.setPage(this.currentPage, false);
                        // this.lazyLoad && this.renderLazyDom(this.slideEls) && this._imgLazyLoad();
                    },0)


                })
            },
            setPage(page){
                if(page === 0){
                    this.currentPage = this.slideEls.length;
                }else if(page === this.slideEls.length + 1){
                    this.currentPage = 1;
                }else{
                    this.currentPage = page;
                }
                this._setTranslate(this._getTranslateOfPage(page));
                // if(!isHasAnimation){
                //     this._slideClassHandle();
                // }else{
                //     this._onTransitionStart(type);
                // }
            },
            _setTranslate(value){
                let translateName = !this.vertical ? 'translateX' :'translateY';
                this[translateName] = value;
            },
            _getSlideDistance(el){
                let styleArr = getComputedStyle(el);
                let marginTop = styleArr['marginTop'].replace('px','') - 0;
                let marginBottom = styleArr['marginBottom'].replace('px','') - 0;
                let marginRight = styleArr['marginRight'].replace('px','') - 0;
                let marginLeft = styleArr['marginLeft'].replace('px','') - 0;
                if(!this.vertical){
                    this.oneSlideTranslate = marginRight + marginLeft + el['offsetWidth'];
                }else{
                    this.oneSlideTranslate = marginTop + marginBottom + el['offsetHeight'];
                }
            },
            _createLoop(){
                // let propName = this.vertical ? 'offsetHeight': 'offsetWidth';
                let swiperWrapEl = this.$el.querySelector('.mui-swipe-wrap');
                let duplicateFirstChild = swiperWrapEl.firstElementChild.cloneNode(true);
                let duplicateLastChild = swiperWrapEl.lastElementChild.cloneNode(true);
                swiperWrapEl.insertBefore(duplicateLastChild,swiperWrapEl.firstElementChild);
                swiperWrapEl.appendChild(duplicateFirstChild);
                this.translateOffset = - this.oneSlideTranslate;
            },
            _getTranslateOfPage(page){
                if(page === 0)  return 0;
                // let propName = !this.vertical ? 'offsetWidth':'offsetHeight';
                let _this = this;
                return -[].reduce.call(this.slideEls,function(total,el,i){
                    return i> page-2? total : total+_this.oneSlideTranslate;
                },0) + this.translateOffset;
            },
            //滑动操作
            switchDo(reduce) {
                clearInterval(this.timer);
                //根据reduce判断this.nowIndex的增加或者减少！
                if (reduce === 'reduce') {
                    if (this.nowIndex === 0) {
                        //如果是滑动切换
                        if (this.type === 'slide') {
                            this.nowIndex--;
                            //执行完了这次动画之后，去除过渡效果
                            setTimeout(() => {
                                this.nowIndex = this.list.length - 1;
                                this.noLast = false;
                            }, 400)
                        }
                        else {
                            this.nowIndex = this.list.length - 1;
                        }
                    }
                    else {
                        this.nowIndex--;
                    }
                }
                else {
                    this.nowIndex++;
                }
                if (this.nowIndex === this.list.length) {
                    if (this.type === 'slide') {
                        //执行完了这次动画之后，去除过渡效果
                        setTimeout(() => {
                            this.nowIndex = 0;
                            this.noLast = false;
                        }, 400)
                    }
                    else {
                        this.nowIndex = 0;
                    }
                    // this.nowIndex = 0;
                }

                //是否显示图片，只针对透明度切换的情况！
                setTimeout(() => {
                    this.nowIndexShow = this.nowIndex;
                }, 1)
                //如果需要自动播放
                if (this.autoplay) {
                    this.autoSwitch();
                }
                //如果是滑动切换，设置this.noLast，增加过渡效果
                if (this.type === 'slide') {
                    this.noLast = true;
                }

            },
            //自动播放函数
            autoSwitch() {
                let time = this.time || 4000;
                this.timer = setInterval(() => {
                    this.switchDo();
                }, time);
            },
            //开始滑动
            touchStar(e) {
                // e.preventDefault();
                this.startX = e.changedTouches[0].clientX;
                this.startY = e.changedTouches[0].clientY;
            },
            //滑动结束
            touchEnd(e) {
                //e.preventDefault();
                if (this.vertical) {
                    if (e.changedTouches[0].clientY - this.startY > 50) {
                        this.switchDo('reduce')
                    }
                    else if (e.changedTouches[0].clientY - this.startY < -50) {
                        this.switchDo()
                    }
                }
                else {
                    if (e.changedTouches[0].clientX - this.startX > 50) {
                        this.switchDo('reduce')
                    }
                    else if (e.changedTouches[0].clientX - this.startX < -50) {
                        this.switchDo()
                    }
                }
            },
        },
        destroyed(){
            this.domTimer = null;
        }
    };
</script>
<style lang="scss" scoped>
    .mui-swipe {
        position: relative;
        overflow: hidden;
        margin: 0 auto;
        cursor: grab;
        user-select: none;
        .mui-swipe-wrap {
            display: flex;
            height: 100%;
        }
        .mui-swiper-slide{
            overflow: hidden;
            flex-shrink: 0;
            -webkit-flex-shrink:0;
            width:100%;
            height:100%;
            cursor: default;
            position: relative;
        }
        &.horizontal .mui-swipe-wrap{
            flex-direction: row;
        }
        &.vertical .mui-swipe-wrap{
            flex-direction: column;
        }
    }



    .mui-swipe--tran {
        transition: all .4s;
    }

    .mui-swipe__indicators {
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


