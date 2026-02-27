const bcrypt = require('bcryptjs');
const fs = require('fs');

async function run() {
    let output = '';
    const log = (msg) => { output += msg + '\n'; console.log(msg); };

    log('--- Auth Diagnostic V2 ---');
    const pass = 'Password123!';
    log(`Test Password: ${pass}`);

    try {
        const salt = await bcrypt.genSalt(10);
        log(`Salt generated: ${salt}`);

        const hash = await bcrypt.hash(pass, salt);
        log(`Hash generated: ${hash}`);
        log(`Hash length: ${hash.length}`);

        const match = await bcrypt.compare(pass, hash);
        log(`Match correct pass: ${match}`);

        const matchWrong = await bcrypt.compare('wrong', hash);
        log(`Match wrong pass: ${matchWrong}`);

        const matchSpace = await bcrypt.compare(pass + ' ', hash);
        log(`Match pass with space: ${matchSpace}`);

    } catch (err) {
        log(`ERROR: ${err.message}`);
    }

    log('--- End ---');
    fs.writeFileSync('diagnostic_results.txt', output);
}

run();
