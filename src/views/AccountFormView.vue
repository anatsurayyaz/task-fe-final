<template>
  <v-container class="d-flex align-center justify-center" style="min-height: 100vh;">
    <v-card class="pa-6 rounded-lg shadow-lg" max-width="650px">
      <v-card-title class="d-flex justify-center">
        <v-sheet class="title-box" elevation="2" rounded>
          <span class="headline">{{ isEditing ? 'Edit Account' : 'Create Account' }}</span>
        </v-sheet>
      </v-card-title>

      <!-- Form for creating or editing an account -->
      <v-form ref="form" @submit.prevent="handleSubmit">
        <v-card-text>
          <!-- Account Name Field -->
          <v-text-field
            v-model="currentAccount.name"
            label="Account Name"
            outlined
            dense
            required
            :rules="[v => !!v || 'Account Name is required']"
          ></v-text-field>

          <!-- Balance Field with Dollar Sign Prefix -->
          <v-text-field
            v-model="currentAccount.balance"
            label="Balance"
            type="number"
            outlined
            dense
            required
            :prefix="'$'"
            :rules="[v => !!v || 'Balance is required']"
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <!-- Save Button (left-aligned) -->
          <v-btn color="blue" class="save-btn" type="submit">
            Save
          </v-btn>

          <!-- Cancel Button (right-aligned) -->
          <v-btn color="red" class="cancel-btn" text @click="cancel">Cancel</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

// Reactive state for form fields
const currentAccount = ref({
  name: '',
  balance: 0,
});

const isEditing = ref(false); // Track if the form is for editing

// Cancel button action
const cancel = () => {
  router.push('/account-list'); // Redirect back to the account list or previous page
};

// Function to handle form submission (create or update)
const handleSubmit = async () => {
  if (!currentAccount.value.name || currentAccount.value.balance === 0) {
    alert('Please fill in all fields.');
    return;
  }

  if (isEditing.value) {
    await updateAccount(); // If editing, update the account
  } else {
    await createAccount(); // If creating, create the new account
  }
};

// Create a new account
const createAccount = async () => {
  try {
    await axios.post('http://localhost:8080/account/create', currentAccount.value);
    alert('Account created successfully!');
    router.push('/account-list');  // Redirect to the account list page
  } catch (error) {
    console.error('Error creating account:', error);
    alert('Failed to create account. Please try again.');
  }
};

// Update an existing account
const updateAccount = async () => {
  try {
    await axios.patch(`http://localhost:8080/account/update/${currentAccount.value.account_id}`, currentAccount.value);
    alert('Account updated successfully!');
    router.push('/account-list');  // Redirect to the account list page
  } catch (error) {
    console.error('Error updating account:', error);
    alert('Failed to update account. Please try again.');
  }
};
</script>

<style scoped>
.v-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title-box {
  padding: 8px 16px;
  background-color: #1976D2;
}

.headline {
  font-size: 18px;
  font-weight: bold;
  color: white;
}

.v-btn {
  transition: color 0.3s ease, background-color 0.3s ease;
  font-weight: 500;
}

.save-btn {
  color: #1976D2;
}

.save-btn:hover,
.save-btn:focus {
  background-color: #1976D2 !important;
  color: white !important;
}

.cancel-btn {
  color: #e53935;
}

.cancel-btn:hover,
.cancel-btn:focus {
  background-color: #e53935 !important;
  color: white !important;
}

.v-card-actions {
  display: flex;
  justify-content: space-between;
}

.v-text-field {
  margin-bottom: 1.2rem;
}
</style>
