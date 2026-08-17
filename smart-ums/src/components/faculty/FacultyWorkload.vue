<template>
  <div class="faculty-workload">
    <h3>Workload Distribution</h3>
    <div class="workload-summary">
      <div class="workload-card teaching">
        <div class="icon">📚</div>
        <div class="info">
          <div class="value">{{ workload.courses }}</div>
          <div class="label">Courses</div>
        </div>
      </div>
      <div class="workload-card hours">
        <div class="icon">⏰</div>
        <div class="info">
          <div class="value">{{ workload.hours }}</div>
          <div class="label">Teaching Hours</div>
        </div>
      </div>
      <div class="workload-card students">
        <div class="icon">👥</div>
        <div class="info">
          <div class="value">{{ workload.students }}</div>
          <div class="label">Students</div>
        </div>
      </div>
    </div>
    <div class="workload-breakdown">
      <div class="breakdown-item">
        <span class="label">Research Hours:</span>
        <span class="value">{{ workload.researchHours || 0 }} hrs/week</span>
      </div>
      <div class="breakdown-item">
        <span class="label">Admin Hours:</span>
        <span class="value">{{ workload.adminHours || 0 }} hrs/week</span>
      </div>
      <div class="breakdown-item">
        <span class="label">Total Hours:</span>
        <span class="value">{{ totalHours }} hrs/week</span>
      </div>
    </div>
    <div class="workload-progress">
      <div class="progress-item">
        <span class="progress-label">Teaching</span>
        <div class="progress-bar">
          <div class="progress-fill teaching" :style="{ width: teachingPercentage + '%' }"></div>
        </div>
        <span class="progress-value">{{ teachingPercentage }}%</span>
      </div>
      <div class="progress-item">
        <span class="progress-label">Research</span>
        <div class="progress-bar">
          <div class="progress-fill research" :style="{ width: researchPercentage + '%' }"></div>
        </div>
        <span class="progress-value">{{ researchPercentage }}%</span>
      </div>
      <div class="progress-item">
        <span class="progress-label">Admin</span>
        <div class="progress-bar">
          <div class="progress-fill admin" :style="{ width: adminPercentage + '%' }"></div>
        </div>
        <span class="progress-value">{{ adminPercentage }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'FacultyWorkload' })

const props = defineProps({
  workload: {
    type: Object,
    default: () => ({
      courses: 0,
      hours: 0,
      students: 0,
      researchHours: 0,
      adminHours: 0
    })
  }
})

const totalHours = computed(() => {
  return (props.workload.hours || 0) + (props.workload.researchHours || 0) + (props.workload.adminHours || 0)
})

const teachingPercentage = computed(() => {
  if (totalHours.value === 0) return 0
  return Math.round(((props.workload.hours || 0) / totalHours.value) * 100)
})

const researchPercentage = computed(() => {
  if (totalHours.value === 0) return 0
  return Math.round(((props.workload.researchHours || 0) / totalHours.value) * 100)
})

const adminPercentage = computed(() => {
  if (totalHours.value === 0) return 0
  return Math.round(((props.workload.adminHours || 0) / totalHours.value) * 100)
})
</script>

<style scoped>
.faculty-workload {
  background: white;
  border: 1px solid #dfe7fb;
  border-radius: 1rem;
  padding: 1.5rem;
}

.faculty-workload h3 {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  color: #14213d;
}

.workload-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.workload-card {
  background: #f6f9ff;
  border: 1px solid #dfe7fb;
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.workload-card .icon {
  font-size: 1.5rem;
}

.workload-card .info {
  display: flex;
  flex-direction: column;
}

.workload-card .value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #214d9c;
}

.workload-card .label {
  font-size: 0.75rem;
  color: #5d6d8f;
  text-transform: uppercase;
}

.workload-breakdown {
  background: #f6f9ff;
  border: 1px solid #dfe7fb;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #dfe7fb;
}

.breakdown-item:last-child {
  border-bottom: none;
}

.breakdown-item .label {
  font-weight: 600;
  color: #5d6d8f;
}

.breakdown-item .value {
  color: #14213d;
}

.workload-progress {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.progress-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-label {
  min-width: 80px;
  font-size: 0.85rem;
  color: #5d6d8f;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #eef2f9;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-fill.teaching {
  background: #214d9c;
}

.progress-fill.research {
  background: #7c3aed;
}

.progress-fill.admin {
  background: #10b981;
}

.progress-value {
  min-width: 40px;
  text-align: right;
  font-size: 0.85rem;
  font-weight: 600;
  color: #14213d;
}
</style>
