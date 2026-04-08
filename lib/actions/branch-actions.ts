// Client-side execution for demo
import { mockBranches } from '@/lib/mock-data'

const serialize = (data: any) => JSON.parse(JSON.stringify(data))

export async function createBranch(data: { companyId: string; name: string; address: string; phone: string }) {
  try {
    const newBranch = {
      id: `branch-${Math.random().toString(36).substr(2, 6)}`,
      ...data
    }
    mockBranches.push(newBranch)
    return { success: true, data: serialize(newBranch) }
  } catch (error) {
    return { success: false, error: 'Failed to create branch' }
  }
}

export async function updateBranch(id: string, data: Partial<{ name: string; address: string; phone: string }>) {
  try {
    const idx = mockBranches.findIndex(b => b.id === id)
    if (idx === -1) return { success: false, error: 'Branch not found' }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockBranches[idx] = { ...mockBranches[idx], ...data } as any
    return { success: true, data: serialize(mockBranches[idx]) }
  } catch (error) {
    return { success: false, error: 'Failed to update branch' }
  }
}

export async function deleteBranch(id: string) {
  try {
    const idx = mockBranches.findIndex(b => b.id === id)
    if (idx !== -1) mockBranches.splice(idx, 1)
    
    // Also might want to cleanup related data logically...
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete branch' }
  }
}
