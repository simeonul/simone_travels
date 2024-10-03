import React from 'react';
import './App.css';
import NavigationBar from "./navigation_bar/NavigationBar";
import Home from "./home_page/Home";
import ContactPage from "./contact_page/ContactPage";
import {Route, Routes} from "react-router-dom";
import RegisterPage from "./register_page/RegisterPage";
import LoginPage from "./login_page/LoginPage";
import DestinationsPage from "./destinations_page/DestinationsPage";
import PrivateRoute from "./configs/PrivateRoute";
import BookingsPage from "./bookings_page/BookingsPage";

function App() {
    return (
        <div className="App">
            <div className="app-container">
                <div className="navigation-container">
                    <NavigationBar/>
                </div>
                <div className="content-container">
                    <Routes>
                        <Route path="/" element={<div className="app-home-container"><Home/></div>}/>
                        <Route path="/contact" element={<div className="app-contact-container"><ContactPage/></div>}/>
                        <Route path="/register"
                               element={<div className="app-register-container"><RegisterPage/></div>}/>
                        <Route path="/login" element={<div className="app-login-container"><LoginPage/></div>}/>
                        <Route path="/destinations" element={
                            <PrivateRoute
                                element={
                                    <div className="app-destinations-container">
                                        <DestinationsPage/>
                                    </div>
                                }
                                allowedRoles={['Agent', 'Client']}
                            />
                        }/>
                        <Route path="/offers" element={
                            <PrivateRoute
                                element={
                                    <div className="app-destinations-container">
                                        <DestinationsPage endpointVariable={"offers"}/>
                                    </div>
                                }
                                allowedRoles={['Agent', 'Client']}
                            />
                        }/>
                        <Route path="/filtered" element={
                            <PrivateRoute
                                element={
                                    <div className="app-destinations-container">
                                        <DestinationsPage endpointVariable={"filtered"}/>
                                    </div>
                                }
                                allowedRoles={['Agent', 'Client']}
                            />
                        }/>
                        <Route path="/bookings" element={
                            <PrivateRoute
                                element={
                                    <div className="app-bookings-container">
                                        <BookingsPage />
                                    </div>
                                }
                                allowedRoles={['Agent']}
                            />
                        }/>
                    </Routes>
                </div>
            </div>
        </div>
    )
        ;
}

export default App;
