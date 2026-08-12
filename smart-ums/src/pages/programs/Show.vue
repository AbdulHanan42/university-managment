<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProgramStore } from '@/stores/program.store'

defineOptions({ name: 'ProgramsShow' })

const router = useRouter()
const route = useRoute()
const programStore = useProgramStore()

const program = ref(null)
const loading = ref(true)

onMounted(async () => {
  const id = parseInt(route.params.id)
  try {
    await programStore.fetchProgramById(id)
    program.value = programStore.selectedProgram
  } catch (error) {
    console.error('Error loading program:', error)
    router.push({ name: 'programs' })
  } finally {
    loading.value = false
  }
})

const handleEdit = () => {
  router.push({ name: 'programs-edit', params: { id: program.value.id } })
}

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this program?')) {
    programStore.deleteProgram(program.value.id)
    router.push({ name: 'programs' })
  }
}

const handleBack = () => {
  router.back()
}
</script>

<template>
  <div class="show-page">
    <div class="page-header">
      <button class="btn-back" @click="handleBack">← Back</button>
      <div class="header-actions">
        <button class="btn-primary" @click="handleEdit">Edit Program</button>
        <button class="btn-danger" @click="handleDelete">Delete</button>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading program details...</div>

    <div v-else-if="program" class="program-details">
      <!-- Main Info Card -->
      <div class="info-card">
        <div class="card-header">
          <div>
            <h1>{{ program.name }}</h1>
            <p class="code">{{ program.code }}</p>
          </div>
          <span class="status" :class="`status-${program.status.toLowerCase()}`">
            {{ program.status }}
          </span>
        </div>

        <div class="card-body">
          <p class="description">{{ program.description }}</p>

          <div class="info-grid">
            <div class="info-item">
              <label>Department</label>
              <p>{{ program.department }}</p>
            </div>
            <div class="info-item">
              <label>Level</label>
              <span class="badge" :class="`badge-${program.level.toLowerCase()}`">
                {{ program.level }}
              </span>
            </div>
            <div class="info-item">
              <label>Duration</label>
              <p>{{ program.duration }}</p>
            </div>
            <div class="info-item">
              <label>Total Credits</label>
              <p>{{ program.credits }}</p>
            </div>
            <div class="info-item">
              <label>Faculty Lead</label>
              <p>{{ program.faculty }}</p>
            </div>
            <div class="info-item">
              <label>Accreditation</label>
              <span class="badge" :class="`acc-${program.accreditation.toLowerCase()}`">
                {{ program.accreditation }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Details -->
      <div class="details-grid">
        <div class="detail-section">
          <h3>Admission Requirements</h3>
          <p>{{ program.admissionRequirements }}</p>
        </div>

        <div class="detail-section">
          <h3>Career Outcomes</h3>
          <p>{{ program.careerOutcomes }}</p>
        </div>
      </div>

      <!-- Statistics -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ program.studentsEnrolled }}</div>
          <div class="stat-label">Students Enrolled</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ program.credits }}</div>
          <div class="stat-label">Program Credits</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ program.duration }}</div>
          <div class="stat-label">Program Duration</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ program.createdAt }}</div>
          <div class="stat-label">Created Date</div>
        </div>
      </div>
    </div>

    <div v-else class="error">Program not found</div>
  </div>
</template>

<style scoped>
.show-page {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.btn-back {
  padding: 0.65rem 1.2rem;
  border: 1px solid #dfe7fb;
  background: white;
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-back:hover {
  background: #f8fafb;
  border-color: #214d9c;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary,
.btn-danger {
  padding: 0.65rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #214d9c;
  color: white;
}

.btn-primary:hover {
  background: #1a3a6f;
}

.btn-danger {
  background: #fee8e8;
  color: #c0392b;
}

.btn-danger:hover {
  background: #fdd5d5;
}

.loading,
.error {
  text-align: center;
  padding: 3rem;
  color: #7f8fa3;
}

.error {
  color: #c0392b;
}

.program-details {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-card {
  background: white;
  border: 1px solid #dfe7fb;
  border-radius: 1.2rem;
  overflow: hidden;
}

.card-header {
  padding: 2rem;
  background: linear-gradient(135deg, #214d9c 0%, #1a3a6f 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-header h1 {
  margin: 0 0 0.5rem;
  font-size: 2rem;
}

.code {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.status {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.status-active {
  background: rgba(0, 0, 0, 0.2);
  color: white;
}

.status-inactive {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.card-body {
  padding: 2rem;
}

.description {
  margin: 0 0 2rem;
  color: #5d6d8f;
  line-height: 1.6;
  font-size: 1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-weight: 600;
  color: #5d6d8f;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item p {
  margin: 0;
  color: #14213d;
  font-size: 1.1rem;
}

.badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  width: fit-content;
}

.badge-undergraduate {
  background: #e8f4ff;
  color: #0066cc;
}

.badge-graduate {
  background: #f0e8ff;
  color: #7c3aed;
}

.badge-doctoral {
  background: #ffe8f0;
  color: #c2185b;
}

.acc-accredited {
  background: #d4edda;
  color: #155724;
}

.acc-pending {
  background: #fff3cd;
  color: #856404;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.detail-section {
  background: white;
  border: 1px solid #dfe7fb;
  border-radius: 1rem;
  padding: 1.5rem;
}

.detail-section h3 {
  margin: 0 0 1rem;
  color: #14213d;
  font-size: 1.1rem;
}

.detail-section p {
  margin: 0;
  color: #5d6d8f;
  line-height: 1.6;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border: 1px solid #dfe7fb;
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 8px 20px rgba(20, 33, 61, 0.1);
  border-color: #214d9c;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #214d9c;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8fa3;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
