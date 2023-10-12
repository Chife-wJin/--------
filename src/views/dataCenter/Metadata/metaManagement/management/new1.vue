<template>
  <div class="new">
    <el-form
      ref="userManageform"
      :model="form"
      :rules="rules"
      label-width="130px"
    >
      <el-row :gutter="24">
        <el-col :span="24" class="branch-name">
          <el-form-item label="参照历史记录：" prop="companyId">
            <el-select
              v-model="form.monitorType"
              size="small"
              @change="changeRecord"
            >
              <el-option
                v-for="item in monitorTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="dialog-caption">
        <h1 class="dialog-caption-text">信息资源标识</h1>
      </div>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="标识符：" prop="companyId">
            <el-input
              v-model="form.jyzmc"
              size="small"
              placeholder="请输入标识符"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="中文名称：" prop="jyzbm">
            <el-input
              v-model="form.jyzbm"
              size="small"
              placeholder="请输入中文名称"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24" class="branch-name">
          <el-form-item label="英文名称：" prop="companyId">
            <el-input
              v-model="form.wd"
              size="small"
              placeholder="请输入英文名称"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="关键词：" prop="jyzbm1">
            <el-input
              v-model="form.jyzbm1"
              size="small"
              placeholder="请输入关键词"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="语种：" prop="companyId">
            <el-select v-model="form.yz" size="small">
              <el-option
                v-for="item in yzList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24" class="branch-name">
          <el-form-item label="摘要：" prop="dm">
            <el-input v-model="form.dm" type="textarea" :rows="3"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">提供方</el-divider>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="机构名称：" prop="pc">
            <SearchBar
              @handleSearch="handleSearch('pc', 'jg')"
              :searchValue="form.pc"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="机构代码：" prop="companyId">
            <el-input
              v-model="form.jgdm"
              size="small"
              placeholder="请输入机构代码"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="机构简称：" prop="companyId">
            <el-input
              v-model="form.jgjc"
              size="small"
              placeholder="请输入机构简称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="负责人姓名：" prop="companyId">
            <el-input
              v-model="form.fzrxm"
              size="small"
              placeholder="请输入负责人姓名"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="责任方地址：" prop="companyId">
            <el-input
              v-model="form.zrfdz"
              size="small"
              placeholder="请输入责任方地址"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="责任方邮编：" prop="companyId">
            <el-input
              v-model="form.fzryb"
              size="small"
              placeholder="请输入责任方邮编"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="责任方联系电话：" prop="companyId">
            <el-input
              v-model="form.zrfdh"
              size="small"
              placeholder="请输入责任方联系电话"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="责任方电子邮箱：" prop="companyId">
            <el-input
              v-model="form.zrfyx"
              size="small"
              placeholder="请输入责任方电子邮箱"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="dialog-caption">
        <h1 class="dialog-caption-text">信息资源内容</h1>
      </div>
      <!-- <el-divider content-position="left">分类</el-divider> -->
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="分类标准代码：" prop="code">
            <SearchBar
              @handleSearch="handleSearch('code', 'code')"
              :searchValue="form.code"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="分类标准名称：" prop="companyId">
            <el-input
              v-model="form.ffff"
              size="small"
              placeholder="请输入分类标准名称"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="分类名称：" prop="companyId">
            <el-input
              v-model="form.yyyy"
              size="small"
              placeholder="请输入分类名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="分类编码：" prop="companyId">
            <el-input
              v-model="form.yy999"
              size="small"
              placeholder="请输入分类编码"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24" class="branch-name">
          <el-form-item label="字段信息：" prop="companyId">
            <el-table
              :data="form.tableData"
              style="width: 100%; margin-bottom: 20px"
              :stripe="true"
              border
              @current-change="handleSelectChange"
              :header-cell-style="{ textAlign: 'center' }"
              :cell-style="{ textAlign: 'center' }"
            >
              <el-table-column label="字段名称">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.a"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="字段中文含义">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.b"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="字段类型">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.c"></el-input>
                </template> </el-table-column
              ><el-table-column prop="name" label="字段长度">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.c"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="字段单位">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.c"></el-input>
                </template> </el-table-column
              ><el-table-column prop="name" label="字段共享范围">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.c"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="字段共享方式">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.c"></el-input>
                </template> </el-table-column
              ><el-table-column prop="name" label="字段单位">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.c"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-plus"
                    @click="handleAddRow"
                    >新增</el-button
                  >
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    class="delete-state-btn"
                    @click="handleDeleteRow(scope.$index)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="类型：" prop="companyId">
            <el-select v-model="form.bdType" size="small">
              <el-option
                v-for="item in bdTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="更新频率：" prop="companyId">
            <el-select v-model="form.pl" size="small">
              <el-option
                v-for="item in plList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="数据格式：" prop="ss">
            <el-input
              v-model="form.ss"
              size="small"
              placeholder="请输入数据格式"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="数据格式版本：" prop="companyId">
            <el-input
              v-model="form.vv"
              size="small"
              placeholder="请输入数据格式版本"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="时间点信息：" prop="companyId">
            <el-date-picker
              v-model="form.value1"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="地理位置：" prop="companyId">
            <el-input v-model="form.dlwz" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="起始时间：" prop="value2">
            <el-date-picker
              v-model="form.value2"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="终止时间：" prop="value3">
            <el-date-picker
              v-model="form.value3"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="左上角经度：" prop="jjjjj">
            <el-input
              v-model="form.jjjjj"
              size="small"
              placeholder="请输入左上角经度"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="左上角纬度：" prop="wwwww">
            <el-input
              v-model="form.wwwww"
              size="small"
              placeholder="请输入左上角纬度"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="右下角经度：" prop="oooo">
            <el-input
              v-model="form.oooo"
              size="small"
              placeholder="请输入右下角经度"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="左上角纬度：" prop="zzzz">
            <el-input
              v-model="form.zzzz"
              size="small"
              placeholder="请输入左上角纬度"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="比例尺：" prop="email">
            <el-input
              v-model="form.blc"
              size="small"
              placeholder="请输入比例尺"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分辨率：" prop="email">
            <el-input
              v-model="form.fbl"
              size="small"
              placeholder="请输入分辨率"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="平面坐标系：" prop="zbx">
            <el-input
              v-model="form.zbx"
              size="small"
              placeholder="请输入平面坐标系"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="投影方式：" prop="email">
            <el-input
              v-model="form.tyfs"
              size="small"
              placeholder="请输入投影方式"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="高程系：" prop="email">
            <el-input
              v-model="form.gcx"
              size="small"
              placeholder="请输入高程系"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">管理方</el-divider>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="机构名称：" prop="pc2">
            <SearchBar
              @handleSearch="handleSearch('pc2', 'jg')"
              :searchValue="form.pc2"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="机构代码：" prop="companyId">
            <el-input
              v-model="form.jgdm2"
              size="small"
              placeholder="请输入机构代码"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="机构简称：" prop="companyId">
            <el-input
              v-model="form.jgjc2"
              size="small"
              placeholder="请输入机构简称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="负责人姓名：" prop="companyId">
            <el-input
              v-model="form.fzrxm2"
              size="small"
              placeholder="请输入负责人姓名"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="责任方地址：" prop="companyId">
            <el-input
              v-model="form.zrfdz2"
              size="small"
              placeholder="请输入责任方地址"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="责任方邮编：" prop="companyId">
            <el-input
              v-model="form.fzryb2"
              size="small"
              placeholder="请输入责任方邮编"
            ></el-input>
          </el-form-item>
        </el-col> </el-row
      ><el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="责任方联系电话：" prop="companyId">
            <el-input
              v-model="form.zrfdh2"
              size="small"
              placeholder="请输入责任方联系电话"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="责任方电子邮箱：" prop="companyId">
            <el-input
              v-model="form.zrfyx2"
              size="small"
              placeholder="请输入责任方电子邮箱"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="dialog-caption">
        <h1 class="dialog-caption-text">信息资源分发</h1>
      </div>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="信息资源记录数：" prop="companyId">
            <el-input
              v-model="form.llll"
              size="small"
              placeholder="请输入信息资源记录数"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="信息资源数据量：" prop="companyId">
            <el-input
              v-model="form.pppp"
              size="small"
              placeholder="请输入信息资源数据量"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="共享范围：" prop="gxff">
            <el-select v-model="form.gxff" size="small">
              <el-option
                v-for="item in gxffList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="共享方式：" prop="gxfs">
            <el-select v-model="form.gxfs" size="small">
              <el-option
                v-for="item in gxfsList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="提供方式：" prop="tgfs">
            <el-select v-model="form.tgfs" size="small">
              <el-option
                v-for="item in tgfsList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="共享使用说明：" prop="companyId">
            <el-input
              v-model="form.ssss"
              size="small"
              placeholder="请输入共享使用说明"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="数据志：" prop="companyId">
            <el-input
              v-model="form.mmmmm"
              size="small"
              placeholder="请输入数据志"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">信息资源分发方</el-divider>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="机构名称：" prop="pc3">
            <SearchBar
              @handleSearch="handleSearch('pc3', 'jg')"
              :searchValue="form.pc3"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="机构代码：" prop="companyId">
            <el-input
              v-model="form.jgdm3"
              size="small"
              placeholder="请输入机构代码"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="机构简称：" prop="companyId">
            <el-input
              v-model="form.jgjc3"
              size="small"
              placeholder="请输入机构简称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="负责人姓名：" prop="companyId">
            <el-input
              v-model="form.fzrxm3"
              size="small"
              placeholder="请输入负责人姓名"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="责任方地址：" prop="companyId">
            <el-input
              v-model="form.zrfdz3"
              size="small"
              placeholder="请输入责任方地址"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="责任方邮编：" prop="companyId">
            <el-input
              v-model="form.fzryb3"
              size="small"
              placeholder="请输入责任方邮编"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="责任方联系电话：" prop="companyId">
            <el-input
              v-model="form.zrfdh3"
              size="small"
              placeholder="请输入责任方联系电话"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="责任方电子邮箱：" prop="companyId">
            <el-input
              v-model="form.zrfyx3"
              size="small"
              placeholder="请输入责任方电子邮箱"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="dialog-caption">
        <h1 class="dialog-caption-text">元数据参考信息</h1>
      </div>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="元数据更新日期：" prop="value4">
            <el-date-picker
              v-model="form.value4"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">信息资源分发方</el-divider>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="机构名称：" prop="pc4">
            <SearchBar
              @handleSearch="handleSearch('pc4', 'jg')"
              :searchValue="form.pc4"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="机构代码：" prop="companyId">
            <el-input
              v-model="form.jgdm4"
              size="small"
              placeholder="请输入机构代码"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="机构简称：" prop="companyId">
            <el-input
              v-model="form.jgjc4"
              size="small"
              placeholder="请输入机构简称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="负责人姓名：" prop="companyId">
            <el-input
              v-model="form.fzrxm4"
              size="small"
              placeholder="请输入负责人姓名"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="责任方地址：" prop="companyId">
            <el-input
              v-model="form.zrfdz4"
              size="small"
              placeholder="请输入责任方地址"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="责任方邮编：" prop="companyId">
            <el-input
              v-model="form.fzryb4"
              size="small"
              placeholder="请输入责任方邮编"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="责任方联系电话：" prop="companyId">
            <el-input
              v-model="form.zrfdh4"
              size="small"
              placeholder="请输入责任方联系电话"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="branch-name">
          <el-form-item label="责任方电子邮箱：" prop="companyId">
            <el-input
              v-model="form.zrfyx4"
              size="small"
              placeholder="请输入责任方电子邮箱"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12" class="branch-name">
          <el-form-item label="缩略图：" prop="companyId">
            <el-upload
              ref="upload"
              :limit="1"
              accept=".png, .jpg"
              :headers="upload.headers"
              :action="upload.url + '?updateSupport=' + upload.updateSupport"
              :disabled="upload.isUploading"
              :on-progress="handleFileUploadProgress"
              :on-success="handleFileSuccess"
              :auto-upload="false"
              drag
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将图片拖到此处，或
                <em>点击上传</em>
              </div>

              <div class="el-upload__tip" style="color: red" slot="tip">
                提示：仅允许导入“npg”或“jpg”格式文件！
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item class="btn">
          <el-button type="primary" @click="submitForm">暂存</el-button>
          <el-button type="success" @click="submitForm">提交</el-button
          ><el-button type="warning" @click="submitForm">另存为模版</el-button>
          <el-button @click="clear">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <SearchTable
      v-if="isSearchBoxShow"
      :type="searchType"
      @getCheckedData="getCheckedData"
      @close="close"
    />
  </div>
