import bcryptjs from 'bcryptjs';

export async function hashPassword(password: string, saltRounds: number): Promise<string> {
    const salt = await bcryptjs.genSalt(saltRounds); // Generate a salt
    const hashedPassword = await bcryptjs.hash(password, salt); // Hash the password
    return hashedPassword; // Return the hashed password
}

export async function validatePassword(inputPassword: string, storedHash: string): Promise<boolean> {
    const isMatch = await bcryptjs.compare(inputPassword, storedHash); // Compare the input password with the hashed password
    return isMatch; // Return the result of the comparison
}