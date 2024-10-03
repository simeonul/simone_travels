import React from 'react';
import './ContactPage.css';

const ContactPage: React.FC = () => {
    return (
        <div className="contact-container">
            <div className="contact-overlay">
                <div className="contact-content">
                    <h1 className="contact-title">Contact information</h1>

                    <div className="contact-info">
                        <table className="contact-table">
                            <tr>
                                <td className="contact-info-title"><p><strong>Phone</strong></p></td>
                                <td className="contact-info-value">
                                    <div className="contact-value-background">
                                        <p className="value-text">+40751346076</p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="contact-info-title"><p><strong>Email</strong></p></td>
                                <td className="contact-info-value">
                                    <div className="contact-value-background">
                                        <p className="value-text">turcu.cezar@yahoo.com</p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="contact-info-title"><p><strong>Fax</strong></p></td>
                                <td className="contact-info-value">
                                    <div className="contact-value-background">
                                        <p className="value-text">+2204712901</p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="contact-info-title"><p><strong>Address</strong></p></td>
                                <td className="contact-info-value">
                                    <div className="contact-value-background">
                                        <p className="value-text">Romania, Cluj-Napoca, Calea Dorobantilor Nr.102</p>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ContactPage;