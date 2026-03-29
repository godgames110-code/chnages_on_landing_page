export type AppointmentStatus = 'scheduled' | 'confirmed' | 'canceled' | 'completed'

export interface Appointment {
  id: string
  clientId: string
  clientName: string
  date: string
  time: string
  address?: string | null
  description?: string | null
  status: AppointmentStatus
}
