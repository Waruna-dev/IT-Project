import nodemailer from 'nodemailer';

async function createTestAccount() {
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log('Ethereal test account:');
    console.log('User:', testAccount.user);
    console.log('Pass:', testAccount.pass);
    console.log('SMTP host:', testAccount.smtp.host);
    console.log('SMTP port:', testAccount.smtp.port);
    console.log('Secure:', testAccount.smtp.secure);
  } catch (err) {
    console.error(err);
  }
}

createTestAccount();
