<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addVisible = true">添加分类</el-button>
      </div>
      <!-- 表格区域 -->
      <el-table stype="width: 100%;" :data="cateList" border stripe>
        <el-table-column label="序号" type="index" width="100"></el-table-column>
        <el-table-column label="分类名称" prop="cate_name"></el-table-column>
        <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
        <el-table-column label="操作">
          <!-- 作用域插槽，官方提供了一些可供直接使用的数据，就不必从服务端获取已有数据 -->
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="showEditDialog(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="removeCate(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加文章分类" width="35%" :visible.sync="addVisible" @closed="$refs.addRef.resetFields()">
      <el-form :model="addForm" :rules="saveRules" ref="addRef" label-width="70px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="addForm.cate_name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model="addForm.cate_alias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="onAddCate">添 加</el-button>
      </span>
    </el-dialog>

    <!-- 修改文章分类的对话框 -->
    <el-dialog title="修改文章分类" :visible.sync="editVisible" width="35%" @closed="$refs.editRef.resetFields()">
      <el-form :model="editForm" :rules="saveRules" ref="editRef" label-width="70px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="editForm.cate_name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model="editForm.cate_alias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="editVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'ArtCate',
  data() {
    return {
      // 文章的分类列表
      cateList: [
        {
          id: 315,
          cate_name: '最新',
          cate_alias: 'Latest'
        },
        {
          id: 317,
          cate_name: '新闻',
          cate_alias: 'News'
        }
      ],
      // 点击添加分类时，设置为true
      addVisible: false,
      // 添加表单的数据对象
      addForm: {
        cate_name: '',
        cate_alias: ''
      },
      // 添加表单的验证规则对象
      saveRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
        ]
      },
      // 控制修改对话框的显示与隐藏
      editVisible: false,
      // 修改表单的数据对象
      editForm: {
        cate_name: '',
        cate_alias: ''
      }
    }
  },
  methods: {
    async getCateList() {
      try {
        const { data: res } = await this.$http.get('/my/cate/list')
        if (res.code === 0) {
          this.cateList = res.data
        }
      } catch (e) {
        console.error('获取文章分类异常！' + e)
      }
    },
    onAddCate() {
      // 表单预校验
      this.$refs.addRef.validate(async valid => {
        if (!valid) return
        try {
          const { data: res } = await this.$http.post('/my/cate/add', this.addForm)
          if (res.code !== 0) return this.$message.error('添加分类失败！')
          this.$message.success('添加分类成功！')
        } catch (e) {
          console.error('添加分类失败！' + e)
          // todo 模拟添加一条数据
          const newData = {
            id: this.cateList[this.cateList.length - 1].id + 1,
            cate_name: this.addForm.cate_name,
            cate_alias: this.addForm.cate_alias
          }
          this.cateList.push(newData)
        }
        // 关闭对话框，并重新请求列表数据
        this.addVisible = false
        this.getCateList()
      })
    },
    showEditDialog(row) {
      this.editForm = { ...row }
      this.editVisible = true
    },
    editCate() {
      this.$refs.editRef.validate(async valid => {
        if (!valid) return
        try {
          const { data: res } = await this.$http.put('/my/cate/info', this.editForm)
          if (res.code !== 0) return this.$message.error('修改分类失败！')
          this.$message.success('修改分类成功！')
        } catch (e) {
          console.error('获取分类异常' + e)
          // todo 模拟更新分类
          const curIdx = this.editForm.id
          console.log('curIdx: ' + curIdx)
          this.cateList.forEach(item => {
            if (item.id === curIdx) {
              item.cate_name = this.editForm.cate_name
              item.cate_alias = this.editForm.cate_alias
            }
          })
        }
        this.editVisible = false
        this.getCateList()
      })
    },
    async removeCate(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult === 'cancel') return

      try {
        const { data: res } = await this.$http.delete('/my/cate/del', { params: { id } })
        if (res.code !== 0) return this.$message.error('删除分类失败！')
        this.$message.success('删除分类成功！')
      } catch (e) {
        console.error('删除分类失败' + e)
        // todo 模拟删除分类
        const indexToDelete = this.cateList.findIndex(item => item.id === id)
        if (indexToDelete !== -1) this.cateList.splice(indexToDelete, 1)
      }
      await this.getCateList()
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
