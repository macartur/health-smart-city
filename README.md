# README

## Development environment

To facilitate the development environment setup, we provide a Vagrantfile that
automates all the configuration. You need to have the softwares below installed
in your PC:

* Virtualbox
* Vagrant

When you have both of them installed you just need to run the command below:

```bash
$ vagrant up --provider=virtualbox
```

Now you are able to login into the virtual machine and work there. To login run:

```bash
$ vagrant ssh
```

The application source code is shared with the virtual machine, you can see it
in /vagrant directory. To run application execute the commands below:

```bash
$ cd /vagrant
$ bundle exec rails s
```

After that you are able to access it via http://localhost:3000 in your host
machine.
