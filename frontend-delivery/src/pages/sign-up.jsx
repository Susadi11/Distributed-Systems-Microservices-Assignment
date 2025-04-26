import { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"
import { Car, Eye, EyeOff, Lock, Mail, Phone, User, MapPin } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card.jsx"
import { Input } from "../components/ui/input.jsx"
import { Label } from "../components/ui/label.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select.jsx"
import { Checkbox } from "../components/ui/checkbox.jsx"
import LocationPicker from "../components/ui/location-picker.jsx"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    vehicalNumber: "",
    vehicleType: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    licenseNumber: "",
    driversAddress: "",
    latitude: "",
    longitude: "",
    agreeTerms: false,
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user selects
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleLocationChange = (location) => {
    setFormData({
      ...formData,
      location,
    })

    // Clear error when user selects location
    if (errors.location) {
      setErrors({
        ...errors,
        location: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name) newErrors.name = "Full name is required"

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.vehicleType) newErrors.vehicleType = "Vehicle type is required"
    if (!formData.vehicleMake) newErrors.vehicleMake = "Vehicle make is required"
    if (!formData.vehicleModel) newErrors.vehicleModel = "Vehicle model is required"
    if (!formData.vehicleYear) newErrors.vehicleYear = "Vehicle year is required"
    if (!formData.licenseNumber) newErrors.licenseNumber = "License number is required"

    if (!formData.location) {
      newErrors.location = "Please select your location on the map"
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleDeliveryPersonSignup = async (e) => {
  e.preventDefault();

  if (validateForm()) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        address: formData.driversAddress,
        phone: formData.phone,
        role: "delivery_personnel",
        deliveryPersonnelDetails: {
          vehicleType: formData.vehicleType,
          vehicleNumber: formData.vehicalNumber,
          Make: formData.vehicleMake,
          Model: formData.vehicleModel,
          year: formData.vehicleYear,
          DriverLicense: formData.licenseNumber,
          longitude: formData.location?.lng,
          latitude: formData.location?.lat,
        }
      });

      console.log("Response:", response.data); // Log the response data

      const { token, user } = response.data;

      localStorage.setItem("driverToken", token);
      localStorage.setItem("driverInfo", JSON.stringify(user));

      toast.success("Signup successful!");

      // Redirect to dashboard after successful signup
      navigate("/");
      
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("Signup failed. Please try again.");
    }
  }
};


  return (
    <div className="flex min-h-screen justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Driver Portal</h1>
          <p className="text-gray-500">Create your driver account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Fill out the form below to create your driver account</CardDescription>
          </CardHeader>
          <form onSubmit={handleDeliveryPersonSignup}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="Name">Full Name </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input
                        id="Name"
                        name="name"
                        placeholder="Doe"
                        className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(123) 456-7890"
                      className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="•••••••"
                        className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`pl-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Vehicle Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select
                    value={formData.vehicleType}
                    onValueChange={(value) => handleSelectChange("vehicleType", value)}
                  >
                    <SelectTrigger id="vehicleType" className={errors.vehicleType ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="bicycle">Bicycle</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.vehicleType && <p className="text-sm text-red-500">{errors.vehicleType}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleMake">Make</Label>
                    <div className="relative">
                      <Car className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input
                        id="vehicleMake"
                        name="vehicleMake"
                        placeholder="Toyota"
                        className={`pl-10 ${errors.vehicleMake ? "border-red-500" : ""}`}
                        value={formData.vehicleMake}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.vehicleMake && <p className="text-sm text-red-500">{errors.vehicleMake}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel">Model</Label>
                    <Input
                      id="vehicleModel"
                      name="vehicleModel"
                      placeholder="Corolla"
                      className={errors.vehicleModel ? "border-red-500" : ""}
                      value={formData.vehicleModel}
                      onChange={handleChange}
                    />
                    {errors.vehicleModel && <p className="text-sm text-red-500">{errors.vehicleModel}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleYear">Year</Label>
                    <Input
                      id="vehicleYear"
                      name="vehicleYear"
                      placeholder="2020"
                      className={errors.vehicleYear ? "border-red-500" : ""}
                      value={formData.vehicleYear}
                      onChange={handleChange}
                    />
                    {errors.vehicleYear && <p className="text-sm text-red-500">{errors.vehicleYear}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Driver's License Number</Label>
                  <Input
                    id="licenseNumber"
                    name="licenseNumber"
                    placeholder="DL12345678"
                    className={errors.licenseNumber ? "border-red-500" : ""}
                    value={formData.licenseNumber}
                    onChange={handleChange}
                  />
                  {errors.licenseNumber && <p className="text-sm text-red-500">{errors.licenseNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicalNumber">Vehical Number</Label>
                  <Input
                    id="vehicalNumber"
                    name="vehicalNumber"
                    placeholder="DL12345678"
                    className={errors.vehicalNumber ? "border-red-500" : ""}
                    value={formData.vehicalNumber}
                    onChange={handleChange}
                  />
                  {errors.vehicalNumber && <p className="text-sm text-red-500">{errors.vehicalNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driversAddress">Drivers Address</Label>
                  <Input
                    id="driversAddress"
                    name="driversAddress"
                    placeholder="72/16/c, Sovi Road, Colombo 7."
                    className={errors.driversAddress ? "border-red-500" : ""}
                    value={formData.driversAddress}
                    onChange={handleChange}
                  />
                  {errors.driversAddress && <p className="text-sm text-red-500">{errors.driversAddress}</p>}
                </div>
              </div>

              

              {/* Location Picker Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Your Location</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>Click on the map to set your location</span>
                  </div>
                </div>

                <div className={`rounded-md border ${errors.location ? "border-red-500" : "border-gray-200"}`}>
                  <LocationPicker onLocationSelect={handleLocationChange} />
                </div>
                {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}

                {formData.location && (
                  <div className="rounded-md bg-gray-50 p-3 text-sm">
                    <p className="font-medium">Selected Location:</p>
                    <p>Latitude: {formData.location.lat.toFixed(6)}</p>
                    <p>Longitude: {formData.location.lng.toFixed(6)}</p>
                  </div>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked })}
                  className={errors.agreeTerms ? "border-red-500" : ""}
                />
                <div className="space-y-1">
                  <Label htmlFor="agreeTerms" className="text-sm font-normal">
                    I agree to the{" "}
                    <Link to="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                  {errors.agreeTerms && <p className="text-sm text-red-500">{errors.agreeTerms}</p>}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                Create Account
              </Button>
              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/" className="font-medium text-blue-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}