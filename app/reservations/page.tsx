"use client"

import { useState } from "react"
import { Calendar, Users, MapPin, Coffee, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

// Mock data - in real app this would come from API
const restaurantTables = [
  { id: 1, tableNumber: "T01", capacity: 2, location: "window", isActive: true },
  { id: 2, tableNumber: "T02", capacity: 2, location: "window", isActive: true },
  { id: 3, tableNumber: "T03", capacity: 4, location: "indoor", isActive: true },
  { id: 4, tableNumber: "T04", capacity: 4, location: "indoor", isActive: true },
  { id: 5, tableNumber: "T05", capacity: 6, location: "indoor", isActive: true },
  { id: 6, tableNumber: "T06", capacity: 2, location: "outdoor", isActive: true },
  { id: 7, tableNumber: "T07", capacity: 2, location: "outdoor", isActive: true },
  { id: 8, tableNumber: "T08", capacity: 4, location: "outdoor", isActive: true },
  { id: 9, tableNumber: "T09", capacity: 8, location: "indoor", isActive: true },
  { id: 10, tableNumber: "T10", capacity: 2, location: "indoor", isActive: true },
]

const timeSlots = [
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
]

// Mock existing reservations for demo
const existingReservations = [
  { tableId: 1, date: "2025-01-20", time: "12:00" },
  { tableId: 1, date: "2025-01-20", time: "18:00" },
  { tableId: 3, date: "2025-01-20", time: "19:00" },
  { tableId: 6, date: "2025-01-21", time: "11:00" },
]

interface ReservationForm {
  customerName: string
  email: string
  phone: string
  partySize: number
  date: string
  time: string
  specialRequests: string
}

export default function ReservationsPage() {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [partySize, setPartySize] = useState<number>(2)
  const [availableTables, setAvailableTables] = useState<typeof restaurantTables>([])
  const [selectedTable, setSelectedTable] = useState<number | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [reservationForm, setReservationForm] = useState<ReservationForm>({
    customerName: "",
    email: "",
    phone: "",
    partySize: 2,
    date: "",
    time: "",
    specialRequests: "",
  })
  const [step, setStep] = useState<"datetime" | "table" | "details" | "confirmation">("datetime")

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      const isCurrentMonth = date.getMonth() === month
      const isPast = date < today
      const isToday = date.getTime() === today.getTime()

      days.push({
        date: date,
        day: date.getDate(),
        isCurrentMonth,
        isPast,
        isToday,
        dateString: date.toISOString().split("T")[0],
      })
    }

    return days
  }

  const checkTableAvailability = (date: string, time: string, partySize: number) => {
    const suitableTables = restaurantTables.filter((table) => table.capacity >= partySize && table.isActive)

    const availableTables = suitableTables.filter((table) => {
      const isReserved = existingReservations.some(
        (reservation) => reservation.tableId === table.id && reservation.date === date && reservation.time === time,
      )
      return !isReserved
    })

    return availableTables
  }

  const handleDateTimeSelection = () => {
    if (selectedDate && selectedTime && partySize) {
      const available = checkTableAvailability(selectedDate, selectedTime, partySize)
      setAvailableTables(available)
      setReservationForm((prev) => ({
        ...prev,
        date: selectedDate,
        time: selectedTime,
        partySize: partySize,
      }))
      setStep("table")
    }
  }

  const handleTableSelection = (tableId: number) => {
    setSelectedTable(tableId)
    setStep("details")
  }

  const handleReservationSubmit = () => {
    // In real app, this would submit to API
    console.log("Reservation submitted:", {
      ...reservationForm,
      tableId: selectedTable,
    })
    setStep("confirmation")
  }

  const getLocationIcon = (location: string) => {
    switch (location) {
      case "window":
        return "🪟"
      case "outdoor":
        return "🌿"
      default:
        return "🏠"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calendarDays = generateCalendarDays()
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Coffee className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Blue Space Coffee</h1>
                <p className="text-sm text-muted-foreground">Table Reservations</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/menu" className="text-foreground hover:text-primary transition-colors">
                Menu
              </Link>
              <Link href="/admin" className="text-foreground hover:text-primary transition-colors">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step === "datetime"
                    ? "bg-primary text-primary-foreground"
                    : ["table", "details", "confirmation"].includes(step)
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                1
              </div>
              <div className="w-12 h-0.5 bg-border"></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step === "table"
                    ? "bg-primary text-primary-foreground"
                    : ["details", "confirmation"].includes(step)
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </div>
              <div className="w-12 h-0.5 bg-border"></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step === "details"
                    ? "bg-primary text-primary-foreground"
                    : step === "confirmation"
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                3
              </div>
              <div className="w-12 h-0.5 bg-border"></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step === "confirmation" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                4
              </div>
            </div>
          </div>

          {/* Step 1: Date & Time Selection */}
          {step === "datetime" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Select Date & Time
                </CardTitle>
                <CardDescription>Choose your preferred date, time, and party size</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Party Size */}
                <div className="space-y-2">
                  <Label>Party Size</Label>
                  <Select value={partySize.toString()} onValueChange={(value) => setPartySize(Number.parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size} {size === 1 ? "person" : "people"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Calendar */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Select Date</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
                        }
                        className="bg-transparent"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium min-w-[120px] text-center">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
                        }
                        className="bg-transparent"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                        {day}
                      </div>
                    ))}
                    {calendarDays.map((day, index) => (
                      <Button
                        key={index}
                        variant={selectedDate === day.dateString ? "default" : "ghost"}
                        className={`p-2 h-10 ${
                          !day.isCurrentMonth
                            ? "text-muted-foreground/50"
                            : day.isPast
                              ? "text-muted-foreground cursor-not-allowed"
                              : day.isToday
                                ? "ring-2 ring-primary"
                                : ""
                        }`}
                        disabled={day.isPast}
                        onClick={() => day.isCurrentMonth && !day.isPast && setSelectedDate(day.dateString)}
                      >
                        {day.day}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Select Time</h3>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                          className="bg-transparent"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDate && selectedTime && (
                  <div className="pt-4">
                    <Button onClick={handleDateTimeSelection} className="w-full">
                      Check Available Tables
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Table Selection */}
          {step === "table" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Select Your Table
                </CardTitle>
                <CardDescription>
                  Available tables for {partySize} {partySize === 1 ? "person" : "people"} on {formatDate(selectedDate)}{" "}
                  at {selectedTime}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {availableTables.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      No tables available for your selected date and time. Please try a different time slot.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableTables.map((table) => (
                      <Card
                        key={table.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedTable === table.id ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => handleTableSelection(table.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">Table {table.tableNumber}</h4>
                            <Badge variant="secondary">
                              {getLocationIcon(table.location)} {table.location}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />
                            Up to {table.capacity} people
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <Button variant="outline" onClick={() => setStep("datetime")} className="bg-transparent">
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Customer Details */}
          {step === "details" && (
            <Card>
              <CardHeader>
                <CardTitle>Reservation Details</CardTitle>
                <CardDescription>Please provide your contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Reservation Summary */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Reservation Summary</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Date:</strong> {formatDate(selectedDate)}
                    </p>
                    <p>
                      <strong>Time:</strong> {selectedTime}
                    </p>
                    <p>
                      <strong>Party Size:</strong> {partySize} {partySize === 1 ? "person" : "people"}
                    </p>
                    <p>
                      <strong>Table:</strong> {availableTables.find((t) => t.id === selectedTable)?.tableNumber} (
                      {availableTables.find((t) => t.id === selectedTable)?.location})
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Full Name *</Label>
                    <Input
                      id="customerName"
                      value={reservationForm.customerName}
                      onChange={(e) => setReservationForm((prev) => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={reservationForm.email}
                      onChange={(e) => setReservationForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={reservationForm.phone}
                    onChange={(e) => setReservationForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+62 812 3456 7890"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    value={reservationForm.specialRequests}
                    onChange={(e) => setReservationForm((prev) => ({ ...prev, specialRequests: e.target.value }))}
                    placeholder="Any special requests or dietary requirements..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" onClick={() => setStep("table")} className="bg-transparent">
                    Back
                  </Button>
                  <Button
                    onClick={handleReservationSubmit}
                    disabled={!reservationForm.customerName || !reservationForm.email || !reservationForm.phone}
                    className="flex-1"
                  >
                    Confirm Reservation
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Confirmation */}
          {step === "confirmation" && (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-2xl">Reservation Confirmed!</CardTitle>
                <CardDescription>Your table has been successfully reserved</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">Reservation Details</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Reservation ID</p>
                      <p className="font-medium">#BSC{Date.now().toString().slice(-6)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Customer Name</p>
                      <p className="font-medium">{reservationForm.customerName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date & Time</p>
                      <p className="font-medium">
                        {formatDate(selectedDate)} at {selectedTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Party Size</p>
                      <p className="font-medium">
                        {partySize} {partySize === 1 ? "person" : "people"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Table</p>
                      <p className="font-medium">
                        {availableTables.find((t) => t.id === selectedTable)?.tableNumber}(
                        {availableTables.find((t) => t.id === selectedTable)?.location})
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Contact</p>
                      <p className="font-medium">{reservationForm.phone}</p>
                    </div>
                  </div>
                  {reservationForm.specialRequests && (
                    <div className="mt-4">
                      <p className="text-muted-foreground">Special Requests</p>
                      <p className="font-medium">{reservationForm.specialRequests}</p>
                    </div>
                  )}
                </div>

                <Alert>
                  <AlertDescription>
                    A confirmation email has been sent to {reservationForm.email}. Please arrive 10 minutes before your
                    reservation time.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-4">
                  <Button asChild className="flex-1">
                    <Link href="/menu">Order Food</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 bg-transparent">
                    <Link href="/">Back to Home</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
