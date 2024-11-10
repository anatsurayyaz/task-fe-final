// src/stores/user.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import api from '@/plugins/api'

export const useUserStore = defineStore('user', () => {
  // state
  const token = ref(localStorage.getItem('token') || null)
  const storedUser = ref(localStorage.getItem('user') || null)

  // getters
  const user = computed(() => {
    if (storedUser.value) {
      return JSON.parse(storedUser.value)
    }
    return storedUser.value
  })

  const isAuthorized = computed(() => !token.value)

  function storeToken(newToken) {
    // Save the token to localStorage
    localStorage.setItem('token', newToken)
    token.value = newToken
  }

  function storeUser(newUser) {
    // Save the user to localStorage
    const stringifiedUser = JSON.stringify(newUser)
    localStorage.setItem('user', stringifiedUser)
    storedUser.value = stringifiedUser
  }

  const login = async (credentials) => {
    // Call API and await response
    const response = await api.post('/auth/login', credentials)
    storeToken(response.data.data)

    // Call API to get user details
    const responseMy = await api.get('/account/my')
    storeUser(responseMy.data.data)
  }

  const logout = () => {
    // Remove token and user from localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    token.value = null
    storedUser.value = null
  }

  // New action to change password
  const changePassword = async ({ password }) => {
    // Ensure token is available and send request
    const currentToken = localStorage.getItem('token')
    if (!currentToken) throw new Error('Not authorized')

    return axios.post('/api/auth/changepassword', { password }, {
      headers: { Authorization: `Bearer ${currentToken}` },
    })
  }

  return {
    token,
    user,
    isAuthorized,
    storeToken,
    storeUser,
    login,
    logout,
    changePassword, // Expose changePassword function
  }
})
