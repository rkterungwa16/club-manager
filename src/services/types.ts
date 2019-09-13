export interface PasswordHashService<T = string> {
    hashPassword(password: T, salt: T): Promise<T>;
    comparePassword(providedPass: T, storedPass: T): Promise<boolean>;
    saltPassword(): Promise<T>;
}
