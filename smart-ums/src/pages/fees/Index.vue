<template>
  <section class="page-card">
    <header class="page-header">
      <div>
        <p class="eyebrow">Finance management</p>
        <h1>Fees</h1>
        <p>Track tuition structures, payments, scholarships, and receipts.</p>
      </div>
    </header>

    <div class="card-grid">
      <article class="summary-card">
        <h2>Collected this month</h2>
        <p class="value">PKR 21.4M</p>
        <span>On target</span>
      </article>
      <article class="summary-card">
        <h2>Outstanding dues</h2>
        <p class="value">PKR 4.8M</p>
        <span>424 students</span>
      </article>
      <article class="summary-card">
        <h2>Scholarship requests</h2>
        <p class="value">67</p>
        <span>Awaiting approval</span>
      </article>
    </div>
  </section>
</template>

<style scoped>
.page-card { background: white; border: 1px solid #dfe7fb; border-radius: 1.2rem; padding: 1.25rem; box-shadow: 0 16px 40px rgba(20, 33, 61, 0.06); }
.page-header { margin-bottom: 1rem; }
.eyebrow { margin: 0 0 0.25rem; font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.2em; color: #60708f; }
h1 { margin: 0 0 0.4rem; }
.card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
.summary-card { background: #f6f9ff; border-radius: 1rem; padding: 1rem; }
.summary-card h2 { margin: 0 0 0.4rem; font-size: 1rem; color: #5d6d8f; }
.value { margin: 0 0 0.2rem; font-size: 1.5rem; font-weight: 700; color: #14213d; }
</style>
