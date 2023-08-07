const hre = require("hardhat")

async function main() {
    console.log("Deploying Contract...")

    const SimpleStorage = await hre.ethers.deployContract("SimpleStorage")

    await SimpleStorage.waitForDeployment()

    console.log(`SimpleStorage deployed to ${SimpleStorage.target}`)
    if (
        hre.network.config.chainId === 11155111 &&
        process.env.ETHERSCAN_API_KEY
    ) {
        console.log("Waiting for block txes...")
        tx = await SimpleStorage.deploymentTransaction()
        await tx.wait(60)
        console.log(tx)
        await verify(SimpleStorage.target, [])
    }

    const currentValue = await SimpleStorage.retrieve()
    console.log(`Current Value is: ${currentValue}`)

    // Update the current value
    const transactionResponse = await SimpleStorage.store(7)
    await transactionResponse.wait(1)
    const updateValue = await SimpleStorage.retrieve()
    console.log(`Update Value is: ${updateValue}`)
}

async function verify(contractAddress, args) {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified")
        } else {
            console.log(e)
        }
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
