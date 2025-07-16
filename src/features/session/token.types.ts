export interface TokenPayload {
    user: {
        id: string;
        email: string;
        name: string;
    }
}

export type TokenType = 'ACCESS' | 'REFRESH';