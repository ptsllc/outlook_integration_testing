<template>
  <div>
    <div id="mainTable">
      <div style="float:left">
        <h3>Calendar Message Log</h3>
      </div>
      <div @click="addNewAppt()">
        <span class="btnAddNew">
          <font-awesome-icon icon="plus-circle" size="lg" style="color:green" />
          <span> Add New</span>
        </span>
      </div>
      <div id="loadingMessage" v-show="showTableLoading">
        Sending Message ...
      </div>
      <div>
        <b-table
          striped
          hover
          :items="items"
          :fields="fields"
          :per-page="perPage"
          :current-page="currentPage"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          responsive="sm"
          sort-icon-left
          id="my-table"
        >
          <template v-slot:cell(Edit)="item">
            <div v-if="item.item.TYPE != 'CANCEL'">
              <span class="actionIcon editIcon" @click="updateAppt(item.item)">
                <font-awesome-icon icon="edit" size="lg" />
                <span>Edit</span>
              </span>
            </div>
          </template>
          <template v-slot:cell(Cancel)="item">
            <div v-if="item.item.TYPE != 'CANCEL'">
              <span
                class="actionIcon deleteIcon"
                @click="showCancelConfirmation(item.item)"
              >
                <font-awesome-icon icon="minus-circle" size="lg" />
                <span>Cancel</span>
              </span>
            </div>
          </template>
        </b-table>
      </div>
      <div>
        <button class="btnRed" @click="showClearLogsConfirmation()">
          Clear Logs
        </button>
      </div>
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
        style="float:right"
      ></b-pagination>
    </div>
    <b-modal
      id="modalForm1"
      size="lg"
      okTitle="Send"
      cancelTitle="Cancel"
      :title="formTitle"
      @ok="OkClicked()"
      @hidden="getLogs()"
    >
      <b-form>
        <b-container fluid>
          <b-row class="my-1">
            <b-col sm="3">
              <label for="input-none">To</label>
            </b-col>
            <b-col sm="9">
              <b-form-input
                id="sendto"
                :state="null"
                v-model="selectedItem.SENDTO"
                placeholder="Single Email Address"
              ></b-form-input>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="3">
              <label for="input-none">Location</label>
            </b-col>
            <b-col sm="9">
              <b-form-input
                id="location"
                :state="null"
                v-model="selectedItem.LOCATION"
                placeholder=""
              ></b-form-input>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="3">
              <label for="input-none">Date</label>
            </b-col>
            <b-col sm="9">
              <b-form-datepicker
                id="apptdate"
                :min="min"
                :max="max"
                v-model="selectedItem.APPTDATE"
                class="mb-2"
              ></b-form-datepicker>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="3">
              <label for="input-none">Start Time</label>
            </b-col>
            <b-col sm="4">
              <b-form-spinbutton
                id="starttime_hour"
                min="00"
                max="23"
                step="1"
                v-model="selectedItem.STARTHOUR"
              ></b-form-spinbutton>
            </b-col>
            <b-col sm="1"><span>:</span></b-col>
            <b-col sm="4">
              <b-form-spinbutton
                id="starttime_min"
                min="00"
                max="55"
                step="5"
                v-model="selectedItem.STARTMIN"
              ></b-form-spinbutton>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="3">
              <label for="input-none">End Time</label>
            </b-col>
            <b-col sm="4">
              <b-form-spinbutton
                id="endtime_hour"
                min="00"
                max="23"
                step="1"
                v-model="selectedItem.ENDHOUR"
              ></b-form-spinbutton>
            </b-col>
            <b-col sm="1"><span>:</span></b-col>
            <b-col sm="4">
              <b-form-spinbutton
                id="endtime_min"
                min="00"
                max="55"
                step="5"
                v-model="selectedItem.ENDMIN"
              ></b-form-spinbutton>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="3">Message</b-col>
            <b-col sm="9">
              <vue-editor
                :editorToolbar="customToolbar"
                v-model="selectedItem.MSGTEXT"
              ></vue-editor>
            </b-col>
          </b-row>
        </b-container>
      </b-form>
    </b-modal>
    <b-modal
      id="modal-delete"
      title="Clear Logs Confirmation"
      okTitle="Yes"
      cancelTitle="No"
      @ok="clearLogs()"
    >
      <b-form>
        Are you sure you want to clear the message logs?
      </b-form>
    </b-modal>
    <b-modal
      id="modal-cancel"
      title="Cancel Confirmation"
      okTitle="Yes"
      cancelTitle="No"
      @ok="sendCancel()"
    >
      <b-form>
        <div>Are you sure you want to cancel this appointment?</div>
        <div>To: {{ selectedItem.SENDTO }}</div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import dataService from '../dataservice';
