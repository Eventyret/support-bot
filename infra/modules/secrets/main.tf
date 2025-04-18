resource "aws_secretsmanager_secret" "app_secrets" {
  name        = "${var.project_name}/${var.environment}/app-secrets"
  description = "Secrets for the ${var.project_name} application in ${var.environment} environment"

  tags = {
    Name        = "${var.project_name}-${var.environment}-secrets"
    Environment = var.environment
  }
}

resource "aws_secretsmanager_secret_version" "app_secrets" {
  secret_id = aws_secretsmanager_secret.app_secrets.id

  secret_string = jsonencode({
    MONGODB_URI        = var.mongodb_uri
    NODE_ENV           = var.environment
    N8N_WEBHOOK_URL    = ""
    CLEANUP_API_KEY    = ""
    N8N_ENCRYPTION_KEY = ""
    FRONTEND_URL       = var.frontend_url
  })
}

# Output the ARN of the Secrets Manager secret
output "secrets_arn" {
  value = aws_secretsmanager_secret.app_secrets.arn
}
