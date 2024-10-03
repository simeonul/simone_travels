import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {Booking} from "../interfaces/Booking";
import './BookingsPage.css'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {Bar} from 'react-chartjs-2';
import 'chart.js/auto';

const BookingsPage: React.FC = () => {
    const location = useLocation();
    const {destinationId} = location.state as { destinationId: string };
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        console.log(destinationId)
        const fetchBookings = async () => {
            const url = `http://localhost:5000/bookings/destination/${destinationId}`;
            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch bookings');
                }
                const bookings = await response.json();
                setBookings(bookings);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, [destinationId]);

    type ChartDataType = {
        labels: string[];
        datasets: Array<{
            label: string;
            data: number[];
            backgroundColor: string;
            borderColor: string;
            borderWidth: number;
        }>;
    };

    const [chartData, setChartData] = useState<ChartDataType>({
        labels: [],
        datasets: [{
            label: '',
            data: [],
            backgroundColor: '',
            borderColor: '',
            borderWidth: 0,
        }],
    });

    const generateMonthYearLabels = (startDate: Date, endDate: Date): string[] => {
        let labels: string[] = [];
        let start = new Date(startDate.getFullYear(), startDate.getMonth());
        let end = new Date(endDate.getFullYear(), endDate.getMonth());

        while (start <= end) {
            labels.push(`${start.getMonth() + 1}-${start.getFullYear()}`);
            start.setMonth(start.getMonth() + 1);
        }

        return labels;
    };

    const adjustDateForTimezone = (date : Date) => {
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - userTimezoneOffset);
    };

    useEffect(() => {
        if (bookings.length > 0) {
            const sortedBookings = bookings.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
            const startDate = new Date(sortedBookings[0].start_date);
            const endDate = new Date(sortedBookings[sortedBookings.length - 1].start_date);

            const allMonthYearLabels = generateMonthYearLabels(startDate, endDate);

            const counts: { [key: string]: number } = {};
            allMonthYearLabels.forEach(label => {
                counts[label] = 0;
            });

            sortedBookings.forEach(booking => {
                const date = new Date(booking.start_date);
                const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
                counts[monthYear] = counts[monthYear] ? counts[monthYear] + 1 : 1;
            });

            const labels = Object.keys(counts);
            const data = Object.values(counts);


            setChartData({
                labels,
                datasets: [{
                    label: 'Total Bookings',
                    data,
                    backgroundColor: 'rgb(6,100,168)',
                    borderColor: 'rgb(6,100,168)',
                    borderWidth: 1,
                }],
            });
        }
    }, [bookings]);

    const tileClassName = ({date, view}: { date: Date; view: string }) => {
        if (view === 'month') {
            const isMarked = bookings.some(booking => {
                const startDate = new Date(booking.start_date);
                const endDate = new Date(booking.end_date);
                const adjustedStartDate = adjustDateForTimezone(startDate);
                const adjustedEndDate = adjustDateForTimezone(endDate);
                const start = new Date(adjustedStartDate.getFullYear(), adjustedStartDate.getMonth(), adjustedStartDate.getDate());
                const end = new Date(adjustedEndDate.getFullYear(), adjustedEndDate.getMonth(), adjustedEndDate.getDate());
                const current = new Date(date.getFullYear(), date.getMonth(), date.getDate());

                return current >= start && current <= end;
            });
            return isMarked ? 'marked' : null;
        }
    };


    return (
        <div className="destinations-container">
            <div className="bookings-container">
                <div className="bookings-details">
                    {bookings.map((booking) => (
                        <div
                            className={`booking-detail`}
                            key={booking.title}
                        >
                            <div className="booking-title-percentage">
                                <div className="booking-title">{booking.email}</div>
                                <div className="booking-percentage">{booking.total_cost}€</div>
                            </div>
                            <div className="booking-dates">
                                <div
                                    className="booking-start-date">from <strong>{booking.start_date.toString()}</strong>
                                </div>
                                <div className="booking-end-date">until <strong>{booking.end_date.toString()}</strong>
                                </div>
                            </div>
                            <div className="booking-dates">
                                <div className="booking-start-date">created on</div>
                                <div className="booking-end-date"><strong>{booking.creation_date.toString()}</strong>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


                <div className="visuals-container">
                    <div className="calendar-container">
                        <Calendar
                            className="bookings-calendar"
                            tileClassName={tileClassName}
                            onClickDay={() => {
                            }}
                        />
                    </div>

                    <div className="chart-container">
                        <Bar
                            className="bookings-chart"
                            data={chartData}
                            options={{scales: {y: {beginAtZero: true}}}}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default BookingsPage;