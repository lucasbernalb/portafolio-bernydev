export interface Message {
  role: "system" | "user" | "assistant"
  content: string
}

export interface ChatRequest {
  messages: Message[]
  lang?: "es" | "en"
}

export interface ChatResponse {
  reply: string
  lead: LeadData
}

export interface LeadData {
  nombre: string | null
  email: string | null
  telefono: string | null
  servicio: string | null
  urgencia: "baja" | "media" | "alta"
  score: number
  resumen: string
  leadCompleto: boolean
}
