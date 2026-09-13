<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <!-- Header Section -->
    <header class="mb-6">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-text-muted font-semibold">Student Portal</p>
        <h1 class="mb-1 text-2xl font-bold text-text-primary">Library</h1>
        <p class="m-0 text-sm text-text-secondary">Browse books, manage your issues, and view return history.</p>
      </div>
    </header>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <article class="bg-primary-light rounded-xl p-5 border border-border transition-all hover:bg-primary">
        <h2 class="mb-2 text-sm text-text-secondary font-semibold">Available Books</h2>
        <p class="mb-1 text-3xl font-bold text-text-primary">{{ libraryStore.availableBooks.length }}</p>
        <span class="text-xs text-text-muted">Ready to borrow</span>
      </article>
      <article class="bg-secondary-light rounded-xl p-5 border border-border transition-all hover:bg-secondary">
        <h2 class="mb-2 text-sm text-text-secondary font-semibold">My Issues</h2>
        <p class="mb-1 text-3xl font-bold text-text-primary">{{ myIssues.length }}</p>
        <span class="text-xs text-text-muted">Currently borrowed</span>
      </article>
      <article class="bg-success-light rounded-xl p-5 border border-border transition-all hover:bg-success">
        <h2 class="mb-2 text-sm text-text-secondary font-semibold">Total Returns</h2>
        <p class="mb-1 text-3xl font-bold text-text-primary">{{ myReturns.length }}</p>
        <span class="text-xs text-text-muted">Books returned</span>
      </article>
      <article class="bg-error-light rounded-xl p-5 border border-border transition-all hover:bg-error">
        <h2 class="mb-2 text-sm text-text-secondary font-semibold">Outstanding Fines</h2>
        <p class="mb-1 text-3xl font-bold text-text-primary">${{ myFines }}</p>
        <span class="text-xs text-text-muted">Pending payment</span>
      </article>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6 bg-bg-light p-2 rounded-lg">
      <button
        :class="activeTab === 'browse' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
        @click="activeTab = 'browse'"
        class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
      >
        Browse Books
      </button>
      <button
        :class="activeTab === 'my-issues' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
        @click="activeTab = 'my-issues'"
        class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
      >
        My Issues
      </button>
      <button
        :class="activeTab === 'history' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
        @click="activeTab = 'history'"
        class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
      >
        Return History
      </button>
    </div>

    <!-- Browse Books Tab -->
    <div v-if="activeTab === 'browse'">
      <div class="mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search books by title, author, or ISBN..."
          class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div v-if="filteredBooks.length === 0" class="text-center py-12 text-text-muted">
        <p>No books found</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-bg-light">
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Title</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Author</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">ISBN</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Category</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Available</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Location</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in filteredBooks" :key="book.id" class="border-b border-border">
              <td class="px-4 py-3 text-sm text-text-primary font-medium">{{ book.title }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ book.author }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ book.isbn }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ book.category }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ book.availableCopies }} / {{ book.totalCopies }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ book.location }}</td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-1 rounded text-xs font-medium', getAvailabilityBadge(book)]">
                  {{ book.availableCopies > 0 ? 'Available' : 'Unavailable' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- My Issues Tab -->
    <div v-if="activeTab === 'my-issues'">
      <div v-if="myIssues.length === 0" class="text-center py-12 text-text-muted">
        <p>You have no issued books</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-bg-light">
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Book</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Issue Date</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Due Date</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Status</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Fine</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="issue in myIssues" :key="issue.id" class="border-b border-border">
              <td class="px-4 py-3 text-sm text-text-primary font-medium">{{ issue.bookTitle }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ issue.issueDate }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ issue.dueDate }}</td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-1 rounded text-xs font-medium', getIssueStatusBadge(issue.status)]">
                  {{ issue.status.charAt(0).toUpperCase() + issue.status.slice(1) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-text-secondary">${{ issue.fine }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Return History Tab -->
    <div v-if="activeTab === 'history'">
      <div v-if="myReturns.length === 0" class="text-center py-12 text-text-muted">
        <p>No return history found</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-bg-light">
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Book</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Issue Date</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Return Date</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Due Date</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Fine Paid</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="returnRecord in myReturns" :key="returnRecord.id" class="border-b border-border">
              <td class="px-4 py-3 text-sm text-text-primary font-medium">{{ returnRecord.bookTitle }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ returnRecord.issueDate }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ returnRecord.returnDate }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ returnRecord.dueDate }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">${{ returnRecord.fine }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useLibraryStore } from '@/stores/library.store'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from '@/composables/useToast'

defineOptions({ name: 'StudentLibrary' })

const libraryStore = useLibraryStore()
const authStore = useAuthStore()
const toast = useToast()

const activeTab = ref('browse')
const searchQuery = ref('')

onMounted(() => {
  libraryStore.fetchBooks()
  libraryStore.fetchIssues()
  libraryStore.fetchReturns()
  libraryStore.checkOverdueIssues()
})

const filteredBooks = computed(() => {
  if (!searchQuery.value) return libraryStore.availableBooks
  const searchResults = libraryStore.searchBooks(searchQuery.value)
  return searchResults.filter(book => book.availableCopies > 0)
})

const myIssues = computed(() => {
  if (authStore.user) {
    return libraryStore.getIssuesByUserId(authStore.user.id)
  }
  return []
})

const myReturns = computed(() => {
  if (authStore.user) {
    return libraryStore.getReturnsByUserId(authStore.user.id)
  }
  return []
})

const myFines = computed(() => {
  return myIssues.value.reduce((sum, issue) => sum + issue.fine, 0)
})

function getAvailabilityBadge(book) {
  if (book.availableCopies === 0) return 'bg-red-100 text-red-800'
  if (book.availableCopies < book.totalCopies / 2) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

function getIssueStatusBadge(status) {
  return status === 'issued' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
}
</script>

<style scoped>
/* Removed the placeholder style */
</style>
