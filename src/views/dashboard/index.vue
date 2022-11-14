<template>
  <div class="dashboard-container">
    <AdminDashboard />
  </div>
</template>

<script>
import AdminDashboard from './admin'

export default {
  name: 'Dashboard',
  components: { AdminDashboard },
  data() {
    return {}
  },
  computed: {
  },
  created() {

  }
}
</script>
