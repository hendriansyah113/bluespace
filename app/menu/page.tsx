"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Coffee, ShoppingCart, Plus, Minus, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

// Mock data - in real app this would come from API
const menuCategories = [
  { id: 1, name: "Coffee", description: "Premium coffee beverages made with locally roasted beans" },
  { id: 2, name: "Tea & Non-Coffee", description: "Refreshing teas and non-caffeinated beverages" },
  { id: 3, name: "Pastries & Desserts", description: "Fresh baked goods and sweet treats" },
  { id: 4, name: "Light Meals", description: "Sandwiches, salads, and light dining options" },
  { id: 5, name: "Breakfast", description: "Morning favorites to start your day right" },
]

const menuItems = [
  // Coffee
  {
    id: 1,
    categoryId: 1,
    name: "Blue Space Signature Blend",
    description: "Our house blend with notes of chocolate and caramel",
    price: 25000,
    preparationTime: 5,
    image: "/coffee-cup-signature-blend.jpg",
  },
  {
    id: 2,
    categoryId: 1,
    name: "Espresso",
    description: "Rich and bold single shot",
    price: 18000,
    preparationTime: 3,
    image: "/espresso-shot.jpg",
  },
  {
    id: 3,
    categoryId: 1,
    name: "Cappuccino",
    description: "Perfect balance of espresso, steamed milk, and foam",
    price: 28000,
    preparationTime: 6,
    image: "/cappuccino-with-foam-art.jpg",
  },
  {
    id: 4,
    categoryId: 1,
    name: "Latte",
    description: "Smooth espresso with steamed milk and light foam",
    price: 30000,
    preparationTime: 6,
    image: "/latte-with-milk-foam.jpg",
  },
  {
    id: 5,
    categoryId: 1,
    name: "Cold Brew",
    description: "Smooth, less acidic coffee brewed cold for 12 hours",
    price: 32000,
    preparationTime: 2,
    image: "/cold-brew-coffee-glass.jpg",
  },

  // Tea & Non-Coffee
  {
    id: 6,
    categoryId: 2,
    name: "Earl Grey Tea",
    description: "Classic bergamot-flavored black tea",
    price: 20000,
    preparationTime: 5,
    image: "/earl-grey-tea-cup.jpg",
  },
  {
    id: 7,
    categoryId: 2,
    name: "Green Tea Latte",
    description: "Matcha powder with steamed milk",
    price: 28000,
    preparationTime: 6,
    image: "/matcha-latte.png",
  },
  {
    id: 8,
    categoryId: 2,
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice",
    price: 25000,
    preparationTime: 3,
    image: "/fresh-orange-juice-glass.jpg",
  },

  // Pastries & Desserts
  {
    id: 9,
    categoryId: 3,
    name: "Croissant",
    description: "Buttery, flaky French pastry",
    price: 15000,
    preparationTime: 2,
    image: "/buttery-croissant-pastry.jpg",
  },
  {
    id: 10,
    categoryId: 3,
    name: "Blueberry Muffin",
    description: "Fresh baked muffin with real blueberries",
    price: 18000,
    preparationTime: 2,
    image: "/blueberry-muffin.png",
  },
  {
    id: 11,
    categoryId: 3,
    name: "Chocolate Cake Slice",
    description: "Rich chocolate cake with ganache",
    price: 35000,
    preparationTime: 2,
    image: "/chocolate-cake-slice.png",
  },

  // Light Meals
  {
    id: 12,
    categoryId: 4,
    name: "Club Sandwich",
    description: "Triple-decker with chicken, bacon, lettuce, tomato",
    price: 45000,
    preparationTime: 12,
    image: "/club-sandwich.jpg",
  },
  {
    id: 13,
    categoryId: 4,
    name: "Caesar Salad",
    description: "Fresh romaine with parmesan and croutons",
    price: 38000,
    preparationTime: 8,
    image: "/caesar-salad.png",
  },

  // Breakfast
  {
    id: 14,
    categoryId: 5,
    name: "Pancakes",
    description: "Fluffy pancakes with maple syrup and butter",
    price: 40000,
    preparationTime: 15,
    image: "/stack-of-pancakes-with-syrup.jpg",
  },
  {
    id: 15,
    categoryId: 5,
    name: "Avocado Toast",
    description: "Smashed avocado on sourdough with seasoning",
    price: 35000,
    preparationTime: 8,
    image: "/avocado-toast.png",
  },
]

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  specialNotes?: string
}

