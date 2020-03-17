<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>
        <el-button type="text" style="float: left;" @click="showCategorys">一级商品分类列表</el-button>
      </span>
      <span style="font-size:14px;float: left;margin-top: 11px;" v-html="showParentName"></span>
      <el-button
        style="float: right;"
        type="primary"
        icon="el-icon-plus"
        size="mini"
        @click="addCategoryData"
      >添加分类</el-button>
    </div>

    <template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="商品分类" width="800"></el-table-column>
        <el-table-column prop="_id" label="操作选项">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">修改分类</el-button>
            <el-button size="mini" @click="showSubCategory(scope.row)" v-if="show">查看子分类</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
    <el-pagination
      class="pagination"
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="currentPage"
      @current-change="current_change"
      :page-size="pagesize"
    ></el-pagination>
    <!-- 创建商品分类 -->
    <el-dialog title="添加分类" :visible.sync="dialogVisible" width="30%" center>
      <el-form :inline="true" class="demo-form-inline" v-if="show1">
        <el-form-item label="分类列表">
          <el-select v-model="type_add._id" value="0">
            <el-option label="一级分类" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称">
          <el-input v-model="type_add.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible=false">取消</el-button>
          <el-button type="primary" @click="onSubmit">添加</el-button>
        </el-form-item>
      </el-form>
      <!-- 二级添加 -->
      <el-form :inline="true" class="demo-form-inline" v-else>
        <el-form-item label="分类列表">
          <el-select v-model="secendForms.name" value="0">
            <el-option
              v-for="(secendForm,index) in secendForms"
              :key="index"
              :label="secendForm.name"
              :value="secendForm._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称">
          <el-input v-model="type_add.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible=false">取消</el-button>
          <el-button type="primary" @click="onSubmit">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>
<script>
import {
  getCategoryList,
  updateCategoryName,
  addCategory,
  getCategoryInfo
} from "../api/common";
export default {
  data() {
    return {
      tableData: [],
      parentId: "0",
      total: +"",
      pagesize: 5, //每页的数据条数
      currentPage: 1, //默认开始页面
      dialogVisible: false,
      subcurrentPage: 1,
      parentName: "",
      show: true,
      show1: true,
      type_add: {},
      secendForms: []
    };
  },
  methods: {
    getCategoryData() {
      getCategoryList({
        parentId: this.parentId,
        pageSize: this.pagesize,
        pageNum: this.currentPage
      }).then(res => {
        if (res.data.status == 0) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
          sessionStorage.Info = JSON.stringify(this.tableData)
        }
      });
    },
    handleEdit(obj) {
      this.$prompt("请输入新分类名", "修改分类", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        updateCategoryName({ categoryId: obj._id, categoryName: value }).then(
          res => {
            if (res.data.status == 0) {
              this.$message({
                type: "success",
                message: "修改成功",
                center: true
              });
              this.getCategoryData();
            } else {
              this.$message({
                type: "error",
                message: "修改失败",
                center: true
              });
            }
          }
        );
      });
    },
    //查看一级分类
    showCategorys() {
      this.parentId = "0";
      this.parentName = "";
      this.subcurrentPage = 1;
      this.show = true;
      this.show1 = true;
      this.getCategoryData();
    },
    //查看子分类
    showSubCategory(obj) {
      this.subcurrentPage = 1;
      this.parentId = obj._id;
      this.parentName = obj.name;
      this.show = false;
      this.getCategoryInfoData();
      this.getCategoryData();
    },
    //分类添加
    addCategoryData() {
      this.dialogVisible = true;
      if (this.parentId && this.parentId == "0") {
        this.show1 = true;
      } else {
        this.show1 = false;
      }
    },
    onSubmit() {
      addCategory({
        parentId: this.parentId,
        categoryName: this.type_add.name
      }).then(res => {
        if (res.data.status == 0) {
          this.$message({
            type: "success",
            message: "添加成功",
            center: true
          });
          this.getCategoryData();
          this.type_add = [];
        } else {
          this.$message({
            type: "error",
            message: "添加失败",
            center: true
          });
        }
        this.dialogVisible = false;
      });
    },
    //获取二级分类父元素信息
    getCategoryInfoData() {
      getCategoryInfo({ categoryId: this.parentId }).then(res => {
        if (res.data.status == 0) {
          this.secendForms = res.data.data;
        }
      });
    },
    //分页
    current_change(currentPage) {
      this.currentPage = currentPage;
      this.getCategoryData();
    }
  },
  mounted() {
    this.getCategoryData();
  },
  computed: {
    showParentName() {
      return this.parentName
        ? `<i class="el-icon-right"></i>${this.parentName}`
        : "";
    },
    page() {
      return this.parentId == 0 ? this.currentPage : this.subcurrentPage;
    }
  }
};
</script>
<style lang="less">
</style>