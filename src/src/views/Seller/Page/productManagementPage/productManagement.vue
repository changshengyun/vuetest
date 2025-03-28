<template>
  <el-main class="management-content">
    <el-card class="product-card">
      <template #header>
        <div class="card-header">
          <h2>商品管理</h2>
          <div class="filter-container">
            <el-input v-model="searchKeyword" placeholder="搜索商品名称" clearable @input="filterProducts"
              style="width: 240px" :prefix-icon="Search" class="input-with-gradient" />
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

        <el-table-column prop="description" label="商品详情" min-width="280" />

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
    <el-dialog v-model="addDialogVisible" title="新增商品" width="500px">
      <el-form :model="newProduct" label-width="100px">
        <el-form-item label="卖家ID">
          <el-input v-model="newProduct.seller_id" placeholder="请输入卖家 ID"></el-input>
        </el-form-item>
        <el-form-item label="类别ID">
          <el-select v-model="editProduct.category_id" placeholder="请选择分类" clearable>
            <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="newProduct.title" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input v-model="newProduct.description" type="textarea" placeholder="请输入商品描述"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model.number="newProduct.price" placeholder="请输入价格" type="number"></el-input>
        </el-form-item>
        <el-form-item label="库存">
          <el-input v-model.number="newProduct.stock" placeholder="请输入库存" type="number"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitProduct">提交</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="editDialogVisible" title="编辑商品" width="700px">
      <el-form :model="editProduct" :rules="editRules" ref="editFormRef" label-width="120px">
        <!-- 卖家ID -->
        <el-form-item label="卖家ID" prop="seller_id">
          <el-input v-model="editProduct.seller_id" placeholder="请输入卖家ID" :disabled="false" />
        </el-form-item>

        <!-- 分类ID -->
        <el-form-item label="分类ID" prop="category_id">
          <el-select v-model="editProduct.category_id" placeholder="请选择分类" clearable>
            <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id" />
          </el-select>
        </el-form-item>

        <!-- 商品标题 -->
        <el-form-item label="商品名称" prop="title">
          <el-input v-model="editProduct.title" placeholder="请输入商品名称" />
        </el-form-item>

        <!-- 商品描述 -->
        <el-form-item label="商品描述" prop="description">
          <el-input v-model="editProduct.description" type="textarea" :rows="4" placeholder="请输入商品描述" show-word-limit
            maxlength="500" />
        </el-form-item>

        <!-- 价格和库存 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="价格" prop="price">
              <el-input-number v-model="editProduct.price" :min="0" :precision="2" controls-position="right"
                placeholder="请输入价格" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存" prop="stock">
              <el-input-number v-model="editProduct.stock" :min="0" integer-only placeholder="请输入库存" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit" :loading="isSubmitting">
          保存修改
        </el-button>
      </template>
    </el-dialog>
  </el-main>
</template>

<script setup>
import axios from 'axios'
import { ref, computed } from 'vue';
import { ElMessageBox } from 'element-plus';
import { Plus, Picture, Search } from '@element-plus/icons-vue';

const searchKeyword = ref('');
const products = ref([
  { id: 1, name: '商品A', price: 199, stock: 5, status: '在售', description: '商品A的详细描述信息' },
  { id: 2, name: '商品B', price: 299, stock: 0, status: '缺货', description: '商品B的详细描述信息' },
  { id: 3, name: '商品C', price: 399, stock: 15, status: '在售', description: '商品C的详细描述信息' }
]);


const filteredProducts = computed(() => {
  return products.value.filter(p =>
    p.name.includes(searchKeyword.value)
  );
});


const addFormRef = ref(null);

// 编辑商品对话框相关
const editDialogVisible = ref(false);
const isSubmitting = ref(false)
const editFormRef = ref(null);

// 过滤商品
const filterProducts = () => {
  // 过滤逻辑
};

const addDialogVisible = ref(false); // 控制弹窗是否可见
const newProduct = ref({
  seller_id: '',
  category_id: '',
  title: '',
  description: '',
  price: 0,
  stock: 0,
});

// 点击新增商品按钮时，打开弹窗并清空表单
const handleAdd = () => {
  addDialogVisible.value = true;
  newProduct.value = {
    seller_id: '',
    category_id: '',
    title: '',
    description: '',
    price: 0,
    stock: 0,
  };
};


// 提交商品信息到后端
const submitProduct = async () => {
  try {
    const response = await axios.post('/api/products', newProduct.value);

    if (response.status === 200) {
      ElMessage({
        message: '商品新增成功！',
        type: 'success',
      });

      // 关闭弹窗
      addDialogVisible.value = false;
    }
  } catch (error) {
    console.error('提交商品失败:', error);
    ElMessage({
      message: '商品新增失败，请检查网络或稍后再试。',
      type: 'error',
    });
  }
};

