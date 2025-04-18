resource "aws_secretsmanager_secret" "app_secrets" {
  name        = "${var.project_name}/${var.environment}/app-secrets"
  description = "Secrets for the ${var.project_name} application in ${var.environment} environment"

  tags = {
    Name        = "${var.project_name}-${var.environment}-secrets"
    Environment = var.environment
  }
}

# Using lifecycle ignore_changes to prevent overwriting manually updated secrets
resource "aws_secretsmanager_secret_version" "app_secrets" {
  secret_id = aws_secretsmanager_secret.app_secrets.id

  secret_string = jsonencode(merge(
    {
      MONGODB_URI        = var.mongodb_uri
      NODE_ENV           = "production"
      N8N_WEBHOOK_URL    = var.n8n_webhook_url
      CLEANUP_API_KEY    = var.cleanup_api_key
      N8N_ENCRYPTION_KEY = var.n8n_encryption_key
      FRONTEND_URL       = var.frontend_url
    },
    # Only include BACKEND_URL if it's set (not empty)
    var.backend_url != "" ? { BACKEND_URL = var.backend_url } : {}
  ))

  # Prevent Terraform from overwriting secrets that have been manually updated
  lifecycle {
    ignore_changes = [
      secret_string
    ]
  }
}

# Output the ARN of the Secrets Manager secret
output "secrets_arn" {
  value = aws_secretsmanager_secret.app_secrets.arn
}
