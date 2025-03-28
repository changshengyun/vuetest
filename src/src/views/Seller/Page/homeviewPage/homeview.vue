<script>
import MainLayout from '../Layout/Layout.vue';

export default {
  components: { MainLayout },
  data() {
    return {
      stats: [
        {
          title: '今日销售额',
          value: 24580,
          icon: 'el-icon-money',
          trend: 'up',
          color: '#67c23a',
          format: v => `¥${v.toLocaleString()}`
        },
        {
          title: '订单数量',
          value: 189,
          icon: 'el-icon-document-checked',
          trend: 'down',
          color: '#409eff',
          format: v => `${v} 单`
        },
        {
          title: '用户增长',
          value: '+12.5%',
          icon: 'el-icon-user',
          trend: 'up',
          color: '#e6a23c',
          format: v => v
        },
        {
          title: '商品总数',
          value: 1568,
          icon: 'el-icon-box',
          trend: 'steady',
          color: '#f56c6c',
          format: v => `${v.toLocaleString()} 件`
        }
      ]
    }
  }
}
</script>

<template>
  <MainLayout>
    <el-main>
      <el-row :gutter="20" class="dashboard-cards">
        <el-col 
          v-for="(item, index) in stats" 
          :key="index"
          :xs="24" :sm="12" :md="6"
        >
          <el-card class="stat-card">
            <div class="card-content">
              <div class="icon-wrapper" :style="{backgroundColor: item.color}">
                <el-icon :size="28" color="#fff">
                  <component :is="item.icon" />
                </el-icon>
              </div>
              <div class="card-info">
                <h3>{{ item.title }}</h3>
                <p class="value">{{ item.format(item.value) }}</p>
                <div class="trend" :class="item.trend">
                  <el-icon v-if="item.trend === 'up'"><top /></el-icon>
                  <el-icon v-if="item.trend === 'down'"><bottom /></el-icon>
                  {{ item.trend === 'up' ? '+12.5%' : '-3.2%' }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </MainLayout>
</template>

<style scoped>
.stat-card {
  position: relative;
  overflow: hidden;
  
  .card-content {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-info {
    flex: 1;
    
    h3 {
      margin: 0 0 4px;
      font-size: 14px;
      color: #909399;
    }

    .value {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
      color: #303133;
    }

    .trend {
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 4px;

      &.up { color: #67c23a; }
      &.down { color: #f56c6c; }
    }
  }
}
</style>