<template>
  <form class="smart-form-container {{ form_class }}">
    <input type="hidden" name="id" data-column="id" value="{{ form._id || form.id }}" />
    <template v-for="column in columns">
    <div class="form-group">

      <template v-if="column && column['field_type'] == 'input'">
        <!-- horizontal form has different layout than vertical/inline form -->
        <template v-if="is_horizontal">
          <label for="{{ column.name }}" class="{{ hlabel_class }} control-label">{{ column.display || column.name }}<span v-if="column.required"> *</span></label>
          <div class="{{ hcontent_class }}">
            <input
              class="form-control"
              data-column="{{ column.name }}"
              v-model="form[column.name]"
              debounce="500"
              @change="formValueChange"
            />
            <div class="smart-form-field-info-text text-muted">{{ fieldInfo[column.name] }}</div>
            <div class="smart-form-field-validation-message text-danger">{{ validationInfo[column.name] }}</div>
          </div>
        </template>
        <template v-if="!is_horizontal">
          <label for="{{ column.name }}">{{ column.display || column.name }}<span v-if="column.required"> *</span></label>
          <div class="smart-form-field-info-text text-muted">{{ fieldInfo[column.name] }}</div>
          <input
            class="form-control"
            data-column="{{ column.name }}"
            v-model="form[column.name]"
            debounce="500"
            @change="formValueChange"
          />
          <div class="smart-form-field-validation-message text-danger">{{ validationInfo[column.name] }}</div>
        </template>
      </template>

      <template v-if="column && column['field_type'] == 'view'">
        <!-- horizontal form has different layout than vertical/inline form -->
        <template v-if="is_horizontal">
          <label for="{{ column.name }}" class="{{ hlabel_class }} control-label">{{ column.display || column.name }}<span v-if="column.required"> *</span></label>
          <div class="{{ hcontent_class }}">
            <input
              class="form-control"
              disabled="true"
              data-column="{{ column.name }}"
              v-model="form[column.name]"
            />
            <div class="smart-form-field-info-text text-muted">{{ fieldInfo[column.name] }}</div>
            <div class="smart-form-field-validation-message text-danger">{{ validationInfo[column.name] }}</div>
          </div>
        </template>
        <template v-if="!is_horizontal">
          <label for="{{ column.name }}">{{ column.display || column.name }}<span v-if="column.required"> *</span></label>
          <div class="smart-form-field-info-text text-muted">{{ fieldInfo[column.name] }}</div>
          <input
            class="form-control"
            disabled="true"
            data-column="{{ column.name }}"
            v-model="form[column.name]"
          />
          <div class="smart-form-field-validation-message text-danger">{{ validationInfo[column.name] }}</div>
        </template>
      </template>

      <template v-if="column && column['field_type'] == 'select-one'">
        <template v-if="is_horizontal">
          <label for="{{ column.name }}" class="{{ hlabel_class }} control-label">{{ column.display || column.name }}<span v-if="column.required"> *</span></label>
          <div class="{{ hcontent_class }}">
            <select
              class="form-control"
              data-column="{{ column.name }}"
              v-model="form[column.name]"
              @change="formValueChange">
              <option value="" disabled selected v-if="column.placeholder">
                <span class="text-muted">{{ column.placeholder }}</span>
              </option>
              <option v-for="value in column.values">
                <template v-if="column.key">
                  {{ value[column.key] }}
                </template>
                <template v-else>
                  {{ value }}
                </template>
              </option>
            </select>
            <div class="smart-form-field-info-text text-muted">{{ fieldInfo[column.name] }}</div>
            <div class="smart-form-field-validation-message text-danger">{{ validationInfo[column.name] }}</div>
          </div>
        </template>
        <template v-if="!is_horizontal">
          <label for="{{ column.name }}">{{ column.display || column.name }}<span v-if="column.required"> *</span></label>
          <div class="smart-form-field-info-text text-muted">{{ fieldInfo[column.name] }}</div>
          <select
            class="form-control"
            data-column="{{ column.name }}"
            v-model="form[column.name]"
            @change="formValueChange">
            <option value="" disabled selected v-if="column.placeholder">
              <span class="text-muted">{{ column.placeholder }}</span>
            </option>
            <option v-for="value in column.values">
              <template v-if="column.key">
                {{ value[key] }}
              </template>
              <template v-else>
                {{ value }}
              </template>
            </option>
          </select>
          <div class="smart-form-field-validation-message text-danger">{{ validationInfo[column.name] }}</div>
        </template>
      </template>

      <template v-if="column && column['field_type'] == 'mselect-one'">
        <template v-if="is_horizontal">
          <label for="{{ column.name }}" class="{{ hlabel_class }} control-label">{{ column.display || column.name }}<span v-if="column.required"> *</span></label>
          <div class="{{ hcontent_class }}">
            <multiselect
              :options="column.values",
              :multiple="false",
              :searchable="true",
              :selected="form[column.name]",
              :placeholder="column.hint",
              label="company_name",
              :close-on-select="true",
              :clear-on-select="false"
              @update="multiselectChange"
            ></multiselect>
            <div class="smart-form-field-info-text text-muted">{{ fieldInfo[column.name] }}</div>
            <div class="smart-form-field-validation-message text-danger">{{ validationInfo[column.name] }}</div>
          </div>
        </template>
        <template v-if="!is_horizontal">
          <label for="{{ column.name }}">{{ column.display || column.name }}<span v-if="column.required"> *</span></label>
          <div class="smart-form-field-info-text text-muted">{{ fieldInfo[column.name] }}</div>
            <multiselect
              :options="column.values",
              :multiple="false",
              :searchable="true",
              :selected="form[column.name]",
              :placeholder="column.name",
              label="company_name",
              :close-on-select="true",
              :clear-on-select="false"
              @update="multiselectChange"
            ></multiselect>
          <div class="smart-form-field-validation-message text-danger">{{ validationInfo[column.name] }}</div>
        </template>
      </template>

      <template v-if="column && column['field_type'] == 'select-multi'">
        <template v-if="is_horizontal">
          <label for="{{ column.name }}" class="{{ hlabel_class }} control-label">{{ column.display || column.name }}<span v-if="column.required"> *</span></label>
          <div class="{{ hcontent_class }}">
            <select
              class="form-control"
              data-column="{{ column.name }}"
              v-model="form[column.name]"
              @change="formValueChange"
              multiple>
              <option value="" disabled selected v-if="column.placeholder">
                <span class="text-muted">{{ column.placeholder }}</span>
              </option>
              <option v-for="value in column.values">
                <template v-if="column.key">
                  {{ value[key] }}
                </template>
                <template v-else>
                  {{ value }}
                </template>
              </option>
            </select>
            <div class="smart-form-field-info-text text-muted">{{ fieldInfo[column.name] }}</div>
            <div class="smart-form-field-validation-message text-danger">{{ validationInfo[column.name] }}</div>
          </div>
        </template>
        <template v-if="!is_horizontal">
          <label for="{{ column.name }}">{{ column.display || column.name }}<span v-if="column.required"> *</span></label>
          <div class="smart-form-field-info-text text-muted">{{ fieldInfo[column.name] }}</div>
            <select
              class="form-control"
              data-column="{{ column.name }}"
              v-model="form[column.name]"
              @change="formValueChange"
              multiple>
              <option value="" disabled selected v-if="column.placeholder">
                <span class="text-muted">{{ column.placeholder }}</span>
              </option>
              <option v-for="value in column.values">
                <template v-if="column.key">
                  {{ value[key] }}
                </template>
                <template v-else>
                  {{ value }}
                </template>
              </option>
            </select>
            <div class="smart-form-field-info-text text-muted">{{ fieldInfo[column.name] }}</div>
            <div class="smart-form-field-validation-message text-danger">{{ validationInfo[column.name] }}</div>
          </div>
        </template>
      </template>

      <template v-if="column && column['field_type'] == 'select-checkbox'">
        <template v-if="is_horizontal">
          <label for="{{ column.name }}" class="{{ hlabel_class }} control-label">{{ column.display || column.name }}<span v-if="column.required"> *</span></label>
          <div class="{{ hcontent_class }}">
            <div class="checkbox" v-for="value in column.values">
              <label>
                <input type="checkbox"
                  name="{{ column.name }}"
                  value="{{ value }}"
                  data-column="{{ column.name }}"
                  v-model="form[column.name]"
                  @change="formValueChange" />
                {{ value }}
              </label>
            </div>
            <div class="smart-form-field-info-text text-muted">{{ fieldInfo[column.name] }}</div>
            <div class="smart-form-field-validation-message text-danger">{{ validationInfo[column.name] }}</div>
          </div>
        </template>
        <template v-if="!is_horizontal">
          <label for="{{ column.name }}">{{ column.display || column.name }}<span v-if="column.required"> *</span></label>
          <div class="smart-form-field-info-text text-muted">{{ fieldInfo[column.name] }}</div>
          <div class="checkbox" v-for="value in column.values">
            <label>
              <input type="checkbox"
                name="{{ column.name }}"
                value="{{ value }}"
                data-column="{{ column.name }}"
                v-model="form[column.name]"
                @change="formValueChange" />
              {{ value }}
            </label>
          </div>
          <div class="smart-form-field-validation-message text-danger">{{ validationInfo[column.name] }}</div>
        </template>
      </template>

      <template v-if="column && column['field_type'] == 'select-radio'">
        <template v-if="is_horizontal">
          <label for="{{ column.name }}" class="{{ hlabel_class }} control-label">{{ column.display || column.name }}<span v-if="column.required"> *</span></label>
          <div class="{{ hcontent_class }}">
            <div class="radio" v-for="value in column.values">
              <label>
                <input type="radio"
                  name="{{ column.name }}"
                  value="{{ value }}"
                  data-column="{{ column.name }}"
                  v-model="form[column.name]"
                  @change="formValueChange" />
                {{ value }}
              </label>
            </div>
            <div class="smart-form-field-info-text text-muted">{{ fieldInfo[column.name] }}</div>
            <div class="smart-form-field-validation-message text-danger">{{ validationInfo[column.name] }}</div>
          </div>
        </template>
        <template v-if="!is_horizontal">
          <label for="{{ column.name }}">{{ column.display || column.name }}<span v-if="column.required"> *</span></label>
          <div class="smart-form-field-info-text text-muted">{{ fieldInfo[column.name] }}</div>
          <div class="radio" v-for="value in column.values">
            <label>
              <input type="radio"
                name="{{ column.name }}"
                value="{{ value }}"
                data-column="{{ column.name }}"
                v-model="form[column.name]"
                @change="formValueChange" />
              {{ value }}
            </label>
          </div>
          <div class="smart-form-field-validation-message text-danger">{{ validationInfo[column.name] }}</div>
        </template>
      </template>

      <template v-if="column && column['field_type'] == 'text'">
        <template v-if="is_horizontal">
          <label for="{{ column.name }}" class="{{ hlabel_class }} control-label">{{ column.display || column.name }}<span v-if="column.required"> *</span></label>
          <div class="{{ hcontent_class }}">
            <textarea
              class="form-control"
              data-column="{{ column.name }}"
              v-model="form[column.name]"
              @change="formValueChange"
            ></textarea>
            <div class="smart-form-field-info-text text-muted">{{ fieldInfo[column.name] }}</div>
            <div class="smart-form-field-validation-message text-danger">{{ validationInfo[column.name] }}</div>
          </div>
        </template>
        <template v-if="!is_horizontal">
          <label for="{{ column.name }}">{{ column.display || column.name }}<span v-if="column.required"> *</span></label>
          <div class="smart-form-field-info-text text-muted">{{ fieldInfo[column.name] }}</div>
          <textarea
            class="form-control"
            data-column="{{ column.name }}"
            v-model="form[column.name]"
            @change="formValueChange"
          ></textarea>
          <div class="smart-form-field-validation-message text-danger">{{ validationInfo[column.name] }}</div>
        </template>
      </template>
    </div>
    </template>

    <template v-if="column && column['field_type'] == 'file'">
      <!-- horizontal form has different layout than vertical/inline form -->
      <template v-if="is_horizontal">
        <label for="{{ column.name }}" class="{{ hlabel_class }} control-label">{{ column.display || column.name }}<span v-if="column.required"> *</span></label>
        <div class="{{ hcontent_class }}">
          <input
            class="form-control"
            type="file"
            data-column="{{ column.name }}"
            v-model="form[column.name]"
            debounce="500"
            @change="formValueChange"
          />
          <div class="smart-form-field-info-text text-muted">{{ fieldInfo[column.name] }}</div>
          <div class="smart-form-field-validation-message text-danger">{{ validationInfo[column.name] }}</div>
        </div>
      </template>
      <template v-if="!is_horizontal">
        <label for="{{ column.name }}">{{ column.display || column.name }}<span v-if="column.required"> *</span></label>
        <div class="smart-form-field-info-text text-muted">{{ fieldInfo[column.name] }}</div>
        <input
          class="form-control"
          type="file"
          data-column="{{ column.name }}"
          v-model="form[column.name]"
          debounce="500"
          @change="formValueChange"
        />
        <div class="smart-form-field-validation-message text-danger">{{ validationInfo[column.name] }}</div>
      </template>
    </template>

    <template v-if="config.showbuttons">
      <template v-if="is_horizontal">
        <div class="form-group">
          <label class="{{ hlabel_class }} control-label"></label>
          <div class="{{ hcontent_class }}">
            <button type="button" class="btn btn-success btn-submit" @click="submitForm">Save</button>
            <button type="button" class="btn btn-default btn-delete" @click="removeForm">Delete</button>
            <!-- <button type="button" class="btn btn-default btn-cancel" @click="cancelForm">Clear</button> -->
          </div>
        </div>
      </template>
      <template v-if="!is_horizontal">
        <div class="form-group">
          <button type="button" class="btn btn-success btn-submit" @click="submitForm">Save</button>
          <button type="button" class="btn btn-default btn-delete" @click="removeForm">Delete</button>
          <!-- <button type="button" class="btn btn-default btn-cancel" @click="cancelForm">Clear</button> -->
        </div>
      </template>
    </template>
  </form>
