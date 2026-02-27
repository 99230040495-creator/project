const axios = require('axios');

const testGoogleAuth = async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/google', {
            email: 'test@example.com',
            googleId: '12345',
            name: 'Test User'
        });
        console.log('Success:', response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
};

testGoogleAuth();
