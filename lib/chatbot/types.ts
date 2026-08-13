export interface Message {
  role: "system" | "user" | "assistant"
  content: string
}

export type ChatUserMessage = {
  role: "user"
  content: string
}

export interface ChatRequest {
  messages: ChatUserMessage[]
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
