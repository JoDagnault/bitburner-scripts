/** Used to test function by running the script in the bitrunner terminal
 * @param {NS} ns **/
export const main = (ns) => {
    getRootAccess(ns, 'iron-gym')
}

/** Get a list of all hostnames (servers) on the network
 *  @param {NS} ns 
 *  @param {string} startingServer - The server from which scanning should start
 *  @return {Array} */
export const scanAllServers = (ns, startingServer = 'home') => {
    const visitedServers = [];

    const scanServer = (currentServer) => {
        visitedServers.push(currentServer);

        const nextNodes = ns.scan(currentServer);

        nextNodes.forEach((server) => {
            if (!visitedServers.includes(server)) {
                // Recursively scan the next server
                scanServer(server);
            }
        });
    };

    // Start scanning from the specified server
    scanServer(startingServer);

    return visitedServers;
};

/**
 * Attempt to gain root access to the target server.
 * @param {NS} ns - The Bitburner namespace
 * @param {string} targetServer - The target server to gain root access
 * @return {boolean} - True if root access gained, false otherwise
 */
export const getRootAccess = (ns, targetServer) => {

    // Check if the server already has root access
    if (ns.hasRootAccess(targetServer)) {
        ns.print(`${targetServer} already has root access.`);
        return true;
    }

    const portsRequired = ns.getServerNumPortsRequired(targetServer);

    const programMap = {
        "BruteSSH.exe": ns.brutessh,
        "FTPCrack.exe": ns.ftpcrack,
        "relaySMTP.exe": ns.relaysmtp,
        "HTTPWorm.exe": ns.httpworm,
        "SQLInject.exe": ns.sqlinject
    };

    const programsRequired = [];

    // Populate programsRequired array based on the number of ports required
    for (const [, program] of Object.entries(programMap)) {
        if (programsRequired.length < portsRequired) {
            programsRequired.push(program);
        } else {
            break;
        }
    }

    // Attempt to execute each required program to gain root access
    try {
        programsRequired.forEach(program => program(targetServer));

        ns.print(`Root access gained on ${targetServer}.`);
        return true;
    } catch (e) {
    }

    // Log unsupported ports message
    ns.print(`Unsupported number of ports (${portsRequired}) required for ${targetServer}.`);
    return false;
};