const regularEx = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default (emails) => {
    const invalidEmails = emails
        .split(',')
        .map(email => email.trim())
        .filter(email => regularEx.test(email) === false);

    if(invalidEmails.length){
        return `You have invalid email(s): ${invalidEmails}`;
    }

    return;
}