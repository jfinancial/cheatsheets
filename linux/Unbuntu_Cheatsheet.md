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


### Creating a self-signed certificate: Create and register CA/Root cerificate

- See [ssl-certificate-authority-for-local-https-development](https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development)

Create the keys for your own certificate authority:

`openssl genrsa -des3 -out myCA.key 204`

Create a **root certificate** using:

`openssl req -x509 -new -nodes -key myCA.key -sha256 -days 1825 -out myCA.pem`

Convert the `.pem` file to `.crt` using:

`openssl x509 -in myCA.pem -inform PEM -out myCA.crt`

Now we have to install the root/CA Certificate. But first create a directory for extra CA certificates in `/usr/local/share/ca-certificates` and copy it into there:

```shell
sudo mkdir /usr/local/share/ca-certificates/extra`
sudo cp myCA.crt /usr/local/share/ca-certificates/myCA.crt
````
Let Ubuntu add the `.crt` file's path relative to `/usr/local/share/ca-certificates` to `/etc/ca-certificates.conf`:

`sudo dpkg-reconfigure ca-certificates`

Or to do this non-interactively, run:

`sudo update-ca-certificates`

You should see the following output and we can now created our own self-signed certificates:

```
Updating certificates in /etc/ssl/certs...
1 added, 0 removed; done.
```

### Creating a self-signed certificate: Creating CA-Signed Certificates for Your Dev Sites

Create a test key:

`openssl genrsa -out hellfish.test.key 2048`

..then create a CSR (Certicate Signing Request):

`openssl req -new -key hellfish.test.key -out hellfish.test.csr`

Finally, we’ll create an [X509](https://en.wikipedia.org/wiki/X.509) V3 certificate extension config file, which is used to define the [Subject Alternative Name (SAN)](https://www.entrust.com/blog/2019/03/what-is-a-san-and-how-is-it-used/) for the certificate. 

In our case, we’ll create a configuration file called `hellfish.test.ext` containing the following text:

```shell
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = hellfish.test
```

Now we run the command to create our certificate using our key:

`sudo openssl x509 -req -in hellfish.test.csr -CA myCA.pem -CAkey myCA.key -CAcreateserial -out hellfish.test.crt -days 825 -sha256 -extfile hellfish.test.ext`

We can do this as a shell script;

```shell
#!/bin/sh

if [ "$#" -ne 1 ]
then
  echo "Usage: Must supply a domain"
  exit 1
fi

DOMAIN=$1

cd ~/certs

openssl genrsa -out $DOMAIN.key 2048
openssl req -new -key $DOMAIN.key -out $DOMAIN.csr

cat > $DOMAIN.ext << EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = $DOMAIN
EOF

sudo openssl x509 -req -in $DOMAIN.csr -CA ../myCA.pem -CAkey ../myCA.key -CAcreateserial \
-out $DOMAIN.crt -days 825 -sha256 -extfile $DOMAIN.ext
```

If you’re using Apache, you’ll need to enable the Apache SSL mod, and configure an Apache virtual host for port `443` for the local site. It will require you to add the SSLEngine, SSLCertificateFile, and SSLCertificateKeyFile directives, and point the last two to the certificate and key file you just created:

```xml
<VirtualHost *:443>
   ServerName hellfish.test
   DocumentRoot /var/www/hellfish-test

   SSLEngine on
   SSLCertificateFile /path/to/certs/hellfish.test.crt
   SSLCertificateKeyFile /path/to/certs/hellfish.test.key
</VirtualHost>
```


### Creating a Self-signed Certificate For Apache

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



## Java `keytool -import` to Import a Certificate into a Public Keystore

Assuming that you've been given a certificate file named `certfile.cer` which contains an alias named `foo`, you can import it into a public keystore named `publicKey.store` with the following keytool import command:
```shell
keytool -import -alias foo -file certfile.cer -keystore publicKey.store
```
This import command can be read as:

- Read from the certfile file named `certfile.cer`
- Look in that file for an alias named `foo`
- If you find the alias `foo`, import the information into the keystore named `publicKey.store`.

Note: The file `publicKey.store` may already exist, in which case the public key for `foo` will be added to that keystore file; otherwise, publicKey.store will be created.
