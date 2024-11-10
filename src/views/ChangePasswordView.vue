<!-- src/views/ChangePasswordView.vue -->
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js'

const router = useRouter()
const userStore = useUserStore()

// Form fields
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const submitErr = ref('')
const submitInProgress = ref(false)

async function submit() {
  if (newPassword.value !== confirmPassword.value) {
    submitErr.value = 'Passwords do not match'
    return
  }

  submitInProgress.value = true
  submitErr.value = ''

  try {
    await userStore.changePassword({
      password: newPassword.value,
    })
    router.push({ name: 'home' }) // Redirect to home after success
  } catch (err) {
    submitErr.value = err.response?.data?.error || 'Failed to change password. Please try again.'
  }

  submitInProgress.value = false
}
</script>

<template>
  <v-container class="d-flex align-center justify-center fill-height">
    <v-card class="change-password-card" elevation="3">
      <v-card-title class="text-center title">Change Password</v-card-title>

      <v-card-text>
        <v-form>
          <v-text-field
            v-model="currentPassword"
            label="Current Password"
            type="password"
            :disabled="submitInProgress"
            outlined
            clearable
            required
          />
          <v-text-field
            v-model="newPassword"
            label="New Password"
            type="password"
            :disabled="submitInProgress"
            outlined
            clearable
            required
          />
          <v-text-field
            v-model="confirmPassword"
            label="Confirm New Password"
            type="password"
            :disabled="submitInProgress"
            outlined
            clearable
            required
          />

          <v-alert v-if="submitErr" type="error" class="mt-3">{{ submitErr }}</v-alert>

          <div class="text-center mt-4">
            <v-btn
              :loading="submitInProgress"
              color="primary"
              @click="submit"
              large
              elevation="2"
            >
              Change Password
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.change-password-card {
  max-width: 500px;
  width: 100%;
  padding: 20px;
}

.title {
  font-weight: bold;
  font-size: 24px;
}

.fill-height {
  height: 100vh;
}
</style>
