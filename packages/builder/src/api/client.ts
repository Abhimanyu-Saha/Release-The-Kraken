import axios from 'axios'

const base = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api'

const client = axios.create({ baseURL: base })

export default client
