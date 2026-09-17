import React, { useState } from 'react';
import { 
  X, Check, Calendar, Users, ShieldCheck, Sparkles, CreditCard, 
  Download, Printer, ArrowRight, ArrowLeft, Building2, MapPin, 
  CheckCircle2, Clock, AlertCircle, Info, ChevronRight
} from 'lucide-react';
import { bookingsAPI, formatMoney, formatDate } from '../../services/api';

export default function MultiStepBookingModal({
  isOpen,
  onClose,
  item, // Can be an experience (event) or stay
  itemType = 'experience', // 'experience' | 'stay'
  onBookingSuccess
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 2: Date
  const [selectedDate, setSelectedDate] = useState(
    item?.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Step 3: Guests
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [selectedRoomType, setSelectedRoomType] = useState(
    item?.roomTypes?.[0]?.title || 'Standard Room'
  );

  // Step 4: Options / Add-ons
  const availableAddOns = itemType === 'stay' ? [
    { id: 'breakfast', title: 'Buffet Breakfast & High Tea', price: 650, selected: true },
    { id: 'airport', title: 'Private Volvo / Station Cab Pickup', price: 1200, selected: false },
    { id: 'spa', title: 'Himalayan Ayurvedic Spa Session', price: 1800, selected: false }
  ] : [
    { id: 'gear', title: 'Alpine Trekking Pole & Gaiters Rental', price: 600, selected: true },
    { id: 'gopro', title: 'GoPro HD Expedition Video Reel Pack', price: 800, selected: false },
    { id: 'insurance', title: 'Adventure Travel Rescue Protection', price: 450, selected: true }
  ];

  const [selectedAddOns, setSelectedAddOns] = useState(
    availableAddOns.filter((a) => a.selected)
  );

  // Step 5: Customer Information
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  // Step 7: Completed Booking Voucher
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!isOpen || !item) return null;

  // Pricing calculations
  const totalGuests = adults + children;
  const nights = itemType === 'stay' ? Math.max(1, Math.round((new Date(checkOutDate) - new Date(selectedDate)) / (1000 * 60 * 60 * 24))) : 1;
  const unitPrice = itemType === 'stay' ? (item.pricePerNight || 3000) : (item.price || 1500);
  const basePrice = itemType === 'stay' ? unitPrice * nights : unitPrice * adults;
  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const taxes = Math.round((basePrice + addOnsTotal) * 0.12); // 12% GST
  const serviceFee = Math.round((basePrice + addOnsTotal) * 0.05); // 5% platform fee
  const discount = step >= 6 ? 400 : 0; // TripShare welcome voucher discount
  const finalTotal = Math.max(0, basePrice + addOnsTotal + taxes + serviceFee - discount);

  const toggleAddOn = (addon) => {
    if (selectedAddOns.some((a) => a.id === addon.id)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  const handleNextStep = () => {
    setError('');
    if (step === 2 && !selectedDate) {
      setError('Please select a travel / check-in date.');
      return;
    }
    if (step === 5) {
      if (!customerInfo.fullName.trim() || !customerInfo.email.trim() || !customerInfo.phone.trim()) {
        setError('Please fill in all required customer details.');
        return;
      }
      if (!customerInfo.email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleConfirmAndPay = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        bookingType: itemType,
        eventId: itemType === 'experience' ? item._id : undefined,
        stayId: itemType === 'stay' ? item._id : undefined,
        stayRoomType: selectedRoomType,
        quantity: itemType === 'stay' ? 1 : adults,
        checkInDate: selectedDate,
        checkOutDate: itemType === 'stay' ? checkOutDate : undefined,
        guests: { adults, children },
        addOns: selectedAddOns,
        customerInfo,
        priceBreakdown: {
          basePrice,
          taxes,
          serviceFee,
          discount,
          addOnsTotal,
          totalAmount: finalTotal
        },
        totalAmount: finalTotal,
        paymentMethod: 'sandbox_payment'
      };

      const res = await bookingsAPI.create(payload);
      if (res.success && res.booking) {
        setConfirmedBooking(res.booking);
        setStep(7); // Jump to confirmation voucher
        if (onBookingSuccess) onBookingSuccess(res.booking);
      }
    } catch (err) {
      setError(err.message || 'Payment simulation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content max-w-2xl bg-[#0c111c] border border-white/15 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-saffron-500/20 text-saffron-400 font-bold text-xs flex items-center justify-center border border-saffron-500/40">
              {step}/7
            </span>
            <div>
              <h2 className="text-lg font-display font-bold text-white">
                {step === 1 && 'Step 1: Booking Overview'}
                {step === 2 && 'Step 2: Choose Dates'}
                {step === 3 && 'Step 3: Travellers & Room'}
                {step === 4 && 'Step 4: Curated Add-ons'}
                {step === 5 && 'Step 5: Traveller Information'}
                {step === 6 && 'Step 6: Price & Sandbox Payment'}
                {step === 7 && 'Step 7: Booking Confirmed!'}
              </h2>
              <p className="text-xs text-white/50">{item.title || item.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Overview */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="relative h-44 rounded-2xl overflow-hidden border border-white/10">
              <img
                src={item.heroImage || item.image}
                alt={item.title || item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-saffron-500 text-white font-bold uppercase tracking-wider">
                    {itemType === 'stay' ? item.propertyType : item.category}
                  </span>
                  <h3 className="text-xl font-display font-bold text-white mt-1">{item.title || item.name}</h3>
                  <p className="text-xs text-white/70 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-saffron-400" />
                    {item.city || item.destination}, India
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              {item.description?.substring(0, 180)}...
            </p>

            <div className="grid grid-cols-2 gap-3 p-3 bg-white/5 rounded-xl border border-white/5 text-xs">
              <div>
                <span className="text-white/40 block text-[11px]">Price Starts At</span>
                <span className="text-base font-bold text-saffron-400">
                  {formatMoney(itemType === 'stay' ? item.pricePerNight : item.price)}
                </span>
                <span className="text-[10px] text-white/40">{itemType === 'stay' ? '/night' : '/traveller'}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[11px]">Cancellation Policy</span>
                <span className="text-white/80 font-medium">
                  {item.cancellationPolicy || 'Free cancellation up to 48 hrs prior'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Date Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <label className="block text-xs font-semibold text-white/80">
              {itemType === 'stay' ? 'Check-in Date' : 'Expedition / Experience Date'}
            </label>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field text-sm"
            />

            {itemType === 'stay' && (
              <>
                <label className="block text-xs font-semibold text-white/80 mt-3">Check-out Date</label>
                <input
                  type="date"
                  value={checkOutDate}
                  min={selectedDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="input-field text-sm"
                />
                <div className="p-3 bg-white/5 rounded-xl text-xs text-white/70 flex items-center justify-between">
                  <span>Stay Duration:</span>
                  <span className="font-bold text-azure-400">{nights} Night(s)</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 3: Guests / Rooms */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
              <div>
                <span className="text-sm font-semibold text-white block">Adults</span>
                <span className="text-xs text-white/50">Age 13+ years</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                >
                  -
                </button>
                <span className="font-bold text-sm w-4 text-center">{adults}</span>
                <button
                  type="button"
                  onClick={() => setAdults((prev) => Math.min(10, prev + 1))}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
              <div>
                <span className="text-sm font-semibold text-white block">Children</span>
                <span className="text-xs text-white/50">Age 2 - 12 years</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                >
                  -
                </button>
                <span className="font-bold text-sm w-4 text-center">{children}</span>
                <button
                  type="button"
                  onClick={() => setChildren((prev) => Math.min(6, prev + 1))}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                >
                  +
                </button>
              </div>
            </div>

            {itemType === 'stay' && item.roomTypes?.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-2">Select Room Category</label>
                <div className="space-y-2">
                  {item.roomTypes.map((room) => (
                    <div
                      key={room.title}
                      onClick={() => setSelectedRoomType(room.title)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedRoomType === room.title
                          ? 'bg-saffron-500/10 border-saffron-500 text-white'
                          : 'bg-white/5 border-white/5 hover:border-white/20 text-white/70'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block">{room.title}</span>
                        <span className="text-[11px] text-white/50">{room.bedType} • {room.size}</span>
                      </div>
                      <span className="text-xs font-bold text-saffron-400">
                        {formatMoney(room.pricePerNight)}/night
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Add-ons */}
        {step === 4 && (
          <div className="space-y-3">
            <p className="text-xs text-white/60 mb-2">
              Enhance your experience with handpicked travel add-ons curated for this trip:
            </p>
            {availableAddOns.map((addon) => {
              const isSelected = selectedAddOns.some((a) => a.id === addon.id);
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddOn(addon)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-saffron-500/15 border-saffron-500/60 text-white'
                      : 'bg-white/5 border-white/5 hover:border-white/15 text-white/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isSelected ? 'bg-saffron-500 border-saffron-500 text-white' : 'border-white/20'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <span className="text-xs font-semibold block">{addon.title}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white">+{formatMoney(addon.price)}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* STEP 5: Customer Information */}
        {step === 5 && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">Primary Guest Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={customerInfo.fullName}
                onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                className="input-field text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Email Address *</label>
                <input
                  type="email"
                  placeholder="rahul@example.com"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="input-field text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">Special Requests / Preferences</label>
              <textarea
                rows={2}
                placeholder="Vegetarian meals, upper deck tent, late check-in..."
                value={customerInfo.specialRequests}
                onChange={(e) => setCustomerInfo({ ...customerInfo, specialRequests: e.target.value })}
                className="input-field text-sm resize-none"
              />
            </div>
          </div>
        )}

        {/* STEP 6: Price Breakdown & Sandbox Payment */}
        {step === 6 && (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between text-white/70">
                <span>
                  Base Rate ({itemType === 'stay' ? `${nights} Nights` : `${adults} Guests`})
                </span>
                <span className="font-semibold text-white">{formatMoney(basePrice)}</span>
              </div>
              {addOnsTotal > 0 && (
                <div className="flex items-center justify-between text-white/70">
                  <span>Selected Add-ons</span>
                  <span className="font-semibold text-white">+{formatMoney(addOnsTotal)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-white/70">
                <span>Taxes & GST (12%)</span>
                <span className="font-semibold text-white">+{formatMoney(taxes)}</span>
              </div>
              <div className="flex items-center justify-between text-white/70">
                <span>Platform Service & Safety Fee (5%)</span>
                <span className="font-semibold text-white">+{formatMoney(serviceFee)}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-400">
                  <span>TripShare Community Welcome Discount</span>
                  <span className="font-semibold">-{formatMoney(discount)}</span>
                </div>
              )}
              <div className="border-t border-white/10 pt-2 flex items-center justify-between text-sm font-bold text-white">
                <span>Total Amount Payable</span>
                <span className="text-saffron-400 text-base">{formatMoney(finalTotal)}</span>
              </div>
            </div>

            {/* Sandbox Payment Simulator Notice */}
            <div className="p-3.5 bg-azure-500/10 border border-azure-500/30 rounded-2xl flex items-start gap-3 text-xs">
              <CreditCard className="w-5 h-5 text-azure-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-azure-400 block mb-0.5">Secure Sandbox Gateway Enabled</span>
                <p className="text-white/70">
                  This transaction is processed via the TripShare India Sandbox Testing Provider. No real money will be charged to your card. A verifiable booking voucher will be generated immediately.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Booking Confirmed & Printable Voucher */}
        {step === 7 && confirmedBooking && (
          <div className="space-y-4 print:p-0">
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/40 animate-bounce">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white">Booking Confirmed!</h3>
              <p className="text-xs text-white/60">
                Your journey has been reserved. Voucher sent to {confirmedBooking.customerInfo?.email || 'your email'}.
              </p>
            </div>

            {/* Voucher Card */}
            <div className="p-4 bg-[#080d16] border border-white/15 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-white/40 block">Booking Reference</span>
                  <span className="text-base font-mono font-bold text-saffron-400 tracking-wider">
                    {confirmedBooking.bookingReference}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-white/40 block">Status</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold uppercase text-[10px]">
                    {confirmedBooking.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-white/80">
                <div>
                  <span className="text-white/40 block text-[10px]">Item</span>
                  <span className="font-semibold text-white">{item.title || item.name}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px]">Date</span>
                  <span className="font-semibold text-white">{formatDate(confirmedBooking.checkInDate)}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px]">Lead Traveller</span>
                  <span className="font-semibold text-white">{confirmedBooking.customerInfo?.fullName}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px]">Total Paid (Sandbox)</span>
                  <span className="font-bold text-emerald-400">{formatMoney(confirmedBooking.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Voucher Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="flex-1 btn-outline text-xs py-2.5 rounded-xl flex items-center justify-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save Voucher</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 btn-saffron text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold"
              >
                <span>View My Bookings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        {step < 7 && (
          <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="btn-outline text-xs py-2 px-4 rounded-xl flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="btn-saffron text-xs py-2 px-5 rounded-xl flex items-center gap-1.5 font-semibold"
              >
                <span>Continue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleConfirmAndPay}
                className="btn-saffron text-xs py-2.5 px-6 rounded-xl flex items-center gap-2 font-bold shadow-saffron"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Sandbox Order...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>Pay {formatMoney(finalTotal)} (Sandbox)</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
