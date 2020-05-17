<template>
    <div>
        <nut-swiper
                :paginationVisibile="true"
                direction="horizontal"
                :swiperData="dataImgItem"
                :loop="false"
                :autoPlay="1000"
                :paginationVisible="true"
        >
            <div  v-for="(item,index) in dataImgItem" :key="index"  class="nut-swiper-slide">
                <img :src="item.imgSrc"   style="max-width:100%;"/>
            </div>

        </nut-swiper>
    </div>
</template>

<script>
    export default {
        name: "nutTestPage",
        data(){
            return{
                dataImgItem:[],
            }
        },
        mounted(){
            setTimeout(()=>{
                this.dataImgItem = [
                    {
                        imgSrc:'//m.360buyimg.com/mobilecms/s750x366_jfs/t1/18629/34/3378/144318/5c263f64Ef0e2bff0/0d650e0aa2e852ee.jpg'
                    },
                    {
                        imgSrc:'//m.360buyimg.com/mobilecms/s750x366_jfs/t1/26597/30/4870/174583/5c35c5d2Ed55eedc6/50e27870c25e7a82.png'
                    },
                    {
                        imgSrc:'//m.360buyimg.com/mobilecms/s750x366_jfs/t1/9542/17/12873/201687/5c3c4362Ea9eb757d/60026b40a9d60d85.jpg'
                    }
                ];
            },300)
        },
    };
</script>

<style scoped>

</style>
