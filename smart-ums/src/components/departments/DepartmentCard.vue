<template>
  <article class="department-card">
    <div class="card-header">
      <div class="header-content">
        <h3>{{ department.name }}</h3>
        <span class="code">{{ department.code }}</span>
      </div>
      <span :class="['status-badge', department.status]">
        {{ department.status === 'active' ? '✓' : '✗' }}
      </span>
    </div>

    <div class="card-description">
      <p>{{ department.description }}</p>
    </div>

    <div class="card-info">
      <div class="info-row">
        <span class="label">Faculty:</span>
        <span class="value">{{ department.faculty }}</span>
      </div>
      <div class="info-row">
        <span class="label">Head:</span>
        <span class="value">{{ department.head }}</span>
      </div>
      <div class="info-row">
        <span class="label">Email:</span>
        <span class="value email">{{ department.headEmail }}</span>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat">
        <div class="stat-value">{{ department.programs }}</div>
        <div class="stat-label">Programs</div>
      </div>
      <div class="stat">
        <div class="stat-value">{{ department.faculty_count }}</div>
        <div class="stat-label">Faculty</div>
      </div>
      <div class="stat">
        <div class="stat-value">{{ department.students }}</div>
        <div class="stat-label">Students</div>
      </div>
      <div class="stat">
        <div class="stat-value">
          {{ department.establishment_year }}
        </div>
        <div class="stat-label">Est.</div>
      </div>
    </div>

    <div v-if="department.specialization && department.specialization.length" class="specializations">
      <span class="spec-label">Specializations:</span>
      <div class="spec-tags">
        <span v-for="spec in department.specialization" :key="spec" class="spec-tag">
          {{ spec }}
        </span>
      </div>
    </div>

    <div class="card-footer">
      <div class="accreditation">
        <span v-if="department.accredited" class="accredited">✓ Accredited</span>
        <span v-if="department.accreditationBody" class="accreditation-body">
          {{ department.accreditationBody }}
        </span>
      </div>
      <div class="actions">
        <button @click="$emit('edit')" class="btn-action" title="Edit">✎</button>
        <button @click="$emit('delete')" class="btn-action delete" title="Delete">🗑</button>
      </div>
    </div>
  </article>
</template>

<script setup>
defineOptions({ name: 'DepartmentCard' })

defineProps({
  department: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete'])
</script>

<style scoped>
.department-card {
  background: linear-gradient(135deg, #f6f9ff 0%, #ecf1ff 100%);
  border: 1px solid #dfe7fb;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.3s ease;
  cursor: pointer;
}

.department-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(33, 77, 156, 0.15);
  border-color: #214d9c;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #dfe7fb;
}

.header-content h3 {
  margin: 0 0 0.35rem;
  font-size: 1.2rem;
  color: #14213d;
  font-weight: 700;
}

.code {
  display: inline-block;
  background: #214d9c;
  color: white;
  padding: 0.25rem 0.6rem;
  border-radius: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.card-description {
  margin-bottom: 1rem;
  flex-grow: 1;
}

.card-description p {
  margin: 0;
  color: #5d6d8f;
  font-size: 0.9rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-info {
  background: white;
  border-radius: 0.6rem;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #eef2f9;
}

.info-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
  font-size: 0.85rem;
}

.info-row:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: 600;
  color: #5d6d8f;
  min-width: 50px;
}

.value {
  color: #14213d;
  flex: 1;
}

.value.email {
  color: #214d9c;
  word-break: break-all;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 0.6rem;
  border: 1px solid #eef2f9;
}

.stat {
  text-align: center;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #214d9c;
}

.stat-label {
  font-size: 0.75rem;
  color: #7f8fa3;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.2rem;
}

.specializations {
  margin-bottom: 1rem;
}

.spec-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #5d6d8f;
  margin-bottom: 0.5rem;
}

.spec-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.spec-tag {
  background: white;
  border: 1px solid #dfe7fb;
  color: #214d9c;
  padding: 0.25rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #dfe7fb;
}

.accreditation {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.accredited {
  display: inline-block;
  background: #d4edda;
  color: #155724;
  padding: 0.3rem 0.7rem;
  border-radius: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.accreditation-body {
  background: #f0f4ff;
  color: #214d9c;
  padding: 0.3rem 0.7rem;
  border-radius: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  background: white;
  border: 1px solid #dfe7fb;
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-action:hover {
  background: #214d9c;
  border-color: #214d9c;
  color: white;
}

.btn-action.delete:hover {
  background: #dc3545;
  border-color: #dc3545;
}
</style>
