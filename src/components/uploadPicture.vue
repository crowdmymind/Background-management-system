<template>
    <div>
        <el-upload :file-list="fileList" action="/manage/img/upload" accept="image/*" list-type="picture-card"
            :limit="4" name="image" :on-preview="handlePictureCardPreview" :on-change='handlePchange'
            :on-remove='removePicture'>
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
 import {reqDeleteImg} from '../apis'
   import {BASE_IMG_URL} from '../utils/constants'
 export default {
     name: 'uploadPicture',
     props:{
         imgArr:{
             type:Array
         }
     },
     data() {
         return {
             dialogImageUrl: '',
             dialogVisible: false,
             fileList: []
         };
     },
     methods: {
         //显示预览大图
         handlePictureCardPreview(file) {
             this.dialogImageUrl = file.url;
             this.dialogVisible = true;
         },
         //上传图片失败或者成功的回调函数
         handlePchange(file, fileList) {
             console.log(file)
             if (file.status == 'success') {
                 this.$message({
                     type: 'success',
                     message: '图片上传成功！',
                     center: true
                 });
                 this.fileList = fileList;
                 this.sendImgArr();
             } else if (file.status == 'fail') {
                 this.$message({
                     type: 'error',
                     message: '图片上传失败',
                     center: true
                 });
             }
         },
         sendImgArr(){
            //给父子传递包装好的img文件名
                const imgArr = this.fileList.map((item) => {
                    return item.response.data.name
                })
                this.$emit('getimgArr', imgArr);
         },
         //删除图片的回调函数
         removePicture(file, fileList) {
             if (file.status == 'success') {
                 reqDeleteImg(file.response.data.name).then((res) => {
                     if (res.status == 0) {
                         this.$message({
                             type: 'success',
                             message: '图片删除成功！',
                             center: true
                         });
                         this.fileList = fileList;
                          this.sendImgArr();
                     } else {
                         this.$message({
                             type: 'error',
                             message: '图片删除失败！',
                             center: true
                         });
                     }
                 })
             }
         },
         //恢复图片
         showImg(imgArr){
             console.log(imgArr)
             if(imgArr && imgArr.length>0){
                 this.fileList = imgArr.map((item,index)=>{
                     return {
                         uid:-index,
                         name:item,
                         status:'success',
                         url:BASE_IMG_URL + item,
                         response:{
                             status:0,
                             data:{
                                 name:item,
                                 url:BASE_IMG_URL + item
                             }
                         }
                     }
                 })
             }
         }

     },
    watch:{
        imgArr(val){
            this.showImg(val)
        }
    }
 }

</script>
<style lang='' scoped>


/*
    elementUI 图片上传
    action 图片上传的地址（后台路由）
    accept 接受的文件类型（选择文件的时候除了图片其他类型的文件不会显示）
    name 请求的参数名
    file-list 已上传的文件列表

    文件上传思路
    主要是需要配置好action和name,这样才可以正确的发送到后台接口，需要得到什么上传的文件信息，可以通过
    对应的钩子函数操作
*/
</style>
