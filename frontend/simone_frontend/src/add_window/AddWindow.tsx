import '../edit_window/EditWindow.css'
import './AddWindow.css'

import React, {useEffect, useState} from "react";
import {DestinationNoDescription} from "../interfaces/DestinationNoDescription";
import {Description} from "../interfaces/Description";
import {AddWindowProps} from "../interfaces/AddWindowProps";

const AddWindow: React.FC<AddWindowProps> = ({isOpen, onClose, onAddSuccess}) => {
    const [destination, setDestination] = useState<DestinationNoDescription>({
        capacity: 0,
        location: '',
        nightly_rate: 0,
        title: '',
    });

    const [description, setDescription] = useState<Description>({
        board_options: 'All Inclusive',
        rating: 0,
        room_type: 'Double Room',
        transport: 'Airplane',
        type: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, isDescription = false) => {
        const {name, value} = e.target;
        let parsedValue: string | number = value;

        if (name === "capacity") {
            parsedValue = parseInt(value, 10);
        }
        if (name === "nightly_rate") {
            parsedValue = parseFloat(value);
        }

        if (isDescription) {
            setDescription(prev => ({...prev, [name]: parsedValue}));
        } else {
            setDestination(prev => ({...prev, [name]: parsedValue}));
        }
    };

    const handleAdd = async () => {
        const jwt = sessionStorage.getItem('jwt');
        const headers = {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
        };

        const addDestination = async () => {
            const url = `http://localhost:5000/destinations`;
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(destination),
            });

            if (!response.ok) {
                throw new Error('Failed to add destination');
            }
            return await response.json();
        };

        const addDescription = async (destinationId: any) => {
            console.log(description);
            const url = `http://localhost:5000/descriptions`;
            const descriptionWithDestinationId = { ...description, destination_id: destinationId };
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(descriptionWithDestinationId),
            });

            if (!response.ok) {
                throw new Error('Failed to add description');
            }
            return await response.json();
        };

        if (jwt) {
            try {
                const newDestination = await addDestination();
                if (newDestination && newDestination.id) {
                    await addDescription(newDestination.id);
                } else {
                    throw new Error('New destination ID is missing');
                }
                onClose();
                onAddSuccess();
            } catch (error) {
                console.error('Post failed:', error);
                alert('Failed adding new destination. Please try again.');
            }
        }
    };

    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const validateForm = () => {
        const isTitleValid = destination.title.trim() !== '';
        const isLocationValid = destination.location.trim() !== '';
        const isNightlyRateValid = destination.nightly_rate > 0;
        const isCapacityValid = destination.capacity > 0 && Number.isInteger(destination.capacity);

        setIsFormValid(isTitleValid && isLocationValid && isNightlyRateValid && isCapacityValid);
    };
    useEffect(() => {
        validateForm();
    }, [destination, description]);

    if (!isOpen) return null;


    return (
        <div className="edit-backdrop">
            <div className="edit-content">
                <div className="edit-info">
                    <table className="edit-table">
                        <tbody>
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
                            <td className="edit-info-title"><p><strong>Location</strong></p></td>
                            <td className="edit-info-value">
                                <input
                                    type="text"
                                    name="location"
                                    className="edit-value-input"
                                    onChange={(e) => handleInputChange(e, false)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="edit-info-title"><p className="edit-title-paragraph"><strong>Boarding
                                Option</strong></p></td>
                            <td className="edit-info-value">
                                <select
                                    className="edit-value-input"
                                    name="board_options"
                                    onChange={(e) => handleInputChange(e, true)}
                                    defaultValue={"All Inclusive"}
                                >
                                    <option value="All Inclusive">All Inclusive</option>
                                    <option value="Half Board">Half Board</option>
                                    <option value="Bed & Breakfast">Bed & Breakfast</option>
                                    <option value="Self Catering">Self Catering</option>
                                    <option value="Room Only">Room Only</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className="edit-info-title"><p><strong>Room Type</strong></p></td>
                            <td className="edit-info-value">
                                <select
                                    className="edit-value-input"
                                    name="room_type"
                                    onChange={(e) => handleInputChange(e, true)}
                                    defaultValue={"Double Room"}
                                >
                                    <option value="Double Room">Double Room</option>
                                    <option value="Twin Room">Twin Room</option>
                                    <option value="Single Room">Single Room</option>
                                    <option value="Cabin">Cabin</option>
                                    <option value="Penthouse">Penthouse</option>
                                    <option value="Family Room">Family Room</option>
                                    <option value="Triple Room">Triple Room</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className="edit-info-title"><p><strong>Transport</strong></p></td>
                            <td className="edit-info-value">
                                <select
                                    className="edit-value-input"
                                    name="transport"
                                    onChange={(e) => handleInputChange(e, true)}
                                    defaultValue={"Airplane"}
                                >
                                    <option value="Airplane">Airplane</option>
                                    <option value="Bus">Bus</option>
                                    <option value="Not Included">Not Included</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className="edit-info-title"><p><strong>Nightly Rate</strong></p></td>
                            <td className="edit-info-value">
                                <input
                                    type="number"
                                    min="0"
                                    className="edit-value-input"
                                    name="nightly_rate"
                                    onChange={(e) => handleInputChange(e, false)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="edit-info-title"><p><strong>Capacity</strong></p></td>
                            <td className="edit-info-value">
                                <input
                                    type="number"
                                    min="0"
                                    className="edit-value-input"
                                    name="capacity"
                                    onChange={(e) => handleInputChange(e, false)}
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="add-buttons-panel">
                    <button className="add-button" onClick={handleAdd} disabled={!isFormValid}>Add Destination</button>
                    <button className="close-button-add-window" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default AddWindow;