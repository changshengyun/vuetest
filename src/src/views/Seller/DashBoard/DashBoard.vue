<script setup>
import { ref } from 'vue'
import { DocumentChecked, Money, User, Box, Top, Bottom } from '@element-plus/icons-vue'

const stats = ref([
  {
    title: 'Today Sales',
    value: 24580,
    icon: Money,
    trend: 'up',
    color: '#67c23a',
    format: v => `¥${v.toLocaleString()}`
  },
  {
    title: 'Orders',
    value: 189,
    icon: DocumentChecked,
    trend: 'down',
    color: '#409eff',
    format: v => `${v} `
  },
  {
    title: 'User Growth',
    value: '+12.5%',
    icon: User,
    trend: 'up',
    color: '#e6a23c',
    format: v => v
  },
  {
    title: 'Total Products',
    value: 1568,
    icon: Box,
    trend: 'steady',
    color: '#f56c6c',
    format: v => `${v.toLocaleString()} `
  }
])
</script>

<template>
  <el-main>
    <el-row :gutter="20" class="dashboard-cards">
      <el-col v-for="(item, index) in stats" :key="index" :xs="24" :sm="12" :md="12">
        <div class="col-container">
        <el-card class="stat-card">
          <div class="card-content">
            <div class="icon-wrapper" :style="{ backgroundColor: item.color }">
              <el-icon :size="28" color="#fff">
                <component :is="item.icon" />
              </el-icon>
            </div>
            <div class="card-info">
              <h3>{{ item.title }}</h3>
              <p class="value">{{ item.format(item.value) }}</p>
              <div class="trend" :class="item.trend">
                <el-icon v-if="item.trend === 'up'"><Top /></el-icon>
                <el-icon v-if="item.trend === 'down'"><Bottom /></el-icon>
                <span v-if="item.trend !== 'steady'">
                  {{ item.trend === 'up' ? '+12.5%' : '-3.2%' }}
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      </el-col>
    </el-row>
  </el-main>
</template>

<style scoped>
.stat-card {
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.icon-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-info {
  flex: 1;
}

h3 {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.value {
  margin: 4px 0;
  font-size: 22px;
  font-weight: 600;
  color: #303133;
}

.trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.trend.up {
  color: #67c23a;
}

.trend.down {
  color: #f56c6c;
}
.dashboard-cards {
  min-height: 500px; /* 根据实际内容调整 */
}

.col-container {
  height: 100%;
}

.stat-card {
  height: 100%; /* 关键：使卡片撑满容器高度 */
  /* 原有样式保留 */
}
</style>
