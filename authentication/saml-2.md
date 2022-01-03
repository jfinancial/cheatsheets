## SAML 2.0 (Security Assertion Markup Language)

- See [documentation](https://developer.okta.com/docs/concepts/saml/)

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

### LDAP and Delegated Authentication
- With *delegated authentication* the application gets out of the way of authentication altogether
- The application redirects (via HTTP post or redirect) the request to an Identity Access Management System (IAMS) which manages authentication
- We are not sending the credentials to the application (much more secure) and they don't need to exist in same domain
- There must be trust between web application and the IAMS - the application sends the request using the IAMS's public key and signs it using application's private key; IDM will verify the signature using the applications public key decrypt the request using the IDM's private key
- There are many Identity Management Systems (Okta, ADFS and Ping) which as well as supporting SAML support other formats e.g. OpenID Connect, directory services etc

### SAML 2.0 Basics and Jargon
- **Service Provider (SP)**: the service provider sits inside the application space and has a trust relationship with the IAMS this is also sometimes called the **Relying Party**
- **Identity Provider (IP)**: the service provider sits inside the IMS/IAMS space and has a trust relationship with the application/SP
- **Subject**: this is the user who is logging in
- **User Agent**: this is usually the browser (acting on behalf of the user)
- **Relay State**: where the user is redirected to after authentication
- **Protocol Bindings**: defines what forward mechanism to use (e.g. post or redirect)
- **Claims**: user attributees of group attributes
- **Assertion Consumer Service (ACS)**: this is the url which handles the SAML assertion 
- **Entity**: both the SP and IP are entities and have an `EntityID` associated with them - they be any string but they are usually URLs
- Two applications can be deployed in two different clouds but they have shared trust relationship with the same SAML IP so SSO is achieved

### SAML Flows
- Flows rely on SAML metadata which describes the SAML entity (SP or IP) which is optionally signed

- **SP Initiated Flow**
  - User attempt to go to application for first time (so no session ) 
  - Application forwards request to a well-defined SSO IP's SSO (defined in metadata), it replies with a 302 response code and adds the SAML request 
  - Identity provider receives identity request via http so IP shows a **login page** at which point identity is sent to Identity Provider to validate
  - If IDP authentication succeeds then IP send a SAML authentication response which includes all attributes of subject (user) and groups
  - This response is sent back to application's ACS which verifies the assertion (the assertion is also called the SAML token) and it verifies the token (e,g. signatures, has not expired)
  - If everything is already within the enterprise and the user has already logged in then LDAP authentication has taken place so SSO is achieved and this is completely transparent (i.e. user is recognised by SAML without credentials)

- **IP Initiated Flow**
  - Works if all applications integated with single SAML provider
  - User logs into application dashboard and IMS provides url for dashboard
  - Credentials get submitted to IDP 
  - User clicks on application in dashboard, IP creates a response XML with correct assertion
  - IDP forwards to Application via SP which verifies assertion
  - Redirect to home page of application

### Tools
- Download SAML Devtools extension for Chome
- Sign up to developer account with [Okta](https://developer.okta.com/signup/)
  - Create users and groups and then app integration and select SAML 2.0§
