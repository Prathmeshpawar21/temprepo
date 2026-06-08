/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/Authentication/SubscriptionGuard.jsx


// src/component/Authentication/SubscriptionGuard.jsx
import React, { useState, useEffect } from "react";
import { Lock, Stethoscope, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from '../Authentication/SubscriptionContext';  // ✅ only this import

const PLAN_LEVELS = { free: 0, basic: 1, standard: 2, pro: 3 };

const PLAN_FEATURES = {
  basic: [
    "AI Symptom Chat",
    "Medical Records",
    "Appointment Booking (soon)",
    "Medication Tracking (soon)",
  ],
  standard: [
    "Voice Consultation with AI Doctor",
    "AI Second Opinion",
    "Prescription Upload & OCR Analysis (soon)",
    "Patient Records Upload (soon)",
  ],
  pro: [
    "Priority AI Response",
    "Unlimited Voice Sessions",
    "Health Analytics & Reports (soon)",
    "Advanced Insights (soon)",
  ],
};

const PLAN_PRICES = { basic: "$19", standard: "$29", pro: "$49" };

const SubscriptionGuard = ({ children, requiredPlan = "basic" }) => {
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);

  // ✅ Use context — no direct API call
  const { subscription, loading: subscriptionLoading } = useSubscription();

  useEffect(() => {
    // Clear payment flag if returning from payment success
    if (sessionStorage.getItem("payment_completed")) {
      sessionStorage.removeItem("payment_completed");
    }

    if (!subscriptionLoading) {
      const planName = subscription?.plan?.name?.toLowerCase() || 'free';
      const subStatus = subscription?.status || 'inactive';
      const effectivePlan = subStatus === 'active' || planName === 'free' ? planName : 'free';

      setCurrentPlan(effectivePlan);
      setHasAccess(
        (PLAN_LEVELS[effectivePlan] ?? 0) >= (PLAN_LEVELS[requiredPlan.toLowerCase()] ?? 0)
      );
    }
  }, [subscription, subscriptionLoading, requiredPlan]);

  // ✅ Correct variable name
  if (subscriptionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-teal-600 mx-auto mb-3" />
        </div>
      </div>
    );
  }

  if (hasAccess) return <>{children}</>;

  // ── Lock Screen ──────────────────────────────────────────
  const planLabel = requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1);
  const features = PLAN_FEATURES[requiredPlan.toLowerCase()] || [];
  const price = PLAN_PRICES[requiredPlan.toLowerCase()] || "";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-teal-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Lock className="w-8 h-8 text-teal-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {planLabel} Plan Required
        </h2>
        <p className="text-gray-400 text-sm mb-5">
          Current plan:{" "}
          <span className="font-semibold uppercase text-gray-600">
            {currentPlan || "free"}
          </span>
          {price && (
            <span className="ml-2 text-teal-600 font-bold">
              → {planLabel} {price}/mo
            </span>
          )}
        </p>
        {features.length > 0 && (
          <div className="bg-gradient-to-br from-teal-50 to-teal-50 rounded-2xl p-4 mb-6 text-left border border-teal-100">
            <p className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5" />
              Unlock with {planLabel}
            </p>
            <ul className="space-y-2">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-xs font-bold">✓</span>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="space-y-2.5">
          <button
            onClick={() => navigate("/subscription")}
            className="w-full py-3.5 px-6 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-100"
          >
            Upgrade to {planLabel}
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3.5 px-6 bg-white border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionGuard;






































// Layer 1 — Frontend Subscription Guard
// Mirrors backend RequirePlan logic on the client side.
// NOTE: This is a UX gate only — the backend RequirePlan is the real security.

// import React, { useState, useEffect } from "react";
// import { Lock, Stethoscope, ArrowRight } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { getMySubscription } from "../../api/subscriptionService";

// // Must match backend PLAN_HIERARCHY exactly
// const PLAN_LEVELS = { free: 0, basic: 1, standard: 2, pro: 3 };

// // What each plan unlocks — shown in the lock screen to motivate upgrade
// const PLAN_FEATURES = {
//   basic: [
//     "AI Symptom Chat",
//     "Medical Records",
//     "Appointment Booking (soon)",
//     "Medication Tracking (soon)",
//   ],
//   standard: [
//     "Voice Consultation with AI Doctor",
//     "AI Second Opinion",
//     "Prescription Upload & OCR Analysis (soon)",
//     "Patient Records Upload (soon)",
//   ],
//   pro: [
//     "Priority AI Response",
//     "Unlimited Voice Sessions",
//     "Health Analytics & Reports (soon)",
//     "Advanced Insights (soon)",
//   ],
// };

// const PLAN_PRICES = { basic: "$19", standard: "$29", pro: "$49" };

// const SubscriptionGuard = ({ children, requiredPlan = "basic" }) => {
//   const navigate = useNavigate();
//   // ✅ Read cache instantly — prevents flash on tab switch

//   const [currentPlan, setCurrentPlan] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [hasAccess, setHasAccess] = useState(false);


//   useEffect(() => {
//     // Clear cache if returning from a successful payment
//     if (sessionStorage.getItem("payment_completed")) {
//       localStorage.removeItem("ai_doctor_plan_cache");
//       sessionStorage.removeItem("payment_completed");
//     }
//     checkSubscription();
//   }, [requiredPlan]);


//   const checkSubscription = async () => {
//     setLoading(true);
//     try {
//       const response = await getMySubscription();
//       const subData = response.data?.subscription;
//       const planName = subData?.plan?.name?.toLowerCase() || "free";
//       const subStatus = subData?.status || "inactive";

//       // Only trust the plan if subscription is active (free always passes as-is)
//       const effectivePlan =
//         subStatus === "active" || planName === "free" ? planName : "free";

//       setCurrentPlan(effectivePlan);
//       setHasAccess(
//         (PLAN_LEVELS[effectivePlan] ?? 0) >=
//           (PLAN_LEVELS[requiredPlan.toLowerCase()] ?? 0)
//       );

//       // Short-lived cache (5 min) — backend is the real gate
//       localStorage.setItem(
//         "ai_doctor_plan_cache",
//         JSON.stringify({ plan: effectivePlan, ts: Date.now() })
//       );
//     } catch {
//       setCurrentPlan("free");
//       setHasAccess(PLAN_LEVELS["free"] >= (PLAN_LEVELS[requiredPlan] ?? 0));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ While loading: show children if cache says OK, spinner only on first-ever load
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh] bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-teal-600 mx-auto mb-3" />
//         </div>
//       </div>
//     );
//   }

//   if (hasAccess) return <>{children}</>;


//   // ── Lock Screen ──────────────────────────────────────────
//   const planLabel =
//     requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1);
//   const features = PLAN_FEATURES[requiredPlan.toLowerCase()] || [];
//   const price = PLAN_PRICES[requiredPlan.toLowerCase()] || "";

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-teal-50 to-teal-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-3xl shadow-xl border border-gray-100 max-w-md w-full p-8 text-center">
        
//         {/* Lock icon */}
//         <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
//           <Lock className="w-8 h-8 text-teal-600" />
//         </div>

//         {/* Heading */}
//         <h2 className="text-2xl font-bold text-gray-900 mb-1">
//           {planLabel} Plan Required
//         </h2>
//         <p className="text-gray-400 text-sm mb-5">
//           Current plan:{" "}
//           <span className="font-semibold uppercase text-gray-600">
//             {currentPlan || "free"}
//           </span>
//           {price && (
//             <span className="ml-2 text-teal-600 font-bold">
//               → {planLabel} {price}/mo
//             </span>
//           )}
//         </p>

//         {/* Features */}
//         {features.length > 0 && (
//           <div className="bg-gradient-to-br from-teal-50 to-teal-50 rounded-2xl p-4 mb-6 text-left border border-teal-100">
//             <p className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
//               <Stethoscope className="w-3.5 h-3.5" />
//               Unlock with {planLabel}
//             </p>
//             <ul className="space-y-2">
//               {features.map((f) => (
//                 <li
//                   key={f}
//                   className="flex items-center gap-2 text-sm text-gray-700"
//                 >
//                   <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
//                     <span className="text-green-600 text-xs font-bold">✓</span>
//                   </span>
//                   {f}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* CTAs */}
//         <div className="space-y-2.5">
//           <button
//             onClick={() => navigate("/subscription")}
//             className="w-full py-3.5 px-6 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-100"
//           >
//             Upgrade to {planLabel}
//             <ArrowRight className="w-4 h-4" />
//           </button>
//           <button
//             onClick={() => navigate(-1)}
//             className="w-full py-3.5 px-6 bg-white border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubscriptionGuard;
