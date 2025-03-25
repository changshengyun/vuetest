<template>
  <el-main class="management-content">
    <el-card class="product-card">
      <template #header>
        <div class="card-header">
          <h2>商品管理</h2>
          <div class="filter-container">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索商品名称"
              clearable
              @input="filterProducts"
              style="width: 240px"
              :prefix-icon="Search"
              class="input-with-gradient"
            />
          </div>
        </div>
      </template>

      <el-table :data="filteredProducts" class="product-table">
        <el-table-column label="封面" width="100" align="center">
          <template #default>
            <el-tooltip content="点击查看大图">
              <template #content>
                <img :src="productImageUrl" alt="商品图片" style="max-width: 100%; max-height: 100%">
              </template>
              <el-avatar :size="50" :icon="Picture" class="product-thumb" />
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="商品名称" min-width="220">
          <template #default="{ row }">
            <div class="product-info">
              <span class="name">{{ row.name }}</span>
              <el-tag v-if="row.stock < 10" size="small" type="warning" class="stock-tag">
                仅剩{{ row.stock }}件
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="价格" width="130" align="center">
          <template #default="{ row }">
            <span class="price">¥{{ row.price.toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="库存" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.stock > 0 ? 'success' : 'danger'" effect="plain">
              {{ row.stock }} 件
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '在售' ? 'success' : 'danger'" effect="plain">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" align="center">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button type="text" size="small" class="delete-btn" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="toolbar-footer">
        <el-button type="primary" :icon="Plus" plain class="add-product-btn" @click="handleAdd">新增商品</el-button>
      </div>
    </el-card>

    <!-- 新增商品对话框 -->
    <el-dialog :visible.sync="addDialogVisible" title="新增商品">
      <template #content>
        <el-form :model="newProduct" ref="addFormRef">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="newProduct.name" />
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model.number="newProduct.price" />
          </el-form-item>
          <el-form-item label="库存" prop="stock">
            <el-input v-model.number="newProduct.stock" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="newProduct.status">
              <el-option label="在售" value="在售" />
              <el-option label="缺货" value="缺货" />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑商品对话框 -->
    <el-dialog :visible.sync="editDialogVisible" title="编辑商品">
      <template #content>
        <el-form :model="editProduct" ref="editFormRef">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="editProduct.name" />
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model.number="editProduct.price" />
          </el-form-item>
          <el-form-item label="库存" prop="stock">
            <el-input v-model.number="editProduct.stock" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="editProduct.status">
              <el-option label="在售" value="在售" />
              <el-option label="缺货" value="缺货" />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEdit">确定</el-button>
      </template>
    </el-dialog>
  </el-main>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Plus, Picture, Search } from '@element-plus/icons-vue';

const searchKeyword = ref('');
const products = ref([
  { id: 1, name: '商品A', price: 199, stock: 5, status: '在售' },
  { id: 2, name: '商品B', price: 299, stock: 0, status: '缺货' },
  { id: 3, name: '商品C', price: 399, stock: 15, status: '在售' }
]);

const filteredProducts = computed(() => {
  return products.value.filter(p =>
    p.name.includes(searchKeyword.value)
  );
});

// 新增商品对话框相关
const addDialogVisible = ref(false);
const newProduct = ref({
  name: '',
  price: 0,
  stock: 0,
  status: '在售'
});
const addFormRef = ref(null);

// 编辑商品对话框相关
const editDialogVisible = ref(false);
const editProduct = ref({});
const editFormRef = ref(null);

// 过滤商品
const filterProducts = () => {
  // 过滤逻辑
};

// 处理新增商品
const handleAdd = () => {
  addDialogVisible.value = true;
  newProduct.value = {
    name: '',
    price: 0,
    stock: 0,
    status: '在售'
  };
};

// 确认新增商品
const confirmAdd = () => {
  const newId = Math.max(...products.value.map(p => p.id)) + 1;
  const newItem = { ...newProduct.value, id: newId };
  products.value.push(newItem);
  addDialogVisible.value = false;
};

// 处理编辑商品
const handleEdit = (row) => {
  editDialogVisible.value = true;
  editProduct.value = { ...row };
};

// 确认编辑商品
const confirmEdit = () => {
  const index = products.value.findIndex(p => p.id === editProduct.value.id);
  if (index !== -1) {
    products.value[index] = { ...editProduct.value };
  }
  editDialogVisible.value = false;
};

// 处理删除商品
const handleDelete = (row) => {
  const index = products.value.findIndex(p => p.id === row.id);
  if (index !== -1) {
    products.value.splice(index, 1);
  }
};
</script>

<style scoped lang="scss">
.management-content {
  background: #ffffff;
  padding: 0px;
}

.product-card {
  max-width: 18000px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  background: linear-gradient(to bottom, #ffffff, #f5f7fa); /* 渐变背景 */
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px); /* 鼠标悬停时卡片上移 */
  }

  :deep(.el-card__header) {
    background: #f8fafc;
    border-bottom: 1px solid #ebeef5;
    padding: 16px 20px;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    color: #303133;
    font-size: 18px;
    margin: 0;
  }
}

.filter-container {
  display: flex;
  align-items: center;
}

.input-with-gradient {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: linear-gradient(to right, #ffffff, #f0f2f5); /* 输入框渐变背景 */
}

.product-table {
  margin-top: 12px;

  .product-info {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .name {
      font-weight: 500;
    }
  }

  .price {
    color: #f56c6c;
    font-weight: 500;
  }

  .delete-btn {
    color: #f56c6c;
  }
}

.toolbar-footer {
  margin-top: 16px;
  padding: 12px 0;
  border-top: 1px solid #ebeef5;
  text-align: right;
}

.add-product-btn {
  transition: all 0.3s;

  &:hover {
    transform: scale(1.05); /* 鼠标悬停时按钮放大 */
    background-color: #409eff;
    color: #fff;
  }
}
</style>