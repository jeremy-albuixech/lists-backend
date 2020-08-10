resource "google_container_cluster" "owl_cluster" {
  name     = "owl-cluster"
  location = "us-central1"

  remove_default_node_pool = true
  initial_node_count       = 1

}

resource "google_container_node_pool" "owl_preemptible_nodes" {
  name       = "owl-node-pool"
  location   = "us-central1"
  cluster    = "owl-cluster"
  node_count = 1

  node_config {
    preemptible  = true
    machine_type = "e2-small"

    metadata = {
      disable-legacy-endpoints = "true"
    }

    oauth_scopes = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ]
  }
}