<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-button type="primary" size="mini" style="float: left;" @click="createRoleData">创建角色</el-button>
    </div>
    <template>
      <el-table :data="roleDate" style="width: 100%">
        <el-table-column prop="name" label="角色名称" width="180"></el-table-column>
        <el-table-column prop="create_time" label="创建时间">
          <template slot-scope="scope">{{new Date(scope.row.create_time).toLocaleString()}}</template>
        </el-table-column>
        <el-table-column prop="auth_time" label="授权时间">
          <template
            slot-scope="scope"
          >{{scope.row.auth_time?new Date(scope.row.auth_time).toLocaleString():''}}</template>
        </el-table-column>
        <el-table-column prop="auth_name" label="授权人"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="setRole(scope.row)">设置权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页插件 -->
    <el-pagination
      class="pagination"
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="currentPage"
      @current-change="current_change"
      :page-size="pagesize"
    ></el-pagination>
    <!-- 用户信息添加和修改 -->
    <el-dialog title="设置权限" :visible.sync="dialogVisible" width="30%" center>
      <div style="text-align:center">
        <el-tag>当前设置角色:{{setName}}</el-tag>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-tree
          :data="CheckRoleData"
          show-checkbox
          node-key="id"
          :default-expanded-keys="defaultExpanded"
          :default-checked-keys="defaultChecked"
          :props="defaultProps"
          ref="tree"
        ></el-tree>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRoleData">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>

import { getRoleList, createRole ,updateRole} from "../api/common";
import menuList from '../../menu.config'

export default {
  data() {
    return {
      roleDate: [],
      loading: false, //加载动画
      total: +"",
      pagesize: 5, //每页的数据条数
      currentPage: 1, //默认开始页面
      dialogVisible: false,
      CheckRoleData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      defaultChecked: [],
      setName: "",
      role: { auth_name: sessionStorage.userInfo_name }
    };
  },
  methods: {
    //获取
    getRoleData() {
      getRoleList({ pageNum: this.currentPage, pageSize: this.pagesize }).then(
        res => {
          if (res.data.status == 0) {
            this.roleDate = res.data.data.list;
            this.total = res.data.data.total;
          } else {
            this.$message({
              type: "error",
              message: "数据获取失败",
              center: true
            });
          }
        }
      );
    },
    //创建角色
    createRoleData() {
      this.$prompt("请输入角色名", "添加角色", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        createRole({ roleName: value }).then(res => {
          if (res.data.status == 0) {
            this.$message({
              type: "success",
              message: "角色添加成功！"
            });
          } else {
            this.$message({
              type: "error",
              message: "角色添加失败！"
            });
          }
          this.getRoleData();
        });
      });
    },
    //设置权限
    setRole(obj) {
      this.defaultChecked = obj.menus;
      this.$refs.tree.setCheckedKeys(this.defaultChecked);
      this.dialogVisible = true;
      this.setName = obj.name;
      this.role._id = obj._id;
    },
    //确定设置权限
    updateRoleData() {
                this.dialogVisible = false;
                this.role.menus = this.$refs.tree.getCheckedKeys();
                this.role.auth_time=new Date().getTime()
                updateRole(this.role).then((res) => {
                    if (res.data.status == 0) {
                        this.$message({
                            type: 'success',
                            message: '角色权限更新成功！',
                            center: true
                        });
                        this.getRoleData();
                    } else {
                        this.$message({
                            type: 'error',
                            message: '角色权限更新失败！',
                            center: true
                        });
                    }
                })
            },
    //递归初始tree(没明白)
    initCheckRoleData(menuList) {
      return menuList.map(item => {
        if (item.children) {
          let children = this.initCheckRoleData(item.children);
          return {
            id: item.key,
            label: item.title,
            children
          };
        } else {
          return {
            id: item.key,
            label: item.title
          };
        }
      });
    },
    //分页
    current_change(currentPage) {
      this.currentPage = currentPage;
      this.getRoleData();
    }
  },
  mounted() {
    this.getRoleData();
    this.CheckRoleData = this.initCheckRoleData(menuList);
  },
  computed: {
    defaultExpanded() {
      return this.CheckRoleData.map(item => item.id);
    }
  }
};
</script>
<style lang="less">
.pagination {
  text-align: center;
  margin-top: 20px;
}
</style>