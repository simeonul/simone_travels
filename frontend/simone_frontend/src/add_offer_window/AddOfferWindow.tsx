import '../edit_window/EditWindow.css'
import './AddOfferWindow.css'
import React, {useEffect, useState} from "react";
import {AddOfferWindowProps} from "../interfaces/AddOfferWindowProps";
import {Offer} from "../interfaces/Offer";
import {Destination} from "../interfaces/Destination";

const AddOfferWindow: React.FC<AddOfferWindowProps> = ({isOpen, onClose, onAddSuccess}) => {
    const [offer, setOffer] = useState<Offer>({
        discount_percentage: 0,
        title: '',
        valid_from: '',
        valid_to: '',
        destination_id: ''
    });

    const [destinations, setDestinations] = useState<Destination[]>([]);

    const fetchDestinations = async () => {
        try {
            const jwt = sessionStorage.getItem('jwt');
            if (!jwt) {
                throw new Error('JWT token not found');
            }
            const url = `http://localhost:5000/destinations`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${jwt}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch destinations');
            }
            const data = await response.json();
            setDestinations(data);
            if (data.length > 0) {
                setOffer(prevOffer => ({...prevOffer, destination_id: data[0].id}));
            }
        } catch (error) {
            console.error('Fetch destinations failed:', error);
        }
    };


    useEffect(() => {
        fetchDestinations();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, isDescription = false) => {
        const {name, value} = e.target;
        let parsedValue: string | number = value;
        if (name === "discount_percentage") {
            parsedValue = parseInt(value, 10);
        }
        setOffer(prev => ({...prev, [name]: parsedValue}));
    };


    const handleAdd = async () => {
        console.log(offer)
        const jwt = sessionStorage.getItem('jwt');
        if (jwt) {
            try {
                let url = `http://localhost:5000/offers`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(offer)
                });
                if (response.ok) {
                    onClose();
                    onAddSuccess();
                }
            } catch (error) {
                console.error('Error adding offer:', error);
            }
        }
    };


    if (!isOpen) return null;


    return (
        <div className="edit-backdrop">
            <div className="edit-content">
                <div className="edit-info">
                    <table className="edit-table">
                        <tbody>
                        <tr>
                            <td className="edit-info-title"><p><strong>Destination</strong></p></td>
                            <td className="edit-info-value">
                                <select
                                    className="edit-value-input"
                                    name="destination_id"
                                    defaultValue={offer.destination_id}
                                    onChange={(e) => handleInputChange(e, true)}
                                >
                                    {destinations.map(destination => (
                                        <option key={destination.id} value={destination.id}>
                                            {destination.title}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className="edit-info-title"><p><strong>Title</strong></p></td>
                            <td className="edit-info-value">
                                <input
                                    type="text"
                                    name="title"
                                    className="edit-value-input"
                                    onChange={(e) => handleInputChange(e, false)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="edit-info-title"><p><strong>Discount Percentage</strong></p></td>
                            <td className="edit-info-value">
                                <input
                                    type="number"
                                    min="0"
                                    className="edit-value-input"
                                    name="discount_percentage"
                                    onChange={(e) => handleInputChange(e, false)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="edit-info-title"><p><strong>Valid From</strong></p></td>
                            <td className="edit-info-value">
                                <input
                                    type="date"
                                    className="edit-value-input"
                                    name="valid_from"
                                    onChange={(e) => handleInputChange(e, false)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="edit-info-title"><p><strong>Valid To</strong></p></td>
                            <td className="edit-info-value">
                                <input
                                    type="date"
                                    className="edit-value-input"
                                    name="valid_to"
                                    onChange={(e) => handleInputChange(e, false)}
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="add-buttons-panel">
                    <button className="add-button" onClick={handleAdd}>Add Offer</button>
                    <button className="close-button-add-window" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default AddOfferWindow;