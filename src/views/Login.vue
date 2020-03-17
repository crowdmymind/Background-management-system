<template>
    <div class="back">

        <div class="warp_nav">
            <img src="../assets/logo.png">
        </div>

        <el-container class="l-contain">
           <div class="form-box">
             <h1>登录</h1>
            <el-form status-icon :model="form" :rules="rules" ref="loginForm">
                <el-form-item prop="username">
                    <el-input  placeholder="请输入用户名" prefix-icon="el-icon-user" v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input placeholder="请输入密码" type="password"  prefix-icon="el-icon-lock" v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item>
                 <el-button type="primary" :plain="true" @click="onSubmit('loginForm')">登录</el-button>
                </el-form-item>
            </el-form>
           </div>
        </el-container>

    </div>
</template>

<script>

import {getLogin} from '../api/common'

export default {
    data(){
        return {
            form:{
              username:"",
              password:""
           },
           rules:{
               username:[{ required: true, message: '用户名不能为空', trigger: 'blur' },
                         { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }],
               password:[
                         { required: true, message: '密码不能为空', trigger: 'blur' },
                         { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' },
                        //  { len: 5, message: '长度为5位 ', trigger: 'blur' }
               ]
           }
        }
    },
    methods: {
        onSubmit(loginForm){
           this.$refs[loginForm].validate((valid) => {
               if (valid) {

                   //发请请求

                     getLogin(this.form).then((res)=>{
                         
                         if(!res.data.status){
                            sessionStorage.userInfo_name = this.form.username
                            sessionStorage.userInfo = JSON.stringify(res.data)
                            this.$store.commit("CHANGEUSERINFO",res.data.data)
                            this.$router.replace("/home")
                            this.$message({
                            message: '恭喜你，登录成功',
                            type: 'success'
                            });
                         }else{
                             this.$message({
                             message: '警告！登陆失败，账号或密码错误，请重新输入',
                             type: 'warning'
                            });
                         }
                     })
                } else {
                    this.$message({
                            message: '警告！请输入账号和密码！！！',
                            type: 'warning'
                            });
                    return false;
                }
            });
        }
    },
}
</script>

<style lang="less">
    *{
        padding:0;
        margin:0;
    }
    .warp_nav{
        position:relative;
        width:100%;
        height:80px;
        line-height:80px;
        text-align:center;
        background-color:hsla(0,0%,100%,.2);
    }
    .warp_nav img{
        width:300px;
        height:70px;    
        border-radius: 5px;
        margin-top: 10px;
        
    }
    #nav{
        padding:0;
    }
    .back{
        width:100vw;
        height:100vh;
        background:url(../assets/黑色皮草.jpg) no-repeat;
        background-size:cover;
    }
    .l-contain{
        height: 100%;
    }
    h1{
        margin-bottom: 30px;
        margin-top: 10px;
    }
    .form-box{
        width: 400px;
        height:300px;
        margin: 50px auto;
        padding: 20px 40px;
        box-sizing: border-box;
        background-color:hsla(0,0%,100%,.3);
    }
      .form-box button{
          width: 100%
      }
</style>