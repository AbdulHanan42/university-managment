<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({ name: 'BookingConfirmation' })

const router = useRouter()

const bookingDetails = ref(null)

onMounted(() => {
  // Get booking details from localStorage (in real app, this would come from API response)
  const lastRequest = localStorage.getItem('lastBookingRequest')
  if (lastRequest) {
    bookingDetails.value = JSON.parse(lastRequest)
  } else {
    // If no booking details, redirect to hostel index
    router.push({ name: 'hostel' })
  }
})

const handleBackToHostel = () => {
  router.push({ name: 'hostel' })
}

const handleViewStatus = () => {
  // Students can view their own request status (would need authentication in real app)
  router.push({ name: 'hostel' })
}
</script>

<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <header class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-success-light rounded-full mb-4">
        <svg class="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h1 class="mb-2 text-3xl font-bold text-text-primary">Booking Request Submitted!</h1>
      <p class="text-text-secondary">Your hostel accommodation request has been successfully submitted.</p>
    </header>

    <div v-if="bookingDetails" class="max-w-2xl mx-auto">
      <div class="bg-bg-light border border-border rounded-xl p-6 mb-6">
        <h2 class="mb-4 text-lg font-bold text-text-primary">Request Details</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-text-muted mb-1">Student Name</p>
            <p class="text-sm font-semibold text-text-primary">{{ bookingDetails.studentName }}</p>
          </div>
          <div>
            <p class="text-xs text-text-muted mb-1">Student ID</p>
            <p class="text-sm font-semibold text-text-primary">{{ bookingDetails.studentId }}</p>
          </div>
          <div>
            <p class="text-xs text-text-muted mb-1">Department</p>
            <p class="text-sm font-semibold text-text-primary">{{ bookingDetails.department }}</p>
          </div>
          <div>
            <p class="text-xs text-text-muted mb-1">Program</p>
            <p class="text-sm font-semibold text-text-primary">{{ bookingDetails.program }}</p>
          </div>
          <div>
            <p class="text-xs text-text-muted mb-1">Semester</p>
            <p class="text-sm font-semibold text-text-primary">{{ bookingDetails.semester }}</p>
          </div>
          <div>
            <p class="text-xs text-text-muted mb-1">Preferred Hostel</p>
            <p class="text-sm font-semibold text-text-primary">{{ bookingDetails.hostelPreference }}</p>
          </div>
          <div>
            <p class="text-xs text-text-muted mb-1">Room Type</p>
            <p class="text-sm font-semibold text-text-primary">{{ bookingDetails.roomType }}</p>
          </div>
          <div>
            <p class="text-xs text-text-muted mb-1">Mess Required</p>
            <p class="text-sm font-semibold text-text-primary">{{ bookingDetails.messRequired ? 'Yes' : 'No' }}</p>
          </div>
        </div>
      </div>

      <div class="bg-primary-light border border-border rounded-xl p-6 mb-6">
        <h2 class="mb-4 text-lg font-bold text-text-primary">What's Next?</h2>
        <ul class="space-y-3 text-sm text-text-secondary">
          <li class="flex items-start gap-3">
            <span class="text-primary font-bold">1.</span>
            <span>Your request will be reviewed by the hostel administration.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary font-bold">2.</span>
            <span>You will receive a notification once your request is processed.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary font-bold">3.</span>
            <span>Upon approval, you will be assigned a room and bed number.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary font-bold">4.</span>
            <span>Check your email for updates on your request status.</span>
          </li>
        </ul>
      </div>

      <div class="bg-warning-light border border-border rounded-xl p-6 mb-6">
        <h2 class="mb-4 text-lg font-bold text-text-primary">Important Notes</h2>
        <ul class="space-y-2 text-sm text-text-secondary">
          <li class="flex items-start gap-2">
            <span class="text-warning">⚠️</span>
            <span>Keep your student ID handy for any inquiries.</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-warning">⚠️</span>
            <span>Processing time may take 2-3 business days.</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-warning">⚠️</span>
            <span>Contact hostel administration if you don't receive a response within 5 days.</span>
          </li>
        </ul>
      </div>

      <div class="flex gap-4 justify-center">
        <button 
          @click="handleBackToHostel"
          class="px-6 py-2 bg-bg-light text-text-primary border border-border rounded-lg font-medium hover:bg-bg-white transition-all"
        >
          Back to Hostel
        </button>
        <button 
          @click="handleViewStatus"
          class="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all"
        >
          View Status
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in;
}
</style>
