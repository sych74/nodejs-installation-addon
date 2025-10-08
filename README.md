<p align="center"> 
<img src="images/node.png" alt="Node.js and NPM Installer" width="100px">
</p>

# Node.js and NPM Installer Add-On

The **Node.js and NPM Installer** solution enables the integration of [Node.js](https://nodejs.org/en/), a cross-platform JavaScript runtime, into any certified container on the Virtuozzo Application Platform (VAP). Node.js installation provides access to the ***npm*** package ecosystem, one of the world's largest collections of open-source libraries. The add-on supports complex CI/CD workflows. For example, Node.js and NPM may be necessary for tasks involving static content or for building and running certain WordPress or web application modules.

Installation is possible on any certified container (except Node.js containers, where these tools are built-in) and allows selection of the preferred software version from the Node.js stacks available on the platform.


## Add-On Installation

To install Node.js and the NPM package manager for your VAP containers, you must be registered on one of the [Virtuozzo Public Cloud Providers](https://www.virtuozzo.com/application-platform-partners/).

1\. Log in to your Virtuozzo Application Platform dashboard. Then hover over the required container and click the **Add-Ons** icon.

![install Node.js add-on](images/01-install-nodejs-addon.png)

> Alternatively, you can deploy this solution from the [Marketplace](https://www.virtuozzo.com/application-platform-docs/marketplace/) or [import](https://www.virtuozzo.com/application-platform-docs/environment-import/) a manifest file from this repository.

2\. In the opened installation window, specify the following details:

- **Node.js Version** – select preferred stack version from the drop-down list
- **Environment** – select target environment for the add-on installation (automatically selected if accessed from *Add-Ons*)
- **Layer(s)** - select environment [layers](https://www.virtuozzo.com/application-platform-docs/concept-and-terminology/#layer) to install the add-on (you can choose multiple ones)

![Node.js installation window](images/02-nodejs-installation-window.png)

> **Note:** The list of available Node.js versions is automatically updated based on the latest versions supported by the Virtuozzo Application Platform. The **16.20.2** version is kept to support legacy containers (based on the CentOS 7 OS template) and cannot be installed on modern containers (based on the AlmaLinux 9 OS template).

3\. Click **Install** to proceed and wait a minute for the solution to be deployed.

![Node.js installed](images/03-nodejs-installed.png)

4\. To check if Node.js and NPM are available for your containers, you can connect via SSH (e.g., using [Web SSH](https://www.virtuozzo.com/application-platform-docs/web-ssh-client/)) and run the `npm version` command:

![Node.js version 24.8](images/04-npm-version-248.png)


## Manage Add-On

Once installed, the ***Node.js and NPM Installer*** add-on can be found under the appropriate node’s **Add-Ons** section. Here, you can **Change Node.js Version** and **Uninstall** the add-on.

![manage Node.js add-on](images/05-manage-nodejs-addon.png)

When changing the version, just pick a new one from the list, click **Apply**, and confirm the action via pop-up.

![change Node.js version](images/06-change-nodejs-version.png)

Once the add-on is reinstalled, you can check the new Node.js and NPM versions.

![Node.js version 24.9](images/07-npm-version-249.png)
