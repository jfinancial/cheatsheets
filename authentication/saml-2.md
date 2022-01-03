## SAML 2.0

### Downsides of Custom Authentication Architecture

- User identity is duplicated (mulitple databases per application; **no common identity**)
- User has to remember too many passwords (no single password for all applications)
- Application is resposible for user provisioning
- No single sign-on
- Application responsible for MFA (multi factor authentication)
- Credentials are sent to application (security risk since they can logged)

### Role of LDAP
- See [learn-about-ldap](https://ldap.com/learn-about-ldap/) and [ldap-tools](https://ldap.com/ldap-tools/)
- Directory service is used for machines, users and printers (e.g. ActiveDirectory) o provides a way of having a single place for users and roles
- LDAP is a protocol for accessing directory service
- Entities (User, Group) have their own attributes
- Top of LDAP hierarchy is domain component (e.g. `dc=mycompany`) and then organizational units which is like a directory (e.g. `ou=groups`,`ou=users`,`ou=printers`) and at the leaf is the entity which has a common name (e.g. `cn=bob`, `cn=ReadOnly`)
- Each attribute has a *distinguihed name* which is the fully qualified name of the attribute (e.g. `cn=bob,ou=users,dc=mycompany,dc=com`)
- An application can call the directory service via an LDAP library - port is 389 or TLS/SSL = 636 but protocal is TCP (not Rest) and encoding is [BER](https://en.wikipedia.org/wiki/X.690#BER_encoding)
- LDAP operations are: bind (authenticate user), search (search directories and retrieve entities), add, delete, modify and unbind (close the connection)
- Using LDAP our application talks to the directory service using encryption via port tcp/636 so directory service is now responsible for user provisioning
- Downsides: 
  - No delegated authentication
  - Can't use in cloud architectures because this would mean opening firewall between cloud and enterprise
  - Applications and LDAP server must be on same domain
  - No single sign-on
  - Application still responsible for MFA
  - Credentials still sent to the application (so can be logged)

###LDAP and Delegated Authentication
- With *delegated authentication* the application gets out of the way of authentication altogether
- The application redirects (via HTTP post or redirect) the request to an Identity Management System (IMS) which manages authentication
- We are not sending the credentials to the application (much more secure) and they don't need to exist in same domain
- There must be trust between web application and the IMS - the application sends the request using the IMS's public key and signs it using application's private key; IDM will verify the signature using the applications public key decrypt the request using the IDM's private key

### SAML 2.0 Flows
