## Helm

### What is Helm?
- Consider a Helm a package manager (like brew or apt) for Kubernetes. The package in this case might be an application/service such as the [ELK stack](https://aws.amazon.com/what-is/elk-stack/)  which consists of various Kubernetes components (e.g. StatefulSet, ConfigMap, Secret K8s user with permissions, Services)
- It makes sense that someone packages up a standard deployment and then allows other to reuse this packaging and this bundle of YAML files is known as a [Helm Chart](https://helm.sh/docs/topics/charts/)
- Charts are made available to other by pushing the chart to a chart repository (so think of this as the Helm equivalent of [Docker Hub](https://hub.docker.com/))
- Helm is also a **templating engine** so you can define a common blueprint for microservices in a template film where placeholders (e.g. `{{ Values.container.name }}`) get replaced from an external file called `values.yaml` (`Values` is an object that is created from the `values.yaml` and/or augmented by the )


### Helm Chart
A chart describing WordPress would be stored in a `wordpress/` directory. Inside of this directory, Helm will expect a structure that matches this:
```shell
wordpress/
  Chart.yaml          # A YAML file containing information about the chart
  LICENSE             # OPTIONAL: A plain text file containing the license for the chart
  README.md           # OPTIONAL: A human-readable README file
  values.yaml         # The default configuration values for this chart
  values.schema.json  # OPTIONAL: A JSON Schema for imposing a structure on the values.yaml file
  charts/             # A directory containing any charts upon which this chart depends.
  crds/               # Custom Resource Definitions
  templates/          # A directory of templates that, when combined with values,
                      # will generate valid Kubernetes manifest files.
  templates/NOTES.txt # OPTIONAL: A plain text file containing short usage notes

```
