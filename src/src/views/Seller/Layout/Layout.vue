<template>
  <el-container class="main-container">
    <!-- 头部导航 -->
    <el-header class="header">
      <img src="@/assets/images/newlogo.jpg" alt="logo" class="logo">
      <div class="nav-items">
        <div v-for="(item, index) in navItems" :key="index" :class="['nav-item', { active: activeIndex === item.path }]"
          @click="handleNavSelect(item.path)">
          {{ item.title }}
        </div>
      </div>
      <div class="user-info">
        <span class="username">username</span>
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
          <h4>Customer Service</h4>
          <h4>Online Support</h4>
          <h4>Feedback</h4>
        </div>
        <div class="footer-col">
          <h4>Follow Us</h4>
          <h4>Official Account</h4>
          <h4>Weibo</h4>
        </div>
        <div class="footer-col">
          <h4>Download App</h4>
          <h4>Scan QR Code</h4>
          <h4>Download Now</h4>
          <h4>Download Page</h4>
        </div>
        <div class="footer-col">
          <h4>Service Hotline</h4>
          <h4>400-0000-000</h4>
          <h4>Mon-Sun 8:00-18:00</h4>
        </div>
      </div>
      <div class="divider"></div>
      <div class="footer-features">
        <span>Affordable Prices</span>
        <span>Fast Delivery</span>
        <span>Fresh Quality</span>
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
        { title: 'My Store', path: '/seller/dashboard' },
        { title: 'Products Management', path: '/seller/productManagement' },
        { title: 'Orders Management', path: '/seller/orderManagement' },

      ],
      footerLinks: [
        'About Us',
        'Help Center',
        'After-sales',
        'Partnership',
        'Recommendations',
        'Links'
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
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
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
    color: #000000;
    font-size: 14px;
  }
}

.unified-footer {
  background: #252424;
  padding: 40px 10%;
  color: #252424;
  height: 310px;
}

.footer-columns {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  margin-bottom: 30px;
}

.footer-col h4 {
  color: #d0d0d0;
  margin-bottom: 15px;
  font-size: 16px;
}


.divider {
  border-top: 1px solid #ffffff;
  margin: 20px 0;
}

.footer-features {
  text-align: center;
  margin: 20px 0;
  font-size: 16px;

  span {
    margin: 0 20px;
    color: #409EFF;
    /*价格亲民*/
  }
}

.header img {
  height: 40px;
  /* 根据实际图片比例调整 */
  margin-right: 28px;
}

.footer-links {
  text-align: center;

  a {
    color: #cfcccc;
    /*关于我们。。。*/
    margin: 0 15px;
    font-size: 14px;
    cursor: pointer;

    &:hover {
      color: #409EFF;
    }
  }
}
</style>