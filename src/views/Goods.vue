<template >
  <!--                     搜索和查看商品状态页面                      -->
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span class="search" style="float:left">
        <el-select style="width:150px" v-model="selected">
          <el-option label="按照名称搜索" value="productName"></el-option>
          <el-option label="按照描述搜索" value="productDesc"></el-option>
        </el-select>
        <el-input placeholder="关键字" style="width:150px" v-model="input"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </span>
      <el-button
        style="float: right;"
        type="primary"
        icon="el-icon-plus"
        size="medium"
        @click="handelJump({name:'添加商品'})"
      >添加商品</el-button>
    </div>
    <template>
      <el-table :data="goodsData" v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="商品名称" width="180"></el-table-column>
        <el-table-column prop="desc" label="商品描述"></el-table-column>
        <el-table-column prop="price" label="商品价格"></el-table-column>
        <el-table-column prop="status" label="商品状态" width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="updateGoodsStatus(scope.row)"
            >{{scope.row.status == 0?'上架':'下架'}}</el-button>
            <el-button type="text" style="font-size:13px">{{scope.row.status == 0?'已下架':'销售中'}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="_id">
          <template slot-scope="scope">
            <el-button size="mini" @click="goodsInfo(scope.row)">详情</el-button>
            <el-button size="mini" @click="handelJump({name:'修改商品',info:scope.row})">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页插件 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="currentPage"
      @current-change="current_change"
    ></el-pagination>
    <!-- 商品详情 -->
    <el-dialog title="商品详情" :visible.sync="centerDialogVisible" width="70%" center>
      <div>
          <el-tag>商品名称</el-tag>
          <span class="detail_span">{{detailList.name}}</span>
        </div>
        <el-divider><i class="el-icon-shopping-cart-full"></i></el-divider>

        <div>
          <el-tag>商品描述</el-tag>
          <span class="detail_span">{{detailList.desc}}</span>
        </div>
        <el-divider><i class="el-icon-chat-line-round"></i></el-divider>

        <div>
          <el-tag>商品价格</el-tag>
          <span class="detail_span">{{detailList.price}}元</span>
        </div>
        <el-divider><i class="el-icon-money"></i></el-divider>
        <div>
          <el-tag >所属分类</el-tag>
          <span class="detail_span">{{type}}</span>
        </div>
        <el-divider><i class="el-icon-folder-opened"></i></el-divider>

        <div>
          <el-tag>商品图片</el-tag>
          <el-image fit="scale-down" v-for="(img,index) in detailList.imgs" :src="url_+img" :key="index" style="width:150px;heigth:150px"></el-image>
        </div>
        <el-divider><i class="el-icon-picture-outline"></i></el-divider>

        <div>
          <el-tag>商品详情</el-tag>
          <div class="detail_span detail_content" v-html="detailList.detail"></div>
        </div>
        <el-divider><i class="el-icon-set-up"></i></el-divider>
    </el-dialog>
  </el-card>
</template>

<script>
import { getGoodsList, updateStatus, searchGoods ,getCategoryInfo} from "../api/common";
export default {
  data() {
    return {
      selected: "productName",
      input: "",
      pagesize: 5,
      currentPage: 1,
      loading: false,
      detailList:[],
      centerDialogVisible: false,
      total: 0,
      info:[],
      goodsData: [],
      url_:'http://118.24.25.7:5000/upload/',
      type:""
    };
  },
  mounted() {
    this.getGoodsListData();
  },
  methods: {
    getGoodsListData() {
      getGoodsList({ pageNum: this.currentPage, pageSize: this.pagesize }).then(
        res => {
          if (res.data.status == 0) {
            this.goodsData = res.data.data.list;
            this.total = res.data.data.total;
          }
        }
      );
    },
    updateGoodsStatus(obj) {
      updateStatus({ productId: obj._id, status: !obj.status }).then(res => {
        if (res.data.status == 0) {
          this.$message({
            type: "success",
            message: "商品状态更新成功",
            center: true
          });
          this.getGoodsListData();
        }
      });
    },
    handleSearch() {
      this.loading = true;
      searchGoods({
        pageNum: this.currentPage,
        pageSize: this.pagesize,
        productName: this.input,
        productDesc: this.selected
      }).then(res => {
        if (res.data.status == 0) {
          this.goodsData = res.data.data.list;
          this.total = res.data.data.total;
          this.input = "";
          this.loading = false;
        } else {
          this.$message({
            type: "error",
            message: "数据获取失败",
            center: true
          });
        }
      });
    },
    handelJump(a) {
      this.$router.push({
        path: "/home/goodsadd",
        query: a
      });
    },
    goodsInfo(obj) {
      this.centerDialogVisible = true;
      this.detailList=obj
      getCategoryInfo({categoryId:obj.categoryId}).then((res)=>{
        if(res.data.status==0){
          this.type=res.data.data.name
        }
        
      })
      
    },
    current_change(currentPage) {
      this.currentPage = currentPage;
      this.getGoodsListData();
    }
  }
};
</script>
<style lang="less">
.search {
  display: inline-flex;
  width: 430px;
  justify-content: space-between;
}
.pagination {
  text-align: center;
  margin-top: 20px;
}
</style>