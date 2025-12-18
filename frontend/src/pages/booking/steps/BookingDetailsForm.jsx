import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useDepartment } from '../../../context/DepartmentContext';
import { 
  FaUserEdit, 
  FaUserCheck,
  FaFemale,
  FaWheelchair,
  FaArrowLeft,
  FaArrowRight,
  FaStar,
  FaInfoCircle,
  FaHourglassHalf
} from 'react-icons/fa';

const BookingDetailsForm = () => {
  const { deptId, serviceId } = useParams();
  const { bookingData, onStepComplete, onStepBack } = useOutletContext();
  const { user } = useAuth();
  const { currentDepartment } = useDepartment();
  const navigate = useNavigate();
  
  const [priorityType, setPriorityType] = useState(bookingData.priorityType || 'NONE');
  const [notes, setNotes] = useState(bookingData.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const priorityCriteria = currentDepartment?.priorityCriteria || {};
  
  // Find the specific service from the department's services array
  const currentService = currentDepartment?.services?.find(
    service => service._id === serviceId || service.serviceId === serviceId
  );

  const priorityOptions = [
    { 
      value: 'NONE', 
      label: 'Regular Booking', 
      icon: FaUserCheck, 
      color: 'blue',
      borderClass: 'border-blue-500',
      bgClass: 'bg-blue-50',
      textClass: 'text-blue-700',
      iconBgClass: 'bg-blue-500'
    },
  ];

  // Add priority options based on department criteria - SHOW ALL OPTIONS
  if (currentService?.priorityAllowed) {
    // Senior Citizen option - always show if department allows it
    if (priorityCriteria.seniorCitizenAge) {
      priorityOptions.push({
        value: 'SENIOR_CITIZEN',
        label: `Senior Citizen (${priorityCriteria.seniorCitizenAge}+ years)`,
        icon: FaHourglassHalf,
        color: 'purple',
        borderClass: 'border-purple-500',
        bgClass: 'bg-purple-50',
        textClass: 'text-purple-700',
        iconBgClass: 'bg-purple-500'
      });
    }
    
    // Pregnant Women option - always show if department allows it
    if (priorityCriteria.allowPregnantWomen) {
      priorityOptions.push({
        value: 'PREGNANT_WOMEN',
        label: 'Pregnant Women',
        icon: FaFemale,
        color: 'pink',
        borderClass: 'border-pink-500',
        bgClass: 'bg-pink-50',
        textClass: 'text-pink-700',
        iconBgClass: 'bg-pink-500'
      });
    }
    
    // Differently Abled option - always show if department allows it
    if (priorityCriteria.allowDifferentlyAbled) {
      priorityOptions.push({
        value: 'DIFFERENTLY_ABLED',
        label: 'Differently Abled',
        icon: FaWheelchair,
        color: 'green',
        borderClass: 'border-green-500',
        bgClass: 'bg-green-50',
        textClass: 'text-green-700',
        iconBgClass: 'bg-green-500'
      });
    }
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (priorityType !== 'NONE') {
      if (!currentService?.priorityAllowed) {
        newErrors.priorityType = 'Priority service is not available for this service';
      }
    }
    
    if (notes.length > 500) {
      newErrors.notes = 'Notes cannot exceed 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateForm()) return;
    
    onStepComplete({
      priorityType,
      notes: notes.trim()
    });
    navigate('../confirm');
  };

  const handleBack = () => {
    onStepBack();
    navigate('../time');
  };

  const getPriorityColorClass = (type) => {
    const option = priorityOptions.find(opt => opt.value === type);
    return option?.textClass || 'text-slate-900';
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FaUserEdit className="text-green-600 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Additional Details</h2>
        <p className="text-slate-600">Add priority access and any special notes for your appointment</p>
      </div>

      <div className="space-y-8">
        {/* Priority Selection */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FaStar className="text-amber-600" />
            <h3 className="text-lg font-semibold text-slate-900">Priority Access</h3>
          </div>
          
          <p className="text-sm text-slate-600 mb-4">
            Select priority type if you are eligible for special access. 
            {!currentService?.priorityAllowed && (
              <span className="text-amber-600 font-medium"> Priority service is not available for this service.</span>
            )}
          </p>
          
          {/* Eligibility Information - REMOVED AGE DISPLAY */}
          <div className="mb-4 space-y-2">
            {priorityCriteria.seniorCitizenAge && (
              <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700">
                  <FaInfoCircle className="inline mr-1" />
                  <span className="font-medium">Senior Citizen:</span> Age {priorityCriteria.seniorCitizenAge}+ years
                </p>
              </div>
            )}
            {priorityCriteria.allowPregnantWomen && (
              <div className="p-2 bg-pink-50 border border-pink-200 rounded-lg">
                <p className="text-xs text-pink-700">
                  <FaInfoCircle className="inline mr-1" />
                  <span className="font-medium">Pregnant Women:</span> Pregnancy verification required
                </p>
              </div>
            )}
            {priorityCriteria.allowDifferentlyAbled && (
              <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-700">
                  <FaInfoCircle className="inline mr-1" />
                  <span className="font-medium">Differently Abled:</span> Disability certificate required
                </p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {priorityOptions.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => setPriorityType(option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  priorityType === option.value
                    ? `${option.borderClass} ${option.bgClass}`
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    priorityType === option.value
                      ? `${option.iconBgClass} text-white`
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    <option.icon />
                  </div>
                  <div className="text-left">
                    <div className={`font-medium ${
                      priorityType === option.value ? option.textClass : 'text-slate-900'
                    }`}>
                      {option.label}
                    </div>
                    {priorityType === option.value && option.value !== 'NONE' && (
                      <div className="text-xs text-slate-500 mt-1">
                        Valid ID/document required for verification
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
          
          {errors.priorityType && (
            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
              <FaInfoCircle />
              {errors.priorityType}
            </p>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FaUserEdit className="text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-900">Additional Notes (Optional)</h3>
          </div>
          
          <div className="space-y-2">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special requirements, notes for the staff, or specific assistance needed..."
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-32"
              maxLength={500}
            />
            <div className="flex justify-between text-sm text-slate-500">
              <span>Max 500 characters</span>
              <span>{notes.length}/500</span>
            </div>
          </div>
          
          {errors.notes && (
            <p className="text-red-600 text-sm mt-2">{errors.notes}</p>
          )}
        </div>

        {/* Preview */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FaInfoCircle className="text-blue-600" />
            <h4 className="font-medium text-slate-900">Appointment Summary</h4>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Date:</span>
              <span className="text-sm font-medium text-slate-900">
                {bookingData.date && new Date(bookingData.date).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Time:</span>
              <span className="text-sm font-medium text-slate-900">
                {bookingData.slotTime && bookingData.slotTime.replace('-', ' - ')}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Priority:</span>
              <span className={`text-sm font-medium ${getPriorityColorClass(priorityType)}`}>
                {priorityOptions.find(opt => opt.value === priorityType)?.label || 'Regular'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t border-slate-200">
        <motion.button
          onClick={handleBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
        >
          <FaArrowLeft />
          Back to Time
        </motion.button>
        
        <motion.button
          onClick={handleNext}
          disabled={isSubmitting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium shadow-lg"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              Next: Review & Confirm
              <FaArrowRight />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default BookingDetailsForm;