// 确认新增商品
const confirmAdd = () => {
  const newId = Math.max(...products.value.map(p => p.id)) + 1;
  const newItem = { ...newProduct.value, id: newId };
  products.value.push(newItem);
  addDialogVisible.value = false;
};

// 分类数据（可以从API获取）
const categories = ref([
  { id: 1, name: '电子产品' },
  { id: 2, name: '服装' },
  { id: 3, name: '食品' }
])

// 编辑表单验证规则
const editRules = {
  seller_id: [{ required: true, message: '卖家ID不能为空', trigger: 'blur' }],
  category_id: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  title: [
    { required: true, message: '请输入商品标题', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在2到50个字符', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格必须大于0', trigger: 'change' }
  ],
  stock: [
    { required: true, message: '请输入库存', trigger: 'blur' },
    { type: 'integer', min: 0, message: '库存必须为整数且大于等于0', trigger: 'change' }
  ]
}

// 编辑商品数据
const editProduct = ref({
  seller_id: '',
  category_id: '',
  title: '',
  description: '',
  price: 0,
  stock: 0
})
// 打开编辑对话框
const handleEdit = (row) => {
  editDialogVisible.value = true
  editProduct.value = {
    seller_id: row.seller_id || '',
    category_id: row.category_id || '',
    title: row.title || '',
    description: row.description || '',
    price: row.price || 0,
    stock: row.stock || 0,
    id: row.id // 保留商品ID用于API请求
  }
}

// 提交编辑
const submitEdit = async () => {
  try {
    // 验证表单
    await editFormRef.value.validate()

    isSubmitting.value = true

    // 发送PUT请求到后端
    const response = await axios.put(`/api/products/${editProduct.value.id}`, {
      seller_id: editProduct.value.seller_id,
      category_id: editProduct.value.category_id,
      title: editProduct.value.title,
      description: editProduct.value.description,
      price: editProduct.value.price,
      stock: editProduct.value.stock
    })

    if (response.data.success) {
      ElMessage.success('商品更新成功')
      editDialogVisible.value = false
      // 刷新商品列表
      fetchProducts()
    } else {
      throw new Error(response.data.message || '更新失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '更新商品失败')
  } finally {
    isSubmitting.value = false
  }
}

// 获取商品列表的函数（示例）
const fetchProducts = async () => {
  try {
    const response = await axios.get('/api/products')
    products.value = response.data
  } catch (error) {
    ElMessage.error('获取商品列表失败')
  }
}



const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定删除以下商品吗？\n\n【${row.name}】(ID: ${row.id})\n\n此操作不可撤销！`,
      '删除确认',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '我再想想',
        type: 'error',
        confirmButtonType: 'danger', // 关键修正
        confirmButtonClass: 'el-button--danger',
        customClass: 'delete-confirm-dialog',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            try {
              // 调用API删除
              await axios.delete(`/api/products/${row.id}`);

              // 前端更新
              const index = products.value.findIndex(p => p.id === row.id);
              if (index !== -1) {
                products.value.splice(index, 1);
              }

              ElMessage.success({
                message: `商品【${row.name}】已删除`,
                duration: 2000
              });
              done();
            } catch (error) {
              ElMessage.error({
                message: `删除失败: ${error.response?.data?.message || error.message}`,
                duration: 3000
              });
              instance.confirmButtonLoading = false;
            }
          } else {
            done();
          }
        }
      }
    );
  } catch (error) {
    // 用户点击了取消
    ElMessage.info('已取消删除操作');
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
  background: linear-gradient(to bottom, #ffffff, #f5f7fa);
  /* 渐变背景 */
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    /* 鼠标悬停时卡片上移 */
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
  background: linear-gradient(to right, #ffffff, #f0f2f5);
  /* 输入框渐变背景 */
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
    transform: scale(1.05);
    /* 鼠标悬停时按钮放大 */
    background-color: #409eff;
    color: #fff;
  }
}


:deep(.delete-confirm-dialog) {
  text-align: center !important;

  .el-message-box__content {
    white-space: pre-line;
    /* 支持换行 */
    padding: 20px 25px;
    /* 调整内边距 */
  }

  .el-message-box__btns {
    justify-content: center !important;
    margin-top: 15px;
  }

  .el-button--danger {
    background-color: #f56c6c !important;
    border-color: #f56c6c !important;
  }
}
</style>