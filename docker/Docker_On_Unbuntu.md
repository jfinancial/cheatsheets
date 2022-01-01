# Docker On Unbuntu 

### Controlling Docker with `systemd`

https://docs.docker.com/config/daemon/systemd/

### Running `docker-compose` in the background

`docker-compose up -d`

### Restart Policy

https://docs.docker.com/config/containers/start-containers-automatically/

### Fixing Permissions For Users To Run Docker

When we see this error then we have not set permissionf for the user properly

`Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get http://%2Fvar%2Frun%2Fdocker.sock/v1.40/containers/json: dial unix /var/run/docker.sock: connect: permission denied`

See official documentation for [Managing Docker As A Non Root User](https://docs.docker.com/install/linux/linux-postinstall/#manage-docker-as-a-non-root-user)

To create the docker group and add your user:

Create the docker group => `sudo groupadd docker`

Add your user to the docker group => `sudo usermod -aG docker ${USER}`
Y
ou would need to loog out and log back in so that your group membership is re-evaluated or type the following command:

`su -s ${USER}`

Verify that you can run docker commands without sudo using hello-world (whichd downloads a test image, runs it and prints a message and exits.)

`docker run hello-world`

If you initially ran Docker CLI commands using sudo before adding your user to the docker group, you may see the following error, which indicates that your ~/.docker/ directory was created with incorrect permissions due to the sudo commands.

aWARNING: Error loading config file: /home/user/.docker/config.json - stat /home/user/.docker/config.json: permission denied`

To fix this problem, either remove the ~/.docker/ directory (it is recreated automatically, but any custom settings are lost), or change its ownership and permissions using the following commands:

`sudo chown "$USER":"$USER" /home/"$USER"/.docker -R`

`sudo chmod g+rwx "$HOME/.docker" -R`
