import '../edit_window/EditWindow.css'
import './AddBookingWindow.css'

import {AddBookingWindowProps} from "../interfaces/AddBookingWindowProps";
import React from "react";

const AddBookingWindow: React.FC<AddBookingWindowProps> = (
    {
        isOpen,
        onClose,
        onAddSuccess,
        startDate,
        endDate,
        destination,
        offer
    }) => {

    const email = sessionStorage.getItem('email');

    const calculateTotalCost = () => {
        if (!startDate || !endDate || !destination) {
            return 0;
        }
        let totalCost = 0.0;
        const nightlyRate = destination.nightly_rate;
        const oneDay = 24 * 60 * 60 * 1000;
        const diffDays = Math.floor((endDate.getTime() + oneDay - startDate.getTime()) / oneDay);

        if (offer) {
            for (let day = 0; day < diffDays; day++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + day);

                if ((currentDate.getTime() + oneDay) >= new Date(offer.valid_from).getTime() &&
                    currentDate.getTime() <= new Date(offer.valid_to).getTime()) {
                    totalCost += nightlyRate * (1 - (offer.discount_percentage / 100));
                } else {
                    totalCost += nightlyRate;
                }
            }
        } else {
            totalCost = diffDays * nightlyRate;
        }
        return parseFloat(totalCost.toFixed(2));
    };

    const totalCost = calculateTotalCost();

    const adjustDateForTimezone = (date : Date) => {
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - userTimezoneOffset);
    };

    const handleAddBooking = async () => {
        console.log(startDate, endDate)

        const adjustedStartDate = adjustDateForTimezone(startDate);
        const adjustedEndDate = adjustDateForTimezone(endDate);

        const bookingData = {
            creation_date: adjustDateForTimezone(new Date()).toISOString().split('T')[0],
            start_date: adjustedStartDate.toISOString().split('T')[0],
            end_date: adjustedEndDate.toISOString().split('T')[0],
            total_cost: parseFloat(totalCost.toFixed(2)),
            destination_id: destination?.id,
            email: email
        };

        console.log(bookingData)
        const url = "http://localhost:5000/bookings";
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`,
                },
                body: JSON.stringify(bookingData)
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            onClose();
            onAddSuccess();
        } catch (error) {
            console.error("Failed to create booking:", error);
        }
    };

    if (!isOpen || destination === undefined || destination === null) return null;

    return (
        <div className="edit-backdrop">
            <div className="edit-content">
                <div className="add-booking-content">
                    <h1 className="add-booking-title">Total cost {totalCost.toFixed(2)}€</h1>
                    <div className="add-booking-info">
                        <table className="add-booking-table">
                            <tbody>
                            <tr>
                                <td className="add-booking-info-title"><p><strong>Destination</strong></p></td>
                                <td className="add-booking-info-value">
                                    <div className="add-booking-value-background">
                                        <p className="value-text">{destination?.title}</p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="add-booking-info-title"><p><strong>Start Date</strong></p></td>
                                <td className="add-booking-info-value">
                                    <div className="add-booking-value-background">
                                        <p className="value-text">{startDate.toLocaleDateString()}</p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="add-booking-info-title"><p><strong>End Date</strong></p></td>
                                <td className="add-booking-info-value">
                                    <div className="add-booking-value-background">
                                        <p className="value-text">{endDate.toLocaleDateString()}</p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="add-booking-info-title"><p><strong>Email</strong></p></td>
                                <td className="add-booking-info-value">
                                    <div className="add-booking-value-background">
                                        <p className="value-text">{email}</p>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="add-buttons-panel">
                    <button className="add-button" onClick={handleAddBooking}>Add Booking</button>
                    <button className="close-button-add-window" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default AddBookingWindow;