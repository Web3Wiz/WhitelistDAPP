const {ethers} = require('hardhat');

async function main() {

  //Deploy the contract
  const contractInstance = await ethers.getContractFactory('Whitelist');
  const contractDeploy   = await contractInstance.deploy(10);
  await contractDeploy.deployed();

  //Print contract address
  console.log("Whitelist contract address is", contractDeploy.address);

}

main()
      .then(()=> process.exit(0))
      .catch((err)=> {console.error(err); process.exit(1)});
      