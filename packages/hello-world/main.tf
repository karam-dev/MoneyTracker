terraform {
  cloud {
    organization = "myPocket"

    workspaces {
      name = "myPocket_test"
    }
  }
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.55.0"
    }
  }
}

provider "google" {
  project = "mypocket-379109"
  region  = "us-central1"
}

data "google_storage_bucket" "main" {
  name = "gcf-v2-sources-567349561198-us-central1"
}

resource "google_storage_bucket_object" "main" {
  name    = "${terraform.workspace}-test-function"
  content = "./src.zip"
  bucket  = data.google_storage_bucket.main.name
}

resource "google_cloudfunctions_function" "main" {
  name        = "function-test"
  description = "My function"
  runtime     = "nodejs18"

  available_memory_mb   = 128
  source_archive_bucket = data.google_storage_bucket.main.name
  source_archive_object = google_storage_bucket_object.main.name
  trigger_http          = true
  entry_point           = "helloGET"
}

resource "google_cloudfunctions_function_iam_member" "main" {
  project        = google_cloudfunctions_function.main.project
  region         = google_cloudfunctions_function.main.region
  cloud_function = google_cloudfunctions_function.main.name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}