<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="filterState.cate_id" placeholder="请选择分类" size="small">
              <el-option v-for="item in cateList" :key="item.id" :label="item.cate_name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px;">
            <el-select v-model="filterState.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="filterArtList">筛选</el-button>
            <el-button type="info" size="small" @click="resetList">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub" @click="pubDialogVisible = true">发表文章</el-button>
      </div>

      <!-- 发表文章的 Dialog 对话框 -->
      <el-dialog title="发表文章" :visible.sync="pubDialogVisible" width="80%" :before-close="handleClose" @closed="onDialogClosed">
        <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
          <el-form-item label="文章标题" prop="title">
            <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
          </el-form-item>

          <el-form-item label="文章分类" prop="cate_id">
            <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%;">
              <el-option :label="item.cate_name" :value="item.id" v-for="item in cateList" :key="item.id" />
            </el-select>
          </el-form-item>

          <el-form-item label="文章内容" prop="content">
            <!--  element-ui通过validateField对部分属性进行校验 -->
            <quill-editor v-model="pubForm.content" @blur="$refs.pubForm.validateField('content')" />
          </el-form-item>

          <el-form-item label="文章封面">
            <!-- 用来显示封面的图片 -->
            <img v-if="cover" :src="cover" alt="" class="cover-img" ref="imgRef" />
            <img v-else src="../../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" />
            <br />
            <!-- 文件选择框，默认被隐藏 -->
            <input type="file" style="display: none;" accept="image/*" ref="iptFile" @change="onCoverChange" />
            <!-- 选择封面的按钮 -->
            <el-button type="text" @click="$refs.iptFile.click()">+ 选择封面</el-button>
            <el-form-item>
              <el-button type="primary" @click="pubArticle('已发布')">发布</el-button>
              <el-button type="info" @click="pubArticle('草稿')">存为草稿</el-button>
            </el-form-item>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 文章表格区域 -->
      <el-table :data="artList" style="width: 100%;" border stripe>
        <el-table-column label="文章标题">
          <template v-slot="{ row }">
            <el-link type="primary" @click="showDetail(row.id)">{{ row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发表时间">
          <!-- 这里不再使用prop，而是利用作用域插槽进行渲染，而{row} 是直接解构的方式 -->
          <template v-slot="{ row }">
            {{ dateFormat(row.pub_date) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="danger" size="mini" @click="removeArt(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="q.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!-- 查看文章详情的对话框 -->
      <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
        <h1 class="title">{{ artDetail.title }}</h1>
        <div class="info">
          <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
          <span>发布时间：{{ dateFormat(artDetail.pub_date) }}</span>
          <span>所属分类：{{ artDetail.cate_name }}</span>
          <span>状态：{{ artDetail.state }}</span>
        </div>
        <!-- 分割线 -->
        <el-divider></el-divider>
        <img :src="artDetail.cover_img" alt="" width="100%"/>
        <div v-html="artDetail.content"></div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'ArtList',
  created() {
    this.initCateList()
    this.initArtList()
  },
  data() {
    return {
      cover: '',
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      },
      filterState: {
        cate_id: '',
        state: ''
      },
      total: 2,
      pubDialogVisible: false,
      // 表单的数据对象
      pubForm: {
        title: '',
        cate_id: '',
        content: '',
        cover_img: '',
        state: ''
      },
      // 表单的验证规则对象
      pubFormRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        cate_id: [{ required: true, message: '请选择文章标题', trigger: 'blur' }]
      },
      cateList: [
        {
          id: 315,
          cate_name: '最新',
          cate_alias: 'Latest'
        },
        {
          id: 316,
          cate_name: '科技',
          cate_alias: 'Science'
        },
        {
          id: 317,
          cate_name: '新闻',
          cate_alias: 'News'
        },
        {
          id: 138,
          cate_name: '财经',
          cate_alias: 'Finance'
        }
      ],
      artList: [
        {
          id: 1,
          title: '科技新闻',
          pub_date: '2023-11-15 15:40:04',
          state: '草稿',
          cate_name: '最新'
        }
      ],
      // 控制文章详情对话框的显示与隐藏
      detailVisible: false,
      // 文章的详情信息对象
      artDetail: {
        id: 1,
        title: '科技新闻',
        content: '<p>AI绘图</p>',
        // cover_img: '/uploads/b484f4be1c29d4bef7216f6dd23b2071',
        cover_img: 'https://gd-hbimg.huaban.com/7d6333643f9829ccc1beade373606ad78480ebe0570e5-IC9OsE_fw1200',
        pub_date: '2023-11-15 15:40:04',
        state: '草稿',
        cate_id: 1,
        author_id: 1
      }
    }
  },
  methods: {
    async handleClose(done) {
      // 询问用户是否确认关闭对话框
      const confirmResult = await this.$confirm('此操作将导致文章信息丢失, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 取消了关闭
      if (confirmResult === 'cancel') return
      // 确认关闭
      done(true)
    },
    async initCateList() {
      try {
        const { data: res } = await this.$http.get('/my/cate/list')
        if (res.code === 0) {
          this.cateList = res.data
        }
      } catch (e) {
        console.error('获取文章分类列表异常' + e)
      }
    },
    onCoverChange(e) {
      // 获取用户选择的文件列表
      const file = e.target.files[0]
      if (file) {
        // 调用原声WEBAPI方法，将文件对象转成URL
        this.cover = URL.createObjectURL(file)
        console.log('the cover is :' + this.cover)
        // file对象就是blob的子类对象
        this.pubForm.cover_img = file
      } else {
        // 清除封面的预览和封面文件
        this.cover = ''
        this.pubForm.cover_img = ''
      }
    },
    onDialogClosed() {
      this.$refs.pubFormRef.resetFields()
      this.pubForm.content = ''
      this.cover = ''
      this.pubForm.cover_img = ''
      this.pubForm.state = ''
    },
    pubArticle(state) {
      this.pubForm.state = state
      this.$refs.pubFormRef.validate(valid => {
        if (!valid) return this.$message.error('请完善文章信息！')
        if (!this.pubForm.cover_img) return this.$message.error('请选择文章封面！')
        this.postArticle()
      })
    },
    async postArticle() {
      // 创建FormData对象并向其中追加数据
      const fd = new FormData()
      Object.keys(this.pubForm).forEach(key => fd.append(key, this.pubForm[key]))
      try {
        const { data: res } = await this.$http.post('/my/article/add', fd)
        if (res.code !== 0) return this.$message.error('发布文章失败！')
        this.$message.success('发布文章成功！')
      } catch (e) {
        console.error('发布文章异常' + e)
      }
      this.pubDialogVisible = false
      this.initArtList()
    },
    async initArtList() {
      try {
        const { data: res } = await this.$http.get('/my/article/list', { params: this.q })
        if (res.code !== 0) return this.$message.error('获取文章列表失败!')
        this.artList = res.data
        this.total = res.total
      } catch (e) {
        console.error('获取文章列表异常' + e)
      }
    },
    dateFormat(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    },
    handleSizeChange(newSize) {
      // 默认展示第一页数据
      this.pagenum = 1
      this.q.pagesize = newSize
      // 重新发起请求
      this.initArtList()
    },
    handleCurrentChange(newPage) {
      // 为页码值赋值
      this.q.pagenum = newPage
      // 重新发起请求
      this.initArtList()
    },
    filterArtList() {
      // 当点击筛选时，才将筛选条件作用到请求参数中
      this.q.pagenum = 1
      this.q.cate_id = this.filterState.cate_id
      this.q.state = this.filterState.state
      this.initArtList()
    },
    resetList() {
      this.q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      }
      this.initArtList()
    },
    async showDetail(id) {
      try {
        // 请求详情数据
        const { data: res } = await this.$http.get('/my/article/info', { params: { id } })
        if (res.code !== 0) return this.$message.error('获取文章详情失败!')
        this.artDetail = res.data
      } catch (e) {
        console.error('获取文章详情异常' + e)
      }
      // 展示对话框
      this.detailVisible = true
    },
    async removeArt(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult === 'cancel') return

      try {
        const { data: res } = await this.$http.delete('/my/article/info', { params: { id } })
        if (res.code !== 0) return this.$message.error('删除失败!')
        this.$message.success('删除成功!')
      } catch (e) {
        console.error('删除文章异常' + e)
      }
      // 刷新列表数据
      await this.initArtList()
    }
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}

// scoped 让 style 中的选择器只对当前template中的标签生效
// 原理：1）给所有标签添加一个data-v-hash。但scoped只会给当前template中出现的标签添加data-v-hash，如果是组件，则只会给组件的根标签添加data-v-hash
// 2）给所有选择器加一个属性交集选择器。

// 设置富文本编辑器的默认最小高度，
// 问题原因：标签内部没有data-v-hash，所以无法选择组件内部的标签。
// 解决办法：利用深度选择器/deep/。将以前的交集选择器（.ql-editor[data-v-hash]）变为后代选择器（[data-v-hash] .ql-editor）
/deep/ .ql-editor {
  min-height: 200px;
}

// 设置图片封面的宽高
.cover-img {
  width: 200px;
  height: 100px;
  object-fit: cover;
}

.el-pagination {
  margin-top: 15px;
}

.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;
  span {
    margin-right: 20px;
  }
}
</style>
