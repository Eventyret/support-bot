variable "environment" {
  description = "Environment name (e.g. dev, prod)"
  type        = string
}

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "mongodb_uri" {
  description = "MongoDB connection URI"
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
  description = "Frontend URL for CORS configuration"
  type        = string
  default     = "http://support-bot-frontend-prod.s3-website.eu-west-2.amazonaws.com"
}