import { VueEditor } from 'vue2-editor';

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const minDate = new Date(today);
const maxDate = new Date(today);
maxDate.setMonth(maxDate.getMonth() + 2);

export default {
  components: {
    VueEditor
  },
  data() {
    return {
      showTableLoading: false,
      min: minDate,
      max: maxDate,
      customToolbar: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link']
      ],
      items: [],
      selectedItem: {},
      formTitle: '',
      fields: [
        'Edit',
        //'UID',
        //{ key: 'TYPE', label: 'Type' },
        {
          key: 'DTCREATED',
          label: 'Sent',
          sortable: true,
          formatter: value => {
            let dbDate = new Date(value);
            let offset = dbDate.getTimezoneOffset();
            dbDate.setMinutes(dbDate.getMinutes() + offset);
            return dbDate.toLocaleString();
          }
        },
        { key: 'SENDTO', label: 'To', sortable: true },
        {
          key: 'APPTDATE',
          label: 'Appt Date',
          sortable: true,
          formatter: value => {
            if (value) {
              let dbDate = new Date(value);
              let offset = dbDate.getTimezoneOffset();
              dbDate.setMinutes(dbDate.getMinutes() + offset);
              return dbDate.toLocaleDateString();
            }
          }
        },
        {
          key: 'STARTHOUR',
          label: 'Start',
          formatter: (value, key, item) => {
            if (value) {
              let hour = value;
              if (value < 10) {
                hour = '0' + hour;
              }
              let min = item.STARTMIN;
              if (min < 10) {
                min = '0' + min;
              }
              return hour + ':' + min;
            }
          }
        },
        {
          key: 'ENDHOUR',
          label: 'End',
          formatter: (value, key, item) => {
            if (value) {
              let hour = value;
              if (value < 10) {
                hour = '0' + hour;
              }
              let min = item.ENDMIN;
              if (min < 10) {
                min = '0' + min;
              }
              return hour + ':' + min;
            }
          }
        },
        'Cancel'
      ],
      perPage: 10,
      currentPage: 1,
      sortBy: 'DTCREATED',
      sortDesc: true
    };
  },
  computed: {
    rows() {
      let rtn = 0;
      if (this.items !== null) {
        rtn = this.items.length;
      }
      return rtn;
    }
  },
  mounted() {
    this.getLogs();
  },
  methods: {
    getLogs() {
      dataService.getLogs().then(result => {
        this.items = result.data;
      });
    },
    showClearLogsConfirmation() {
      this.$bvModal.show('modal-delete');
    },
    clearLogs() {
      dataService.clearAllLogs().then(() => {
        this.getLogs();
      });
    },
    showCancelConfirmation(item) {
      this.selectedItem = JSON.parse(JSON.stringify(item));
      this.$bvModal.show('modal-cancel');
    },
    sendCancel() {
      this.selectedItem.TYPE = 'CANCEL';
      this.OkClicked();
    },
    addNewAppt() {
      this.selectedItem = {
        TYPE: 'REQUEST',
        APPTDATE: today,
        LOCATION: 'Training Room',
        STARTHOUR: 9,
        STARTMIN: 0,
        ENDHOUR: 10,
        ENDMIN: 30
      };
      this.formTitle = 'Send New Calendar Request';
      this.$bvModal.show('modalForm1');
    },
    updateAppt(item) {
      this.selectedItem = JSON.parse(JSON.stringify(item));
      this.formTitle = 'Send Update';
      this.$bvModal.show('modalForm1');
    },
    OkClicked() {
      this.showTableLoading = true;
      dataService
        .sendNewMessage(this.selectedItem)
        .then(() => {
          this.getLogs();
        })
        .then(() => {
          this.showTableLoading = false;
        });
    }
  }
};
</script>

<style scoped>
#mainTable {
  font-size: smaller;
  width: 1024px;
  margin: auto;
  margin-top: 20px;
}
.btnRed {
  float: left;
  background-color: rgb(179, 28, 28);
  color: white;
  padding: 4px;
}
.btnAddNew {
  font-size: larger;
  float: right;
  margin-right: 20px;
  padding-bottom: 10px;
  cursor: pointer;
}
.deleteIcon {
  color: red;
  cursor: pointer;
}
.editIcon {
  color: indigo;
  cursor: pointer;
}

#loadingMessage {
  margin: auto;
  background-color: wheat;
  height: 20px;
  width: 200px;
  text-align: center;
  font-weight: bold;
}
</style>
