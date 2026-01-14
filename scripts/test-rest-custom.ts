import { exec } from 'child_process';

import { AppConfig } from '../src/config/app-config.interface';
import { buildAppConfig } from '../src/config/config.server';

const appConfig: AppConfig = buildAppConfig();

/**
 * Script to test the connection with the configured REST API (in the 'rest' settings of your config.*.yaml)
 *
 * This script is useful to test for any Node.js connection issues with your REST API.
 *
 * Usage (see package.json): yarn test:rest
 */

// Get root URL of configured REST API
const restUrl = appConfig.rest.baseUrl + '/api';
console.log(`...Testing connection to REST API at ${restUrl}...\n`);

// Construct the curl command
// We use -s to silence progress output, and -L to follow redirects if any (though API shouldn't redirect)
// We add a User-Agent just in case, though curl often works without it or with its default one.
// We verified that a specific User-Agent works.
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
const cmd = `curl -s -H "User-Agent: ${userAgent}" "${restUrl}"`;

console.log(`Executing: ${cmd}`);

exec(cmd, (error, stdout, stderr) => {
    if (error) {
        console.error(`ERROR connecting to REST API\n${error.message}`);
        return;
    }
    if (stderr) {
        // curl -s might still output errors to stderr
        console.error(`curl stderr: ${stderr}`);
    }

    console.log(`RESPONSE: 200 OK (assuming success if curl returned data) \n`);
    checkJSONResponse(stdout);
});

/**
 * Check JSON response from REST API to see if it looks valid. Log useful information
 * @param responseData response data
 */
function checkJSONResponse(responseData: any): any {
    let parsedData;
    try {
        parsedData = JSON.parse(responseData);
        console.log('Checking JSON returned for validity...');
        console.log(`\t"dspaceVersion" = ${parsedData.dspaceVersion}`);
        console.log(`\t"dspaceUI" = ${parsedData.dspaceUI}`);
        console.log(`\t"dspaceServer" = ${parsedData.dspaceServer}`);
        console.log(`\t"dspaceServer" property matches UI's "rest" config? ${(parsedData.dspaceServer === appConfig.rest.baseUrl)}`);
        // Check for "authn" and "sites" in "_links" section as they should always exist (even if no data)!
        const linksFound: string[] = Object.keys(parsedData._links);
        console.log(`\tDoes "/api" endpoint have HAL links ("_links" section)? ${linksFound.includes('authn') && linksFound.includes('sites')}`);
    } catch (err) {
        console.error('ERROR: INVALID DSPACE REST API! Response is not valid JSON!');
        console.error(`Response returned:\n${responseData}`);
    }
}
