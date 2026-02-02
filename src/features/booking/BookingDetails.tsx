import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './bookingDetails.css'

const BookingDetails = () => {

    const location = useLocation()
    const state = location.state

    const totalPrice: number = state?.totalPrice || 0;
    const selectedSeats: { seat: string; layoutType: string }[] = state?.bookedSeats || [];
    const movieName: string = state?.movieName || 'Unknown Movie';
    const startTime: string = state?.time || '';
    const date: string = state?.date || '';
    const serviceChargePercent = 6;
    const serviceCharge = Math.round(totalPrice * (serviceChargePercent / 100));
    const finalTotal = totalPrice + serviceCharge;

    const navigate = useNavigate()
    const previousUrl: string | undefined = location.state?.from
    const showId: string = location.state?.showId

    const handlePayment = async () => {
        try {
            const token = localStorage.getItem('accessToken')
            if (!token) {
                console.error("Not authenticated. Please login again.")
                return
            }

            const payload = {
                showtimeId: showId,
                seatData: {
                    seats: selectedSeats.map(s => ({
                        row: s.seat.charAt(0),
                        column: Number(s.seat.slice(1)),
                        layoutType: s.layoutType,
                    })),
                },
            }

            const res = await fetch(
                '/api/orders',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            )

            const data = await res.json()

            if (!res.ok || !data.paymentUrl) {
                throw new Error(data.message || 'Payment initiation failed')
            }

            const redirectUrl = new URL(data.paymentUrl)
            redirectUrl.searchParams.set("orderId", data.orderId)
            window.location.href = data.paymentUrl

        } catch (err: any) {
            console.error(err)
            // Error handled by global interceptor
        }
    }


    useEffect(() => {
        if (!state || !state.showId) {
            console.error("Invalid booking session. Please select seats again.")
            navigate('/home')
        }
    }, [state, navigate])

    if (!state || !state.showId) {
        return null
    }


    return (
        <div className="booking-container">
            <div className='ticketCard'>
                <h2>Booking Summary</h2>
                
                <p><b>Movie:</b> {movieName}</p>
                <p><b>Date:</b> {date}</p>
                <p><b>Time:</b> {startTime}</p>
                <p><b>Seats:</b> {selectedSeats.map(e => e.seat).join(', ')}</p>

                <hr />

                <p><b>Ticket Price:</b> ₹{totalPrice}</p>
                <p><b>Service Charge ({serviceChargePercent}%):</b> ₹{serviceCharge}</p>
                <p style={{ fontSize: '18px' }}><b>Total:</b> ₹{finalTotal}</p>

                <button
                    className="proceed-btn"
                    onClick={handlePayment}
                >
                    Pay ₹{finalTotal}
                </button>

                <button
                    className="cancel-btn"
                    onClick={() => {
                        if (previousUrl) navigate(previousUrl)
                        else navigate(-1)
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    )

}

export default BookingDetails