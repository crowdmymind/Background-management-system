<template>
  <!--                     操作商品和添加商品                      -->
  <el-card class="box-card">
    <span slot="header" class="clearfix">
      <span style="float:left">
        <el-button type="text" @click="$router.go(-1)">
          <i class="el-icon-back"></i>
        </el-button>
        <span class="p_title">{{t_name}}</span>
      </span>
    </span>
    <el-form label-position="right" label-width="80px" :model="updateData">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="updateData.name" style="width:40vw;float:left"></el-input>
      </el-form-item>
      <el-form-item label="商品描述" prop="desc">
        <el-input type="textarea" v-model="updateData.desc" style="width:40vw;float:left"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="price">
        <el-input v-model="updateData.price" style="width:40vw;float:left"></el-input>
      </el-form-item>
      <el-form-item label="商品分类" prop="categoryId">
        <el-select v-model="updateData.categoryId" style="float:left">
          <el-option
            v-for="(c_type,index) in categoryData"
            :key="index"
            :label="c_type.name"
            :value="c_type._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品图片" v-model="updateData.imgs" prop="imgs">
        <el-upload action="#" list-type="picture-card" :auto-upload="false" style="float:left;">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url"
              alt
              style="width:150px;height:150px"
            />
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品详情" prop="detail">
        <div id="div3" style="text-align: left;" v-html="updateData.detail"></div>
      </el-form-item>
      <el-form-item style="float:left">
        <el-button type="primary" @click="addGoods">确定提交</el-button>
        <el-button @click="clear_" v-if="show">重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </el-card>
</template>
<script>
import { goodsAdd, getCategoryList, goodsUpdate } from "../api/common";
export default {
  data() {
    return {
      loading: false,
      show: true,
      goodsData: [],
      updateData: {
        name: "",
        desc: "",
        price: "",
        imgs: [],
        detail: "",
        categoryId: ""
      },
      categoryData: {},
      imageUrl: "",
      t_name: this.$route.query.name,
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false
    };
  },
  mounted() {
    this.draw();
    this.getCategoryData();
    if (this.$route.query.info) {
      this.updateData = this.$route.query.info;
      this.show = false;
    } else {
      this.show = true;
    }
  },
  methods: {
    getCategoryData() {
      getCategoryList({}).then(res => {
        if (res.data.status == 0) {
          this.categoryData = res.data.data.list;
        }
      });
    },
    draw() {
      var E = require("wangeditor"); // 使用 npm 安装
      var editor = new E("#div3");
      editor.customConfig.onchange = html => {
        this.updateData.detail = html;
      };
      editor.create();
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    addGoods() {
      if (!this.updateData._id) {
        goodsAdd({
          categoryId: this.updateData.categoryId,
          pCategoryId: "0",
          name: this.updateData.name,
          desc: this.updateData.desc,
          price: this.updateData.price,
          detail: this.updateData.detail,
          imgs: this.updateData.imgs
        }).then(res => {
          if (res.data.status == 0) {
            this.$message({
              type: "success",
              message: "添加商品成功",
              center: true
            });
            this.updateData = {};
            this.$router.go(-1);
          } else {
            this.$message({
              type: "error",
              message: "添加商品失败",
              center: true
            });
          }
        });
      } else {
        goodsUpdate({
          categoryId: this.updateData.categoryId,
          pCategoryId: "0",
          name: this.updateData.name,
          desc: this.updateData.desc,
          price: this.updateData.price,
          detail: this.updateData.detail,
          imgs: this.updateData.imgs,
          _id: this.updateData._id
        }).then(res => {
          if (res.data.status == 0) {
            this.$message({
              type: "success",
              message: "商品跟新成功",
              center: true
            });
            this.updateData = {};
            this.$router.go(-1);
          } else {
            this.$message({
              type: "error",
              message: "商品跟新失败",
              center: true
            });
          }
        });
      }
    },
    clear_() {
      this.updateData = {};
    },
    handleRemove(file) {
      console.log(file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
      console.log(this.dialogImageUrl);
    },
    handleDownload(file) {
      console.log(file);
    }
  }
};
</script>
<style lang="less">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>