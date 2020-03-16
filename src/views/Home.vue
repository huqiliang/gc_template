<template>
  <div class="home">
    <AutoTable v-bind="autoTableConfig" ref="autoTable" @on-click="openModal">
      <row slot="header" :gutter="10">
        <FilterSearch
          :columns="searchColumns"
          v-model="searchData"
        ></FilterSearch>
      </row>
    </AutoTable>
    <Modal
      mask
      v-model="dialog.show"
      :width="70"
      :mask-closable="false"
      :title="dialog.title"
    >
      <div v-if="dialog.show">
        <AutoForm :row="1" ref="form" v-model="formData" :fields="fields">
        </AutoForm>
      </div>
      <div slot="footer">
        <Button type="primary" @click="ok">提交</Button>
        <Button @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import api from "../api/controller";

export default {
  data() {
    return {
      dialog: {
        title: "",
        show: false,
        isEdit: false
      },

      formData: {},
      autoTableConfig: {
        columns: [
          {
            title: "标识",
            key: "id",
            showForm: true, //是否在表单中体现
            validators: [
              //如果在表单中 可以设置验证规则
              {
                required: true,
                message: "自定义显示的"
              }
            ]
          },
          { title: "姓名", key: "username" },
          { title: "性别", showForm: true, key: "sex" },
          {
            title: "操作",
            key: "action",
            width: 160,
            align: "center",
            buttons: [
              { type: "edit", label: "修改" },
              { type: "delete", label: "删除" }
            ]
          }
        ],
        url: api.LIST_URL, //获取表格数据接口
        path: "datas"
      },
      searchData: {
        conditionText: "",
        searchBarStas: ""
      },
      searchColumns: [
        {
          datas: [
            {
              label: "请输入代码或者描述",
              key: "conditionText"
            },
            {
              label: "类型",
              render: () => {
                return (
                  <i-select>
                    <i-option value="a">a</i-option>
                  </i-select>
                );
              }
            }
          ],
          type: "inputs"
        },
        {
          datas: [
            { label: "待上线", key: "R", value: "R" },
            { label: "有效", key: "I", value: "I" },
            { label: "无效", key: "X", value: "X" }
          ],
          key: "searchBarStas", //传入节点值 不传扩展到根对象
          type: "checkboxs"
        },
        {
          datas: [
            {
              label: "查询",
              action: () => {
                this.$refs.autoTable.fetchDataInSide(this.searchData);
              }
            },
            {
              label: "重置",
              action: "reset"
            },
            {
              label: "新增",
              action: () => {
                this.openModal({ type: "新增" });
              }
            }
          ],
          type: "buttons"
        }
      ]
    };
  },
  computed: {
    fields() {
      let arr = [];
      this.autoTableConfig.columns.map(element => {
        if (element.showForm) {
          element.label = element.title;
          arr.push(element);
        }
      });
      return arr;
    }
  },
  methods: {
    async openModal({ type, params }) {
      switch (type) {
        case "新增":
          this.dialog.title = "新建数据";
          this.dialog.isEdit = false;
          this.formData = {};
          this.dialog.show = true;
          break;
        case "修改":
          this.dialog.title = "修改数据";
          this.dialog.isEdit = true;
          // this.formData = params.row; //可以换成从接口取数据
          this.formData = { ...params.row };
          this.dialog.show = true;
          break;
        case "删除":
          this.delete(params.row);
          break;
        default:
          break;
      }
    },
    async delete(data) {
      const res = await api.DELETE(data);
      if (res && res.data && res.data.result === 0) {
        this.$Message.info({ content: res.data.msg || "成功" });
        this.$refs.autoTable.refresh(this.searchData); //刷新表格
      }
    },
    async ok() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res;
          if (this.dialog.isEdit) {
            res = await api.UPDATE(this.formData);
          } else {
            res = await api.CREATE(this.formData);
          }
          if (res && res.data && res.data.result === 0) {
            this.$Message.info({ content: res.data.msg || "成功" });
            this.$refs.autoTable.fetchDataInSide(this.searchData);
            this.dialog.show = false;
          }
        }
      });
    },
    reset() {
      this.formData = {};
      this.$refs.form.resetFields();
    },
    cancel() {
      this.reset();
      this.dialog.show = false;
    }
  }
};
</script>
<style>
.home {
  font-size: 20px;
  padding: 20px;
}
</style>
