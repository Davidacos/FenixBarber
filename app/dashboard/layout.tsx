import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - BeautyCRM',
  description: 'Resumen de tu negocio',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
