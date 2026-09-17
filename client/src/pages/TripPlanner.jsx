import React, { useState } from 'react';
import { 
  Compass, Calendar, Users, MapPin, Plus, Trash2, Edit3, 
  ArrowRight, Clock, Navigation, Car, Train, Plane, Fuel, 
  DollarSign, Check, Sparkles, Save, ChevronRight, Layers, 
  Utensils, BedDouble, Camera, ArrowDown
} from 'lucide-react';
import { tripsAPI, formatMoney } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function TripPlanner({ onTripCreated }) {
  const { isAuthenticated, showToast } = useAuth();

  // Route visualizer multi-stop state
  const [routeStops, setRouteStops] = useState([
    { city: 'Delhi', duration: 'Start', distance: '0 km', mode: 'Car' },
    { city: 'Jaipur', duration: '5h 30m', distance: '280 km', mode: 'Train' },
    { city: 'Jodhpur', duration: '5h 15m', distance: '335 km', mode: 'Self-Drive' },
    { city: 'Udaipur', duration: '4h 45m', distance: '260 km', mode: 'Car' },
    { city: 'Ahmedabad', duration: '5h 00m', distance: '260 km', mode: 'Volvo Bus' },
    { city: 'Mumbai', duration: '8h 20m', distance: '525 km', mode: 'Train' }
  ]);
  const [newStopCity, setNewStopCity] = useState('');

  // Trip planner inputs
  const [destination, setDestination] = useState('Manali & Spiti Valley');
  const [fromCity, setFromCity] = useState('Delhi');
  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [budget, setBudget] = useState(18500);
  const [groupSize, setGroupSize] = useState(4);
  const [travelStyle, setTravelStyle] = useState('Adventure');

  // Day-by-Day Interactive Itinerary
  const [itineraryDays, setItineraryDays] = useState([
    {
      day: 1,
      title: 'Arrival, Acclimatization & Old Manali Vibe',
      activities: [
        { id: '1', time: '10:00 AM', title: 'Check-in to Riverside Chalet & Morning Kahwa', type: 'stay', cost: 2400 },
        { id: '2', time: '02:00 PM', title: 'Manu Temple & Cedar Forest Nature Hike', type: 'activity', cost: 0 },
        { id: '3', time: '07:30 PM', title: 'Acoustic evening dinner at Café 1947', type: 'food', cost: 850 }
      ]
    },
    {
      day: 2,
      title: 'High Altitude Crossover: Atal Tunnel to Sissu',
      activities: [
        { id: '4', time: '08:00 AM', title: 'Drive through Atal Tunnel into Lahaul Valley', type: 'transit', cost: 1200 },
        { id: '5', time: '11:30 AM', title: 'Sissu Waterfall Glacier Stream Trek', type: 'activity', cost: 500 },
        { id: '6', time: '06:00 PM', title: 'Traditional Siddu & Trout Tasting in Vashisht', type: 'food', cost: 650 }
      ]
    },
    {
      day: 3,
      title: 'Alpine Pass & Glacial Lake Expedition',
      activities: [
        { id: '7', time: '06:30 AM', title: 'Early morning start towards Rohtang / Hampta base', type: 'transit', cost: 1500 },
        { id: '8', time: '01:00 PM', title: 'Glacial stream photography & packed lunch', type: 'activity', cost: 400 },
        { id: '9', time: '08:00 PM', title: 'Bonfire & stargazing gear check', type: 'activity', cost: 300 }
      ]
    }
  ]);

  // Activity modal/inputs
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityTime, setNewActivityTime] = useState('10:00 AM');
  const [newActivityCost, setNewActivityCost] = useState(500);
  const [newActivityType, setNewActivityType] = useState('activity');
  const [savingTrip, setSavingTrip] = useState(false);

  const addStop = () => {
    if (!newStopCity.trim()) return;
    setRouteStops([
      ...routeStops,
      { city: newStopCity.trim(), duration: '4h 30m', distance: '220 km', mode: 'Self-Drive' }
    ]);
    setNewStopCity('');
  };

  const removeStop = (idx) => {
    setRouteStops(routeStops.filter((_, i) => i !== idx));
  };

  const handleAddActivity = (dayIndex) => {
    if (!newActivityTitle.trim()) return;
    const updated = [...itineraryDays];
    updated[dayIndex].activities.push({
      id: Date.now().toString(),
      time: newActivityTime,
      title: newActivityTitle.trim(),
      type: newActivityType,
      cost: Number(newActivityCost) || 0
    });
    setItineraryDays(updated);
    setNewActivityTitle('');
    setNewActivityCost(500);
  };

  const handleDeleteActivity = (dayIndex, actId) => {
    const updated = [...itineraryDays];
    updated[dayIndex].activities = updated[dayIndex].activities.filter((a) => a.id !== actId);
    setItineraryDays(updated);
  };

  const handleSaveToTrips = async () => {
    if (!isAuthenticated) {
      showToast('Please login to save trips', 'info');
      return;
    }
    setSavingTrip(true);
    try {
      const payload = {
        title: `${destination} Expedition`,
        destination,
        fromCity,
        toCity: destination.split('&')[0].trim(),
        startDate,
        endDate,
        budget: Number(budget),
        travelStyle,
        groupSize: Number(groupSize),
        description: `Custom itinerary generated via TripShare Smart Planner spanning ${itineraryDays.length} days.`,
        itinerary: itineraryDays.map((d) => ({
          day: d.day,
          title: d.title,
          activity: d.activities.map((a) => `${a.time} - ${a.title}`).join('; '),
          activities: d.activities.map((a) => a.title),
          stayLocation: destination
        })),
        interests: ['Mountains', 'Road Trips', 'Adventure', 'Photography']
      };

      const res = await tripsAPI.create(payload);
      if (res.success && res.trip) {
        showToast('Trip itinerary saved to My Trips!', 'success');
        if (onTripCreated) onTripCreated(res.trip);
      }
    } catch (err) {
      showToast(err.message || 'Could not save trip', 'error');
    } finally {
      setSavingTrip(false);
    }
  };

  // Total calculated budget from itinerary
  const totalItineraryCost = itineraryDays.reduce(
    (daySum, d) => daySum + d.activities.reduce((actSum, a) => actSum + a.cost, 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#060910] text-white pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Planner Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8 flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/30 text-saffron-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Itinerary & Transit Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
              Trip Planner & Smart Route Visualizer
            </h1>
            <p className="text-xs sm:text-sm text-white/60">
              Build custom multi-day plans, reorder activities, calculate road distances, and forecast group costs.
            </p>
          </div>

          <button
            onClick={handleSaveToTrips}
            disabled={savingTrip}
            className="btn-saffron py-2.5 px-6 rounded-xl text-xs font-bold flex items-center gap-2 shadow-saffron"
          >
            {savingTrip ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save to My Trips</span>
          </button>
        </div>

        {/* Input Controls Panel */}
        <div className="bg-[#0c111d] border border-white/10 p-6 rounded-3xl shadow-xl mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-4 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-saffron-400" /> Plan Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-white/60 block mb-1">Target Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="input-field text-xs py-2.5"
              />
            </div>
            <div>
              <label className="text-xs text-white/60 block mb-1">Departure City</label>
              <input
                type="text"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="input-field text-xs py-2.5"
              />
            </div>
            <div>
              <label className="text-xs text-white/60 block mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field text-xs py-2.5"
              />
            </div>
            <div>
              <label className="text-xs text-white/60 block mb-1">Target Budget Per Person</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="input-field text-xs py-2.5"
              />
            </div>
          </div>
        </div>

        {/* Two-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Day-by-Day Itinerary */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-azure-400" /> Day-by-Day Itinerary Builder
              </h2>
              <span className="text-xs text-emerald-400 font-mono font-semibold">
                Est. Activity Cost: {formatMoney(totalItineraryCost)}
              </span>
            </div>

            {/* Days Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {itineraryDays.map((d, idx) => (
                <button
                  key={d.day}
                  onClick={() => setActiveDayIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeDayIndex === idx
                      ? 'bg-gradient-to-r from-saffron-500 to-amber-500 text-white shadow-lg'
                      : 'bg-[#0f1628] text-white/60 hover:text-white border border-white/5'
                  }`}
                >
                  Day {d.day}
                </button>
              ))}
            </div>

            {/* Active Day Activities Container */}
            {itineraryDays[activeDayIndex] && (
              <div className="bg-[#0c111d] border border-white/10 rounded-3xl p-6 shadow-xl space-y-6">
                <div className="border-b border-white/10 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-saffron-400 block mb-1">
                    Day {itineraryDays[activeDayIndex].day} Focus
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {itineraryDays[activeDayIndex].title}
                  </h3>
                </div>

                {/* Activity Items List */}
                <div className="space-y-3">
                  {itineraryDays[activeDayIndex].activities.map((act) => (
                    <div
                      key={act.id}
                      className="p-3.5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:border-white/15 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-saffron-400">
                          {act.type === 'food' && <Utensils className="w-4 h-4" />}
                          {act.type === 'stay' && <BedDouble className="w-4 h-4" />}
                          {act.type === 'transit' && <Car className="w-4 h-4" />}
                          {act.type === 'activity' && <Compass className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-white/50">{act.time}</span>
                            <span className="text-xs font-bold text-white">{act.title}</span>
                          </div>
                          <span className="text-[10px] text-white/40 capitalize">Category: {act.type}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-emerald-400 font-mono">
                          {act.cost > 0 ? formatMoney(act.cost) : 'Free'}
                        </span>
                        <button
                          onClick={() => handleDeleteActivity(activeDayIndex, act.id)}
                          className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-rose-400 transition-all p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Activity Bar */}
                <div className="p-4 bg-black/30 border border-white/5 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-white block">Add Activity to Day {itineraryDays[activeDayIndex].day}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <input
                      type="text"
                      placeholder="Activity description..."
                      value={newActivityTitle}
                      onChange={(e) => setNewActivityTitle(e.target.value)}
                      className="sm:col-span-6 input-field text-xs py-2"
                    />
                    <input
                      type="text"
                      placeholder="e.g. 02:00 PM"
                      value={newActivityTime}
                      onChange={(e) => setNewActivityTime(e.target.value)}
                      className="sm:col-span-2 input-field text-xs py-2"
                    />
                    <select
                      value={newActivityType}
                      onChange={(e) => setNewActivityType(e.target.value)}
                      className="sm:col-span-2 input-field text-xs py-2 bg-[#0c111c]"
                    >
                      <option value="activity">Activity</option>
                      <option value="food">Food</option>
                      <option value="stay">Stay</option>
                      <option value="transit">Transit</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleAddActivity(activeDayIndex)}
                      className="sm:col-span-2 btn-saffron text-xs py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Smart Route Visualizer */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Navigation className="w-5 h-5 text-saffron-400 rotate-45" /> Multi-Stop Route Visualizer
              </h2>
              <span className="text-xs text-white/50">{routeStops.length} Waypoints</span>
            </div>

            <div className="bg-[#0c111d] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
              {/* Route Waypoints Chain */}
              <div className="space-y-2">
                {routeStops.map((stop, idx) => (
                  <div key={idx} className="relative">
                    <div className="p-3.5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-saffron-500/20 text-saffron-400 font-bold text-xs flex items-center justify-center border border-saffron-500/40">
                          {idx + 1}
                        </div>
                        <div>
                          <span className="text-sm font-bold text-white block">{stop.city}</span>
                          <span className="text-[10px] text-white/50">{stop.distance} • {stop.duration} via {stop.mode}</span>
                        </div>
                      </div>

                      {routeStops.length > 2 && (
                        <button
                          onClick={() => removeStop(idx)}
                          className="text-white/30 hover:text-rose-400 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Connecting arrow indicator */}
                    {idx < routeStops.length - 1 && (
                      <div className="flex items-center justify-center py-1 text-white/20">
                        <ArrowDown className="w-4 h-4 text-saffron-500/60" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Waypoint Input */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add stop (e.g. Chandigarh, Pushkar)..."
                  value={newStopCity}
                  onChange={(e) => setNewStopCity(e.target.value)}
                  className="input-field text-xs py-2 flex-1"
                />
                <button
                  type="button"
                  onClick={addStop}
                  className="btn-outline text-xs py-2 px-3.5 rounded-xl font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-saffron-400" />
                  <span>Add Stop</span>
                </button>
              </div>

              {/* Total Transit Estimation Summary */}
              <div className="p-4 bg-gradient-to-r from-azure-500/10 to-saffron-500/10 border border-white/10 rounded-2xl text-xs space-y-1.5 mt-4">
                <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block">Transit Forecast</span>
                <div className="flex items-center justify-between text-white font-semibold">
                  <span>Total Corridor Distance:</span>
                  <span className="font-mono text-saffron-400">~1,740 km</span>
                </div>
                <div className="flex items-center justify-between text-white font-semibold">
                  <span>Estimated Road Travel Time:</span>
                  <span className="font-mono text-azure-400">~35 Hours</span>
                </div>
                <div className="flex items-center justify-between text-white font-semibold">
                  <span>Estimated Fuel / Transit Pass:</span>
                  <span className="font-mono text-emerald-400">₹8,400</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
