<script setup>
import { ref } from 'vue'
import { mdiAccountOutline, mdiLockOutline, mdiEye, mdiEyeOff } from '@mdi/js'
import logo from '@/assets/logo-digi.png' // Replace with your logo path
import { useUserStore } from '@/stores/user.js' // Import the user store to handle login
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

// Form fields
const username = ref('')
const password = ref('')
const submitErr = ref('') // Error message

// State controls
const showPassword = ref(false)
const submitInProgress = ref(false) // Login button loading state

async function submit() {
  submitInProgress.value = true
  submitErr.value = '' // Clear any previous error message

  try {
    // Attempt to log in via the backend API
    await userStore.login({
      username: username.value,
      password: password.value,
    })

    // Redirect to the home page on successful login
    router.push({ name: 'home' })
  } catch (err) {
    // Display an error message if login fails
    submitErr.value = err.response?.data?.error || 'An error occurred. Please try again.'
  }

  submitInProgress.value = false
}
</script>

<template>
  <div class="d-flex justify-center align-center h-100 bg-light">
    <div>
      <v-form>
        <v-img class="mx-auto my-6" max-width="180" :src="logo" alt="Logo"></v-img>

        <v-card class="mx-auto pa-8" elevation="10" width="400" rounded="lg">
          <h2 class="text-center mb-6 text-primary font-weight-bold">Login</h2>

          <div class="text-subtitle-1 text-medium-emphasis mb-2">Username</div>
          <v-text-field
            v-model="username"
            density="comfortable"
            placeholder="Enter your username"
            :prepend-inner-icon="mdiAccountOutline"
            variant="outlined"
            hide-details
          ></v-text-field>

          <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between mt-4 mb-2">
            Password
          </div>
          <v-text-field
            v-model="password"
            :append-inner-icon="showPassword ? mdiEyeOff : mdiEye"
            :type="showPassword ? 'text' : 'password'"
            density="comfortable"
            autoComplete="current-password"
            placeholder="Enter your password"
            :prepend-inner-icon="mdiLockOutline"
            variant="outlined"
            hide-details
            @click:append-inner="showPassword = !showPassword"
          ></v-text-field>

          <!-- Error message displayed if login fails -->
          <v-card
            class="mb-4 mt-4"
            color="error"
            variant="flat"
            v-show="submitErr"
            rounded="md"
          >
            <v-card-text class="text-error-white text-center">
              {{ submitErr }}
            </v-card-text>
          </v-card>

          <v-btn
            class="mt-4"
            color="primary"
            size="large"
            elevation="2"
            block
            :loading="submitInProgress"
            :disabled="submitInProgress"
            @click="submit"
          >
            <template v-slot:default v-if="!submitInProgress">Login</template>
            <template v-slot:default v-else>Logging in...</template>
          </v-btn>
        </v-card>
      </v-form>
    </div>
  </div>
</template>

<style scoped>
.bg-light {
  background-color: #f9f9f9;
  height: 100vh;
}

.text-primary {
  color: #1976d2;
}

.font-weight-bold {
  font-weight: bold;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.v-card {
  border-radius: 8px;
}

.v-btn {
  background-color: #1976d2; /* Matching blue color for the login button */
  color: white;
}

.v-btn[disabled] {
  opacity: 0.7;
}

.text-error-white {
  color: #ffffff; /* White color for error text */
}
</style>
