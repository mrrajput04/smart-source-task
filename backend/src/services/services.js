function generateRandomPassword(firstName, lastName, phoneNumber, length = 12) {
    // Combine all characters
    let allChars = (firstName + lastName + phoneNumber).split('');
    
    // Shuffle the characters randomly
    for (let i = allChars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allChars[i], allChars[j]] = [allChars[j], allChars[i]];
    }

    // Select a portion for the password
    return allChars.slice(0, length).join('');
}

module.exports = generateRandomPassword
