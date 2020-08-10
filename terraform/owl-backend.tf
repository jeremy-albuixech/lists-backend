resource "kubernetes_service" "owl_backend" {
  metadata {
    name      = "owlbackend"
  }

  spec {
    selector = {
      app = "owl-backend"
    }

    port {
      port        = 8080
      target_port = 8080
      protocol    = "TCP"
      name        = "owlbackend"
    }

    type = "ClusterIP"
  }
}

resource "kubernetes_deployment" "owl_backend" {
  metadata {
    name      = "owl-backend"
  }

  spec {
    selector {
      match_labels = {
        app = "owl-backend"
      }
    }


    template {
      metadata {
        labels = {
          app = "owl-backend"
        }
      }

      spec {

        container {
          image             = "owl-backend:latest"
          name              = "owl-backend"
          image_pull_policy = "Always"

          resources {
            requests {
              memory = "50m"
              cpu    = ".1"
            }

            limits {
              memory = "50m"
              cpu    = ".1"
            }
          }
          port {
            container_port = 8080
          }

          readiness_probe {
            tcp_socket {
              port = "8080"
            }

            initial_delay_seconds = 5
            period_seconds        = 10
          }

        }
        container {
          image             = "mongo:4.2"
          name              = "mongo"

          resources {
            requests {
              memory = "50m"
              cpu    = ".1"
            }

            limits {
              memory = "50m"
              cpu    = ".1"
            }
          }
          port {
            container_port = 27017
          }
          
        }
      }
    }
  }

}
