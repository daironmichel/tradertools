import readline from 'readline';
import db from '../db';
import { hashPassword } from '../utils';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(questionText: string, required: boolean = true): Promise<string> {
  return new Promise((resolve, reject) => {
    rl.question(questionText, (answer) => {
      if (required && !answer) reject('Value is required');
      resolve(answer);
    });
  });
}

async function main() {
  let username = '';
  let password = '';
  let lastName = '';
  let firstName = '';

  while (!username) {
    try {
      username = await ask('username (required): ');
    } catch (e) {
      console.log(e);
    }
  }

  while (!password) {
    try {
      password = hashPassword(await ask('password (required): '));
    } catch (e) {
      console.log(e);
    }
  }

  firstName = await ask('first name: ');
  lastName = await ask('last name: ');

  let userId = null;

  await db.transaction(async (trx) => {
    const res = await trx('User').insert({ username, password, firstName, lastName }, 'id');
    userId = res[0];
  });

  console.log('----------------');
  console.log('credentials:');
  console.log('id:', userId);
  console.log(username);
  console.log(password);
}

main()
  .then(() => {
    rl.close();
    console.log('successful!');
    process.exit(0);
  })
  .catch((e) => {
    rl.close();
    console.error(e);
    console.log('failed!');
    process.exit(1);
  });
