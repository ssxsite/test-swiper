<template>
    <div class="mui-swipe" :class="[vertical ? 'vertical':'horizontal']" :style="[{'height': height+'px'}]">
        <!-- 左右滑动-->
        <template v-if="!vertical">
            <div class="mui-swipe-wrap"
                 :style="{'width':ulWidth,'transform':'translate3d(-'+translateLength+'%,0,0)'}"
                 v-if="list.length >1 && !vertical"
                 @touchstart="touchStar" @touchend="touchEnd"
                 :class="{'mui-swipe--tran':noLast}">
                <slot></slot>
            </div>
        </template>

        <!-- 上下滑动-->
        <template v-else>
            <div  class="mui-swipe-wrap"
                  :style="[{'height':boxHeight},{'transform':'translate3d(0,-'+translateLength+'%,0)'}]"
                 v-if="list.length >1 && vertical"
                 @touchstart="touchStar" @touchend="touchEnd"
                 :class="{'mui-swipe--tran':noLast}">
                <slot></slot>
            </div>
        </template>

        <div class="mui-swipe__indicators" v-show="paginationVisible">
            <span class="swiper-pagination-bullet"
                  :class="{'active':index === nowIndex}"
                  :style="[index === nowIndex ? indicatorStyle : null]"
                  v-for="(slide,index) in list"
                  :key ="index"
            >
            </span>
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
            'autoPlay': {
                type:Number,
                default:0
            },
            'height': {
                type: Number,
                default: 0,
            },
            'paginationVisible': {
                type: Boolean,
                default: true,
            },
            'vertical': {
                type: Boolean,
                default: false,
            },
            'indicatorColor': {
                type: String,
                default: '#007aff',
            },
            loop: {
                type: Boolean,
                default: false
            },
            initPage: {
                type: Number,
                default: 0
            },
        },
        data() {
            return {
                nowIndex: this.initPage,
                timer: null,
                noLast: true,
                startX: 0,
                startY: 0,
                isLoop: this.loop,
                domTimer: null,//渲染延迟查找
                swiperWrap: null
            };
        },
        computed: {
            //ul宽度
            ulWidth: function () {
                if (this.isLoop) {
                    return (this.list.length + 2) + "00%";
                } else {
                    return (this.list.length) + "00%";
                }
            },
            listWidth: function () {
                if (this.isLoop) {
                    return 100 / (this.list.length + 2)
                } else {
                    return 100 / (this.list.length)
                }
            },
            translateLength(){
                if(this.isLoop){
                    return this.listWidth*(this.nowIndex+1);
                }else {
                    return this.listWidth*(this.nowIndex);
                }
            },

            boxHeight: function () {
                if(this.isLoop){
                    return this.height * (this.list.length + 2) + "px";
                }else {
                    return this.height * (this.list.length) + "px";
                }

            },
            indicatorStyle() {
                return {
                    backgroundColor: this.indicatorColor,
                };
            },
        },

        mounted() {
            this.initSwiper();
            //是否自动播放
            if (this.autoPlay) {
                this.isLoop = true;
                this.autoSwitch();
            }
        },
        methods: {
            initSwiper() {
                this.$nextTick(() => {
                    this.domTimer = setTimeout(() => {
                        this.swiperWrap = this.$el.querySelector('.mui-swipe-wrap');
                        if(this.vertical){
                            this.swiperWrap.children.forEach((child) => {
                                child.style.height = this.height + 'px'
                            },)
                        }else {
                            this.swiperWrap.children.forEach((child) => {
                                child.style.width = this.listWidth + '%'
                            },)
                        }
                        this.slideEls = [...this.swiperWrap.children];
                        if (this.slideEls.length === 0) return;
                        this.isLoop && this._createLoop();
                    }, 0)
                })
            },
            _createLoop() {
                let swiperWrapEl = this.$el.querySelector('.mui-swipe-wrap');
                let duplicateFirstChild = swiperWrapEl.firstElementChild.cloneNode(true);
                let duplicateLastChild = swiperWrapEl.lastElementChild.cloneNode(true);
                swiperWrapEl.insertBefore(duplicateLastChild, swiperWrapEl.firstElementChild);
                swiperWrapEl.appendChild(duplicateFirstChild);
            },
            //滑动操作
            switchDo(reduce) {
                clearInterval(this.timer);
                //根据reduce判断this.nowIndex的增加或者减少！
                if (reduce === 'reduce') {
                    if (this.nowIndex === 0) {
                        if (this.isLoop) {
                            this.nowIndex--;
                            //执行完了这次动画之后，去除过渡效果
                            setTimeout(() => {
                                this.nowIndex = this.list.length - 1;
                                this.noLast = false;
                                this.$emit('change',this.nowIndex);
                            }, 400)
                        }else {
                            this.nowIndex = 0;
                            this.$emit('change',this.nowIndex);
                        }
                    } else {
                        this.nowIndex--;
                        if(this.nowIndex >= 0){
                            this.$emit('change',this.nowIndex);
                        }
                    }
                } else {
                    this.nowIndex++;
                    if (this.nowIndex === this.list.length) {
                        if (this.isLoop) {
                            setTimeout(() => {
                                this.nowIndex = 0;
                                this.noLast = false;
                                this.$emit('change',this.nowIndex);
                            }, 400)
                        }else {
                            this.nowIndex = this.list.length - 1;
                            this.noLast = true;
                            this.$emit('change',this.nowIndex);
                            clearInterval(this.timer);
                        }

                    }else {
                        if(this.nowIndex < this.list.length){
                            this.$emit('change',this.nowIndex);
                        }
                    }
                }
                this.noLast = true;
                //如果需要自动播放
                if (this.autoPlay) {
                    this.autoSwitch();
                }
            },
            //自动播放函数
            autoSwitch() {
                if(!this.autoPlay){
                    return;
                }else {
                    this.timer = setInterval(() => {
                        this.switchDo();
                    }, this.autoPlay);
                }
            },
            //开始滑动
            touchStar(e) {
                this.startX = e.changedTouches[0].clientX;
                this.startY = e.changedTouches[0].clientY;
            },
            //滑动结束
            touchEnd(e) {
                if (this.vertical) {
                    if (e.changedTouches[0].clientY - this.startY > 50) {
                        this.switchDo('reduce')
                    }
                    else if (e.changedTouches[0].clientY - this.startY < -50) {
                        this.switchDo()
                    }
                } else {
                    if (e.changedTouches[0].clientX - this.startX > 50) {
                        this.switchDo('reduce')
                    }
                    else if (e.changedTouches[0].clientX - this.startX < -50) {
                        this.switchDo()
                    }
                }
            },
        },
        destroyed() {
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
        .mui-swiper-slide {
            overflow: hidden;
            flex-shrink: 0;
            -webkit-flex-shrink: 0;
            width: 100%;
            height: 100%;
            cursor: default;
            position: relative;
        }
        &.horizontal .mui-swipe-wrap {
            flex-direction: row;
        }
        &.vertical .mui-swipe-wrap {
            flex-direction: column;
        }
        .mui-swipe__indicators {
            position: absolute;
            .swiper-pagination-bullet{
                width:8px;
                height:8px;
                border-radius: 50%;
                background-color:#000;
                opacity: 0.2;
                transition:all .5s ease;
                -webkit-transition:all .5s ease;
            }
            .swiper-pagination-bullet.active{
                opacity: 1;
            }
        }

        &.vertical .mui-swipe__indicators{
            right:10px;
            top:50%;
            bottom: auto;
            transform:translate3d(0,-50%,0);
            .swiper-pagination-bullet{
                display: block;
                margin:6px 0;
            }
        }
        &.horizontal .mui-swipe__indicators{
            bottom:10px;
            width:100%;
            text-align: center;
            .swiper-pagination-bullet{
                display: inline-block;
                margin:0 3px;
            }
        }
    }
    .mui-swipe--tran {
        transition: all .4s;
    }
</style>


