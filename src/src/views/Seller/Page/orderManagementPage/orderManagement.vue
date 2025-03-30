<script setup>
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import axios from 'axios'

const orders = ref([])
const searchKeyword = ref('')
const selectedStatus = ref('')
const filteredOrders = ref([])
const showDetailDialog = ref(false)  // 控制详情弹窗
const selectedOrder = ref(null)      // 当前选中订单详情

// 后端接口配置
const API = {
  GET_ORDERS: 'http://192.168.43.115:3007/api/getorder',
  UPDATE_STATUS: 'http://192.43.115.100:3007/api/order'
}

// 获取订单数据
const fetchOrders = async () => {
  try {
    const response = await axios.get(API.GET_ORDERS)
    orders.value = response.data.data 
    filterOrders()
  } catch (error) {
    if (error.response) {
      ElMessage.error(`服务器错误: ${error.response.data.message}`)
    } else if (error.request) {
      ElMessage.error('网络异常，请检查连接')
    } else {
      ElMessage.error('请求配置错误')
    }
  }
}
// 显示订单详情
const showOrderDetail = (order) => {
  selectedOrder.value = order
  showDetailDialog.value = true
}

// 修改订单状态
const changeStatus = async (orderId, newStatus) => {
  try {
    // 发送PUT请求到真实接口（根据后端实际情况调整方法）
    const response = await axios.put(
      API.UPDATE_STATUS,
      { 
        order_id: orderId,  // 按照示例接口要求传递order_id
        status: newStatus 
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // 添加认证头
        }
      }
    )

    // 根据后端返回结构处理响应
    if (response.data.status === 0) {
      // 更新本地数据
      const index = orders.value.findIndex(order => order.order_id === orderId)
      if (index !== -1) {
      orders.value[index] = {
          ...orders.value[index],
          ...response.data.data,
          status: newStatus,
        }
      }
      ElMessage.success('状态更新成功')
      filterOrders() // 刷新过滤后的列表
    } else {
      ElMessage.error(`操作失败：${response.data.message}`)
    }
  } catch (error) {
    // 增强错误处理
    if (error.response) {
      const { status, data } = error.response
      if (status === 401) {
        ElMessage.error('登录过期，请重新登录')
        router.push('/login')
      } else {
        ElMessage.error(`服务器错误：${data.message || '未知错误'}`)
      }
    } else if (error.request) {
      ElMessage.error('网络连接异常，请检查网络')
    } else {
      ElMessage.error('请求配置错误')
    }
  }
}

// 过滤订单
const filterOrders = () => {
  filteredOrders.value = orders.value.filter(order => {
    const matchesKeyword =
      order.order_id.includes(searchKeyword.value) || // 改为order_id
      order.recipient.includes(searchKeyword.value) || // 改为recipient
      order.phone.includes(searchKeyword.value) // 新增电话搜索
    const matchesStatus = !selectedStatus.value || order.status === selectedStatus.value
    return matchesKeyword && matchesStatus
  })
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="order-management">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h2>Order Management</h2>
          <div class="filter-container">
            <el-input v-model="searchKeyword" placeholder="Search order ID, name or phone" clearable @input="filterOrders"
              style="width: 240px">
              <template #prefix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
            <el-select v-model="selectedStatus" placeholder="Status" clearable @change="filterOrders"
              style="width: 120px; margin-left: 10px">
              <el-option label="Pending Payment" value="paid" />
              <el-option label="Shipped" value="shipped" />
              <el-option label="Completed" value="completed" />
            </el-select>
          </div>
        </div>
      </template>

      <el-table :data="filteredOrders" class="order-table">
        <el-table-column prop="order_id" label="Order ID" width="200" />
        <el-table-column prop="recipient" label="User" width="160" />
        <el-table-column prop="phone" label="Phone" width="160" />
        <el-table-column prop="total_amount" label="Amount" width="160">
          <template #default="{ row }"> ¥{{ Number(row.total_amount).toFixed(2) }} </template>
        </el-table-column>
        <el-table-column label="Address" width="240">
          <template #default="{ row }">
            {{ row.province }}{{ row.city }}{{ row.district }}{{ row.street }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Status" width="160">
          <template #default="{ row }">
            <el-tag :type="{
              paid: 'warning',
              shipped: 'primary',
              completed: 'success'
            }[row.status]">
              {{
                {
                  paid: 'Pending Payment',
                  shipped: 'Shipped',
                  completed: 'Completed'
                }[row.status]
              }}

            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="Create Time" />
        <el-table-column label="Actions" width="200" align="center">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="showOrderDetail(row)">
              Details
            </el-button>
            <el-divider direction="vertical" />

            <el-dropdown>
              <el-button type="text" size="small">
                Actions<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="[statusValue, statusLabel] in [
                    ['paid', 'Pending Payment'],
                    ['shipped', 'Shipped'],
                    ['completed', 'Completed']
                  ]" :key="statusValue" @click="changeStatus(row.order_id, statusValue)"
                    :disabled="row.status === statusValue">
                    {{ statusLabel }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 商品详情弹窗 -->
    <el-dialog v-model="showDetailDialog" title="Order Details" width="800px">
      <div v-if="selectedOrder" class="order-detail">
        <div v-for="(item, index) in selectedOrder.items" :key="index" class="detail-item">
          <el-row :gutter="20" align="middle">
            <el-col :span="4">
              <el-image :src="item.main_image || '/default-image.jpg'" fit="cover" style="width: 100px; height: 100px"
                :preview-src-list="[item.main_image || '/default-image.jpg']" />
            </el-col>
            <el-col :span="20">
              <div class="item-info">
                <h4>{{ item.title }}</h4>
                <div class="meta">
                  <span>quantity：{{ item.quantity }}</span>
                  <span>unit price：¥{{ item.unit_price.toFixed(2) }}</span>
                  <span>total price：¥{{ item.total_price.toFixed(2) }}</span>
                </div>
                <div class="product-id">
                  product id：{{ item.product_id }}
                </div>
              </div>
            </el-col>
          </el-row>
          <el-divider v-if="index < selectedOrder.items.length - 1" />
        </div>
      </div>
    </el-dialog>
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

.order-detail {
  padding: 0 20px;
}

.detail-item {
  margin-bottom: 20px;
}

.item-info h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #303133;
}

.meta {
  display: flex;
  gap: 20px;
  margin-bottom: 8px;
  color: #606266;
}

.product-id {
  color: #909399;
  font-size: 12px;
}

.el-divider {
  margin: 15px 0;
}
</style>