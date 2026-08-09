<template>
  <section class="dashboard-page">
    <header class="hero-card">
      <div>
        <p class="eyebrow">Main dashboard</p>
        <h1>Welcome to Smart UMS</h1>
        <p>Manage students, faculty, finances, and support services from one organized workspace.</p>
      </div>

      <div class="hero-actions">
        <router-link to="/students" class="primary">Review students</router-link>
        <router-link to="/courses" class="secondary">Open courses</router-link>
      </div>
    </header>

    <div class="stats-grid">
      <article class="stat-card">
        <h3>Enrolled students</h3>
        <p class="value">4,280</p>
        <span>+12% this semester</span>
      </article>
      <article class="stat-card">
        <h3>Active faculty</h3>
        <p class="value">215</p>
        <span>92% attendance</span>
      </article>
      <article class="stat-card">
        <h3>Fee collection</h3>
        <p class="value">PKR 84.2M</p>
        <span>96% on schedule</span>
      </article>
      <article class="stat-card">
        <h3>Open notices</h3>
        <p class="value">18</p>
        <span>3 require review</span>
      </article>
    </div>

    <div class="content-grid">
      <article class="panel">
        <h2>What you can manage</h2>
        <ul>
          <li>Admissions and student records</li>
          <li>Course scheduling and enrollment</li>
          <li>Attendance, exams, and results</li>
          <li>Fees, library, hostel, and transport</li>
        </ul>
      </article>

      <article class="panel highlight">
        <h2>Next review</h2>
        <p>Check pending attendance reports, fee receipts, and student verification tasks before the next academic review meeting.</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.hero-card,
.panel,
.stat-card {
  background: white;
  border: 1px solid #dfe7fb;
  border-radius: 1.2rem;
  box-shadow: 0 16px 40px rgba(20, 33, 61, 0.06);
}

.hero-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #0d1f4f 0%, #214d9c 100%);
  color: white;
}

.eyebrow {
  margin: 0 0 0.3rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  opacity: 0.8;
  font-size: 0.75rem;
}

h1 {
  margin: 0 0 0.5rem;
  font-size: 1.8rem;
}

.hero-card p {
  margin: 0;
  max-width: 560px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 0.75rem;
}

.hero-actions a {
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  font-weight: 600;
}

.hero-actions .primary {
  background: white;
  color: #0d1f4f;
}

.hero-actions .secondary {
  background: rgba(255, 255, 255, 0.14);
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.stat-card {
  padding: 1rem 1.1rem;
}

.stat-card h3 {
  margin: 0 0 0.4rem;
  font-size: 0.95rem;
  color: #61708f;
}

.value {
  margin: 0;
  font-size: 1.45rem;
  font-weight: 700;
  color: #14213d;
}

.stat-card span {
  color: #4f6fae;
  font-size: 0.9rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
}

.panel {
  padding: 1.2rem 1.25rem;
}

.panel.highlight {
  background: #f3f6ff;
}

.panel h2 {
  margin-top: 0;
}

ul {
  padding-left: 1.1rem;
  display: grid;
  gap: 0.55rem;
}

@media (max-width: 780px) {
  .hero-card,
  .content-grid {
    grid-template-columns: 1fr;
    display: grid;
  }

  .hero-card {
    gap: 1rem;
  }
}
</style>
