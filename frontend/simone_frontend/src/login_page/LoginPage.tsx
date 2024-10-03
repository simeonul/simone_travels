import React, {useEffect, useState} from 'react';
import './LoginPage.css';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        sessionStorage.clear();
    }, []);

    const navigate = (path: string) => {
        window.location.href = path;
    };

    const isFormValid = () => {
        return (
            email !== '' &&
            password !== ''
        );
    };


    const handlelogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (isFormValid()) {
            const requestBody = {
                email: email,
                password: password
            };

            try {
                const response = await fetch('http://localhost:5000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });
                const data = await response.json();
                if (response.ok){
                    sessionStorage.setItem('jwt', data.access_token);
                    const jwtPayload = JSON.parse(atob(data.access_token.split('.')[1]));
                    const role = jwtPayload.role;
                    const email = jwtPayload.email;
                    sessionStorage.setItem('role', role);
                    sessionStorage.setItem('email', email);
                    navigate('/');
                }
            } catch (error) {
                console.error('Error during registration:', error);
            }
        }
    };


    return (
        <div className="login-container">
            <div className="login-content">
                <h1 className="login-title">Login</h1>

                <div className="login-info">
                    <table className="login-table">
                        <tbody>
                        <tr>
                            <td className="login-info-title"><p><strong>Email</strong></p></td>
                            <td className="login-info-value">
                                <input
                                    type="email"
                                    className="login-value-input"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="login-info-title"><p><strong>Password</strong></p></td>
                            <td className="login-info-value">
                                <input
                                    type="password"
                                    className="login-value-input"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>

                </div>
                <button
                    className="access-account-button"
                    onClick={handlelogin}
                    disabled={!isFormValid()}
                >Access my account
                </button>

            </div>
        </div>
    );
}
export default LoginPage;