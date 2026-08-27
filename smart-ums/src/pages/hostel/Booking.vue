<script setup>
import { ref, onMounted } from 'vue'
import { useHostelStore } from '@/stores/hostel.store'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'

defineOptions({ name: 'HostelBooking' })

const router = useRouter()
const hostelStore = useHostelStore()
const toast = useToast()

const formData = ref({
  studentId: '',
  studentName: '',
  email: '',
  phone: '',
  department: '',
  program: '',
  semester: '',
  hostelPreference: '',
  roomType: 'single',
  messRequired: true,
  emergencyContact: '',
  emergencyPhone: '',
  address: '',
  reason: ''
})

const isSubmitting = ref(false)

const departments = ['Computer Science', 'Engineering', 'Business', 'Arts', 'Science']
const programs = ['BSCS', 'BBA', 'BSSE', 'MBA', 'BSC']
const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']
const roomTypes = ['single', 'double', 'triple', 'quad']

onMounted(() => {
  hostelStore.fetchHostelData()
})

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Create booking request
    const bookingRequest = {
      id: Date.now(),
      ...formData.value,
      status: 'pending',
      submittedAt: new Date().toISOString()
    }
    
    // Store in localStorage for demo (in real app, this would be an API call)
    const existingRequests = JSON.parse(localStorage.getItem('hostelRequests') || '[]')
    existingRequests.push(bookingRequest)
    localStorage.setItem('hostelRequests', JSON.stringify(existingRequests))
    
    // Store last booking for confirmation page
    localStorage.setItem('lastBookingRequest', JSON.stringify(bookingRequest))
    
    toast.success('Hostel booking request submitted successfully!')
    router.push({ name: 'hostel-booking-confirmation' })
  } catch (error) {
    toast.error('Failed to submit booking request')
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.push({ name: 'hostel' })
}
</script>

<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <header class="flex justify-between items-center gap-4 mb-6 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-text-muted font-semibold">Hostel Management</p>
        <h1 class="mb-1 text-2xl font-bold text-text-primary">Hostel Booking</h1>
        <p class="m-0 text-sm text-text-secondary">Submit your hostel accommodation request.</p>
      </div>
    </header>

    <div class="max-w-3xl mx-auto">
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
        <!-- Personal Informat -->
        <div class="bg-bg-light border border-border rounded-xl p-6">
          <h2 class="mb-4 text-lg font-bold text-text-primary">Personal Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-text-secondary mb-2">Student ID *</label>
              <input 
                v-model="formData.studentId" 
                type="text" 
                required
                placeholder="Enter your student ID"
                class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-text-secondary mb-2">Full Name *</label>
              <input 
                v-model="formData.studentName" 
                type="text" 
                required
                placeholder="Enter your full name"
                class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-text-secondary mb-2">Email *</label>
              <input 
                v-model="formData.email" 
                type="email" 
                required
                placeholder="Enter your email"
                class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-text-secondary mb-2">Phone *</label>
              <input 
                v-model="formData.phone" 
                type="tel" 
                required
                placeholder="Enter your phone number"
                class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <!-- Academic Information -->
        <div class="bg-bg-light border border-border rounded-xl p-6">
          <h2 class="mb-4 text-lg font-bold text-text-primary">Academic Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-text-secondary mb-2">Department *</label>
              <select 
                v-model="formData.department" 
                required
                class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              >
                <option value="">Select Department</option>
                <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-text-secondary mb-2">Program *</label>
              <select 
                v-model="formData.program" 
                required
                class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              >
                <option value="">Select Program</option>
                <option v-for="prog in programs" :key="prog" :value="prog">{{ prog }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-text-secondary mb-2">Semester *</label>
              <select 
                v-model="formData.semester" 
                required
                class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              >
                <option value="">Select Semester</option>
                <option v-for="sem in semesters" :key="sem" :value="sem">{{ sem }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Hostel Preferences -->
        <div class="bg-bg-light border border-border rounded-xl p-6">
          <h2 class="mb-4 text-lg font-bold text-text-primary">Hostel Preferences</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-text-secondary mb-2">Preferred Hostel *</label>
              <select 
                v-model="formData.hostelPreference" 
                required
                class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              >
                <option value="">Select Hostel</option>
                <option value="Hostel A">Hostel A</option>
                <option value="Hostel B">Hostel B</option>
                <option value="Hostel C">Hostel C</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-text-secondary mb-2">Room Type *</label>
              <select 
                v-model="formData.roomType" 
                required
                class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              >
                <option v-for="type in roomTypes" :key="type" :value="type">{{ type.charAt(0).toUpperCase() + type.slice(1) }} Occupancy</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="flex items-center gap-2">
                <input 
                  v-model="formData.messRequired" 
                  type="checkbox" 
                  class="w-4 h-4 text-primary focus:ring-primary"
                />
                <span class="text-sm font-semibold text-text-secondary">I require mess service</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Emergency Contact -->
        <div class="bg-bg-light border border-border rounded-xl p-6">
          <h2 class="mb-4 text-lg font-bold text-text-primary">Emergency Contact</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-text-secondary mb-2">Contact Name *</label>
              <input 
                v-model="formData.emergencyContact" 
                type="text" 
                required
                placeholder="Emergency contact name"
                class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-text-secondary mb-2">Contact Phone *</label>
              <input 
                v-model="formData.emergencyPhone" 
                type="tel" 
                required
                placeholder="Emergency contact phone"
                class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <!-- Address and Reason -->
        <div class="bg-bg-light border border-border rounded-xl p-6">
          <h2 class="mb-4 text-lg font-bold text-text-primary">Additional Information</h2>
          <div class="flex flex-col gap-4">
            <div>
              <label class="block text-sm font-semibold text-text-secondary mb-2">Permanent Address *</label>
              <textarea 
                v-model="formData.address" 
                required
                rows="3"
                placeholder="Enter your permanent address"
                class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-semibold text-text-secondary mb-2">Reason for Hostel Accommodation *</label>
              <textarea 
                v-model="formData.reason" 
                required
                rows="3"
                placeholder="Explain why you need hostel accommodation"
                class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex gap-4 justify-end">
          <button 
            type="button" 
            @click="handleCancel"
            class="px-6 py-2 bg-bg-light text-text-primary border border-border rounded-lg font-medium hover:bg-bg-white transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Submitting...' : 'Submit Request' }}
          </button>
        </div>
      </form>
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