</template>

<script>
// import { getSelectMap } from "@/api/yg/site.js";
// import { dictListType } from "@/api/styem/dict/type.js";
// import {
//   saveAddInfo,
//   getAddInfoById,
//   getQHList,
//   getJDList,
// } from "@/api/yqBack/basicInfo.js";
import SearchBar from "../../components/searchBar.vue";
import SearchTable from "../../components/searchTable.vue";
import { _dateFormat } from "@/utils/dateFormat.js";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      isRequesting: false,
      curValue: "",
      isSearchBoxShow: false,
      searchType: "",
      value1: undefined,
      value2: undefined,
      value3: undefined,
      value4: undefined,
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/center/sys/user/import",
      },
      form: {
        monitorType: "",
        jyzmc: "",
        jyzbm: "",
        wd: "",
        jyzbm1: "",
        yz: "",
        dm: "",
        jgdm: "",
        pc: "",
        fzrxm: "",
        jgjc: "",
        zrfdz: "",
        fzryb: "",
        zrfdh: "",
        zrfyx: "",
        code: "",
        ffff: "",
        yyyy: "",
        yy999: "",
        tableData: [
          {
            a: "676",
            b: "",
            c: "",
          },
        ],
        bdType: "",
        pl: "",
        ss: "",
        vv: "",
        date1: "",
        dlwz: "",
        date2: "",
        date3: "",
        jjjjj: "",
        wwwww: "",
        oooo: "",
        zzzz: "",
        blc: "",
        fbl: "",
        zbx: "",
        tyfs: "",
        gcx: "",
        pc2: "",
        pc3: "",
        pc4: "",
        jgdm2: "",
        jgdm3: "",
        jgdm4: "",
        fzrxm2: "",
        fzrxm3: "",
        fzrxm4: "",
        jgjc2: "",
        jgjc3: "",
        jgjc4: "",
        zrfdz2: "",
        zrfdz3: "",
        zrfdz4: "",
        fzryb2: "",
        fzryb3: "",
        fzryb4: "",
        zrfdh2: "",
        zrfdh3: "",
        zrfdh4: "",
        zrfyx2: "",
        zrfyx3: "",
        zrfyx4: "",
        llll: "",
        pppp: "",
        gxff: "",
        gxfs: "",
        tgfs: "",
        ssss: "",
        mmmmm: "",
      },
      tgfsList: [
        {
          value: "1",
          label: "sdb",
        },
      ],
      gxfsList: [
        {
          value: "1",
          label: "sdb",
        },
      ],
      gxffList: [
        {
          value: "1",
          label: "sdb",
        },
      ],
      plList: [
        {
          value: "1",
          label: "yyjjdd",
        },
      ],
      monitorTypeList: [
        {
          value: "1",
          label: "aaa",
        },
      ],
      yzList: [
        {
          value: "1",
          label: "4vvv",
        },
      ],
      dataTypeList: [
        {
          value: "1",
          label: "bb",
        },
      ],
      bdTypeList: [
        {
          value: "1",
          label: "33",
        },
      ],
      rules: {
        jyzbm: [{ required: true, message: "请输入中文名称", trigger: "blur" }],
        jyzbm1: [{ required: true, message: "请输入关键词", trigger: "blur" }],
        dm: [{ required: true, message: "请输入摘要", trigger: "blur" }],
        pc: [{ required: true, message: "请输入机构名称", trigger: "blur" }],
        pc2: [{ required: true, message: "请输入机构名称", trigger: "blur" }],
        pc3: [{ required: true, message: "请输入机构名称", trigger: "blur" }],
        pc4: [{ required: true, message: "请输入机构名称", trigger: "blur" }],
        code: [
          { required: true, message: "请输入分类标准代码", trigger: "blur" },
        ],
        ss: [{ required: true, message: "请输入数据格式", trigger: "blur" }],
        value2: [
          { required: true, message: "请选择起始时间", trigger: "change" },
        ],
        value3: [
          { required: true, message: "请选择终止时间", trigger: "change" },
        ],
        value4: [
          {
            required: true,
            message: "请选择元数据更新日期",
            trigger: "change",
          },
        ],
        jjjjj: [
          { required: true, message: "请输入左上角经度", trigger: "blur" },
        ],
        wwwww: [
          { required: true, message: "请输入左上角纬度", trigger: "blur" },
        ],
        oooo: [
          { required: true, message: "请输入右下角经度", trigger: "blur" },
        ],
        zzzz: [
          { required: true, message: "请输入右下角经度", trigger: "blur" },
        ],
        zbx: [{ required: true, message: "请输入平面坐标系", trigger: "blur" }],
        gxff: [
          { required: true, message: "请选择共享范围", trigger: "change" },
        ],
        gxfs: [
          { required: true, message: "请选择共享方式", trigger: "change" },
        ],
        tgfs: [
          { required: true, message: "请选择提供方式", trigger: "change" },
        ],
        zdmc: [
          {
            required: true,
            message: "请选择站点名称",
            trigger: "change",
          },
        ],
        ylcl: [{ required: true, message: "请输入原铝产量", trigger: "blur" }],
        tjsj: [
          {
            required: true,
            message: "请选择统计时间",
            trigger: "change",
          },
        ],
      },
    };
  },
  props: {
    id: String,
    type: String,
  },
  components: {
    SearchBar,
    SearchTable,
  },
  created() {
    if (this.type == "edit" || this.type == "view") {
      this.getData();
    }
  },

  methods: {
    changeRecord: function (val) {
      this.form.jyzmc = "aa";
      this.form.jyzbm = "bb";
      this.form.wd = "cc";
      this.form.jyzbm1 = "ff";
    },
    handleDeleteRow: function (idx) {
      this.form.tableData.splice(idx, 1);
    },
    handleAddRow: function () {
      this.form.tableData.push({ a: "", b: "", c: "" });
    },
    clear: function () {
      for (let i in this.form) {
        this.$set(this.form, i, undefined);
      }
    },

    getData: function () {
      getAddInfoById({
        id: this.id,
      }).then((res) => {
        // this.form =  res.data
        for (let item in this.form) {
          this.$set(this.form, item, res.data[item]);
        }
      });
    },
    submitForm: function () {
      if (this.form.value1 && typeof this.form.value1 == "object") {
        this.$set(
          this.form,
          "date1",
          _dateFormat(this.form.value1, "yyyy-MM-dd hh:mm:ss")
        );
      }
      if (this.form.value2 && typeof this.form.value2 == "object") {
        this.$set(
          this.form,
          "date2",
          _dateFormat(this.form.value2, "yyyy-MM-dd hh:mm:ss")
        );
      }
      if (this.form.value3 && typeof this.form.value3 == "object") {
        this.$set(
          this.form,
          "date3",
          _dateFormat(this.form.value3, "yyyy-MM-dd hh:mm:ss")
        );
      }
      if (this.type == "edit") {
        this.form.id = this.id;
      }
      if (this.isRequesting) {
        return;
      }
      this.$refs.userManageform.validate(async (valid) => {
        if (valid) {
          this.isRequesting = true;
          const loading = this.$loading({
            lock: true,
            text: "正在保存提交，请稍等...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.1)",
          });
          saveAddInfo(this.form)
            .then((reponse) => {
              if (reponse.code == 200) {
                this.$message.success("保存成功");
              } else {
                this.$notify({
                  title: "系统提示",
                  message: "保存失败",
                  showClose: false,
                });
              }
            })
            .finally(() => {
              this.isRequesting = false;
            });
          loading.close();
        } else {
          return false;
        }
      });
    },
    handleSearch: function (value, searchType) {
      this.searchType = searchType;
      this.curValue = value;
      this.isSearchBoxShow = true;
    },
    getCheckedData: function (data) {
      this.form[this.curValue] = data.id;
      // let num;
      // if (this.curValue.indexOf("pc") > -1) {
      //   num = this.curValue.subString(2);
      // }
      // if (num) {
      //   this.form["jgdm" + num] = data.id;
      // }

      this.isSearchBoxShow = false;
    },
    close: function () {
      this.isSearchBoxShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.new {
  padding-top: 20px;
}
::v-deep .el-select {
  width: 100%;
}
::v-deep .el-date-editor {
  width: 100%;
}
::v-deep .el-cascader {
  width: 100%;
}
::v-deep label {
  font-weight: 400;
}
.btn {
  display: flex;
  justify-content: center;
  padding-top: 26px;
}

::v-deep .el-row {
  margin-bottom: 16px;
}
</style>