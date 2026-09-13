<script setup>
import { ref, onMounted, computed } from 'vue'
import { useLibraryStore } from '@/stores/library.store'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from '@/composables/useToast'
import AppButton from '@/components/common/AppButton.vue'

defineOptions({ name: 'LibraryIndex' })

const libraryStore = useLibraryStore()
const authStore = useAuthStore()
const toast = useToast()

const activeTab = ref('books')
const showAddBookModal = ref(false)
const showIssueModal = ref(false)
const selectedBook = ref(null)
const searchQuery = ref('')

const bookForm = ref({
  title: '',
  author: '',
  isbn: '',
  category: 'Computer Science',
  totalCopies: 1,
  location: ''
})

const issueForm = ref({
  userId: '',
  userName: ''
})

const categories = ['Computer Science', 'Programming', 'Database', 'Networking', 'AI', 'Mathematics', 'Physics', 'Chemistry']

onMounted(() => {
  libraryStore.fetchBooks()
  libraryStore.fetchIssues()
  libraryStore.fetchReturns()
  libraryStore.checkOverdueIssues()
})

const filteredBooks = computed(() => {
  if (!searchQuery.value) return libraryStore.books
  return libraryStore.searchBooks(searchQuery.value)
})

const summaryCards = computed(() => [
  { title: 'Total Books', value: libraryStore.statistics.totalBooks, subtitle: 'In library catalog' },
  { title: 'Available', value: libraryStore.statistics.availableBooks, subtitle: 'Ready for issue' },
  { title: 'Issued', value: libraryStore.statistics.activeIssues, subtitle: 'Currently borrowed' },
  { title: 'Overdue', value: libraryStore.statistics.overdueIssues, subtitle: 'Need attention' },
])

async function handleAddBook() {
  try {
    const bookData = {
      ...bookForm.value,
      addedBy: authStore.user?.name || 'Admin'
    }
    await libraryStore.createBook(bookData)
    toast.success('Book added successfully')
    showAddBookModal.value = false
    bookForm.value = { title: '', author: '', isbn: '', category: 'Computer Science', totalCopies: 1, location: '' }
  } catch (error) {
    toast.error('Failed to add book')
  }
}

async function handleDeleteBook(bookId) {
  if (confirm('Are you sure you want to delete this book?')) {
    try {
      await libraryStore.deleteBook(bookId)
      toast.success('Book deleted successfully')
    } catch (error) {
      toast.error('Failed to delete book')
    }
  }
}

function handleIssueClick(book) {
  selectedBook.value = book
  showIssueModal.value = true
}

async function handleIssueBook() {
  try {
    await libraryStore.issueBook(
      selectedBook.value.id,
      issueForm.value.userId,
      issueForm.value.userName,
      authStore.user?.role || 'Student'
    )
    toast.success('Book issued successfully')
    showIssueModal.value = false
    selectedBook.value = null
    issueForm.value = { userId: '', userName: '' }
  } catch (error) {
    toast.error(error.message || 'Failed to issue book')
  }
}

async function handleReturnBook(issueId) {
  try {
    await libraryStore.returnBook(issueId)
    toast.success('Book returned successfully')
  } catch (error) {
    toast.error('Failed to return book')
  }
}

async function handleRenewBook(issueId) {
  try {
    await libraryStore.renewBook(issueId)
    toast.success('Book renewed successfully')
  } catch (error) {
    toast.error('Failed to renew book')
  }
}

