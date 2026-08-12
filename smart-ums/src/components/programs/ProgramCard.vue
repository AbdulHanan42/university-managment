<template>
  <div class="program-card">
    <div class="card-header">
      <div class="card-title">
        <h3>{{ program.name }}</h3>
        <p class="card-code">{{ program.code }}</p>
      </div>
      <div class="card-actions">
        <button class="btn-action" @click="$emit('edit')" title="Edit">✎</button>
        <button class="btn-action btn-delete" @click="handleDelete" title="Delete">🗑️</button>
      </div>
    </div>

    <div class="card-body">
      <div class="info-row">
        <span class="label">Department:</span>
        <span class="value">{{ program.department }}</span>
      </div>

      <div class="info-row">
        <span class="label">Level:</span>
        <span class="badge" :class="`badge-${program.level.toLowerCase()}`">
          {{ program.level }}
        </span>
      </div>

      <div class="info-row">
        <span class="label">Duration:</span>
        <span class="value">{{ program.duration }}</span>
      </div>

      <div class="info-row">
        <span class="label">Credits:</span>
        <span class="value">{{ program.credits }}</span>
      </div>

      <div class="info-row">
        <span class="label">Faculty:</span>
        <span class="value">{{ program.faculty }}</span>
      </div>

      <div class="description">
        {{ program.description }}
      </div>

      <div class="stats">
        <div class="stat-item">
          <div class="stat-value">{{ program.studentsEnrolled }}</div>
          <div class="stat-label">Students</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ program.studentsEnrolled > 0 ? 'Active' : 'Inactive' }}</div>
          <div class="stat-label">Status</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ program.accreditation }}</div>
          <div class="stat-label">Accreditation</div>
        </div>
      </div>
    </div>

    <div class="card-footer">
      <button class="btn-primary" @click="$emit('view')">View Details</button>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'ProgramCard' })

const props = defineProps({
  program: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view', 'edit', 'delete'])

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this program?')) {
    emit('delete')
  }
}
</script>

<style scoped>
.program-card {
  background: white;
  border: 1px solid #dfe7fb;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(20, 33, 61, 0.04);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.program-card:hover {
  box-shadow: 0 8px 24px rgba(20, 33, 61, 0.12);
  border-color: #214d9c;
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.25rem;
  border-bottom: 1px solid #eef2f9;
  background: #f8fafb;
}

.card-title {
  flex: 1;
}

.card-title h3 {
  margin: 0 0 0.25rem;
  font-size: 1.05rem;
  color: #14213d;
  font-weight: 600;
  line-height: 1.4;
}

.card-code {
  margin: 0;
  color: #214d9c;
  font-size: 0.9rem;
  font-weight: 500;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #dfe7fb;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.btn-action:hover {
  background: #e8f4ff;
  border-color: #214d9c;
  transform: scale(1.05);
}

.btn-action.btn-delete:hover {
  background: #fee8e8;
  border-color: #c0392b;
}

.card-body {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #5d6d8f;
}

.value {
  color: #14213d;
  font-weight: 500;
}

.badge {
  display: inline-block;
  padding: 0.3rem 0.7rem;
  border-radius: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
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

.description {
  padding: 1rem;
  background: #f8fafb;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  color: #5d6d8f;
  line-height: 1.5;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eef2f9;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #214d9c;
}

.stat-label {
  font-size: 0.75rem;
  color: #7f8fa3;
  margin-top: 0.25rem;
  text-transform: uppercase;
}

.card-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid #eef2f9;
  background: #f8fafb;
}

.btn-primary {
  width: 100%;
  padding: 0.7rem 1rem;
  border: none;
  border-radius: 0.75rem;
  background: #214d9c;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.btn-primary:hover {
  background: #1a3a6f;
  box-shadow: 0 4px 12px rgba(33, 77, 156, 0.2);
}
</style>
