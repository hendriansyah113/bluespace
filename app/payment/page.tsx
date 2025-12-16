"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Coffee, CreditCard, Banknote, QrCode, CheckCircle, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

// Mock order data - in real app this would come from API
const mockOrder = {
  id: "ORD-001",
  type: "dine_in",
  items: [
    { name: "Blue Space Signature Blend", quantity: 2, price: 25000 },
    { name: "Croissant", quantity: 1, price: 15000 },
    { name: "Avocado Toast", quantity: 1, price: 35000 },
  ],
  subtotal: 100000,
  tax: 10000,
  total: 110000,
  customerInfo: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+62 812 3456 7890",
  },
}

interface PaymentStatus {
  status: "pending" | "processing" | "success" | "failed"
  message: string
}

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId") || "ORD-001"

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"cash" | "qris" | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({ status: "pending", message: "" })
  const [qrisCode, setQrisCode] = useState<string>("")
  const [countdown, setCountdown] = useState<number>(300) // 5 minutes for QRIS payment

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Generate mock QRIS code
  const generateQRISCode = () => {
    const qrisData = `00020101021226580014ID.CO.QRIS.WWW0215ID20232024567890303UME51440014ID.CO.QRIS.WWW0215ID20232024567890520454995802ID5914BLUE SPACE COFFEE6007JAKARTA61051234562070703A0163044B2A`
    setQrisCode(qrisData)
  }

  // Handle payment method selection
  const handlePaymentMethodSelect = (method: "cash" | "qris") => {
    setSelectedPaymentMethod(method)
    if (method === "qris") {
      generateQRISCode()
      setCountdown(300) // Reset countdown
    }
  }

  // Handle cash payment confirmation
  const handleCashPayment = () => {
    setPaymentStatus({ status: "processing", message: "Processing cash payment..." })

    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus({
        status: "success",
        message: "Payment confirmed! Please proceed to the cashier to complete your payment.",
      })
    }, 2000)
  }

  // Handle QRIS payment
  const handleQRISPayment = () => {
    setPaymentStatus({ status: "processing", message: "Waiting for payment confirmation..." })

    // Simulate payment processing (in real app, this would check payment status via API)
    setTimeout(() => {
      setPaymentStatus({
        status: "success",
        message: "QRIS payment successful! Your order is confirmed.",
      })
    }, 5000)
  }

  // Countdown timer for QRIS
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (selectedPaymentMethod === "qris" && countdown > 0 && paymentStatus.status === "pending") {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (countdown === 0) {
      setPaymentStatus({ status: "failed", message: "QRIS payment expired. Please try again." })
    }
    return () => clearTimeout(timer)
  }, [countdown, selectedPaymentMethod, paymentStatus.status])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/menu" className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Blue Space Coffee</h1>
                  <p className="text-sm text-muted-foreground">Payment</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {paymentStatus.status === "success" ? (
            // Success Screen
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-2xl">Payment Successful!</CardTitle>
                <CardDescription>{paymentStatus.message}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Order ID:</span>
                      <span className="font-medium">{orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span className="font-medium capitalize">
                        {selectedPaymentMethod === "qris" ? "QRIS Digital Payment" : "Cash at Cashier"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-medium text-primary">{formatPrice(mockOrder.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className="bg-accent text-accent-foreground">
                        {selectedPaymentMethod === "qris" ? "Paid" : "Pending Payment at Cashier"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {selectedPaymentMethod === "cash" && (
                  <Alert>
                    <AlertDescription>
                      Please proceed to the cashier with this order confirmation to complete your cash payment.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-4">
                  <Button asChild className="flex-1">
                    <Link href="/menu">Order More</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 bg-transparent">
                    <Link href="/">Back to Home</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Payment Selection Screen
            <>
              {/* Order Summary */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Order #{orderId}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatPrice(mockOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (10%):</span>
                      <span>{formatPrice(mockOrder.tax)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary">{formatPrice(mockOrder.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method Selection */}
              {!selectedPaymentMethod && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Select Payment Method
                    </CardTitle>
                    <CardDescription>Choose how you'd like to pay for your order</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      {/* Cash Payment */}
                      <Card
                        className="cursor-pointer transition-all hover:shadow-md hover:ring-2 hover:ring-primary/20"
                        onClick={() => handlePaymentMethodSelect("cash")}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <Banknote className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">Cash Payment</h3>
                              <p className="text-sm text-muted-foreground">Pay with cash at the cashier counter</p>
                            </div>
                            <Badge variant="secondary">Available</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      {/* QRIS Payment */}
                      <Card
                        className="cursor-pointer transition-all hover:shadow-md hover:ring-2 hover:ring-primary/20"
                        onClick={() => handlePaymentMethodSelect("qris")}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                              <QrCode className="w-6 h-6 text-accent" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">QRIS Digital Payment</h3>
                              <p className="text-sm text-muted-foreground">Scan QR code with your mobile banking app</p>
                            </div>
                            <Badge variant="secondary">Instant</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Cash Payment Confirmation */}
              {selectedPaymentMethod === "cash" && paymentStatus.status === "pending" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Banknote className="w-5 h-5" />
                      Cash Payment
                    </CardTitle>
                    <CardDescription>Confirm your cash payment order</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <AlertDescription>
                        Your order will be prepared after you complete the payment at our cashier counter. Please show
                        this confirmation to our staff.
                      </AlertDescription>
                    </Alert>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Payment Instructions</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Proceed to the cashier counter</li>
                        <li>Show this order confirmation</li>
                        <li>Pay the total amount: {formatPrice(mockOrder.total)}</li>
                        <li>Receive your receipt and wait for your order</li>
                      </ol>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedPaymentMethod(null)}
                        className="bg-transparent"
                      >
                        Back
                      </Button>
                      <Button onClick={handleCashPayment} className="flex-1">
                        Confirm Cash Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* QRIS Payment */}
              {selectedPaymentMethod === "qris" && paymentStatus.status === "pending" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <QrCode className="w-5 h-5" />
                      QRIS Payment
                    </CardTitle>
                    <CardDescription>Scan the QR code below with your mobile banking app</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="w-64 h-64 bg-white border-2 border-border rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <div className="text-center">
                          <QrCode className="w-32 h-32 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">QRIS Code</p>
                          <p className="text-xs text-muted-foreground mt-2">Amount: {formatPrice(mockOrder.total)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Time remaining: {formatTime(countdown)}</span>
                      </div>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Payment Instructions</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Open your mobile banking or e-wallet app</li>
                        <li>Select "Scan QR" or "QRIS" option</li>
                        <li>Scan the QR code above</li>
                        <li>Confirm the payment amount: {formatPrice(mockOrder.total)}</li>
                        <li>Complete the payment in your app</li>
                      </ol>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedPaymentMethod(null)}
                        className="bg-transparent"
                      >
                        Back
                      </Button>
                      <Button onClick={handleQRISPayment} className="flex-1">
                        I've Made the Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Processing Status */}
              {paymentStatus.status === "processing" && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-primary animate-spin" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
                    <p className="text-muted-foreground">{paymentStatus.message}</p>
                  </CardContent>
                </Card>
              )}

              {/* Failed Status */}
              {paymentStatus.status === "failed" && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <QrCode className="w-8 h-8 text-destructive" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Payment Failed</h3>
                    <p className="text-muted-foreground mb-4">{paymentStatus.message}</p>
                    <Button
                      onClick={() => {
                        setSelectedPaymentMethod(null)
                        setPaymentStatus({ status: "pending", message: "" })
                      }}
                    >
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
