import jwtDecode from 'jwt-decode';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJzYW1zb25zaGlzaGFiYUBvdXRsb29rLmNvbSIsIm5iZiI6MTcyNjAwMTExMSwiZXhwIjoxNzI2MDA0NzExLCJpYXQiOjE3MjYwMDExMTEsImlzcyI6Ikp3dCIsImF1ZCI6IllvdXJBdWRpZW5jZSJ9.bEa6p-umK8VwLaSj837NZUPEcuWAeXSsr8laPpqJMzA';

try {
  const decodedToken = jwtDecode(token);
  console.log('Decoded Token:', decodedToken);
} catch (error) {
  console.error('Failed to decode token:', error.message);
}
