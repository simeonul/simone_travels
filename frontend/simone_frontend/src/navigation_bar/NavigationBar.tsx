import React, {useState} from 'react';
import './NavigationBar.css'
import {useNavigate} from 'react-router-dom';

const NavigationBar: React.FC = () => {
    const navigate = (path: string) => {
        window.location.href = path;
    };

    const navigateWithProps = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };
    const handleMagnifyIconClick = () => {
        const trimmedSearchQuery = searchQuery.trim();
        if (trimmedSearchQuery) {
            navigateWithProps('/filtered',
                {
                    state:
                        {
                            pathVariable: searchQuery
                        }
                });
        }
    };

    return (
        <header className="header">
            <img src="/images/logo_transparent.png" alt="Logo" className="logo"/>
            <nav className="navigation">
                <button onClick={() => navigate('/')}>HOME</button>
                <div className="dropdown">
                    <button className="submenu" onClick={() => navigate('/destinations')}>DESTINATIONS</button>
                    <div className="dropdown-content">
                        <a href="/offers">OFFERS</a>
                    </div>
                </div>
                <div className="search-group">
                    <input
                        type="search"
                        placeholder="Search Destinations..."
                        className="search-bar"
                        onChange={handleSearchChange}
                    />
                    <button className="magnify" onClick={handleMagnifyIconClick} aria-label="Search">
                        <img src="/icons/magnify.png" alt="Search"/>
                    </button>
                </div>
                <button onClick={() => navigate('/contact')}>CONTACT</button>
            </nav>
        </header>
    );
}

export default NavigationBar;