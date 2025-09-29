const MIN_VERSION = '18.18.0';

function parse(version) {
  return version
    .replace(/^v/, '')
    .split('.')
    .map((part) => parseInt(part, 10));
}

function isVersionLess(current, minimum) {
  for (let index = 0; index < minimum.length; index += 1) {
    const currentPart = current[index] || 0;
    const minPart = minimum[index] || 0;

    if (currentPart > minPart) {
      return false;
    }

    if (currentPart < minPart) {
      return true;
    }
  }

  return false;
}

const currentVersion = parse(process.version);
const minimumVersion = parse(MIN_VERSION);

if (isVersionLess(currentVersion, minimumVersion)) {
  const versionMessage = `Node ${MIN_VERSION}+ es obligatorio para ejecutar Expo CLI sin el error "SyntaxError: Unexpected token '.'".`;
  const helpMessage = 'Actualiza Node usando nvm, nvm-windows, Volta o descarga el instalador oficial desde https://nodejs.org.';

  console.error('\n❌ Versión de Node incompatible detectada:', process.version);
  console.error(versionMessage);
  console.error(helpMessage);
  console.error('Una vez actualizado, reinstala las dependencias con "npm install".\n');
  process.exit(1);
}
