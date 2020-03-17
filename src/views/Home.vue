<template>
  <div>
    <el-container>
      <el-header style="padding:0;">
        <div class="home_nav">
          <div class="home_logo">
            <img src="../assets/logo.png" />
          </div>
          <div class="home_user">
            <span class="head" style="margin-right:20px">
              <img src="../assets/bg.png" />
            </span>
            <span class="user_name">{{username}}</span>
            <div class="line"></div>
            <el-button style="color: skyblue;border: 1px solid white;" @click="open">退出登录</el-button>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <div class="content">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
            >
              <el-submenu index="1" >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span style="margin-right:75px;">首页</span>
                </template>
                  <el-menu-item-group>
                  <el-menu-item index="1-1" @click="handelJump('/home/maps')">
                    <i class="el-icon-platform-eleme"></i>首页
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">
                  <i class="el-icon-user"></i>
                  <span style="margin-right:75px;">用户</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="2-1" @click="handelJump('/home/user')">
                    <i class="el-icon-user-solid"></i>用户管理
                  </el-menu-item>
                  <el-menu-item index="2-2" @click="handelJump('/home/purview')">
                    <i class="el-icon-s-tools"></i>权限管理
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">
                  <i class="el-icon-goods"></i>
                  <span style="margin-right:75px;">商品</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="3-1" @click="handelJump('/home/category')">
                    <i class="el-icon-s-shop"></i>品类管理
                  </el-menu-item>
                  <el-menu-item index="3-2" @click="handelJump('/home/goods')">
                    <i class="el-icon-s-grid"></i>商品管理
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="4">
                <template slot="title">
                  <i class="el-icon-document"></i>
                  <span style="margin-right:75px;">订单</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="4-2" @click="handelJump('/home/order')">
                    <i class="el-icon-s-order"></i>订单管理
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </div>
        </el-aside>
        <el-main>
          <div class="content_txt">
            <router-view>
              
            </router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // username: this.$store.state.app.userInfo.username
      username: sessionStorage.userInfo_name
    };
  },
  mounted() {
    this.$router.push({path:'/home/maps'})
  },
  methods: {
    handleOpen() {
    },
    handleClose() {
    },
    handelJump(val) {
      this.$router.push({
        path: val
      });
    },
    open() {
      this.$confirm("确定退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //退出登录回调函数
        this.$message({
          type: "success",
          message: "已退出!"
        });

        // 跳转到login
        // this.$router.push('/login')
        this.$router.replace("/login");
      });
    }
  }
};
</script>

<style lang="less">
* {
  padding: 0;
  margin: 0;
}
body {
  background-color: #f3f3f3;
}
.home_nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  background-color: white;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.05);
}
.home_logo {
  width: 200px;
  height: 60px;
  background-color: #32323a;
}
#app {
  height: 100vh;
}
.el-menu {
  height: 100%;
}
.home_logo img {
  margin-top: 10px;
  width: 160px;
  height: auto;
  max-width: 100%;
}
.home_user {
  width: 220px;
  height: 40px;
  margin-right: 20px;
  font-size: 14px;
}
.head {
  float: left;
  display: inline-block;
  width: 40px;
  height: 40px;
  overflow: hidden;
  border-radius: 50%;
  margin-right: 5px;
}
.head img {
  width: 40px;
  height: 40px;
}
.user_name {
  display: inline-block;
  float: left;
  text-align: center;
  width: 40px;
  height: 40px;
  line-height: 40px;
  margin-right: 5px;
}
.line {
  display: inline-block;
  width: 1px;
  height: 1em;
  margin: 0 8px;
  background-color: #dcdfe6;
  position: relative;
  right: 0px;
  top: 4px;
}
.el-header {
  padding: 0;
}
.content {
  background: black;
  width: 200px;
  height: 91.5vh;
}
.el-menu-item {
  padding: 0px !important;
}
.content_txt {
  width: 82vw;
  height: 82vh;
  margin: 15px auto;
}
</style>