export interface AirConditioner {
  id: string
  brand: string
  model: string
  serialNumber: string
  location: string
  capacity: string
  installationDate: string
  lastService: string
  status: "operational" | "maintenance-pending" | "out-of-service"
  serviceHistory?: ServiceRecord[]
}

export interface ServiceRecord {
  id: string
  date: string
  type: "limpeza" | "manutenção" | "reparo" | "inspeção"
  description: string
  technician: string
  status?: "iniciar" | "em_andamento" | "finalizada"
  proof?: {
    fileName: string
    url: string
    type: "pdf" | "image" | "document" | "file"
  }[]
}
