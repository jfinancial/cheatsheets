## Setting Up MiniKube

- [MiniKube](https://minikube.sigs.k8s.io/docs/start/) is a one node cluster where master and worker processes run on the same node
- MiniKube has a Docker runtime installed and MinikKube createa a virtual box using hypervisor
- As we need to talk to the API Server via UI, API or CLI and in the case of MiniKube we have a CLI in the form of [**kubectl**](https://kubernetes.io/docs/reference/kubectl/). Note that **kubectl** is not just a CLI for MiniKube but can be used to talk to an on prem or cloud-based Kubernetes cluster 

### What is a hypervisor?
A hypervisor, also known as a virtual machine monitor (VMM), is software or firmware that creates and manages virtual machines (VMs) on a physical computer. It enables the simultaneous execution of multiple guest operating systems on a single host machine by abstracting the underlying hardware and providing a virtualized environment for each guest. The main role of a hypervisor is to allocate and manage the host's physical resources (such as CPU, memory, disk, and network) among the virtual machines. Each VM operates as if it has its own dedicated hardware, unaware of other VMs running on the same host. There are two primary types of hypervisors:

  - **Type 1 Hypervisor (Bare-metal Hypervisor)**: Type 1 hypervisor runs directly on the host's hardware without the need for a separate operating system. It provides direct access to hardware resources, making it more efficient and suitable for enterprise-level virtualization. Examples of Type 1 hypervisors include VMware ESXi, Microsoft Hyper-V (when installed on bare metal), and KVM (Kernel-based Virtual Machine).
  - **Type 2 Hypervisor (Hosted Hypervisor)**: Type 2 hypervisor runs on top of a host operating system. It relies on the host OS for hardware access, making it less efficient than Type 1 hypervisors but easier to set up and use for personal or development purposes. Examples of Type 2 hypervisors include VMware Workstation, Oracle VirtualBox, and Parallels Desktop.


### Installing and Starting Minikubeon a Mac
- Install [hyperkit](https://minikube.sigs.k8s.io/docs/drivers/hyperkit/) as a hypervisor using `brew install hyperkit`
- You will see with `hyperkit` it also installs `kubecli` (you will see `kubernetes-cli`)
- Now do `minibube start --vm-driver=hyperkit`
- You can now do `minikube get nodes` and minikube should show one node with status `Ready`

### 
| set                                  | command                                                       | description                                                                                                        |
|--------------------------------------|---------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| Creating cluster                     | `minikube start --vm-driver=hyperkit`                         | Start minikube using hyperkit                                                                                      |  
|                                      | `kubectl get nodes`                                           |                                                                                                                    |  
|                                      | `minikube status`                                             |                                                                                                                    | 
|                                      | `kubectl version`                                             |                                                                                                                    | 
| Delete/restart cluster in debug mode | `minikube delete`                                             |                                                                                                                    |
|                                      | `minikube start --vm-driver=hyperkit --v=7 --alsologtostderr` |                                                                                                                    |
|                                      | `minikube status`                                             |                                                                                                                    |
| kubectl commands                     | `kubectl get nodes`                                           |                                                                                                                    | 
|                                      | `kubectl get pod`                                             |                                                                                                                    |
|                                      | `kubectl get services`                                        |                                                                                                                    | 
|                                      | `kubectl create deployment nginx-depl --image=nginx`          |                                                                                                                    | 
|                                      | `kubectl get deployment`                                      |                                                                                                                    |
|                                      | `kubectl get replicaset`                                      |                                                                                                                    |
|                                      | `kubectl edit deployment nginx-depl`                          |                                                                                                                    | 
| Debugging                            | `kubectl logs {pod-name}`                                     |                                                                                                                    |
|                                      | `kubectl exec -it {pod-name} -- bin/bash`                     |                                                                                                                    | 
| Creating mongo deployment            | `kubectl create deployment mongo-depl --image=mongo`          |                                                                                                                    |
|                                      | `kubectl logs mongo-depl-{pod-name}`                          |                                                                                                                    |
|                                      | `kubectl describe pod mongo-depl-{pod-name}`                  |                                                                                                                    | 
| Deleting deplyoment                  | `kubectl delete deployment mongo-depl`                        |                                                                                                                    |
|                                      | `kubectl delete deployment nginx-depl`                        |                                                                                                                    |
| Create or edit config file           | `vim nginx-deployment.yaml`                                   |                                                                                                                    |
|                                      | `kubectl apply -f nginx-deployment.yaml`                      |                                                                                                                    |
|                                      | `kubectl get pod`                                             |                                                                                                                    |
|                                      | `kubectl get deployment`                                      |                                                                                                                    | 
| Delete with config                   | `kubectl delete -f nginx-deployment.yaml`                     |                                                                                                                    |
| Metrics                              | `kubectl top`                                                 | Returns current CPU and memory usage for a cluster’s pods or nodes, or for a particular pod or node if specified.  |
