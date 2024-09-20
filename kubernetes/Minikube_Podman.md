### Running Minikube with Podman & Rancher

#### Reading
- [Podman And Minikube](https://loopednetwork.medium.com/podman-and-minikube-a31069f2be7d)
- [Ranch your Minikube](https://0to1.nl/post/minikube-m1-rancher/)
- [Provisioning Minikube using Rancher](https://medium.com/@mhshahin/provision-minikube-using-rancher-811bc39c122b)
- [Using Minikube on M1 Macs](https://itnext.io/using-minikube-on-m1-macs-416da593ba0c)
- [Vault installation to minikube via Helm with TLS enabled](https://developer.hashicorp.com/vault/tutorials/kubernetes/kubernetes-minikube-tls)


### Tools
- [Podman](https://podman.io/)
- [Podman Desktop](https://podman-desktop.io/)
- [Rancher](https://www.rancher.com/products/rancher-desktop)

1. Initialize and configure a virtual machine (VM) that can run container workloads using:

    ```shell
    podman machine init
    ```

2. Set podman as the default driver using

   ```shell
   minikube config set driver podman
   ```

3. Start the VM using
    ```shell
    minikube start --driver=podman --container-runtime=cri-o
    ```
    or 
    ```shell
    podman machine set --cpus 2 --rootful
    podman machine start
    ```

4. Testing stopping Podman with 

    ```shell
    podman machine stop
    ```
   
5. Start the Minikube with the Podman [driver](https://minikube.sigs.k8s.io/docs/drivers/)

    ```shell
    minikube start --driver=podman
    ```
    if you get `kubelet is not running` error then try switching on [`systemd`](https://documentation.suse.com/sle-micro/6.0/html/Micro-systemd-basics/index.html)
    ```shell
    minikube delete --all
    minikube start --force-systemd --driver=podman
    ```

6. Bring up Minikube dashboard using

   ```shell
   minikube dashboard
   ```

7. Install Kubernetes `kubetcl` command-line tool using. Note that `kubernetes-cli` and `kubectl` are the same thing?

   ```shell
   brew install kubectl
   ```

8. Install Helm using
   ```shell
   brew install helm
   ```
9. Add the HashiCorp Helm repository.:
   ```shell
   helm repo add hashicorp https://helm.releases.hashicorp.com
   ```
10. Update the Helm repos to make sure aware Helm is aware of latest versions:

   ```shell
   helm repo update
   ```

11. Search for For Vault in charts:
   ```shell
   helm search repo hashicorp/vault
   ```

12. 

13. Install [Rancher](https://www.rancher.com/products/rancher-desktop)

