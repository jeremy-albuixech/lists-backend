resource "kubernetes_config_map" "nginx_config" {
  metadata {
    name      = "nginx-config"
  }

  data = {
    "nginx.conf" = "${file("${path.module}/../nginx/nginx.conf")}"
  }
}


resource "google_compute_address" "nginx_external" {
  name    = "nginxip"
  project = "owl-backend-286022"
}

resource "kubernetes_service" "nginx_public_service" {
  metadata {
    name      = "nginx-public"
  }

  spec {
    selector = {
        app = "nginx"
    }

    port {
      port        = 80
      target_port = 80
      protocol    = "TCP"
      name        = "http"
    }

    type                    = "LoadBalancer"
    load_balancer_ip        = google_compute_address.nginx_external.address
    external_traffic_policy = "Local"
  }
}

resource "kubernetes_horizontal_pod_autoscaler" "nginx_hpa" {
  metadata {
    name      = "hpa-nginx"
  }

  spec {
    max_replicas                      = 10
    min_replicas                      = 1
    target_cpu_utilization_percentage = 70

    scale_target_ref {
      kind        = "Deployment"
      name        = "nginx"
      api_version = "extensions/v1beta1"
    }
  }
}

resource "kubernetes_deployment" "nginx" {
 
  metadata {
    name      = "nginx"
  }

  spec {
   
    selector {
      match_labels = {
        app = "nginx"
      }
    }

    template {
      metadata {
        labels = {
          app = "nginx"
        }
      }

      spec {
        container {
          image = "owasp/modsecurity-crs:nginx"
          name  = "nginx"

          # we need the custom nginx.conf file to send logs to stdout
          command = ["nginx", "-g", "daemon off;", "-c", "/custom_nginx_conf/nginx.conf"]

          readiness_probe {
            http_get {
              path   = "/health"
              port   = "80"
              scheme = "HTTP"
            }

            initial_delay_seconds = 60
          }
          liveness_probe {
            http_get {
              path   = "/health"
              port   = "80"
              scheme = "HTTP"
            }

            initial_delay_seconds = 60
            period_seconds        = 30
          }
          port {
            container_port = 80
          }
          resources {
            requests {
              memory = "200m"
              cpu    = "1"
            }

            limits {
              memory = "200m"
              cpu    = "1"
            }
          }
          env {
            name  = "SERVER_CONF_MD5"
            value = md5(jsonencode(kubernetes_config_map.nginx_config.data))
          }
          volume_mount {
            name       = "nginx-config"
            mount_path = "/custom_nginx_conf"
          }
        }

        volume {
          name = "nginx-config"

          config_map {
            name = "nginx-config"
          }
        }
      }
    }
  }
}
