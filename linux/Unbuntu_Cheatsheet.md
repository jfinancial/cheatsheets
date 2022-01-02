# Unbuntu Linux Cheatsheet

### Installing Bind for DNS

See Unbuntu documention for [DNS](https://ubuntu.com/server/docs/service-domain-name-service-dns)

`sudo apt install bind9`
`sudo apt install dnsutils`

..then edit `/etc/bind/named.conf.option` and add nameservers. Namecheap's [name servers](https://www.namecheap.com/support/knowledgebase/article.aspx/9434/10/using-default-nameservers-vs-hosting-nameservers/) are:
```shell
dns1.registrar-servers.com
dns2.registrar-servers.com
````

### Creating an SSH key for GitHub

- See [generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
- Create the key pair => `ssh-keygen -t ed25519 -C "john.edwards@jfinancial.co.uk"`
- Add the key to the ssh-agent => `ssh-add -K ~/.ssh/id_ed25519`
- Add to `~/.ssh/config`

```shell
Host *
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519
```
- Add to GitHub => [adding-a-new-ssh-key-to-your-github-account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)


### Adding User to Suoders

- In supported versions of Ubuntu, using the sudo command will grant elevated permissions for 15 minutes
- See [how-to-create-sudo-user-on-ubuntu](https://phoenixnap.com/kb/how-to-create-sudo-user-on-ubuntu)
- You need to add user to sudo group - `-aG` option tells the system to append the user to the specified group:

    `usermod -aG sudo newuser`

  ...if you get an error then try with `sudo`:

    `sudo usermod -aG sudo newuser`

### Stop Chrome redirecting to HTTPS

- See [stop-chrome-from-automatically-redirecting-https](https://howchoo.com/chrome/stop-chrome-from-automatically-redirecting-https)
- Go to "HSTS Settings" in Chrome Internals using `chrome://net-internals/#hsts`
-  Delete domain security policies for the domain
-  Visit the website to test

### Installing Cockpit

- See [Instrucions for Unbuntu](https://cockpit-project.org/running.html#ubuntu)
- To install use `sudo apt install cockpit`
- Enable cockpit `sudo systemctl enable --now cockpit.socket`
- Open firewall if necessary:
```shell
sudo firewall-cmd --add-service=cockpit
sudo firewall-cmd --add-service=cockpit --permanent
```

### Creating a self-signed certfiiate

See [how-to-create-a-self-signed-ssl-certificate-for-apache-in-ubuntu-16-04](https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-apache-in-ubuntu-16-04)

We can create a self-signed key and certificate pair with OpenSSL in a single command:

`sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/apache-selfsigned.key -out /etc/ssl/certs/apache-selfsigned.crt`

You will be asked a series of questions. Before we go over that, let’s take a look at what is happening in the command we are issuing:

`openssl`: This is the basic command line tool for creating and managing OpenSSL certificates, keys, and other files.
req: This subcommand specifies that we want to use X.509 certificate signing request (CSR) management. The “X.509” is a public key infrastructure standard that SSL and TLS adheres to for its key and certificate management. We want to create a new X.509 cert, so we are using this subcommand.

`-x509`: This further modifies the previous subcommand by telling the utility that we want to make a self-signed certificate instead of generating a certificate signing request, as would normally happen.

`-nodes`: This tells OpenSSL to skip the option to secure our certificate with a passphrase. We need Apache to be able to read the file, without user intervention, when the server starts up. A passphrase would prevent this from happening because we would have to enter it after every restart.

`-days 365`: This option sets the length of time that the certificate will be considered valid. We set it for one year here.

`-newkey rsa:2048`: This specifies that we want to generate a new certificate and a new key at the same time. We did not create the key that is required to sign the certificate in a previous step, so we need to create it along with the certificate. The rsa:2048 portion tells it to make an RSA key that is 2048 bits long.

`-keyout`: This line tells OpenSSL where to place the generated private key file that we are creating.

`-out`: This tells OpenSSL where to place the certificate that we are creating.

These options will create both a key file and a certificate. We will be asked a few questions about our server in order to embed the information correctly in the certificate.

Fill out the prompts appropriately. **The most important line is the one that requests the Common Name (e.g. server FQDN or YOUR name). You need to enter the domain name associated with your server or, more likely, your server’s public IP address.**

While we are using OpenSSL, we should also create a strong [Diffie-Hellman](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange) group, which is used in negotiating Perfect Forward Secrecy with clients.

We can do this (creating a [.pem](https://www.cloudsavvyit.com/1727/what-is-a-pem-file-and-how-do-you-use-it/) file)  by typing :

`sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048`

##Enabling SSL at home

Can use [Let's Encrypt](https://letsencrypt.org/) and...
Either use [Certbot](https://eff-certbot.readthedocs.io/en/stable/index.html) for which there is a [docker image](https://hub.docker.com/r/certbot/certbot/) - se [running using docker](https://eff-certbot.readthedocs.io/en/stable/install.html#running-with-docker)

- See [how-to-create-let-s-encrypt-wildcard-certificates-with-certbot](https://www.digitalocean.com/community/tutorials/)
- See [how-to-secure-apache-with-let-s-encrypt-on-ubuntu-18-04](https://www.digitalocean.com/community/tutorials/how-to-secure-apache-with-let-s-encrypt-on-ubuntu-18-04)
- See [generate-wildcard-ssl-certificate-using-lets-encrypt-certbot](https://medium.com/@saurabh6790/generate-wildcard-ssl-certificate-using-lets-encrypt-certbot-273e432794d7)
- See [add-wildcard-lets-encrypt-certifications-with-namecheap](https://medium.com/@cubxi/add-wildcard-lets-encrypt-certifications-with-namecheap-6a466df0886f)

Or use another approach 

- See [enabling-ssl-in-your-local-network](https://anteru.net/blog/2020/enabling-ssl-in-your-local-network/)

## Using Cerbot
- See [Certbot instructions](https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal)
- Certbot can be retrieved by api (`apt-get install letsencrypt`) or via the `certbert-auto` script but officially Snap is preferred so to use Snap and if so remove from apt (`sudo apt-get remove certbot`)

```shell
sudo snap install core
sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot ##check it exists
sudo snap set certbot trust-plugin-with-root=ok
sudo snap install certbot-dns-namecheap #..or plugin for DNS provider of choice
```

- ...then using the command:

```shell
./certbot certonly --manual \ 
                        --preferred-challenges=dns \
                        —-email saurabh@erpnext.com \
                        —-server https://acme-v02.api.letsencrypt.org/directory \
                        —-agree-tos -d *.erpnext.xyz
```

`certonly`: Obtain or renew a certificate, do not install it
`--manual`: Obtain certificates interactively or using shell script hooks
`--preferred-challenges`: "dns" to authenticate domain ownership
`--sever`: specify endpoint to generate wildcard certificate. Currently only `acme-v02` supports
`agree-tos`: Agree to ACME server's Subscriber Agreement
`-d`: domain name
