import {EditWindowProps} from "../interfaces/EditWindowProps";
import './EditWindow.css'
import React, {useEffect, useState} from "react";
import {DestinationNoDescription} from "../interfaces/DestinationNoDescription";
import {Description} from "../interfaces/Description";

const EditWindow: React.FC<EditWindowProps> = ({isOpen, onClose, destination, onUpdateSuccess}) => {
    const [updatedDestination, setUpdatedDestination] = useState<DestinationNoDescription>({
        id: destination.id,
        title: destination.title,
        location: destination.location,
        nightly_rate: destination.nightly_rate,
        capacity: destination.capacity
    });

    const [updatedDescription, setUpdatedDescription] = useState<Description>({
        ...destination.description,
        destination_id: destination.id
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, isDescription = false) => {
        const { name, value } = e.target;
        let parsedValue: string | number = value;

        if (name === "capacity") {
            parsedValue = parseInt(value, 10);
        }
        if (name === "nightly_rate") {
            parsedValue = parseFloat(value);
        }

        if (isDescription) {
            setUpdatedDescription(prev => ({ ...prev, [name]: parsedValue }));
        } else {
            setUpdatedDestination(prev => ({ ...prev, [name]: parsedValue }));
        }
    };

    const handleUpdate = async () => {
        const jwt = sessionStorage.getItem('jwt');
        const headers = {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
        };

        const updateDescription = async () => {
            const url = `http://localhost:5000/descriptions/${updatedDescription.id}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(updatedDescription),
            });

            if (!response.ok) {
                throw new Error('Failed to update description');
            }
            return await response.json();
        };

        const updateDestination = async () => {

            const url = `http://localhost:5000/destinations/${updatedDestination.id}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(updatedDestination),
            });

            if (!response.ok) {
                throw new Error('Failed to update destination');
            }
            return await response.json();
        };

        if (jwt) {
            try {
                await updateDescription();
                await updateDestination();
                onClose();
                onUpdateSuccess();
            } catch (error) {
                console.error('Update failed:', error);
                alert('Update failed. Please try again.');
            }
        }
    };


    const handleDelete = async () => {
        const jwt = sessionStorage.getItem('jwt');

        try {
            const response = await fetch(`http://localhost:5000/destinations/${destination.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete the offer');
            }
            onClose();
            onUpdateSuccess();
        } catch (error) {
            console.error('Error deleting offer:', error);
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
                            <td className="edit-info-title"><p><strong>Title</strong></p></td>
                            <td className="edit-info-value">
                                <input
                                    type="text"
                                    name="title"
                                    className="edit-value-input"
                                    defaultValue={destination.title}
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
                                    defaultValue={destination.location}
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
                                    defaultValue={destination.description.board_options}
                                    name="board_options"
                                    onChange={(e) => handleInputChange(e, true)}
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
                                    defaultValue={destination.description.room_type}
                                    name="room_type"
                                    onChange={(e) => handleInputChange(e, true)}
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
                                    defaultValue={destination.description.transport}
                                    name="transport"
                                    onChange={(e) => handleInputChange(e, true)}
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
                                    defaultValue={destination.nightly_rate}
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
                                    defaultValue={destination.capacity}
                                    name="capacity"
                                    onChange={(e) => handleInputChange(e, false)}
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="edit-buttons-panel">
                    <button className="update-button" onClick={handleUpdate}>Update</button>
                    <button className="delete-button" onClick={handleDelete}>Delete</button>
                    <button className="close-button" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default EditWindow;