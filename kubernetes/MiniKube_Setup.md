## Setting Up Minikube

- [Minikube](https://minikube.sigs.k8s.io/docs/start/) is a one node cluster where master and worker processes run on the same node
- Minikube has a Docker runtime installed and MinikKube createa a virtual box using hypervisor
- As we need to talk to the API Server via UI, API or CLI and in the case of Minikube we have a CLI in the form of [**kubectl**](https://kubernetes.io/docs/reference/kubectl/). Note that **kubectl** is not just a CLI for Minikube but can be used to talk to an on prem or cloud-based Kubernetes cluster 

### What Is A hypervisor?
A hypervisor, also known as a virtual machine monitor (VMM), is software or firmware that creates and manages virtual machines (VMs) on a physical computer. It enables the simultaneous execution of multiple guest operating systems on a single host machine by abstracting the underlying hardware and providing a virtualized environment for each guest. The main role of a hypervisor is to allocate and manage the host's physical resources (such as CPU, memory, disk, and network) among the virtual machines. Each VM operates as if it has its own dedicated hardware, unaware of other VMs running on the same host. There are two primary types of hypervisors:

  - **Type 1 Hypervisor (Bare-metal Hypervisor)**: Type 1 hypervisor runs directly on the host's hardware without the need for a separate operating system. It provides direct access to hardware resources, making it more efficient and suitable for enterprise-level virtualization. Examples of Type 1 hypervisors include VMware ESXi, Microsoft Hyper-V (when installed on bare metal), and KVM (Kernel-based Virtual Machine).
  - **Type 2 Hypervisor (Hosted Hypervisor)**: Type 2 hypervisor runs on top of a host operating system. It relies on the host OS for hardware access, making it less efficient than Type 1 hypervisors but easier to set up and use for personal or development purposes. Examples of Type 2 hypervisors include VMware Workstation, Oracle VirtualBox, and Parallels Desktop.


### Installing And Starting Minikube On A Mac
- Install [hyperkit](https://minikube.sigs.k8s.io/docs/drivers/hyperkit/) as a hypervisor using `brew install hyperkit`
- You will see with `hyperkit` it also installs `kubecli` (you will see `kubernetes-cli`)
- Now do `minibube start --vm-driver=hyperkit`
- You can now do `minikube get nodes` and minikube should show one node with status `Ready`

### Kubectl Commands
| set                                  | command                                                       | description                                                                                                       |
|--------------------------------------|---------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| Creating cluster                     | `minikube start --vm-driver=hyperkit`                         | Start Minikube using hyperkit                                                                                     |  
|                                      | `minikube status`                                             |                                                                                                                   | 
|                                      | `kubectl version`                                             |                                                                                                                   | 
| Delete/restart cluster in debug mode | `minikube delete`                                             |                                                                                                                   |
|                                      | `minikube start --vm-driver=hyperkit --v=7 --alsologtostderr` |                                                                                                                   |
|                                      | `minikube status`                                             |                                                                                                                   |
| kubectl commands                     | `kubectl get nodes`                                           | Get the status of the nodes                                                                                       | 
|                                      | `kubectl get pod`                                             |                                                                                                                   |
|                                      | `kubectl get services`                                        |                                                                                                                   | 
|                                      | `kubectl create deployment nginx-depl --image=nginx`          | An example of the most minimal creation of a Nginx Deployment (i.e. the bluepring for creating pods)              | 
|                                      | `kubectl get deployment`                                      |                                                                                                                   |
|                                      | `kubectl get replicaset`                                      | Show the state of replicaset                                                                                      |
|                                      | `kubectl edit deployment nginx-depl`                          | Edit the Deployment configuration of our deployment "nginx-depl"                                                  | 
| Debugging                            | `kubectl logs {pod-name}`                                     | Examine the application logs of the pod                                                                           |
|                                      | `kubectl exec -it {pod-name} -- bin/bash`                     | Get an interactive terminal of the container                                                                      | 
| Creating mongo deployment            | `kubectl create deployment mongo-depl --image=mongo`          | An example of the most minimal creation of a MongoDB Deployment (i.e. the bluepring for creating pods)            |
|                                      | `kubectl logs mongo-depl-{pod-name}`                          |                                                                                                                   |
|                                      | `kubectl describe pod mongo-depl-{pod-name}`                  | Get more information on the pod (e.g. showing state changes)                                                      | 
| Deleting deployment                  | `kubectl delete deployment mongo-depl`                        | Deleting the deployment will also terminate the pods                                                              |
| Create or edit config file           | `vim nginx-deployment.yaml`                                   |                                                                                                                   |
|                                      | `kubectl apply -f nginx-deployment.yaml`                      | Applies the configuration file for a Deployement                                                                  |
|                                      | `kubectl get pod`                                             |                                                                                                                   |
|                                      | `kubectl get deployment`                                      |                                                                                                                   | 
| Delete with config                   | `kubectl delete -f nginx-deployment.yaml`                     |                                                                                                                   |
| Metrics                              | `kubectl top`                                                 | Returns current CPU and memory usage for a cluster’s pods or nodes, or for a particular pod or node if specified. |


### Overview of Basic Deployment Configuration

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.16
        ports:
        - containerPort: 8080

```

