import React, {useEffect, useState} from 'react';
import './DestinationsPage.css';
import {Destination} from "../interfaces/Destination";
import {Offer} from '../interfaces/Offer'
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {DateRangePicker} from 'react-date-range';
import {DestinationsPageProps} from "../interfaces/DestinationsPageProps";
import { useLocation } from 'react-router-dom';
import EditWindow from '../edit_window/EditWindow';
import AddWindow from "../add_window/AddWindow";
import {UserLocation} from "../interfaces/UserLocation";
import AddOfferWindow from "../add_offer_window/AddOfferWindow";
import AddBookingWindow from "../add_booking_window/AddBookingWindow";
import { useNavigate } from 'react-router-dom';

const DestinationsPage: React.FC<DestinationsPageProps> = ({ endpointVariable }) => {
    const navigate = useNavigate();
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const role = sessionStorage.getItem('role');
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        }
    ]);

    const[addBookingIsClickable, setAddBookingIsClickable] = useState(false);
    const handleSelect = (ranges: any) => {
        setIsAvailabilityChecked(false);
        const { selection } = ranges;
        const { startDate, endDate } = selection;
        const daysDifference = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
        setState([selection]);

        if (daysDifference >= 1) {
            setAddBookingIsClickable(true);
        }else{
            setAddBookingIsClickable(false);
        }
    };

    const [visibleOffersDestinationId, setVisibleOffersDestinationId] = useState<null | string>(null);

    const toggleOffersVisibility = (id: string): void => {
        if (visibleOffersDestinationId === id) {
            setVisibleOffersDestinationId(null);
        } else {
            setVisibleOffersDestinationId(id);
        }
    };

    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

    const handleOfferClick = (offer: Offer): void => {
        if (selectedOffer && selectedOffer.title === offer.title) {
            setSelectedOffer(null);
        } else {
            setSelectedOffer(offer);
        }
    };

    const location = useLocation();
    const pathVariable = location.state?.pathVariable;
    const [editIsOpen, setEditIsOpen] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
    const [addIsOpen, setAddIsOpen] = useState(false);
    const [addOfferIsOpen, setAddOfferIsOpen] = useState(false);
    const [addBookingIsOpen, setAddBookingIsOpen] = useState(false);
    const [wantedDestinationForBooking, setWantedDestinationForBooking] = useState<Destination | null>(null);

    const handleCardClick = (destination: Destination) => {
        if (role === 'Agent') {
            setSelectedDestination(destination);
            setEditIsOpen(true);
        }
    };

    const handleAddClick = () => {
        setAddIsOpen(true);
    };

    const handleAddOfferClick = () => {
        setAddOfferIsOpen(true);
    };

    const handleAddBookingClick = (destination : Destination) => {
        setWantedDestinationForBooking(destination);
        setAddBookingIsOpen(true);
    };

    const handleShowBookings = (destinationId: string) => {
        navigate('/bookings', { state: { destinationId } });
    }

    const handleDeleteOfferClick = async () => {
        if (!selectedOffer) return;

        const jwt = sessionStorage.getItem('jwt');
        const offerId = selectedOffer.id;

        try {
            const response = await fetch(`http://localhost:5000/offers/${offerId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete the offer');
            }
            setSelectedOffer(null);
            onDestinationUpdated();
        } catch (error) {
            console.error('Error deleting offer:', error);
        }
    };

    const fetchDestinations = async () => {
        const jwt = sessionStorage.getItem('jwt');
        try {
            if (jwt) {
                let url = `http://localhost:5000/destinations`;
                if (endpointVariable === 'offers') {
                    url = `http://localhost:5000/destinations/hasOffers`;
                }
                else if (endpointVariable === 'filtered') {
                    url = `http://localhost:5000/destinations/filter/${pathVariable}`;
                }
                console.log(url)
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setDestinations(data);
            }
        } catch (error) {
            console.error('Error fetching destinations:', error);
        }
    };

    useEffect(() => {
        fetchDestinations();
    }, [pathVariable]);

    const onDestinationUpdated = () => {
        fetchDestinations();
    };

    const [userLocation, setUserLocation] = useState<UserLocation>({ lat: null, long: null });

    useEffect(() => {
        const latitude = sessionStorage.getItem('latitude');
        const longitude = sessionStorage.getItem('longitude');

        if (latitude && longitude) {
            setUserLocation({ lat: latitude, long: longitude });
        }
    }, []);


    const checkAvailability = () => {
        const filteredDestinations = destinations.filter((destination) => {
            const bookingsInRange = destination.bookings?.filter((booking) => {
                const bookingStartDate = new Date(booking.start_date).getTime();
                const selectedStartDate = state[0].startDate.setHours(0, 0, 0, 0);
                const selectedEndDate = state[0].endDate.setHours(23, 59, 59, 999);
                return (bookingStartDate >= selectedStartDate && bookingStartDate <= selectedEndDate);
            }).length || 0;
            return destination.capacity > bookingsInRange;
        });
        setDestinations(filteredDestinations);
        setIsAvailabilityChecked(true);
    };

    const [isAvailabilityChecked, setIsAvailabilityChecked] = useState(false);

    useEffect(() => {
        setIsAvailabilityChecked(false);
    },[state[0].startDate, state[0].endDate]);


    return (
        <div className="destinations-container">
            <div className="date-picker-container">
                <div className="calendar">
                    <DateRangePicker
                        ranges={state}
                        minDate={new Date()}
                        onChange={handleSelect}
                        moveRangeOnFirstSelection={false}
                        direction="horizontal"
                        weekStartsOn={1}
                        color="#0664a8"
                    />
                </div>

                <button
                    className="filter-button"
                    onClick={checkAvailability}
                >
                    Check availability
                </button>

                {
                    role === 'Agent' && (
                        <div className="admin-add-buttons">
                            <button
                                onClick={handleAddClick}
                            >
                                Add Destination
                            </button>
                            <button
                                onClick={handleAddOfferClick}
                            >
                                Add Offer
                            </button>
                            <button
                                style={{color: selectedOffer ? "#eb5834" : "#ccc"}}
                                    onClick={selectedOffer ? handleDeleteOfferClick : undefined}
                                    disabled={!selectedOffer}
                            >
                                Delete Offer
                            </button>
                        </div>
                    )
                }

                {userLocation.lat && userLocation.long && (
                    <div className="location">You are traveling from: {userLocation.lat}, {userLocation.long}</div>
                )}
            </div>


            <div className="cards-container">
                {destinations.map((destination, index) => (
                    <React.Fragment key={destination.id}>
                        <div
                            className="card"
                        >
                            <div
                                className="card-description"
                                onClick={() => handleCardClick(destination)}
                            >
                                <p className="destination-title"><strong>{destination.title}</strong></p>
                                <div className="destination-attribute-location">
                                    <div className="icon-container">
                                        <img className="destination-attribute-icon" src='/icons/location_pin.png'/>
                                    </div>
                                    <div className="destination-attribute-text">{destination.location}</div>
                                </div>
                                <div className="destination-attribute">
                                    <div className="icon-container">
                                        <img className="destination-attribute-icon" src='/icons/transport.png'/>
                                    </div>
                                    <div
                                        className="destination-attribute-text">{destination.description?.transport}</div>
                                </div>
                                <div className="destination-attribute">
                                    <div className="icon-container">
                                        <img className="destination-attribute-icon" src='/icons/boarding.png'/>
                                    </div>
                                    <div
                                        className="destination-attribute-text">{destination.description?.board_options}</div>
                                </div>
                                <div className="destination-attribute">
                                    <div className="icon-container">
                                        <img className="destination-attribute-icon" src='/icons/room.png'/>
                                    </div>
                                    <div
                                        className="destination-attribute-text">{destination.description?.room_type}</div>
                                </div>
                            </div>

                            <div className="book-info">
                                <div className="price">
                                    <div className="price-amount">{destination.nightly_rate}€</div>
                                    <div className="price-night">/night</div>
                                </div>

                                <button
                                    className="destination-button"
                                    onClick={() => {
                                        if (role === 'Client') {
                                            handleAddBookingClick(destination);
                                        }
                                        if (role === 'Agent') {
                                            console.log("DA")
                                            handleShowBookings(destination.id);
                                        }
                                    }}
                                    disabled={(!addBookingIsClickable || !isAvailabilityChecked) && role !== 'Agent'}
                                >
                                    {role === 'Client' ? 'book' : role === 'Agent' ? 'bookings' : ''}

                                </button>

                                {destination.offers && destination.offers.length > 0 && (
                                    <div className="offers" onClick={() => toggleOffersVisibility(destination.id)}>
                                        <div className="offer-text">offers</div>
                                        <div className="offer-icon">
                                            <img className="offer-icon" src='/icons/arrow.png' alt="Offers arrow"/>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {visibleOffersDestinationId === destination.id && (
                            <div className="offers-details">
                                {destination.offers.map((offer) => (
                                    <div
                                        className={`offer-detail ${selectedOffer && selectedOffer.title === offer.title ? 'offer-selected' : ''}`}
                                        onClick={() => handleOfferClick(offer)}
                                        key={offer.title}
                                    >
                                        <div className="offer-title-percentage">
                                            <div className="offer-title">{offer.title}</div>
                                            <div className="offer-percentage">{offer.discount_percentage}%</div>
                                        </div>
                                        <div className="offer-dates">
                                            <div className="offer-start-date">from {offer.valid_from}</div>
                                            <div className="offer-end-date">until {offer.valid_to}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
            {editIsOpen && selectedDestination && (
                <EditWindow
                    isOpen={editIsOpen}
                    onClose={() => setEditIsOpen(false)}
                    destination={selectedDestination}
                    onUpdateSuccess={onDestinationUpdated}
                >
                </EditWindow>
            )}

            {addIsOpen && (
                <AddWindow
                    isOpen={addIsOpen}
                    onClose={() => setAddIsOpen(false)}
                    onAddSuccess={onDestinationUpdated}
                >
                </AddWindow>
            )}

            {addOfferIsOpen && (
                <AddOfferWindow
                    isOpen={addOfferIsOpen}
                    onClose={() => setAddOfferIsOpen(false)}
                    onAddSuccess={onDestinationUpdated}
                >
                </AddOfferWindow>
            )}

            {addBookingIsOpen && (
                <AddBookingWindow
                    isOpen={addBookingIsOpen}
                    onClose={() => setAddBookingIsOpen(false)}
                    onAddSuccess={onDestinationUpdated}
                    startDate={state[0].startDate}
                    endDate={state[0].endDate}
                    destination={wantedDestinationForBooking}
                    offer={selectedOffer}
                >
                </AddBookingWindow>
            )}
        </div>
    );
};

export default DestinationsPage;