const { join } = require('path');
const { Menu, Tray, MenuItem } = require('electron');
const { Docker } = require('node-docker-api');

const assetsDirectory = join(__dirname, '..', 'assets');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

class DockyTrayMenu {
  static init() {
    const instance = new DockyTrayMenu();
    instance.render();
  }

  constructor() {
    this.tray = new Tray(join(assetsDirectory, 'iconTemplate.png'));
  }

  async containers() {
    const containers = await docker.container.list({ all: true });
    return containers.map((container) => new MenuItem({
      type: 'normal',
      label: ` ${container.data.Image}${container.data.Names.flat()}`,
      icon: join(assetsDirectory, `${container.data.State === 'running' ? 'online' : 'offline'}.png`),
      click: async () => {
        const isRunning = container.data.State === 'running';

        if (isRunning) {
          await container.stop();
        } else {
          await container.start();
        }

        this.render();
      },
    }));
  }

  async render() {
    const menu = Menu.buildFromTemplate([
      ...await this.containers(),
      { type: 'separator' },
      new MenuItem({
        label: ' Refresh',
        icon: join(assetsDirectory, 'refreshTemplate.png'),
        click: this.render.bind(this),
      }),
      new MenuItem({
        label: ' Quit Docky',
        icon: join(assetsDirectory, 'powerTemplate.png'),
        role: 'quit',
      }),
    ]);
    this.tray.setContextMenu(menu);
  }
}

module.exports = DockyTrayMenu;
