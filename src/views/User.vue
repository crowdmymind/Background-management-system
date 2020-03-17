<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-button type="primary" size="mini" style="float: left;" @click="openRander">创建用户</el-button>
    </div>
    <template>
      <el-table :data="userDate" style="width: 100%">
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="create_time" label="注册时间">
          <template slot-scope="scope">{{new Date(scope.row.create_time).toLocaleString()}}</template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="role_id" label="权限角色">
          <template slot-scope="scope">{{getRole(scope.row.role_id)}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="openRander(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="deleteUserData(scope.row)">删除</el-button>
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
    <!-- 用户信息添加和修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="centerDialogVisible" width="30%" center>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="show">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id" ref="role_user_id">
          <el-select v-model="ruleForm.role_id" placeholder="请选择用户权限角色">
            <el-option
              v-for="(role,index) in roles"
              :key="index"
              :label="role.name"
              :value="role._id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateUserData">确定修改</el-button>
        <el-button type="primary" @click="addUserData">确定添加</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { getUserList, deleteUser, addUser, updateUser } from "../api/common";

export default {
  data() {
    return {
      pagesize: 5,
      currentPage: 1,
      total: 0,
      roles: [],
      msg: {},
      userDate: [],
      dialogTitle: "",
      show: true,
      centerDialogVisible: false,
      ruleForm: {
        username: "",
        password: "",
        phone: "",
        email: "",
        role_id: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 2,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 2,
            max: 10,
            message: "长度在 6 到 16 个字符",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          {
            pattern: /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/,
            message: "请输入正确的手机号格式",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: "请输入正确的邮箱格式",
            trigger: "blur"
          }
        ],
        role_id: [
          {
            required: true,
            message: "请选择权限角色",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    getUserData() {
      getUserList({pageNum:this.currentPage, pageSize:this.pagesize}).then(res => {
        if (res.data.status == 0) {
          this.userDate = res.data.data.list;
          this.roles = res.data.data.roles;
          this.total = res.data.data.total;
        } else {
          this.$message({
            type: "error",
            message: "数据获取失败",
            center: true
          });
        }
      });
    },
    deleteUserData(obj) {
      this.$confirm("确认删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteUser({userId:obj._id}).then(res => {

          if (res.data.status == 0) {
            this.getUserData();
            this.$message({
              type: "success",
              message: "删除用户成功!"
            });
            this.getUserData();
          } else {
            this.$message({
              type: "error",
              message: "删除用户失败！",
              center: true
            });
          }
        });
      });
    },
    openRander(obj) {
      this.centerDialogVisible = true;
      if (obj && obj._id) {
        this.show = false;
        this.dialogTitle = "修改用户";
        this.msg = this.userDate.find(item => {
          return item._id == obj._id;
        });
        this.ruleForm = {
          _id: obj._id,
          username: this.msg.username,
          phone: this.msg.phone,
          email: this.msg.email,
          role_id: this.msg.role_id
        };
        this.msg = this.ruleForm;
      } else {
        this.dialogTitle = "添加用户";
        this.ruleForm={}
      }
    },
    updateUserData() {
      updateUser(this.msg).then(res => {
        if (res.data.status == 0) {
          this.$refs["ruleForm"].resetFields();
          this.centerDialogVisible = false;
          this.getUserData();
          this.$message({
            type: "success",
            message: "修改用户成功！",
            center: true
          });
        } else {
          this.$message({
            type: "error",
            message: "修改用户失败！",
            center: true
          });
        }
      });
    },
    getRole(roleId) {
      let user_role = this.roles.find(item => {
        return item._id == roleId;
      });
      return user_role.name;
    },
    addUserData() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let userMsg = this.ruleForm;
          addUser(userMsg).then(res => {
            if (res.data.status == 0) {
              this.$refs["ruleForm"].resetFields();
              this.centerDialogVisible = false;
              this.getUserData();
              this.$message({
                type: "success",
                message: "添加用户成功！",
                center: true
              });
            } else {
              this.$message({
                type: "error",
                message: "添加用户失败！",
                center: true
              });
            }
          });
        }
      });
    },
    current_change: function(currentPage) {
      this.currentPage = currentPage;
      this.getUserData();
    }
  },
  mounted() {
    this.getUserData();
  }
};
</script>
<style lang="less">
.el-card__header {
  height: 65px;
}
</style>