export default function MenuPage() {
  const searchParams = useSearchParams()
  const [orderType, setOrderType] = useState<string>(searchParams.get("type") || "dine_in")
  const [cart, setCart] = useState<CartItem[]>([])
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    deliveryAddress: "",
  })
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [activeCategory, setActiveCategory] = useState("1")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const addToCart = (item: any) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id)
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId: number) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === itemId)
      if (existing && existing.quantity > 1) {
        return prev.map((cartItem) =>
          cartItem.id === itemId ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem,
        )
      }
      return prev.filter((cartItem) => cartItem.id !== itemId)
    })
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const filteredItems = menuItems.filter((item) => item.categoryId === Number.parseInt(activeCategory))

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
                <p className="text-sm text-muted-foreground">Order Menu</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button variant="outline" className="bg-transparent">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Cart ({getTotalItems()})
                </Button>
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                    {getTotalItems()}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            {/* Order Type Selection */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Select Order Type</h2>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={orderType === "dine_in" ? "default" : "outline"}
                  onClick={() => setOrderType("dine_in")}
                  className="flex flex-col items-center p-6 h-auto bg-transparent"
                >
                  <Coffee className="w-8 h-8 mb-2" />
                  <span>Dine In</span>
                </Button>
                <Button
                  variant={orderType === "takeaway" ? "default" : "outline"}
                  onClick={() => setOrderType("takeaway")}
                  className="flex flex-col items-center p-6 h-auto bg-transparent"
                >
                  <ShoppingCart className="w-8 h-8 mb-2" />
                  <span>Takeaway</span>
                </Button>
                <Button
                  variant={orderType === "delivery" ? "default" : "outline"}
                  onClick={() => setOrderType("delivery")}
                  className="flex flex-col items-center p-6 h-auto bg-transparent"
                >
                  <MapPin className="w-8 h-8 mb-2" />
                  <span>Delivery</span>
                </Button>
              </div>
            </div>

            {/* Menu Categories */}
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8">
                {menuCategories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id.toString()} className="text-xs">
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {menuCategories.map((category) => (
                <TabsContent key={category.id} value={category.id.toString()}>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{category.name}</h3>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredItems.map((item) => (
                      <Card key={item.id} className="hover:shadow-lg transition-shadow">
                        <div className="flex">
                          <div className="w-32 h-32 bg-muted rounded-l-lg overflow-hidden">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-4">
                            <CardHeader className="p-0 mb-3">
                              <CardTitle className="text-lg">{item.name}</CardTitle>
                              <CardDescription className="text-sm">{item.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-lg font-bold text-primary">{formatPrice(item.price)}</span>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="w-4 h-4" />
                                  {item.preparationTime}m
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {cart.find((cartItem) => cartItem.id === item.id) ? (
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => removeFromCart(item.id)}
                                      className="w-8 h-8 p-0 bg-transparent"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="w-8 text-center font-medium">
                                      {cart.find((cartItem) => cartItem.id === item.id)?.quantity}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => addToCart(item)}
                                      className="w-8 h-8 p-0 bg-transparent"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button size="sm" onClick={() => addToCart(item)}>
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Summary
                </CardTitle>
                <CardDescription>
                  {orderType === "dine_in" && "Dine In Order"}
                  {orderType === "takeaway" && "Takeaway Order"}
                  {orderType === "delivery" && "Delivery Order"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Your cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatPrice(item.price)} x {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromCart(item.id)}
                              className="w-6 h-6 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => addToCart({ id: item.id, name: item.name, price: item.price })}
                              className="w-6 h-6 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="your@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="+62 812 3456 7890"
                        />
                      </div>
                      {orderType === "delivery" && (
                        <div className="space-y-2">
                          <Label htmlFor="address">Delivery Address</Label>
                          <Textarea
                            id="address"
                            value={customerInfo.deliveryAddress}
                            onChange={(e) => setCustomerInfo((prev) => ({ ...prev, deliveryAddress: e.target.value }))}
                            placeholder="Enter your full delivery address"
                            rows={3}
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="instructions">Special Instructions</Label>
                        <Textarea
                          id="instructions"
                          value={specialInstructions}
                          onChange={(e) => setSpecialInstructions(e.target.value)}
                          placeholder="Any special requests..."
                          rows={2}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-primary">{formatPrice(getTotalPrice())}</span>
                      </div>
                    </div>

                    <Button asChild className="w-full" size="lg">
                      <Link href={`/payment?orderId=ORD-${Date.now()}`}>Proceed to Payment</Link>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
