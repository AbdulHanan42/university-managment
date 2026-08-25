<template>
  <div class="faculty-profile">
    <div class="profile-header">
      <div class="avatar-placeholder">
        <img v-if="faculty.imageUrl" :src="faculty.imageUrl" :alt="faculty.name" class="w-full h-full object-cover" />
        <span v-else>{{ faculty.name?.charAt(0) || '?' }}</span>
      </div>
      <div class="profile-info">
        <h3>{{ faculty.name }}</h3>
        <p>{{ faculty.designation }}</p>
        <p>{{ faculty.department }}</p>
      </div>
    </div>
    <div class="profile-details">
      <div class="detail-item">
        <span class="label">Email:</span>
        <span class="value">{{ faculty.email }}</span>
      </div>
      <div class="detail-item">
        <span class="label">Phone:</span>
        <span class="value">{{ faculty.phone || 'N/A' }}</span>
      </div>
      <div class="detail-item">
        <span class="label">Office:</span>
        <span class="value">{{ faculty.office || 'N/A' }}</span>
      </div>
      <div class="detail-item">
        <span class="label">Office Hours:</span>
        <span class="value">{{ faculty.officeHours || 'N/A' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'FacultyProfile' })

defineProps({
  faculty: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.faculty-profile {
  background: var(--color-bg-white);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.5rem;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.avatar-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.profile-info h3 {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
  color: var(--color-text-primary);
}

.profile-info p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.profile-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  gap: 1rem;
}

.detail-item .label {
  font-weight: 600;
  color: var(--color-text-secondary);
  min-width: 100px;
}

.detail-item .value {
  color: var(--color-text-primary);
}
</style>
