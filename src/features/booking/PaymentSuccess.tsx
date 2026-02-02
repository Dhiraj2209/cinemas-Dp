import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import '../../components/successFailure.css'

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const sessionId = searchParams.get("session_id")

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [orderId, setOrderId] = useState<string | null>(null)


    useEffect(() => {
        if (!sessionId) {
            setError("No Session ID found.")
            setLoading(false)
            return
        }

        const verifyPayment = async () => {
            try {
                const res = await fetch(
                    `/api/payments/verify?session_id=${sessionId}`
                )

                if (res.ok) {
                    const data = await res.json()
                    setOrderId(data.orderId)
                    console.log("Payment verified successfully!")
                    return
                }

                throw new Error("Verification endpoint returned error")

            } catch (err: any) {
                console.warn("Verification failed, checking recent orders...", err)
                // Don't show toast for 401 errors - handled globally
                if (err.message?.includes('401')) {
                    return
                }
                try {
                    const token = localStorage.getItem('accessToken')
                    if (!token) throw new Error("No token for fallback")

                    const orderRes = await fetch("/api/orders", {
                        headers: { "Authorization": `Bearer ${token}` }
                    })

                    if (orderRes.ok) {
                        const orders = await orderRes.json()
                        // Sort by newest
                        orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

                        const latest = orders[0]
                        if (latest) {
                            const createdTime = new Date(latest.createdAt).getTime()
                            const now = Date.now()
                            if (now - createdTime < 5 * 60 * 1000) {
                                setOrderId(latest.id)
                                console.log("Payment confirmed (via recent orders)")
                                return
                            }
                        }
                    }
                } catch (fallbackErr: any) {
                    console.error("Fallback failed", fallbackErr)
                }

                setError("Payment verification failed. Please check My Tickets to confirm.")
                console.error("Payment verification failed")
            } finally {
                setLoading(false)
            }
        }

        verifyPayment()
    }, [sessionId])


    if (loading) {
        return (
            <div className="payment-status-container">
                <h2>Verifying...</h2>
            </div>
        )
    }

    if (error) {
        return (
            <div className="payment-status-container">
                <div className="status-card">
                    <h1>Payment Failed</h1>
                    <p>{error}</p>
                    <button onClick={() => navigate("/home")}>Back to Home</button>
                </div>
            </div>
        )
    }

    return (
        <div className="payment-status-container">
            <div className="status-card">
                <h1>Success!</h1>
                <p>Your payment was successful</p>
                {orderId && (
                    <button onClick={() => navigate(`/ticket/${orderId}`)}>View Ticket</button>
                )}
                <button onClick={() => navigate("/home")}>Back to Home</button>
            </div>
        </div>
    )
}

export default PaymentSuccess
