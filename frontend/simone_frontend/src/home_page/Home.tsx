import React, {useEffect} from 'react';
import './Home.css'


const Home: React.FC = () => {
    const navigate = (path: string) => {
        window.location.href = path;
    };

    useEffect(() => {
        const requestLocation = () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition((position) => {
                    console.log("Latitude:", position.coords.latitude, "Longitude:", position.coords.longitude);
                    sessionStorage.setItem('latitude', String(position.coords.latitude));
                    sessionStorage.setItem('longitude', String(position.coords.longitude));
                }, (error) => {
                    console.error("Error obtaining location:", error);
                });
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        };

        requestLocation();
    }, []);


    return (
        <div className="home-container">
            <div className="overlay">
                <div className="home-content">
                    <h1 className="motto">Say goodbye to stress and hello to unforgettable experiences!</h1>
                    <p className="description">
                        We take the hassle out of planning so you can focus on making memories.<br />
                        Our expert team crafts personalized itineraries tailored to your preferences,<br />
                        from flights to accommodations and activities.<br />
                    </p>
                    <div className="buttons">
                        <button
                            className="login-button"
                            onClick={() => navigate('/login')}
                        >Log In</button>
                        <button
                            className="register-button"
                            onClick={() => navigate('/register')}
                        >
                            Register</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;