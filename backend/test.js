import jwt from 'jsonwebtoken'


const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhmNTk1YmExMmVkNjQzZTRiMDg5ODA4OTdmMGI1MWRiIiwidXNlcm5hbWUiOiJ3aGF0IiwiY29sb3IiOiIjNTcyMDcxMTciLCJfaWQiOiI2MzA5ZDljODQwODQyNWUxMjNiYzIxMzgiLCJpYXQiOjE2NjE1ODk5NjB9.WiqDldGwLr5DewAXYCXvPDyFN_24e3jCOt3wPsJs0Fc';

const decoded = jwt.decode(token);

console.log(token);
console.log(decoded);
