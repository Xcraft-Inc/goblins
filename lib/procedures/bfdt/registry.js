const path = require('path');
const fs = require('fs/promises');

async function findExecutable(exe) {
  const envPath = process.env.PATH || '';
  const pathDirs = envPath
    .replace(/["]+/g, '')
    .split(path.delimiter)
    .filter(Boolean);

  const candidates = pathDirs.map((d) => path.join(d, exe));
  try {
    return (await Promise.all(candidates.map(checkFileExists))).some(Boolean);
  } catch (e) {
    return false;
  }

  async function checkFileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = {
  '21.10': async function (codename, os) {
    let dockerCompose = 'docker-compose';
    try {
      console.log(`Looking for ${dockerCompose} in path...`);
      const hasDockerCompose = await findExecutable(dockerCompose);
      if (!hasDockerCompose) {
        console.error(
          `${dockerCompose} not in path... please review ${codename}`
        );
        return;
      }
      console.log(`found!`);
      const {workingDir} = require('../../treePaths.js');
      console.log(`create docker-compose.yml in ${workingDir}`);
      const {cp} = require('xcraft-core-fs');
      cp(
        path.join(__dirname, '/stuff/docker-compose.yml'),
        path.join(workingDir, 'docker-compose.yml')
      );
      const spawnSync = require('child_process').spawnSync;
      spawnSync('docker-compose', ['up', '-d'], {
        cwd: workingDir,
        shell: true,
      });
    } catch (ex) {
      console.log(`oops, ${ex} 
      ${codename} failed`);
    }
  },
};
