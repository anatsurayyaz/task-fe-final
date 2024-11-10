<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const headers = [
  { title: 'Account Name', key: 'name', sortable: true },
  { title: 'Balance', key: 'balance', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
];

const accounts = ref([]);
const totalBalance = ref(0);
const averageBalance = ref(0);
const totalAccounts = ref(0);
const deleteDialog = ref(false); // Dialog visibility state
const accountToDelete = ref(null); // Account to delete

async function fetchAccounts() {
  try {
    const response = await axios.get('http://localhost:8080/account/list');
    if (response.data && response.data.data) {
      accounts.value = response.data.data; // Update the account list
      totalAccounts.value = accounts.value.length;

      // Calculate total and average balance
      totalBalance.value = accounts.value.reduce((sum, account) => sum + account.balance, 0);
      averageBalance.value = totalAccounts.value > 0 ? totalBalance.value / totalAccounts.value : 0;
    } else {
      console.error('Invalid response structure:', response.data);
    }
  } catch (error) {
    console.error('Error fetching accounts:', error);
  }
}

onMounted(() => {
  fetchAccounts();
});

function handleCreate() {
  console.log("Create Account Button Clicked");
  // Implement create logic here
}

function handleEdit(item) {
  console.log("Edit Account Button Clicked", item);
  // Implement edit logic here
}

function confirmDelete(account) {
  accountToDelete.value = account;
  deleteDialog.value = true;
}

function deleteAccount() {
  if (accountToDelete.value) {
    const index = accounts.value.indexOf(accountToDelete.value);
    if (index !== -1) {
      accounts.value.splice(index, 1); // Remove account from list
    }
  }
  deleteDialog.value = false; // Close the dialog
}
</script>

<template>
  <v-container class="d-flex justify-center">
    <v-row justify="center">
      <!-- Load Accounts Button -->
      <v-col cols="12" md="8" class="text-center mb-4">
        <v-btn @click="fetchAccounts" color="primary" class="load-btn" large>
          Load Accounts
        </v-btn>
      </v-col>

      <!-- Account Summary Card -->
      <v-col cols="12" md="8">
        <v-card class="summary-card elevation-10">
          <v-card-title class="text-h5 text-center font-weight-bold">
            Account Statistics
          </v-card-title>
          <v-card-text class="text-center">
            <v-row>
              <v-col cols="12" sm="4">
                <div class="summary-item">
                  <strong>Total Accounts:</strong> {{ totalAccounts }}
                </div>
              </v-col>
              <v-col cols="12" sm="4">
                <div class="summary-item">
                  <strong>Total Balance:</strong> ${{ totalBalance.toFixed(2) }}
                </div>
              </v-col>
              <v-col cols="12" sm="4">
                <div class="summary-item">
                  <strong>Average Balance:</strong> ${{ averageBalance.toFixed(2) }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Account List Table -->
      <v-col cols="12" md="8" class="mt-5">
        <v-data-table
          :headers="headers"
          :items="accounts"
          :items-per-page="5"
          class="elevation-1 data-table"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-row class="d-flex justify-end">
              <!-- Edit Button -->
              <v-col class="d-flex justify-end">
                <v-btn color="blue" @click="handleEdit(item)" class="ma-2 edit-btn">
                  Edit
                </v-btn>
              </v-col>
              <!-- Delete Button -->
              <v-col class="d-flex justify-end">
                <v-btn color="red" @click="confirmDelete(item)" class="ma-2 delete-btn">
                  Delete
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </v-data-table>
      </v-col>

      <!-- Create Account Button -->
      <v-col cols="12" md="8" class="text-center mt-4">
        <v-btn @click="handleCreate" color="blue" class="create-btn" large>
          Create Account
        </v-btn>
      </v-col>
    </v-row>
  </v-container>

  <!-- Confirmation Dialog -->
  <v-dialog v-model="deleteDialog" max-width="400px">
    <v-card>
      <v-card-title class="headline">Confirm Deletion</v-card-title>
      <v-card-text>
        Are you sure you want to delete this account?
      </v-card-text>
      <v-card-actions>
        <v-btn color="grey" @click="deleteDialog = false">Cancel</v-btn>
        <v-btn color="red" @click="deleteAccount">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
/* General layout styling */
.v-container {
  padding-top: 30px;
  padding-bottom: 30px;
  max-width: 100%;
}

.v-col {
  margin-bottom: 20px;
}

/* Button styles */
.load-btn {
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  padding: 12px 24px;
}

.create-btn, .edit-btn, .delete-btn {
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 5px;
}

.create-btn {
  font-size: 16px;
}

.edit-btn {
  font-size: 14px;
}

.delete-btn {
  font-size: 14px;
}

/* Account Summary Card */
.summary-card-container {
  margin-top: 20px;
}

.summary-card {
  background-color: #f9fafb;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.text-center {
  text-align: center;
}

.text-h5 {
  font-size: 20px;
  font-weight: 600;
}

.font-weight-bold {
  font-weight: bold;
}

/* Summary section inside card */
.summary-item {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  padding: 10px;
  text-align: center;
}

/* Data table styling */
.v-data-table {
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Shadow added here */
}

.v-data-table thead {
  background-color: #1976d2;
  color: #fff;
  font-weight: bold;
}

.v-data-table tbody tr {
  transition: background-color 0.2s ease;
}

.v-data-table tbody tr:hover {
  background-color: #f1f1f1;
}

.v-data-table td, .v-data-table th {
  padding: 12px 16px;
  text-align: left;
}

.v-data-table .v-btn {
  font-size: 14px;
  font-weight: 500;
  text-transform: none;
}

/* Font and text adjustments */
.font-weight-bold {
  font-weight: bold;
}
</style>
