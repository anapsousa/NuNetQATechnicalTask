# NuNetQATechnicalTask
Technical take-home task for the QA Role

How to install

Start by adding Homebrew to your Mac/Windows machine by using this command line

```/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" ```


After it has successfully installed, use it to install the npm package by

```brew install npm ```


Finally install TS-node so you can easily run/use the code I’ve written

```npm install -g ts-node ```


Next up, install docker (you can follow the instructions here: https://docs.docker.com/get-started/get-docker/ )

```docker compose watch ```

You will then be able to see the docker images in your container. Go check it out. As you can see there’s 3 nodes running simultaneously that represent nodes of a small network.

```docker run -v $(pwd):/app -w /app node:latest node ping_scripts.ts ```

If you don't have it locally, you should add Cucumber to be able to understand and run the tests. Here's what you should install for this particular case of testing: 

Install Dependencies: Install Cucumber.js and TypeScript:

```npm install --save-dev @cucumber/cucumber typescript ts-node```
```npm install @cucumber/cucumber @types/node typescript```


Run Tests: 
Open a terminal and run the docker containers: 

```docker compose down && docker compose up --build ```

Execute the tests in another terminal using the following command:

```npx cucumber-js```


