<template>
  <el-container class="main-container">
    <!-- 头部导航 -->
    <el-header class="header">
      <div class="logo">Marvo Market</div>
      <div class="nav-items">
        <div 
          v-for="(item, index) in navItems" 
          :key="index"
          :class="['nav-item', { active: activeIndex === item.path }]"
          @click="handleNavSelect(item.path)"
        >
          {{ item.title }}
        </div>
      </div>
      <div class="user-info">
        <el-avatar :size="32" icon="el-icon-user-solid"></el-avatar>
        <span class="username">用户名</span>
      </div>
    </el-header>

    <!-- 内容区域 -->
    <el-container>
      <router-view></router-view>
    </el-container>

    <!-- 统一底部 -->
    <el-footer class="unified-footer">
      <div class="footer-columns">
        <div class="footer-col">
          <h4>客户服务</h4>
          <p>在线客服</p>
          <p>问题反馈</p>
        </div>
        <div class="footer-col">
          <h4>关注我们</h4>
          <p>公众号</p>
          <p>微博</p>
        </div>
        <div class="footer-col">
          <h4>下载APP</h4>
          <p>扫描二维码</p>
          <p>立马下载APP</p>
          <p>下载页面</p>
        </div>
        <div class="footer-col">
          <h4>服务热线</h4>
          <p>400-0000-000</p>
          <p>周一至周日 8:00-18:00</p>
        </div>
      </div>
      <div class="divider"></div>
      <div class="footer-features">
        <span>价格亲民</span>
        <span>物流快捷</span>
        <span>品质新鲜</span>
      </div>
      <div class="footer-links">
        <a v-for="(link, index) in footerLinks" :key="index">{{ link }}</a>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '/',
      navItems: [
        { title: '我的店铺', path: '/seller/dashboard' },
        { title: '商品管理', path: '/seller/productManagement' },
        { title: '订单管理', path: '/seller/orderManagement' },
        // { title: '我的店铺', path: '/seller/store' }
      ],
      footerLinks: [
        '关于我们',
        '帮助中心',
        '售后服务',
        '商务合作',
        '搜索推荐',
        '友情链接'
      ]
    }
  },
  methods: {
    handleNavSelect(path) {
      this.activeIndex = path
      this.$router.push(path)
    }
  }
}
</script>

<style scoped>
.main-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  display: flex;
  align-items: center;
  padding: 0 40px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  height: 60px;
}

.logo {
  font-size: 24px;
  font-weight: 600;
  color: #409EFF;
  margin-right: 50px;
}

.nav-items {
  display: flex;
  gap: 30px;
}

.nav-item {
  color: #606266;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s;
}

.nav-item:hover {
  background: #ecf5ff;
  color: #409EFF;
}

.nav-item.active {
  color: #409EFF;
  font-weight: 500;
}

.user-info {
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 10px;
  
  .username {
    color: #606266;
    font-size: 14px;
  }
}

.unified-footer {
  background: #f5f7fa;
  padding: 40px 10%;
  color: #606266;
}

.footer-columns {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  margin-bottom: 30px;
}

.footer-col h4 {
  color: #303133;
  margin-bottom: 15px;
  font-size: 16px;
}

.footer-col p {
  margin: 8px 0;
  font-size: 14px;
  cursor: pointer;
}

.divider {
  border-top: 1px solid #e4e7ed;
  margin: 20px 0;
}

.footer-features {
  text-align: center;
  margin: 20px 0;
  font-size: 16px;
  
  span {
    margin: 0 20px;
    color: #409EFF;
  }
}

.footer-links {
  text-align: center;
  
  a {
    color: #606266;
    margin: 0 15px;
    font-size: 14px;
    cursor: pointer;
    
    &:hover {
      color: #409EFF;
    }
  }
}
</style>