<script setup>
import AppButton from '@/components/common/AppButton.vue'
</script>

<template>
  <section class="auth-card">
    <div>
      <p class="eyebrow">Secure access</p>
      <h1>Welcome back</h1>
      <p>Sign in to explore the university operations dashboard.</p>
    </div>

    <form class="auth-form">
      <label>
        <span>Email</span>
        <input type="email" placeholder="staff@university.edu" />
      </label>
      <label>
        <span>Password</span>
        <input type="password" placeholder="••••••••" />
      </label>
      <AppButton type="submit" block>Continue</AppButton>
    </form>
  </section>
</template>

<style scoped>
.auth-card { max-width: 480px; margin: 3rem auto; background: white; border: 1px solid #dfe7fb; border-radius: 1.2rem; padding: 1.5rem; box-shadow: 0 16px 40px rgba(20, 33, 61, 0.06); }
.eyebrow { margin: 0 0 0.25rem; font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.2em; color: #60708f; }
h1 { margin: 0 0 0.4rem; }
.auth-form { display: grid; gap: 0.9rem; margin-top: 1rem; }
label { display: grid; gap: 0.35rem; color: #30415d; }
input { border: 1px solid #d7e1f0; border-radius: 0.75rem; padding: 0.8rem 0.9rem; }
button { border: none; border-radius: 999px; padding: 0.8rem; background: #214d9c; color: white; cursor: pointer; }
</style>
