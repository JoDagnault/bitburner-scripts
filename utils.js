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