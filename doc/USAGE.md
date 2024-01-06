# Usage and use cases

## 1.0 Creating a new website
How are the following steps to create a new site `example.com`
1. Directory for site (See 1.1)
2. Website source code (See 1.2)
3. Start script (See 1.3)
4. Service file (See 1.4)
5. Nginx config file (See 1.5)
`
### 1.1 Directory for site
All websites have their own directory in `sites/`.
To create/add a new website `example.com`:
```bash
mkdir sites/example.com
```

### 1.2 Website source code
Source code for websites writtin in `www/` within that website's directory.
To create/add source code directory for website `example.com`:
```bash
mkdir sites/example.com/www
```

### 1.3 Start script
To begin hosting of a website, a start up script called `start.sh` must be created with that website's directory.
This startup script should begin hosting the website on its given framework.
To create/add startup script for a new website `example.com`:
```bash
touch sites/example.com/start.sh
```

### 1.4 Service file
Each website should have its own service file to hanlde starting, stoping and restarting the website.
This service file is up to the users configuration.
To create/add a service file for a new website `example.com`:
```bash
touch sites/example.com/example.com.service
```

### 1.5 Nginx config file
For a website to be accessible externally, a nginx file must be configured for that website in `nginx/sites-available/`.
To create/add a nginx config for a new website `example.com`:
```bash
touch nginx/sites-available/example.com.conf
```
For this config to be enabled, create a symbolic link of the config file to `nginx/sites-enabled/`.
Enabling the nginx config for a new website `example.com`:
```bash
ln -s nginx/sites-available/example.com.conf nginx/sites-enabled/
```

