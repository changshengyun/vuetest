<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const orders = ref([
  {
    id: '20230815001',
    user: '王小明',
    amount: 158.0,
    status: '已发货',
    createTime: '2023-08-15 09:30'
  },
  {
    id: '20230814003',
    user: '张伟',
    amount: 299.0,
    status: '待付款',
    createTime: '2023-08-14 14:20'
  },
  {
    id: '20230813002',
    user: '李芳',
    amount: 458.0,
    status: '已完成',
    createTime: '2023-08-13 16:45'
  }
])
const changeStatus = (orderId, newStatus) => {
  const order = orders.value.find(item => item.id === orderId)
  if (order) {
    order.status = newStatus
    ElMessage.success('状态修改成功')
    filterOrders() // 刷新过滤列表
  }
}

const searchKeyword = ref('')
const selectedStatus = ref('')
const filteredOrders = ref(orders.value)

const filterOrders = () => {
  filteredOrders.value = orders.value.filter(order => {
    const matchesKeyword =
      order.id.includes(searchKeyword.value) ||
      order.user.includes(searchKeyword.value)
    const matchesStatus =
      !selectedStatus.value || order.status === selectedStatus.value
    return matchesKeyword && matchesStatus
  })
}
</script>

<template>
  <div class="order-management">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h2>订单管理</h2>
          <div class="filter-container">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索订单号或用户名"
              clearable
              @input="filterOrders"
              style="width: 240px"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select
              v-model="selectedStatus"
              placeholder="订单状态"
              clearable
              @change="filterOrders"
              style="width: 120px; margin-left: 10px"
            >
              <el-option label="待付款" value="待付款" />
              <el-option label="已发货" value="已发货" />
              <el-option label="已完成" value="已完成" />
            </el-select>
          </div>
        </div>
      </template>

      <el-table :data="filteredOrders" class="order-table">
        <el-table-column prop="id" label="订单号" width="200" />
        <el-table-column prop="user" label="用户" width="160" />
        <el-table-column prop="amount" label="金额" width="160">
          <template #default="{ row }"> ¥{{ row.amount.toFixed(2) }} </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="160">
          <template #default="{ row }">
            <el-tag
              :type="{
                待付款: 'warning',
                已发货: 'primary',
                已完成: 'success'
              }[row.status]"
            >
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button type="text" size="small">详情</el-button>
            <el-divider direction="vertical" />
            <el-dropdown>
              <el-button type="text" size="small">
                操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item 
                    v-for="status in ['待付款', '已发货', '已完成']" 
                    :key="status"
                    @click="changeStatus(row.id, status)"
                    :disabled="row.status === status"
                  >
                    {{ status }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.order-management {
  background: #f8fafc;
  width: 1800px;
  margin: 0 auto;
}

.box-card {
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-container {
  display: flex;
  align-items: center;
}

.order-table {
  margin-top: 12px;
}

.order-table :deep(.el-table__header) th {
  background: #f8fafc;
  font-weight: 600;
  color: #606266;
}

.el-dropdown {
  vertical-align: middle;
}
</style>