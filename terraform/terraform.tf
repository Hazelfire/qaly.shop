provider "google" {
  credentials = var.credentials
  project     = var.project
  region      = "us-central1"
}

variable "project" {}
variable "credentials" {}
variable "bucket" {}

resource "google_storage_bucket" "bucket" {
  name     = var.bucket
  location = "US"

  cors {
    origin          = ["http://localhost:3000", "https://qaly.shop"]
    response_header = ["Content-Type"]
    method          = ["GET", "HEAD", "DELETE", "PUT"]
    max_age_seconds = 3600
  }
}