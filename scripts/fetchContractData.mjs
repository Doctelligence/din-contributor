import fs from "fs";
import path from "path";

const VERSION = "v0.1.0";

// const DINManagerModule = "DINManagerModule#DINManager";
// const MockERC20Module = "MockERC20Module#MockERC20";

const __dirname = path.resolve(path.dirname(''));

if (!fs.existsSync(path.join(__dirname, 'temp'))) {
  fs.mkdirSync(path.join(__dirname, 'temp'));
}

async function main() {
  const [
    deployedAddressesResponse,
    DINManagerModuleResponse,
    MockERC20ModuleResponse,
  ] = await Promise.all((await Promise.all([
    fetch(`https://raw.githubusercontent.com/Doctelligence/DIN-Prototype/refs/tags/${VERSION}/ignition/deployments/chain-11155111/deployed_addresses.json`),
    fetch(`https://raw.githubusercontent.com/Doctelligence/DIN-Prototype/refs/tags/${VERSION}/ignition/deployments/chain-11155111/artifacts/DINManagerModule%23DINManager.json`),
    fetch(`https://raw.githubusercontent.com/Doctelligence/DIN-Prototype/refs/tags/${VERSION}/ignition/deployments/chain-11155111/artifacts/MockERC20Module%23MockERC20.json`)
  ])).map(response => response.json()));

  console.log(path.join(__dirname, 'temp', 'DINManager.json'));

  fs.writeFileSync(path.join(__dirname, 'temp', 'DINManager.json'), JSON.stringify(DINManagerModuleResponse, null, 2));
  fs.writeFileSync(path.join(__dirname, 'temp', 'MockERC20.json'), JSON.stringify(MockERC20ModuleResponse, null, 2));
  fs.writeFileSync(path.join(__dirname, 'temp', 'deployed_addresses.json'), JSON.stringify(deployedAddressesResponse, null, 2));
}

main();
