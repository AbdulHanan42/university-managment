import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLibraryStore = defineStore('library', () => {
  const books = ref([])
  const issues = ref([])
  const returns = ref([])
  const fines = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Mock data for books
  const mockBooks = [
    { id: 1, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', category: 'Computer Science', totalCopies: 10, availableCopies: 7, location: 'Shelf A-1', status: 'available', addedBy: 'Super Admin', addedDate: '2024-01-15' },
    { id: 2, title: 'Data Structures and Algorithms', author: 'Michael T. Goodrich', isbn: '978-1118771334', category: 'Computer Science', totalCopies: 8, availableCopies: 5, location: 'Shelf A-2', status: 'available', addedBy: 'Super Admin', addedDate: '2024-01-20' },
    { id: 3, title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', category: 'Programming', totalCopies: 15, availableCopies: 12, location: 'Shelf B-1', status: 'available', addedBy: 'Admin', addedDate: '2024-02-01' },
    { id: 4, title: 'Design Patterns', author: 'Erich Gamma', isbn: '978-0201633610', category: 'Programming', totalCopies: 6, availableCopies: 4, location: 'Shelf B-2', status: 'available', addedBy: 'Admin', addedDate: '2024-02-10' },
    { id: 5, title: 'Database System Concepts', author: 'Abraham Silberschatz', isbn: '978-0073523323', category: 'Database', totalCopies: 12, availableCopies: 8, location: 'Shelf C-1', status: 'available', addedBy: 'Super Admin', addedDate: '2024-02-15' },
    { id: 6, title: 'Operating System Concepts', author: 'Abraham Silberschatz', isbn: '978-1118129388', category: 'Computer Science', totalCopies: 10, availableCopies: 6, location: 'Shelf C-2', status: 'available', addedBy: 'Admin', addedDate: '2024-03-01' },
    { id: 7, title: 'Computer Networks', author: 'Andrew S. Tanenbaum', isbn: '978-0132126953', category: 'Networking', totalCopies: 8, availableCopies: 5, location: 'Shelf D-1', status: 'available', addedBy: 'Super Admin', addedDate: '2024-03-10' },
    { id: 8, title: 'Artificial Intelligence', author: 'Stuart Russell', isbn: '978-0132350884', category: 'AI', totalCopies: 5, availableCopies: 3, location: 'Shelf E-1', status: 'available', addedBy: 'Admin', addedDate: '2024-03-20' },
  ]

  // Mock data for issues
  const mockIssues = [
    { id: 1, bookId: 1, bookTitle: 'Introduction to Algorithms', userId: 1, userName: 'John Doe', userRole: 'Student', issueDate: '2024-09-01', dueDate: '2024-09-15', status: 'issued', fine: 0 },
    { id: 2, bookId: 3, bookTitle: 'Clean Code', userId: 2, userName: 'Jane Smith', userRole: 'Faculty', issueDate: '2024-09-05', dueDate: '2024-09-19', status: 'issued', fine: 0 },
    { id: 3, bookId: 5, bookTitle: 'Database System Concepts', userId: 3, userName: 'Mike Johnson', userRole: 'Student', issueDate: '2024-08-20', dueDate: '2024-09-03', status: 'overdue', fine: 50 },
  ]

  // Mock data for returns
  const mockReturns = [
    { id: 1, bookId: 1, bookTitle: 'Introduction to Algorithms', userId: 1, userName: 'John Doe', userRole: 'Student', issueDate: '2024-08-15', returnDate: '2024-08-30', dueDate: '2024-08-29', fine: 10, status: 'returned' },
    { id: 2, bookId: 2, bookTitle: 'Data Structures and Algorithms', userId: 4, userName: 'Sarah Williams', userRole: 'Student', issueDate: '2024-08-10', returnDate: '2024-08-25', dueDate: '2024-08-24', fine: 15, status: 'returned' },
  ]

  // Computed properties
  const availableBooks = computed(() => books.value.filter(book => book.availableCopies > 0))
  const issuedBooks = computed(() => books.value.filter(book => book.availableCopies < book.totalCopies))
  const activeIssues = computed(() => issues.value.filter(issue => issue.status === 'issued'))
  const overdueIssues = computed(() => issues.value.filter(issue => issue.status === 'overdue'))
  const totalFines = computed(() => fines.value.reduce((sum, fine) => sum + fine.amount, 0))

  const statistics = computed(() => ({
    totalBooks: books.value.length,
    availableBooks: availableBooks.value.length,
    issuedBooks: issuedBooks.value.length,
    activeIssues: activeIssues.value.length,
    overdueIssues: overdueIssues.value.length,
    totalReturns: returns.value.length,
    totalFines: totalFines.value
  }))

  // Actions
  async function fetchBooks() {
    loading.value = true
    error.value = null
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      books.value = mockBooks
    } catch (err) {
      error.value = 'Failed to fetch books'
      console.error('Error fetching books:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchIssues() {
    loading.value = true
    error.value = null
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      issues.value = mockIssues
    } catch (err) {
      error.value = 'Failed to fetch issues'
      console.error('Error fetching issues:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchReturns() {
    loading.value = true
    error.value = null
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      returns.value = mockReturns
    } catch (err) {
      error.value = 'Failed to fetch returns'
      console.error('Error fetching returns:', err)
    } finally {
      loading.value = false
    }
  }

  async function createBook(bookData) {
    loading.value = true
    error.value = null
    try {
      const newBook = {
        id: Date.now(),
        ...bookData,
        availableCopies: bookData.totalCopies,
        status: 'available',
        addedDate: new Date().toISOString().split('T')[0]
      }
      books.value.push(newBook)
      return newBook
    } catch (err) {
      error.value = 'Failed to add book'
      console.error('Error adding book:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateBook(bookId, bookData) {
    loading.value = true
    error.value = null
    try {
      const index = books.value.findIndex(book => book.id === bookId)
      if (index !== -1) {
        books.value[index] = { ...books.value[index], ...bookData }
        return books.value[index]
      }
      throw new Error('Book not found')
    } catch (err) {
      error.value = 'Failed to update book'
      console.error('Error updating book:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteBook(bookId) {
    loading.value = true
    error.value = null
    try {
      books.value = books.value.filter(book => book.id !== bookId)
      return true
    } catch (err) {
      error.value = 'Failed to delete book'
      console.error('Error deleting book:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function issueBook(bookId, userId, userName, userRole) {
    loading.value = true
    error.value = null
    try {
      const book = books.value.find(b => b.id === bookId)
      if (!book || book.availableCopies <= 0) {
        throw new Error('Book not available')
      }

      // Update book availability
      await updateBook(bookId, { availableCopies: book.availableCopies - 1 })

      // Calculate due date (14 days from issue date)
      const issueDate = new Date()
      const dueDate = new Date(issueDate)
      dueDate.setDate(dueDate.getDate() + 14)

      const newIssue = {
        id: Date.now(),
        bookId,
        bookTitle: book.title,
        userId,
        userName,
        userRole,
        issueDate: issueDate.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'issued',
        fine: 0
      }

      issues.value.push(newIssue)
      return newIssue
    } catch (err) {
      error.value = 'Failed to issue book'
      console.error('Error issuing book:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function returnBook(issueId) {
    loading.value = true
    error.value = null
    try {
      const issue = issues.value.find(i => i.id === issueId)
      if (!issue) {
        throw new Error('Issue not found')
      }

      // Calculate fine if overdue
      const today = new Date()
      const dueDate = new Date(issue.dueDate)
      let fine = 0

      if (today > dueDate) {
        const diffTime = Math.abs(today - dueDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        fine = diffDays * 5 // $5 per day
      }

      // Update book availability
      const book = books.value.find(b => b.id === issue.bookId)
      if (book) {
        await updateBook(book.id, { availableCopies: book.availableCopies + 1 })
      }

      // Create return record
      const returnRecord = {
        id: Date.now(),
        bookId: issue.bookId,
        bookTitle: issue.bookTitle,
        userId: issue.userId,
        userName: issue.userName,
        userRole: issue.userRole,
        issueDate: issue.issueDate,
        returnDate: today.toISOString().split('T')[0],
        dueDate: issue.dueDate,
        fine,
        status: 'returned'
      }

      returns.value.unshift(returnRecord)

      // Remove from issues
      issues.value = issues.value.filter(i => i.id !== issueId)

      // Add fine if any
      if (fine > 0) {
        fines.value.push({
          id: Date.now(),
          issueId,
          userId: issue.userId,
          userName: issue.userName,
          amount: fine,
          status: 'unpaid',
          createdAt: today.toISOString().split('T')[0]
        })
      }

      return returnRecord
    } catch (err) {
      error.value = 'Failed to return book'
      console.error('Error returning book:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function renewBook(issueId) {
    loading.value = true
    error.value = null
    try {
      const issue = issues.value.find(i => i.id === issueId)
      if (!issue) {
        throw new Error('Issue not found')
      }

      // Extend due date by 14 days
      const currentDueDate = new Date(issue.dueDate)
      const newDueDate = new Date(currentDueDate)
      newDueDate.setDate(newDueDate.getDate() + 14)

      await updateIssue(issueId, { dueDate: newDueDate.toISOString().split('T')[0] })
      return issues.value.find(i => i.id === issueId)
    } catch (err) {
      error.value = 'Failed to renew book'
      console.error('Error renewing book:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateIssue(issueId, issueData) {
    const index = issues.value.findIndex(issue => issue.id === issueId)
    if (index !== -1) {
      issues.value[index] = { ...issues.value[index], ...issueData }
      return issues.value[index]
    }
    throw new Error('Issue not found')
  }

  function getBooksByCategory(category) {
    return books.value.filter(book => book.category === category)
  }

  function getIssuesByUserId(userId) {
    return issues.value.filter(issue => issue.userId === userId)
  }

  function getReturnsByUserId(userId) {
    return returns.value.filter(returnRecord => returnRecord.userId === userId)
  }

  function searchBooks(query) {
    const lowerQuery = query.toLowerCase()
    return books.value.filter(book =>
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery) ||
      book.isbn.includes(lowerQuery)
    )
  }

  function calculateFine(issueId) {
    const issue = issues.value.find(i => i.id === issueId)
    if (!issue) return 0

    const today = new Date()
    const dueDate = new Date(issue.dueDate)
    if (today <= dueDate) return 0

    const diffTime = Math.abs(today - dueDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays * 5
  }

  function checkOverdueIssues() {
    const today = new Date()
    issues.value.forEach(issue => {
      const dueDate = new Date(issue.dueDate)
      if (today > dueDate && issue.status === 'issued') {
        issue.status = 'overdue'
        issue.fine = calculateFine(issue.id)
      }
    })
  }

  return {
    books,
    issues,
    returns,
    fines,
    loading,
    error,
    availableBooks,
    issuedBooks,
    activeIssues,
    overdueIssues,
    totalFines,
    statistics,
    fetchBooks,
    fetchIssues,
    fetchReturns,
    createBook,
    updateBook,
    deleteBook,
    issueBook,
    returnBook,
    renewBook,
    getBooksByCategory,
    getIssuesByUserId,
    getReturnsByUserId,
    searchBooks,
    calculateFine,
    checkOverdueIssues
  }
})
