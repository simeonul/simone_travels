import React, {useState} from 'react';
import './RegisterPage.css';

const RegisterPage: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('Client');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const navigate = (path: string) => {
        window.location.href = path;
    };

    const isFormValid = () => {
        return (
            fullName !== '' &&
            email !== '' &&
            password !== '' &&
            password === passwordConfirmation
        );
    };


    const handleRegister = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (isFormValid()) {
            const requestBody = {
                full_name: fullName,
                role: role,
                email: email,
                password: password,
            };

            try {
                const response = await fetch('http://localhost:5000/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });
                const data = await response.json();
                if (response.ok){
                    navigate('/');
                }
            } catch (error) {
                console.error('Error during registration:', error);
            }
        }
    };


    return (
        <div className="register-container">
            <div className="register-content">
                <h1 className="register-title">Register</h1>

                <div className="register-info">
                    <table className="register-table">
                        <tbody>
                        <tr>
                            <td className="register-info-title"><p><strong>Full Name</strong></p></td>
                            <td className="register-info-value">
                                <input
                                    type="text"
                                    className="register-value-input"
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="register-info-title"><p><strong>Role</strong></p></td>
                            <td className="register-info-value">
                                <select
                                    className="register-value-input"
                                    defaultValue="Client"
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="Client">Client</option>
                                    <option value="Agent">Agent</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className="register-info-title"><p><strong>Email</strong></p></td>
                            <td className="register-info-value">
                                <input
                                    type="email"
                                    className="register-value-input"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="register-info-title"><p><strong>Password</strong></p></td>
                            <td className="register-info-value">
                                <input
                                    type="password"
                                    className="register-value-input"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="register-info-title"><p><strong>Password Confirmation</strong></p></td>
                            <td
                                className="register-info-value">
                                <input
                                    type="password"
                                    className="register-value-input"
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>

                </div>
                <button
                    className="create-account-button"
                    onClick={handleRegister}
                    disabled={!isFormValid()}
                >Create Account
                </button>

            </div>

        </div>


    );
}
export default RegisterPage;