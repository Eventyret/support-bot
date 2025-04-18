variable "environment" {
  description = "Environment name (e.g. dev, prod)"
  type        = string
}

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "mongodb_uri" {
  description = "The MongoDB URI for connecting to the database"
  type        = string
  sensitive   = true
}

variable "node_env" {
  description = "App environment"
  type        = string
  default     = "production"
}

variable "n8n_webhook_url" {
  description = "n8n production webhook URL"
  type        = string
  default     = ""
}

variable "cleanup_api_key" {
  description = "Key used for cleaning up chats"
  type        = string
  default     = ""
}

variable "n8n_encryption_key" {
  description = "Encryption key for n8n"
  type        = string
  default     = ""
}

variable "frontend_url" {
  description = "The URL of the frontend application"
  type        = string
  default     = ""
}

variable "backend_url" {
  description = "The URL of the backend application (if using external backend)"
  type        = string
  default     = ""
}