</template>

<script>
import store from '../vuex/store'
import multiselect from 'vue-multiselect'
import {
  setFormByName, saveForm, deleteForm, cancelForm, sendFormChange,
  getItems, notifyMultiSelectChange
} from '../vuex/actions'
import { hideEditForm, getArrayItemByProperty } from '../service/support.js'

export default {
  props: ['name', 'target', 'columns', 'config'],
  data: function() {
    var dataResult = {
      fieldInfo: {},
      validationInfo: {}
    };
    for (var i = 0; i < this.columns.length; i++) {
      var column = this.columns[i];
      dataResult.fieldInfo[column.name] = column.hint || '';
      dataResult.validationInfo[column.name] = '';
    }
    return dataResult;
  },
  vuex: {
    getters: {
      formCol: state => state.formCol
    }
  },
  components: {
    multiselect
  },
  computed: {
    is_horizontal: function() {
      return this.config['mode'] == 'horizontal';
    },
    hlabel_class: function() {
      var labelWidthNumber = this.config['label_width'] || 3;
      return 'col-md-' + labelWidthNumber;
    },
    hcontent_class: function() {
      var labelWidthNumber = this.config['label_width'] || 3;
      return 'col-md-' + (12 - labelWidthNumber);
    },
    form_class: function() {
      var result = '';
      console.log('compute form_class:', this.config);
      switch(this.config['mode'] ) {
      case 'horizontal':
        result = 'form-horizontal';
        break;
      case 'inline':
        result = 'form-inline';
        break;
      }
      return result;
    },
    form: {
      get: function () {
        var formCol = this.$store.state['formCol'];
        var formName = this.name;
        return formCol[formName];
      },
      set: function (newForm) {
        var formName = this.name;
        setFormByName(this.$store, formName, newForm);
      }
    }
  },
  methods: {
    validateForm: function() {
      var validateFormResult = true;
      //console.log('validateForm form:', JSON.stringify(this.form));
      //console.log('validateForm columns:', JSON.stringify(this.columns));
      for (var i = 0; i < this.columns.length; i++) {
        var column = this.columns[i];
        var validationResult = this.validateFormField(column.name, this.form[column.name]);
        //console.log('validateForm ', column.name, this.form[column.name], validationResult);
        if (!validationResult) {
          validateFormResult = false;
        }
      }
      //console.log('>>> validateForm validateFormResult:', validateFormResult);
      return validateFormResult;
    },
    validateFormField: function(columnName, value) {
      var validationResult = true;
      var column = getArrayItemByProperty(this.columns, 'name', columnName);
      //console.log('validateFormField:', column, value);
      this.validationInfo[columnName] = '';
      if (column) {
        if (column.required) {
          if (!value || value == '') {
            this.validationInfo[columnName] = 'required';
            validationResult = false;
          }
        }
      }
      return validationResult;
    },
    formValueChange: function(event) {
      console.log('formValueChange:', event);
      var columnName = $(event.srcElement).attr('data-column');
      var value = event.srcElement.value;
      console.log('formValueChange:', columnName, value);
      sendFormChange(this.$store, this.name, this.target, columnName, value);
      this.validateFormField(columnName, value);
      return false;
    },
    multiselectChange: function(value, id) {
      //console.log('>>> multiselectChange:', value, id);
      notifyMultiSelectChange(store, value);
    },
    submitForm: function(event) {
      console.log('submitForm:', event);
      if (this.validateForm()) {
        saveForm(this.$store, this.name, this.dismissForm);
      } else {
        console.log('form validation does not pass');
      }
    },
    removeForm: function(event) {
      console.log('removeForm:', event);
      deleteForm(this.$store, this.name, this.dismissForm);
    },
    cancelForm: function(event) {
      console.log('cancelForm:', event);
      cancelForm(this.$store, this.name, this.dismissForm);
    },
    dismissForm: function() {
      console.log('dismissForm', this.name, this.target);
      hideEditForm();
      getItems(this.$store, this.target);  // refresh items list
    }
  }
}
</script>

<style>
form.form-inline .form-group label {
  font-weight: normal;
  padding-left: 10px;
  padding-right: 3px;
}
form.form-inline .smart-form-field-info-text {
  display: inline;
}
form.form-inline .smart-form-field-validation-message {
  display: inline;
}

</style>
