'use server'

import { mockServices, mockCompanies } from '@/lib/mock-data'
import { revalidatePath } from 'next/cache'

// Helper for deep cloning and serializing (to match previous behavior)
const serialize = (data: any) => JSON.parse(JSON.stringify(data))

export async function getServices(companyId: string, branchId: string) {
  try {
    const services = mockServices.filter(s => s.companyId === companyId && s.branchId === branchId)
    return { success: true, data: serialize(services) }
  } catch (error) {
    console.error('Error fetching services:', error)
    return { success: false, error: 'Failed to fetch services' }
  }
}

export async function createService(data: {
  name: string
  description?: string
  category: string
  price: number
  duration: number
  companyId: string
  branchId: string
}) {
  try {
    const newService = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      active: true
    }
    
    // In a real mock scenario we might push to the array, 
    // but since this is a server action in a stateless environment (for 이제),
    // we'll just simulate success.
    mockServices.push(newService as any)

    revalidatePath('/services')
    return { success: true, data: serialize(newService) }
  } catch (error) {
    console.error('Error creating service:', error)
    return { success: false, error: 'Failed to create service' }
  }
}

export async function updateService(
  id: string,
  data: {
    name?: string
    description?: string
    category?: string
    price?: number
    duration?: number
    active?: boolean
  }
) {
  try {
    const serviceIndex = mockServices.findIndex(s => s.id === id)
    if (serviceIndex === -1) return { success: false, error: 'Service not found' }

    const updatedService = {
      ...mockServices[serviceIndex],
      ...data
    }
    
    mockServices[serviceIndex] = updatedService as any

    revalidatePath('/services')
    return { success: true, data: serialize(updatedService) }
  } catch (error) {
    console.error('Error updating service:', error)
    return { success: false, error: 'Failed to update service' }
  }
}

export async function deleteService(id: string) {
  try {
    const serviceIndex = mockServices.findIndex(s => s.id === id)
    if (serviceIndex !== -1) {
      mockServices.splice(serviceIndex, 1)
    }
    
    revalidatePath('/services')
    return { success: true }
  } catch (error) {
    console.error('Error deleting service:', error)
    return { success: false, error: 'Failed to delete service' }
  }
}

