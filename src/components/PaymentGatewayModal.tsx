import React, { useState, useEffect } from 'react';
import { 
  X, 
  CreditCard, 
  QrCode, 
  Smartphone, 
  Building2, 
  Banknote, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  Copy, 
  Check 
} from 'lucide-react';
import { PaymentMethod, RestaurantInfo } from '../types';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  finalAmount: number;
  customerName: string;
  restaurantInfo: RestaurantInfo;
  onPaymentSuccess: (paymentMethod: PaymentMethod, transactionId: string) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  finalAmount,
  customerName,
  restaurantInfo,
  onPaymentSuccess
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>('');
  const [upiTimer, setUpiTimer] = useState(300); // 5 mins
  const [upiIdInput, setUpiIdInput] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Card details
  const [cardNumber, setCardNumber] = useState('4532 8921 4452 9012');
  const [cardHolder, setCardHolder] = useState(customerName || 'KIRAN KUMAR');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('884');
  const [isFlipped, setIsFlipped] = useState(false);

  // Net banking
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // UPI Timer countdown
  useEffect(() => {
    if (activeTab === 'upi' && upiTimer > 0) {
      const interval = setInterval(() => setUpiTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [activeTab, upiTimer]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleExecutePayment = (method: PaymentMethod) => {
    setIsProcessing(true);
    setProcessStep('Connecting to Secure Payment Gateway...');

    setTimeout(() => {
      setProcessStep(
        method === 'upi' 
          ? 'Verifying UPI Authorization...' 
          : method === 'card' 
          ? 'Performing 3D Secure 2.0 Authentication...' 
          : method === 'netbanking' 
          ? `Authenticating with ${selectedBank}...` 
          : 'Generating Counter Cash Token...'
      );
    }, 1000);

    setTimeout(() => {
      setProcessStep('Payment Authorized & Captured Successfully!');
    }, 2200);

    setTimeout(() => {
      setIsProcessing(false);
      const txId = 'TXN_' + Math.random().toString(36).substring(2, 9).toUpperCase();
      onPaymentSuccess(method, txId);
    }, 3000);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    const parts = cleaned.match(/.{1,4}/g) || [];
    return parts.join(' ');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        id="payment-gateway-modal"
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 my-8 flex flex-col relative"
      >
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black shadow-md">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight">
                  {restaurantInfo.name} Payment Gateway
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  256-bit SSL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Amount Payable: <strong className="text-amber-300 font-black">Rs. {finalAmount.toFixed(2)}</strong>
              </p>
            </div>
          </div>

          {!isProcessing && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Processing State Overlay */}
        {isProcessing ? (
          <div className="p-12 text-center space-y-6 flex flex-col items-center justify-center min-h-[380px]">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-orange-200 border-t-orange-600 animate-spin flex items-center justify-center" />
              <ShieldCheck className="w-8 h-8 text-orange-600 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-black text-slate-900">Processing Your Payment</h4>
              <p className="text-xs font-semibold text-slate-500">{processStep}</p>
              <p className="text-[11px] text-slate-400">Please do not refresh or close this window.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 flex-1">
            
            {/* Left payment method navigation tabs */}
            <div className="md:col-span-5 bg-slate-50 border-r border-slate-200/80 p-4 space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Payment Methods
              </p>

              {/* UPI */}
              <button
                id="pay-tab-upi"
                onClick={() => setActiveTab('upi')}
                className={`w-full p-3 rounded-2xl text-left font-bold text-xs transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'upi'
                    ? 'bg-white text-orange-950 shadow-md border-l-4 border-l-orange-500 border border-slate-200/60'
                    : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-bold">UPI / QR Code</p>
                    <p className="text-[10px] text-slate-400 font-normal">GPay, PhonePe, Paytm</p>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md font-bold">
                  Fast
                </span>
              </button>

              {/* Card */}
              <button
                id="pay-tab-card"
                onClick={() => setActiveTab('card')}
                className={`w-full p-3 rounded-2xl text-left font-bold text-xs transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'card'
                    ? 'bg-white text-orange-950 shadow-md border-l-4 border-l-orange-500 border border-slate-200/60'
                    : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-bold">Credit / Debit Card</p>
                    <p className="text-[10px] text-slate-400 font-normal">Visa, Master, RuPay</p>
                  </div>
                </div>
              </button>

              {/* NetBanking */}
              <button
                id="pay-tab-netbanking"
                onClick={() => setActiveTab('netbanking')}
                className={`w-full p-3 rounded-2xl text-left font-bold text-xs transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'netbanking'
                    ? 'bg-white text-orange-950 shadow-md border-l-4 border-l-orange-500 border border-slate-200/60'
                    : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-bold">Net Banking</p>
                    <p className="text-[10px] text-slate-400 font-normal">All Major Indian Banks</p>
                  </div>
                </div>
              </button>

              {/* Cash / Counter */}
              <button
                id="pay-tab-cod"
                onClick={() => setActiveTab('cod')}
                className={`w-full p-3 rounded-2xl text-left font-bold text-xs transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'cod'
                    ? 'bg-white text-orange-950 shadow-md border-l-4 border-l-orange-500 border border-slate-200/60'
                    : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-bold">Pay at Counter / COD</p>
                    <p className="text-[10px] text-slate-400 font-normal">Cash or POS Machine</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Right Tab Content */}
            <div className="md:col-span-7 p-6 space-y-5">
              
              {/* TAB 1: UPI */}
              {activeTab === 'upi' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">Scan &amp; Pay via UPI</h4>
                      <p className="text-xs text-slate-500">Scan QR using any UPI app</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-semibold block">Expires in</span>
                      <span className="text-xs font-mono font-black text-rose-600">{formatTimer(upiTimer)}</span>
                    </div>
                  </div>

                  {/* QR Code graphic */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-xs border border-slate-200 flex items-center justify-center">
                      <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                        <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" />
                        <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" />
                        <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
                        <path d="M40,10 h10 v20 h-10 z M60,10 h5 v10 h-5 z" />
                        <path d="M40,40 h20 v20 h-20 z M10,40 h20 v10 h-20 z" />
                        <path d="M70,40 h10 v10 h-10 z M90,40 h10 v20 h-10 z" />
                        <path d="M40,70 h20 v10 h-20 z M70,70 h30 v30 h-30 z M80,80 h10 v10 h-10 z" />
                      </svg>
                    </div>
                    <p className="text-[11px] text-slate-600 font-mono font-bold">
                      UPI ID: <strong className="text-slate-900">frozenbottle.pay@icici</strong>
                    </p>
                  </div>

                  {/* UPI Apps Row */}
                  <div className="space-y-1.5">
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                      Popular UPI Apps
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                      <div className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200">
                        Google Pay
                      </div>
                      <div className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200">
                        PhonePe
                      </div>
                      <div className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200">
                        Paytm UPI
                      </div>
                      <div className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200">
                        BHIM UPI
                      </div>
                    </div>
                  </div>

                  {/* Complete Payment Button */}
                  <button
                    id="confirm-upi-btn"
                    onClick={() => handleExecutePayment('upi')}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>Simulate Successful UPI Payment</span>
                  </button>
                </div>
              )}

              {/* TAB 2: Card */}
              {activeTab === 'card' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Virtual Credit Card */}
                  <div className="w-full h-40 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 text-white p-4 shadow-xl border border-slate-700 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs tracking-widest text-amber-400">
                        FROZEN BOTTLE PLATINUM
                      </span>
                      <span className="font-mono text-xs font-black text-slate-300">VISA</span>
                    </div>

                    <div className="font-mono text-base tracking-widest text-slate-100 font-bold">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">Cardholder</span>
                        <span className="font-bold tracking-wider">{cardHolder || 'VALUED CUSTOMER'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">Expires</span>
                        <span className="font-bold font-mono">{cardExpiry || 'MM/YY'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Form */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Valid Thru (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                        />
                      </div>
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">CVV / CVC</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    id="confirm-card-pay-btn"
                    onClick={() => handleExecutePayment('card')}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
                  >
                    Pay Rs. {finalAmount.toFixed(2)} Securely
                  </button>
                </div>
              )}

              {/* TAB 3: NetBanking */}
              {activeTab === 'netbanking' && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="font-extrabold text-sm text-slate-900">Select Your Bank</h4>
                  
                  <div className="grid grid-cols-2 gap-2.5">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map(bank => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          selectedBank === bank
                            ? 'border-orange-500 bg-orange-50 text-orange-950 shadow-xs'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{bank}</span>
                        {selectedBank === bank && <Check className="w-3.5 h-3.5 text-orange-600" />}
                      </button>
                    ))}
                  </div>

                  <button
                    id="confirm-netbanking-btn"
                    onClick={() => handleExecutePayment('netbanking')}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
                  >
                    Proceed with {selectedBank}
                  </button>
                </div>
              )}

              {/* TAB 4: Cash / Counter */}
              {activeTab === 'cod' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-950 space-y-2">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-emerald-700" />
                      <h4 className="font-extrabold text-sm">Pay at Dining Counter or on Delivery</h4>
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      You can pay via Cash, Card swipe at table POS, or UPI QR with our billing server upon order delivery.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                    <p>• Exact change of <strong>Rs. {finalAmount.toFixed(2)}</strong> is appreciated.</p>
                    <p>• Digital GST invoice token will be generated instantly.</p>
                  </div>

                  <button
                    id="confirm-cod-btn"
                    onClick={() => handleExecutePayment('cod')}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
                  >
                    Confirm Order &amp; Pay Rs. {finalAmount.toFixed(2)} at Counter
                  </button>
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
