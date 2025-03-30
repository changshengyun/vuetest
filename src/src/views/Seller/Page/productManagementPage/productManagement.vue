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

      <div class="table-controls">
        <el-button type="primary" :icon="Refresh" @click="fetchProducts" :loading="loading">
          刷新列表
        </el-button>
      </div>

      <el-table :data="filteredProducts" class="product-table" v-loading="loading">
        <el-table-column label="封面" width="100" align="center">
          <template #default="{ row }">
            <el-tooltip content="点击查看大图">
              <template #content>
                <img :src="row.image_url" alt="商品图片" style="max-width: 100%; max-height: 100%">
              </template>
              <el-avatar :size="50" :src="row.image_url" class="product-thumb" />
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
          <el-select v-model="newProduct.category_id" placeholder="请选择分类" clearable>
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
        <el-form-item label="商品图片">
          <el-upload
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleUpload"
          >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
          <div v-if="editProduct.images" class="image-preview">
            <img :src="editProduct.images" alt="商品图片预览" style="max-height: 100px; margin-top: 10px;">
          </div>
        </el-form-item>
   </el-form>
  

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitProduct" :loading="isSubmitting">
            提交
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑商品对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑商品" width="700px">
      <el-form :model="editProduct" :rules="editRules" ref="editFormRef" label-width="120px">
        <el-form-item label="卖家ID" prop="seller_id">
          <el-input v-model="editProduct.seller_id" placeholder="请输入卖家ID" :disabled="false" />
        </el-form-item>

        <el-form-item label="分类ID" prop="category_id">
          <el-select v-model="editProduct.category_id" placeholder="请选择分类" clearable>
            <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="商品名称" prop="title">
          <el-input v-model="editProduct.title" placeholder="请输入商品名称" />
        </el-form-item>

        <el-form-item label="商品描述" prop="description">
          <el-input v-model="editProduct.description" type="textarea" :rows="4" placeholder="请输入商品描述" show-word-limit
            maxlength="500" />
        </el-form-item>
        <el-form-item label="商品状态" prop="status">
          <el-select v-model="editProduct.status" placeholder="请选择商品状态">
            <el-option v-for="option in statusOptions" :key="option.value" :label="option.label"
              :value="option.value" />
          </el-select>
        </el-form-item>

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
        <el-form-item label="商品图片">
          <el-upload
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleUpload"
          >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
          <div v-if="newProduct.images" class="image-preview">
            <img :src="newProduct.images" alt="商品图片预览" style="max-height: 100px; margin-top: 10px;">
          </div>
        </el-form-item>
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
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, imageEmits } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'

const searchKeyword = ref('')
const products = ref([])
const loading = ref(false)
// 1. 增加API配置（在axios导入后添加）
const API = {
  // 根据实际接口文档配置
  GET_PRODUCTS: 'http://192.168.43.115:3007/api/getgoods',        // 获取商品列表
  UPDATE_PRODUCT: 'http://192.168.43.115:3007/api/updategoods',  // 更新商品接口
  DELETE_PRODUCT: 'http://192.168.43.115:3007/api/delgoods',  // 删除商品接口
  CREATE_PRODUCT: 'http://192.168.43.115:3007/api/newgoods',      // 创建商品接口
}

// 获取商品列表
const fetchProducts = async () => {
  try {
    loading.value = true
    const response = await axios.get(API.GET_PRODUCTS)

    products.value = response.data.data.map(item => ({
      id: item.product_id,
      name: item.title,
      price: item.price,
      stock: item.stock,
      status: item.status === 'available' ? '在售' : '缺货',
      description: item.description,
      image_url: item.main_image_url,
      seller_id: item.seller_id,
      category_id: item.category_id,
      category_name: item.category_name // 新增分类名称
    }))

  } catch (error) {
    ElMessage.error('获取商品列表失败: ' + (error.response?.data?.message || error.message))
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  fetchProducts()
})

const filteredProducts = computed(() => {
  return products.value.filter(p =>
    p.name.includes(searchKeyword.value)
  )
})

