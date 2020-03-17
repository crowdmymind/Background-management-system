<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span class="search" style="float:left">
        <el-select style="width:150px" v-model="selected">
          <el-option label="按照订单号搜索" value="orderId"></el-option>
          <el-option label="按照收件人搜索" value="recipient"></el-option>
        </el-select>
        <el-input placeholder="关键字" style="width:150px" v-model="input"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </span>
    </div>
    <template>
      <el-table :data="orderData" v-loading="loading" style="width: 100%">
        <el-table-column prop="orderId" label="订单号" width="180"></el-table-column>
        <el-table-column prop="recipient" label="收件人"></el-table-column>
        <el-table-column prop="status" label="订单状态">
          <template slot-scope="scope">{{scope.row.status == 1 ? '未支付' : '已支付' }}</template>
        </el-table-column>
        <el-table-column prop="allPrice" label="订单总价" width="180">
          <template slot-scope="scope">{{ '￥' + scope.row.allPrice }}</template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="180">
          <template slot-scope="scope">{{new Date(scope.row.create_time).toLocaleString()}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleView(scope.row)">查看详情</el-button>
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

    <!--                订单详情                  -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="60%">
      <el-form label-position="right" label-width="80px" :model="formLabelAlign">
        <el-form-item label="订单号" prop="orderId">
          <el-input style="width:40vw;float:left" v-model="formLabelAlign.orderId"></el-input>
        </el-form-item>
        <el-form-item label="订单人" prop="recipient">
          <el-input style="width:40vw;float:left" v-model="formLabelAlign.recipient"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="create_time">
          <el-input style="width:40vw;float:left" v-model="formLabelAlign.create_time"></el-input>
        </el-form-item>
        <el-form-item label="订单状态" prop="status">
          <el-input style="width:40vw;float:left" v-model="formLabelAlign.status"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="allPrice">
          <el-input style="width:40vw;float:left" v-model="formLabelAlign.allPrice"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="paymentMethod">
          <el-input style="width:40vw;float:left" v-model="formLabelAlign.paymentMethod">
          </el-input>
        </el-form-item>
      </el-form>
      <el-divider>
        <i class="el-icon-shopping-cart-full"></i>
      </el-divider>

      <el-table :data="details" border stripe style="width: 100%">
        <el-table-column prop="name" label="商品名称" width="100"></el-table-column>
        <el-table-column prop="imgs" label="商品图片" width="100">
          <template slot-scope="scope">
            <el-image
              fit="scale-down"
              v-for="(img,index) in scope.row.imgs"
              :src="imgPath+img"
              :key="index"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="info" label="商品信息"></el-table-column>
        <el-table-column prop="price" label="单价" width="100">
          <template slot-scope="scope">￥{{scope.row.price }}</template>
        </el-table-column>
        <el-table-column prop="count" label="数量" width="100"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { getOrderList, searchOrder, getOrderInfo } from "../api/common";
export default {
  data() {
    return {
      orderData: [],
      total: 0,
      input: "",
      payName: "",
      payStatus: "",
      imgPath: "http://118.24.25.7:5000/upload/",
      selected: "orderId",
      pagesize: 5, //每页的数据条数
      currentPage: 1, //默认开始页面
      loading: false,
      dialogVisible: false,
      details: [],
      formLabelAlign: {},
      statusArr: {
        1: "未支付",
        2: "已支付",
        3: "以取消"
      },
      paymentArr: {
        1: "支付宝",
        2: "微信",
        3: "银联"
      }
    };
  },
  mounted() {
    this.getOrderListData();
  },
  methods: {
    getOrderListData() {
      getOrderList({ pageNum: this.currentPage, pageSize: this.pagesize }).then(
        res => {
          if (res.data.status == 0) {
            this.orderData = res.data.data.list;
            this.total = res.data.data.total;
          }
        }
      );
    },
    handleSearch() {
      this.loading = true;
      searchOrder({
        pageNum: this.currentPage,
        pageSize: this.pagesize,
        value: this.input,
        type: this.selected
      }).then(res => {
        if (res.data.status == 0) {
          this.orderData = res.data.data.list;
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
    handleView(obj) {
      this.dialogVisible = true;
      getOrderInfo({ id: obj._id }).then(res => {
        if (res.data.status == 0) {
          this.details = res.data.data.details;
          let obj_ = res.data.data;
          this.jugePayStatus(this.details.status)
          this.jugePay(obj_.paymentMethod)
          this.formLabelAlign = {
            orderId: obj_.orderId,
            recipient: obj_.recipient,
            allPrice: obj_.allPrice,
            paymentMethod: this.payName,
            status: this.payStatus,
            create_time: obj_.create_time
          };
        }
      });
    },
    jugePay(num){
      if(num==1){
        this.payName="支付宝"
      }else if(num==2){
        this.payName="微信"
      }else{
        this.payName="银联"
      }
    },
    jugePayStatus(num){
      if(num==1){
        this.payStatus="未支付"
      }else if(num==2){
        this.payStatus="已支付"
      }else{
        this.payStatus="已取消"
      }
    },
    //分页
    current_change(currentPage) {
      this.currentPage = currentPage;
      this.getOrderData();
    }
  }
};
</script>
<style lang="less">
</style>