function getAvailabilityBadge(book) {
  if (book.availableCopies === 0) return 'bg-red-100 text-red-800'
  if (book.availableCopies < book.totalCopies / 2) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

function getIssueStatusBadge(status) {
  return status === 'issued' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
}
</script>

<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <!-- Header Section -->
    <header class="flex justify-between items-center gap-4 mb-6 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-text-muted font-semibold">Library Management</p>
        <h1 class="mb-1 text-2xl font-bold text-text-primary">Library</h1>
        <p class="m-0 text-sm text-text-secondary">Manage books, circulation, fines, and collections.</p>
      </div>
      <AppButton @click="showAddBookModal = true">
        + Add Book
      </AppButton>
    </header>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <article v-for="card in summaryCards" :key="card.title" class="bg-primary-light rounded-xl p-5 border border-border transition-all hover:bg-primary">
        <h2 class="mb-2 text-sm text-text-secondary font-semibold">{{ card.title }}</h2>
        <p class="mb-1 text-3xl font-bold text-text-primary">{{ card.value }}</p>
        <span class="text-xs text-text-muted">{{ card.subtitle }}</span>
      </article>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6 bg-bg-light p-2 rounded-lg">
      <button
        :class="activeTab === 'books' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
        @click="activeTab = 'books'"
        class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
      >
        Books
      </button>
      <button
        :class="activeTab === 'issues' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
        @click="activeTab = 'issues'"
        class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
      >
        Issues
      </button>
      <button
        :class="activeTab === 'returns' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
        @click="activeTab = 'returns'"
        class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
      >
        Returns
      </button>
    </div>

    <!-- Books Tab -->
    <div v-if="activeTab === 'books'">
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
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Copies</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Location</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Status</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Actions</th>
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
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button
                    v-if="book.availableCopies > 0"
                    @click="handleIssueClick(book)"
                    class="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary-dark transition-all"
                  >
                    Issue
                  </button>
                  <button
                    @click="handleDeleteBook(book.id)"
                    class="px-3 py-1 bg-error text-white rounded text-sm hover:bg-error-dark transition-all"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Issues Tab -->
    <div v-if="activeTab === 'issues'">
      <div v-if="libraryStore.issues.length === 0" class="text-center py-12 text-text-muted">
        <p>No active issues found</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-bg-light">
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Book</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">User</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Role</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Issue Date</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Due Date</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Status</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Fine</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="issue in libraryStore.issues" :key="issue.id" class="border-b border-border">
              <td class="px-4 py-3 text-sm text-text-primary font-medium">{{ issue.bookTitle }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ issue.userName }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ issue.userRole }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ issue.issueDate }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ issue.dueDate }}</td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-1 rounded text-xs font-medium', getIssueStatusBadge(issue.status)]">
                  {{ issue.status.charAt(0).toUpperCase() + issue.status.slice(1) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-text-secondary">${{ issue.fine }}</td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button
                    @click="handleReturnBook(issue.id)"
                    class="px-3 py-1 bg-success text-white rounded text-sm hover:bg-success-dark transition-all"
                  >
                    Return
                  </button>
                  <button
                    v-if="issue.status === 'issued'"
                    @click="handleRenewBook(issue.id)"
                    class="px-3 py-1 bg-secondary text-white rounded text-sm hover:bg-secondary-dark transition-all"
                  >
                    Renew
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Returns Tab -->
    <div v-if="activeTab === 'returns'">
      <div v-if="libraryStore.returns.length === 0" class="text-center py-12 text-text-muted">
        <p>No returns found</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-bg-light">
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Book</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">User</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Issue Date</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Return Date</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Due Date</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Fine</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="returnRecord in libraryStore.returns" :key="returnRecord.id" class="border-b border-border">
              <td class="px-4 py-3 text-sm text-text-primary font-medium">{{ returnRecord.bookTitle }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ returnRecord.userName }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ returnRecord.issueDate }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ returnRecord.returnDate }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ returnRecord.dueDate }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">${{ returnRecord.fine }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Book Modal -->
    <div v-if="showAddBookModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 class="text-xl font-bold text-text-primary mb-4">Add New Book</h2>
        <form @submit.prevent="handleAddBook" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Title</label>
            <input v-model="bookForm.title" type="text" required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          </div>
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Author</label>
            <input v-model="bookForm.author" type="text" required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          </div>
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">ISBN</label>
            <input v-model="bookForm.isbn" type="text" required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">Category</label>
              <select v-model="bookForm.category" required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">Total Copies</label>
              <input v-model="bookForm.totalCopies" type="number" min="1" required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Location</label>
            <input v-model="bookForm.location" type="text" required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g., Shelf A-1">
          </div>
          <div class="flex gap-3 justify-end">
            <button type="button" @click="showAddBookModal = false" class="px-4 py-2 border border-border rounded-lg text-text-secondary hover:bg-bg-light transition-all">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all">
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Issue Book Modal -->
    <div v-if="showIssueModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 class="text-xl font-bold text-text-primary mb-4">Issue Book</h2>
        <p class="text-sm text-text-secondary mb-4">Book: {{ selectedBook?.title }}</p>
        <form @submit.prevent="handleIssueBook" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">User ID</label>
            <input v-model="issueForm.userId" type="text" required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          </div>
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">User Name</label>
            <input v-model="issueForm.userName" type="text" required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          </div>
          <div class="flex gap-3 justify-end">
            <button type="button" @click="showIssueModal = false; selectedBook = null" class="px-4 py-2 border border-border rounded-lg text-text-secondary hover:bg-bg-light transition-all">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all">
              Issue Book
            </button>
          </div>
        </form>
      </div>
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