// 新增商品相关
const addDialogVisible = ref(false)
const isSubmitting = ref(false)
const newProduct = ref({
  seller_id: '',
  category_id: '',
  title: '',
  description: '',
  price: 0,
  stock: '',
  images: '', // 存储base64图片数据
})

const handleAdd = () => {
  addDialogVisible.value = true
  newProduct.value = {
    seller_id: '',
    category_id: '',
    title: '',
    description: '',
    price: 0,
    stock: '',
    images: '',
  }
}


const submitProduct = async () => {
  try {
    isSubmitting.value = true; // 开始提交

    // 确保所有字段都存在
    if (
      !newProduct.value.title ||
      !newProduct.value.price ||
      !newProduct.value.category_id
    ) {
      ElMessage.error("请填写所有必要的字段");
      isSubmitting.value = false;
      return;
    }

    console.log("提交数据:", newProduct.value); // 方便调试

    const response = await axios.post(
      API.CREATE_PRODUCT,
      {
        title: newProduct.value.title.trim(), // 确保没有空格
        seller_id: String(newProduct.value.seller_id),
        description: newProduct.value.description || "", // 防止 null
        price: String(Math.round(Number(newProduct.value.price))),
        stock: String(Number(newProduct.value.stock || 0)),
        category_id: Number(newProduct.value.category_id), // **转换为整数**
        images: newProduct.value.images || undefined,
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    if (response.data.code === 201) {
      ElMessage.success("商品新增成功！");
      addDialogVisible.value = false;
      await fetchProducts(); // 刷新列表
    } else {
      ElMessage.error(response.data.message || "新增商品失败");
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.message || "请求失败");
  } finally {
    isSubmitting.value = false;
  }
};


// 分类数据
const categories = ref([
  { id: '1', name: '电子产品' },
  { id: '2', name: '服装' },
  { id: '3', name: '食品' }
])

// 编辑商品相关
const editDialogVisible = ref(false);
const editFormRef = ref(null);
// const isSubmitting = ref(false);

const editProduct = ref({
  product_id: "",
  seller_id: null,    // 期望 `integer`
  category_id: null,  // 期望 `integer`
  title: "",          // 期望 `string`
  description: "",    // 期望 `string`
  price: null,        // 期望 `number`
  stock: null,        // 期望 `integer`
  status: "draft",    // 默认值
  images: "",         // 存储base64图片数据
}); 

// 添加 statusOptions 作为可选项
const statusOptions = [
  { label: "在售", value: "available" },
  { label: "已下架", value: "discontinued" },
  { label: "未发布", value: "draft" }
];

// 中文到英文的映射
const statusMapping = {
  "在售": "available",
  "已下架": "discontinued",
  "未发布": "draft"
};

const editRules = {
  seller_id: [{ required: true, message: "卖家ID不能为空", trigger: "blur" }],
  category_id: [{ required: true, message: "请选择商品分类", trigger: "change" }],
  title: [
    { required: true, message: "请输入商品标题", trigger: "blur" },
    { min: 1, max: 50, message: "长度在1到50个字符", trigger: "blur" }
  ],
  price: [
    { required: true, message: "请输入价格", trigger: "blur" },
    { type: "number", min: 0, message: "价格必须大于0", trigger: "change" }
  ],
  stock: [
    { required: true, message: "请输入库存", trigger: "blur" },
    { type: "integer", min: 0, message: "库存必须大于等于0", trigger: "change" }
  ]
};

// 处理编辑商品的逻辑
const handleEdit = (row) => {
  console.log("编辑商品数据:", row);

  editDialogVisible.value = true;
  editProduct.value = {
    product_id: row.product_id || row.id || "",  // 确保 `product_id` 赋值正确
    seller_id: row.seller_id ? Number(row.seller_id) : null,  // 确保 `seller_id` 为整数
    category_id: row.category_id ? Number(row.category_id) : null,  // 确保 `category_id` 为整数
    title: row.title || row.name || "",  // 确保 `title` 为字符串
    description: row.description || "",  // 确保 `description` 为字符串
    price: row.price !== undefined ? Number(row.price) : null,  // 确保 `price` 为数字
    stock: row.stock !== undefined ? Number(row.stock) : null,  // 确保 `stock` 为整数
    status: row.status || "draft",  // 确保 `status` 有默认值
    images: row.images && row.images.length > 0 ? row.images[0] : (row.main_image_url || ""),  // `images` 取第一个图片
  };

  console.log("赋值后的 editProduct:", editProduct.value);
};

// 提交编辑商品
const submitEdit = async () => {
  try {
    await editFormRef.value.validate();
    isSubmitting.value = true;

    // 检查商品 ID 是否存在
    if (!editProduct.value.product_id) {
      ElMessage.error("商品 ID 不能为空");
      return;
    }

    // 转换 status 为英文
    const statusInEnglish = statusMapping[editProduct.value.status] || editProduct.value.status;

    // 准备提交的数据   
    const payload = {
      product_id: editProduct.value.product_id,
      title: editProduct.value.title || undefined,  // 只有存在值时才传递
      seller_id: editProduct.value.seller_id !== null ? editProduct.value.seller_id : undefined,
      description: editProduct.value.description || undefined,
      price: editProduct.value.price !== null ? editProduct.value.price : undefined,
      stock: editProduct.value.stock !== null ? editProduct.value.stock : undefined,
      status: statusInEnglish,  // 转换后的英文状态
      category_id: editProduct.value.category_id,
      images: editProduct.value.images || undefined,  // 只有存在值时才传递
    };

    console.log("最终提交的数据:", payload);

    // 发送更新请求
    const response = await axios.put(
      `${API.UPDATE_PRODUCT}`,
      payload
    );

    if (response.data.code === 200) {
      ElMessage.success(response.data.message || "商品更新成功");
      await fetchProducts();  // 刷新商品列表
      editDialogVisible.value = false;  // 关闭编辑对话框
    } else {
      ElMessage.error(response.data.message || "业务逻辑错误");
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.message || error.message || "接口通讯异常");
  } finally {
    isSubmitting.value = false;
  }
};



// 删除商品
const handleDelete = async (row) => {
  try {
    // 添加确认对话框
    await ElMessageBox.confirm(
      `确定要删除商品【${row.name}】吗？此操作不可恢复！`,
      '警告',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
    )

    // 发送删除请求（使用title参数）
    const response = await axios.delete(API.DELETE_PRODUCT, {
      data: {
        title: row.name // 使用商品名称作为删除参数
      }
    })

    // 处理成功响应
    if (response.data.code === 200) {
      // 更新本地数据
      const index = products.value.findIndex(p => p.id === row.id)
      if (index !== -1) {
        products.value.splice(index, 1)
      }
      ElMessage.success(response.data.message)
    } else {
      // 处理业务逻辑错误
      ElMessage.error(response.data.message || "删除失败")
    }
  } catch (error) {
    // 处理取消操作
    if (error === 'cancel') return

    // 处理错误响应
    if (error.response) {
      switch (error.response.data.code) {
        case 400:
          ElMessage.warning('该商品存在关联订单，请先处理订单')
          break
        case 404:
          ElMessage.error('商品不存在或已被删除')
          break
        default:
          ElMessage.error(`删除失败: ${error.response.data.message}`)
      }
    } else {
      ElMessage.error(`请求失败: ${error.message}`)
    }
  }
}





// 处理图片上传
const handleUpload = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (editDialogVisible.value) {
        editProduct.value.images = e.target.result
      } else {
        newProduct.value.images = e.target.result
      }
      resolve()
    }
    reader.readAsDataURL(file.raw)
  })
}
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
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
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
}

.table-controls {
  margin-bottom: 15px;
  display: flex;
  justify-content: flex-end;
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
    background-color: #409eff;
    color: #fff;
  }
}

.product-thumb {
  object-fit: cover;
}
</style>

<style>
/* 全局对话框居中样式 */
.el-message-box {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
}

.el-message-box__content {
  text-align: center !important;
}

.el-message-box__btns {
  justify-content: center !important;
}
</style>