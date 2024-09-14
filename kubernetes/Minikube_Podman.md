### Running Minikube with Podman & Rancher

#### Reading
- [Podman And Minikube](https://loopednetwork.medium.com/podman-and-minikube-a31069f2be7d)
- [Ranch your Minikube](https://0to1.nl/post/minikube-m1-rancher/)


1. Initialize and configure a virtual machine (VM) that can run container workloads using:

    ```shell
    podman machine init
    ```

2. Start the VM using
    ```shell
    podman machine start
    ```
    or 
    ```shell
    podman machine set --cpus 2 --rootful
    podman machine start
    ```

3. Testing stopping Podman with 

    ```shell
    podman machine stop
    ```
   
4. Start the Minikube with the Podman [driver](https://minikube.sigs.k8s.io/docs/drivers/)
    ```shell
    minikube start --driver=podman
    ```
  if you get `kubelet is not running` error then try switching on [`systemd`](https://documentation.suse.com/sle-micro/6.0/html/Micro-systemd-basics/index.html)

   ```shell
   minikube delete --all
   minikube start --force-systemd --driver=podman
   ```


5. Install [Rancher](https://www.rancher.com/products/rancher-desktop)

