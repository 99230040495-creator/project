const supabase = require('./utils/supabase');
const fs = require('fs');

async function checkDB() {
    let output = '--- Supabase DB Check ---\n';
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('id, email, name')
            .limit(10);

        if (error) {
            output += `ERROR: ${error.message}\n`;
        } else {
            output += `Total Users found: ${users.length}\n`;
            users.forEach((u, i) => {
                output += `User ${i}: email="${u.email}", name="${u.name}"\n`;
            });
        }

    } catch (err) {
        output += `UNEXPECTED ERROR: ${err.message}\n`;
    }

    console.log(output);
    fs.writeFileSync('db_check_results.txt', output);
}

checkDB();
