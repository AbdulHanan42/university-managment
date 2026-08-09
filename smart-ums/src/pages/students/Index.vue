<template>
  <section class="page-card">
    <header class="page-header">
      <div>
        <p class="eyebrow">Student management</p>
        <h1>Student records</h1>
        <p>Track enrollment, personal details, academic progress, and support requests in one place.</p>
      </div>
      <button type="button">+ Add student</button>
    </header>

    <div class="card-grid">
      <article class="summary-card">
        <h2>Current semester</h2>
        <p class="value">1,240</p>
        <span>Active enrolled students</span>
      </article>
      <article class="summary-card">
        <h2>Pending verification</h2>
        <p class="value">34</p>
        <span>Documents waiting review</span>
      </article>
      <article class="summary-card">
        <h2>Attendance status</h2>
        <p class="value">92%</p>
        <span>Average class presence</span>
      </article>
    </div>
  </section>
</template>

<style scoped>
.page-card {
  background: white;
  border: 1px solid #dfe7fb;
  border-radius: 1.2rem;
  box-shadow: 0 16px 40px rgba(20, 33, 61, 0.06);
  padding: 1.25rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.eyebrow {
  margin: 0 0 0.25rem;
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #60708f;
}

h1 {
  margin: 0 0 0.4rem;
}

button {
  border: none;
  border-radius: 999px;
  padding: 0.7rem 1rem;
  background: #214d9c;
  color: white;
  cursor: pointer;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 1rem;
}

.summary-card {
  background: #f6f9ff;
  border-radius: 1rem;
  padding: 1rem;
}

.summary-card h2 {
  margin: 0 0 0.4rem;
  font-size: 1rem;
  color: #5d6d8f;
}

.value {
  margin: 0 0 0.2rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #14213d;
}
</style>
