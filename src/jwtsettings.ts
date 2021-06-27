let i  = 'URental'; // Issuer
let s  = 'gabriele.palmeri@test.it'; // Subject
let a  = 'localhost'; // Audience

// SIGNING OPTIONS
export const jwtSettings: any = {
    issuer:  i,
    subject:  s,
    audience:  a,
    expiresIn:  "2h",
    algorithm:  "RS256"
};
